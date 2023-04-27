import os, requests
import uuid
import json
import base64
import spotipy
import time
import cred
from requests import Request, post, get
from datetime import datetime, timedelta
from io import BytesIO
from flask import Flask, jsonify, make_response, session, redirect, request
from flask_cors import CORS, cross_origin
from flask_session import Session
import configparser



SPOTIFY_BASE_URL = "https://api.spotify.com/v1"
app = Flask(__name__)
config = configparser.ConfigParser()
config.read('config.cfg')
app.secret_key = config.get('flask', 'secret_key')
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["CORS_HEADERS"] = "Content-Type"


Session(app)
cors = CORS(app, origins=["http://127.0.0.1:3000", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:5173", "http://localhost:5001"], supports_credentials=True)


@app.route('/new-login', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def index():
	'''This function manages the authentication process for the spotify API'''
	cache_handler = spotipy.cache_handler.FlaskSessionCacheHandler(session)
	auth_manager = spotipy.oauth2.SpotifyOAuth(scope=cred.scopes, cache_handler=cache_handler,
		show_dialog=True, client_id=cred.client_id, client_secret=cred.client_secret, redirect_uri=cred.redirect_url)

	if request.args.get('code'):
		print('code is in request.args')
		# Step 2 -- Being Redirected from the Spotify auth page
		auth_manager.get_access_token(request.args.get('code'))
		return redirect('/')

	if not auth_manager.validate_token(cache_handler.get_cached_token()):
		print('no valid token, need to sign-in with spotify')
		# Step 1 -- Display sign in link when no token
		auth_url = auth_manager.get_authorize_url()
		return redirect(auth_url)
		#return jsonify({'url': auth_url})
	return jsonify({'url': 'hello'})


@app.route('/auth/callback')
@cross_origin(supports_credentials=True)
def callback():
	'''This function is called when the user is redirected back to the app from the spotify auth page'''
	# get the request arg, code
	code = request.args.get('code')
	# put this into the session
	session['code'] = code
	print('Session is: ', session)
	auth_header = base64.b64encode(f"{cred.client_id}:{cred.client_secret}".encode("ascii"))
	headers = {"Authorization": f"Basic {auth_header.decode('ascii')}"}

	params = {
		"grant_type": "authorization_code",
		"code": code,
		"redirect_uri": cred.redirect_url
	}
	response = requests.post("https://accounts.spotify.com/api/token", data=params, headers=headers)
	response_data = response.json()
        
	access_token = response_data["access_token"]
	refresh_token = response_data["refresh_token"]

	# Store the access token and refresh token in the session
	print("Access token:", access_token)
	session["access_token"] = access_token
	session["refresh_token"] = refresh_token
	# Redirect to the index page
	new_url = 'http://localhost:3000/home'
	print(f"Redirecting to {new_url}")
	return redirect(new_url)

def get_top(type, access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(f'https://api.spotify.com/v1/me/top/{type}', headers=headers)
    response.raise_for_status()
    data = response.json()
    return data

def get_recommendations(seed_artists=None, seed_genres=None, seed_tracks=None, access_token=None):
    headers = {'Authorization': f'Bearer {access_token}'}
    params = {}
    if seed_artists:
        params['seed_artists'] = seed_artists
    if seed_genres:
        params['seed_genres'] = seed_genres
    if seed_tracks:
        params['seed_tracks'] = seed_tracks
    response = requests.get('https://api.spotify.com/v1/recommendations', headers=headers, params=params)
    response.raise_for_status()
    data = response.json()
    return data

@app.route('/home')
def home():
    access_token = request.args.get("access_token")
	
    if not access_token:
        return jsonify({'error': 'Missing access token'})

    try:
        top_artists = get_top('artists', access_token)
        top_tracks = get_top('tracks', access_token)

        seed_artists = [artist['id'] for artist in top_artists['items']]
        seed_tracks = [track['id'] for track in top_tracks['items']]
        recommendations = get_recommendations(seed_artists=seed_artists, seed_tracks=seed_tracks, access_token=access_token)

        track_urls = [{'name': track['name'], 'external_url': track['external_urls']['spotify']} for track in recommendations['tracks']]
        return jsonify(track_urls)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)})

@app.route('/login-check')
@cross_origin(supports_credentials=True)
def login_check():
	return jsonify(session)

@app.route('/access_token')
@cross_origin(supports_credentials=True)
def access_token():
    # Get the access token from the session
    access_token = session.get('access_token')
    
    # Return the access token as a JSON object
    return jsonify({'access_token': access_token})


@app.route('/')
@cross_origin(supports_credentials=True)
def health():
	# Get the access token from the session
	access_token = session.get('access_token')

	# Check if access token is missing
	if access_token is None:
		return jsonify({'error': 'access token is missing'}), 401

	# Set the authorization header with the access token
	headers = {"Authorization": f"Bearer {access_token}"}

	# Make a GET request to the Spotify API
	response = requests.get("https://api.spotify.com/v1/me", headers=headers)

	# Check if the access token is invalid
	if response.status_code == 401:
		return jsonify({'error': 'access token is invalid or expired'}), 401

	# The response will be in JSON format
	response_data = response.json()
	return jsonify(response_data)


@app.route('/logout')
@cross_origin(supports_credentials=True)
def logout():
	'''This function removes the current session token from the cache, and hereby enforces another login'''
	session.pop("token_info", None)
	session.pop("code", None)
	return redirect ('http://localhost:5001/login-check')

@app.route('/get-weather/<city>')
@cross_origin(supports_credentials=True)
def weather(city):
    geo_url = f'https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={cred.weather_key}'
    r = requests.get(geo_url)
    r = r.json()
    lat = r[0]["lat"]
    long = r[0]["lon"]
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={long}&appid={cred.weather_key}&units=metric"
    r = requests.get(weather_url)
    r = r.json()

    return r



if __name__ == '__main__':
	# run app
	app.run(debug=True, host='localhost', port=5001)