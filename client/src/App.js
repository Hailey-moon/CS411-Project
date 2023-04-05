import './App.css';
import React from "react";
import CityInput from "./CityInput";

function App() {
  return (
    <div className="App">
      {/* CityInput is the component that takes city name from user and calls weatherapi to fetch weather data */}
      <CityInput />
    </div>
  );
}

export default App;