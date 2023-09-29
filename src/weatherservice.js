// const API_KEY = "ad4ee8b050dbc852d54b0c8f6643147c";
const API_KEY = process.env.REACT_APP_API_KEY;

const makeIconURL = (iconId) =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

const getFormattedWeatherData = async (city, units = "metric") => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.cod === "404") {
      return {
        name: "City not found",
      };
    }

    const {
      weather,
      main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
      wind: { speed },
      sys: { country },
      name,
    } = data;

    const { description, icon } = weather[0];

    return {
      description,
      iconURL: makeIconURL(icon),
      temp,
      feels_like,
      temp_min,
      temp_max,
      pressure,
      humidity,
      speed,
      country,
      name,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      name: "Error fetching weather data",
    };
  }
};
export { getFormattedWeatherData };
