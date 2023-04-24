# CS411-Project

# Setup

Frontend setup:

`yarn add react react-dom react-scripts`

Please follow these instructions to set-up the backend on your local dev environment:

1. Please cd into pythonBackend
2. Run this following command: `python3 -m venv env`
3. Start the python virtual environment: `source env/bin/activate`
4. Install all required packages: `pip3 install -r requirements.txt`
5. Setup the cred.py with the right keys

# To start the app,

To start the frontend server, run this in your terminal:

`cd prototype`

`npm start`

To start the backend server, open another terminal window and run:

`cd pythonBackend`

`python3 backend.py`

# When you're done

After you are done, deactivate the python environment: `deactivate`

# APIs used:

Taking user input of city and getting lat and lon: https://openweathermap.org/api/geocoding-api

Taking lat and lon and fetching weather data for that location: https://openweathermap.org/current
