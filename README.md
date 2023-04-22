# CS411-Project

# You might need to run these?
`yarn add react react-dom react-scripts`

`yarn init -y`

`yarn add express cors dotenv node-fetch`

# Before you start, make sure of these:

1. Make sure you're in `client` by `cd client` to make changes to the application. Anything outside of `client` is not related to the function fo the app.

2. This repo comes with `env` file that sets your environmental variables, like API keys. Make a copy of this in the root of `client` and name it `.env`. This will allow the document to be ignored by git, so you don't push sensitive information like passwords to GitHub.

3. In the .env, fill in your api key by making your own account for apis. See "APIs used" section for more information on this.

# To start the app,
`cd client`

To start the frontend server, run this in your terminal:

`yarn start`

To start the backend server, open another terminal window and run:

`node server.js`

# APIs used:

Taking user input of city and getting lat and lon: https://openweathermap.org/api/geocoding-api

Taking lat and lon and fetching weather data for that location: https://openweathermap.org/current
