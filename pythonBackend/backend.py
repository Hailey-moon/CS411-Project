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



SPOTIFY_BASE_URL = "https://api.spotify.com/v1"
app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(16)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["CORS_HEADERS"] = "Content-Type"


Session(app)
cors = CORS(app, origins=["http://127.0.0.1:3000", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:5173"], supports_credentials=True)


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
    print(f'code is created')
    # redirect to the index with the code args
    # new_url = '/?code=' + code
    new_url = 'http://localhost:5001/'
    return redirect(new_url)

@app.route('/login-check')
@cross_origin(supports_credentials=True)
def login_check():
	return jsonify(session)


@app.route('/')
@cross_origin(supports_credentials=True)
def health():
	return jsonify({"hello": "hi"})


@app.route('/logout')
@cross_origin(supports_credentials=True)
def logout():
    '''This function removes the current session token from the cache, and hereby enforces another login'''
    session.pop("token_info", None)
    session.pop("code", None)
    return redirect ('http://localhost:5001/login-check')

@app.route('/get-weather')
@cross_origin(supports_credentials=True)
def weather():
    city = 'Boston'
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