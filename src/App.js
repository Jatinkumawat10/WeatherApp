import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherservice";

function App() {
  const [city, setCity] = useState("Mumbai");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);
  const [showWarning, setShowWarning] = useState(false);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);

      if (data && data.name === "City not found") {
        setWeather(null);
        setShowWarning(true);
      } else {
        setWeather(data);
        setShowWarning(false);

        const threshold = units === "metric" ? 20 : 60;
        if (data.main && data.main.temp) {
          if (data.temp <= threshold) setBg(coldBg);
          else setBg(hotBg);
        }
      }
    };

    fetchWeatherData();
  }, [units, city]);

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        <div className="container">
          <div className="section section__inputs">
            <input
              onKeyDown={enterKeyPressed}
              type="text"
              name="city"
              placeholder="Enter Location..."
            />
            <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            {showWarning && (
              <div className="not-available">
                <h1>No result found. Try for searching another Location.</h1>
              </div>
            )}
          </div>
          {weather && (
            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>
          )}

          {weather && <Descriptions weather={weather} units={units} />}
        </div>
      </div>
    </div>
  );
}

export default App;
