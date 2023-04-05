// Function that takes a city and fetches its weather data
export async function fetchWeatherData(city) {
  // Get the API key from environment variable
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  // Construct the URL for the geocoding API endpoint
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

  // Send a GET request to the geocoding API endpoint and wait for the response
  const geoResponse = await fetch(geoUrl);

  // Parse the JSON response from the geocoding API endpoint
  const geoData = await geoResponse.json();

  // Check if the response is empty (i.e., city not found)
  if (geoData.length === 0) {
    throw new Error("City not found");
  }

  // Extract the latitude and longitude values from the response
  const lat = geoData[0].lat;
  const lon = geoData[0].lon;

  // Construct the URL for the weather API endpoint using the latitude and longitude values
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  // Send a GET request to the weather API endpoint and wait for the response
  const weatherResponse = await fetch(weatherUrl);

  // Parse the JSON response from the weather API endpoint
  const weatherData = await weatherResponse.json();

  // Return the weather data object
  return weatherData;
}
