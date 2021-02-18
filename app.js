const API_KEY = "2c2af416266d43878bb165611211702";
let currentLocation = "Prague";
let isLoading = true;
let API_LINK = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${currentLocation}&days=10`;

const inputElement = document.querySelector("#location-input");

const cityElements = document.querySelectorAll("[data-city]");
const dateElement = document.querySelector("[data-date]");
const regionElement = document.querySelector("[data-region]");
const countryElement = document.querySelector("[data-country]");
const tempElement = document.querySelector("[data-temp]");
const feelsTempElement = document.querySelector("[data-feels-temp]");
const windElement = document.querySelector("[data-wind]");
const humidityElement = document.querySelector("[data-humidity]");
const uvIndexElement = document.querySelector("[data-uv]");

let isMetric = true;
const metricRadio = document.querySelector("#cel");
const imperialRadio = document.querySelector("#fah");

const forecastContainer = document.querySelector(".forecast__container");
const forecastCardTemplate = document.querySelector("[data-card]");
const forecastBtn = document.querySelector(".forecast__btn");
const dayElement = document.querySelector("[data-day]");
const conditionElement = document.querySelector("[data-condition]");
const iconElement = document.querySelector("[data-icon]");
const maxTempElement = document.querySelector("[data-maxTemp]");
const minTempElement = document.querySelector("[data-minTemp]");
const avgWindElement = document.querySelector("[data-avgWind]");

inputElement.addEventListener("keyup", changeLocation);
metricRadio.addEventListener("click", () => {
  isMetric = !isMetric;
  loadData();
});
imperialRadio.addEventListener("click", () => {
  isMetric = !isMetric;
  loadData();
});

forecastBtn.addEventListener("click", () => {
  if (forecastContainer.style.visibility === "hidden") {
    forecastContainer.style.visibility = "visible";
    forecastContainer.style.height = "100%";
    forecastContainer.style.overflow = "auto";
  } else {
    forecastContainer.style.visibility = "hidden";
    forecastContainer.style.height = "0";
    forecastContainer.style.overflow = "hidden";
  }
});

function getWeather() {
  return fetch(API_LINK)
    .then((response) => response.json())
    .then((data) => {
      const { current, forecast, location } = data;
      return {
        city: location.name,
        region: location.region,
        country: location.country,
        localTime: new Date(location.localtime),
        temperatureC: current.temp_c,
        temperatureF: current.temp_f,
        feelsLikeTempC: current.feelslike_c,
        feelsLikeTempF: current.feelslike_f,
        isDay: current.is_day,
        windMPH: current.wind_mph,
        windKPH: current.wind_kph,
        windDirection: current.wind_dir,
        windDegree: current.wind_degree,
        humidity: current.humidity,
        uvIndex: current.uv,
        forecast: forecast.forecastday,
        condition: current.condition,
      };
    });
}

function loadData() {
  getWeather().then((forecast) => {
    console.log(forecast);
    displayWeather(forecast);
    displayForecast(forecast);
  });
}

loadData();

function displayWeather(forecast) {
  cityElements.forEach((city) => (city.innerText = forecast.city));
  dateElement.innerHTML = displayDate(forecast.localTime);
  regionElement.innerHTML = forecast.region;
  countryElement.innerHTML = forecast.country;
  tempElement.innerHTML = isMetric
    ? `${forecast.temperatureC}°C`
    : `${forecast.temperatureF}°F`;
  feelsTempElement.innerHTML = isMetric
    ? `${forecast.feelsLikeTempC}°C`
    : `${forecast.feelsLikeTempF}°F`;
  windElement.innerHTML = isMetric
    ? `${forecast.windKPH} KM/H`
    : `${forecast.windMPH} MP/H`;
  humidityElement.innerHTML = forecast.humidity + " %";
  uvIndexElement.innerHTML = forecast.uvIndex;
}

function displayDate(date) {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long" });
}

function changeLocation(event) {
  if (event.keyCode === 13) {
    currentLocation = inputElement.value;
    API_LINK = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${currentLocation}&days=10`;
    loadData();
  }
}

function displayForecast(forecast) {
  forecastContainer.innerHTML = "";
  forecast.forecast.forEach((day) => {
    console.log(day);
    const forecastCard = forecastCardTemplate.cloneNode(true);
    forecastCard.querySelector("[data-day]").innerText = day.date;
    forecastCard.querySelector("[data-condition]").innerText =
      day.day.condition.text;
    forecastCard.querySelector("[data-icon]").src = day.day.condition.icon;
    forecastCard.querySelector("[data-maxTemp]").innerText = isMetric
      ? day.day.maxtemp_c
      : day.day.maxtemp_f;
    forecastCard.querySelector("[data-minTemp]").innerText = isMetric
      ? day.day.mintemp_c
      : day.day.mintemp_f;
    forecastCard.querySelector("[data-avgWind]").innerText = isMetric
      ? day.day.maxwind_kph
      : day.day.maxwind_mph;
    forecastContainer.appendChild(forecastCard);
  });
}
