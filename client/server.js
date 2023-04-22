require('dotenv').config();     // Load environment variables (like the api key)

const express = require("express");
let fetch;
(async () => {
  fetch = await import("node-fetch").then((module) => module.default);
})();

const app = express();

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

app.get("/api/weather/:city", async (req, res) => {
    try {
        const city = req.params.city;

        // Get the latitude and longitude for the city
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoResponse.ok) {
            throw new Error("Could not fetch geolocation data");
        }

        if (geoData.length === 0) {
            throw new Error("City not found");
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        // Get the weather data for the latitude and longitude
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (!weatherResponse.ok) {
            throw new Error("Could not fetch weather data")
        }

        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(error.statusCosde || 500).json({message: error.message || "Internal server error"});
    }
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});



