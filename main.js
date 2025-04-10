const container = document.querySelector(`.container`);
const search = document.querySelector(`.search-box button`);
const weatherBox = document.querySelector(`.weather-box`);
const weatherDetails = document.querySelector(`.weather-details`);
const error404 = document.querySelector(`.not-found`);

search.addEventListener(`click`, () => {
  makeSearch();
});

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    makeSearch();
  }
});

const updateLocationByCity = (city) => {
  const APIKey = "eca7ab8bf05cee8659afa29992bf0bf0";
  const locationElement = document.getElementById("current-location");

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data && data.name && data.sys) {
        const locationName = `${data.name}, ${data.sys.country}`;
        locationElement.textContent = locationName;
      } else {
        locationElement.textContent = "Location not found";
      }
    })
    .catch((error) => {
      console.error("Error fetching location name:", error);
      locationElement.textContent = "Error fetching location";
    });
};

const makeSearch = () => {
  const APIKey = "eca7ab8bf05cee8659afa29992bf0bf0";
  const city = document.querySelector(`.search-box input`).value;

  if (city === ``) {
    container.style.height = "480px";
    weatherBox.style.display = "none";
    weatherDetails.style.display = "none";
    error404.style.display = "block";
    error404.classList.add("fadeIn");
    alert("You must input a location");
    return;
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.cod === `404`) {
        container.style.height = "480px";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fadeIn");
        return;
      }

      error404.style.display = "none";
      error404.classList.remove("fadeIn");

      const image = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span"
      );
      const wind = document.querySelector(".weather-details .wind span");
      const pressure = document.querySelector(".weather-details .pressure span");
      const visibility = document.querySelector(".weather-details .visibility span");
      const sunrise = document.querySelector(".additional-info .sunrise span");
      const sunset = document.querySelector(".additional-info .sunset span");

      const weatherIcons = {
        Clear: [
          "https://i.imgur.com/yR9OWXH.gif",
          "https://i.pinimg.com/originals/53/22/c2/5322c2cad533e12e552d0dfdc89b4c25.gif",
          "https://openweathermap.org/img/wn/01d@4x.png"
        ],
        Rain: [
          "https://i.imgur.com/xqJmKyO.gif",
          "https://i.pinimg.com/originals/f2/f5/20/f2f520c7a6185da76203b78e5afe1377.gif",
          "https://openweathermap.org/img/wn/10d@4x.png"
        ],
        Snow: [
          "https://i.imgur.com/UzPmvSP.gif",
          "https://i.pinimg.com/originals/65/dc/98/65dc98171c2ef187d8107960b369429c.gif",
          "https://openweathermap.org/img/wn/13d@4x.png"
        ],
        Clouds: [
          "https://i.imgur.com/MOXwGGP.gif",
          "https://i.pinimg.com/originals/3b/00/ca/3b00ca43e0fa60f11d501d5c1bb7a31f.gif",
          "https://openweathermap.org/img/wn/03d@4x.png"
        ],
        Haze: [
          "https://i.imgur.com/BvI8CWB.gif",
          "https://i.pinimg.com/originals/73/d5/19/73d519fdff458c8f8aa52844c730e0b7.gif",
          "https://openweathermap.org/img/wn/50d@4x.png"
        ],
        Thunderstorm: [
          "https://i.imgur.com/AsLHofJ.gif",
          "https://i.pinimg.com/originals/57/83/e0/5783e0e65996e6355229d6978676b9f7.gif",
          "https://openweathermap.org/img/wn/11d@4x.png"
        ],
        Drizzle: [
          "https://i.imgur.com/BQbzoKt.gif",
          "https://i.pinimg.com/originals/f2/f5/20/f2f520c7a6185da76203b78e5afe1377.gif",
          "https://openweathermap.org/img/wn/09d@4x.png"
        ]
      };

      const tryLoadImage = (sources, index, weatherType, imageElement) => {
        if (index >= sources.length) {
          imageElement.src = "https://openweathermap.org/img/wn/01d@4x.png"; // Final fallback
          return;
        }

        imageElement.src = sources[index];
        imageElement.onerror = () => {
          tryLoadImage(sources, index + 1, weatherType, imageElement);
        };
      };

      const weatherType = json.weather[0].main;
      const sources = weatherIcons[weatherType] || weatherIcons.Clear;
      tryLoadImage(sources, 0, weatherType, image);

      temperature.innerHTML = `${parseInt(json.main.temp)}°C`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)} km/h`;
      pressure.innerHTML = `${json.main.pressure} hPa`;
      visibility.innerHTML = `${(json.visibility / 1000).toFixed(1)} km`;

      const sunriseTime = new Date(json.sys.sunrise * 1000);
      const sunsetTime = new Date(json.sys.sunset * 1000);
      sunrise.innerHTML = `${sunriseTime.getHours()}:${sunriseTime.getMinutes()} AM`;
      sunset.innerHTML = `${sunsetTime.getHours()}:${sunsetTime.getMinutes()} PM`;

      weatherBox.style.display = "";
      weatherDetails.style.display = "";
      weatherBox.classList.add("fadeIn");
      weatherDetails.classList.add("fadeIn");
      container.style.height = "auto";

      // Update the current location
      updateLocationByCity(city);
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchWeatherByLocation = (latitude, longitude) => {
  const APIKey = "eca7ab8bf05cee8659afa29992bf0bf0";

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.cod === `404`) {
        container.style.height = "480px";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fadeIn");
        return;
      }

      error404.style.display = "none";
      error404.classList.remove("fadeIn");

      const image = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span"
      );
      const wind = document.querySelector(".weather-details .wind span");
      const pressure = document.querySelector(".weather-details .pressure span");
      const visibility = document.querySelector(".weather-details .visibility span");
      const sunrise = document.querySelector(".additional-info .sunrise span");
      const sunset = document.querySelector(".additional-info .sunset span");

      // Use online images or GIFs for weather conditions
      switch (json.weather[0].main) {
        case "Clear":
          image.src = "https://openweathermap.org/img/wn/01d@2x.png"; // Clear sky icon
          break;

        case "Rain":
          image.src = "https://openweathermap.org/img/wn/09d@2x.png"; // Rain icon
          break;

        case "Snow":
          image.src = "https://openweathermap.org/img/wn/13d@2x.png"; // Snow icon
          break;

        case "Clouds":
          image.src = "https://openweathermap.org/img/wn/03d@2x.png"; // Cloudy icon
          break;

        case "Haze":
          image.src = "https://openweathermap.org/img/wn/50d@2x.png"; // Haze icon
          break;

        default:
          image.src = "https://openweathermap.org/img/wn/01n@2x.png"; // Default icon
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}°C`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)} km/h`;
      pressure.innerHTML = `${json.main.pressure} hPa`;
      visibility.innerHTML = `${(json.visibility / 1000).toFixed(1)} km`;

      const sunriseTime = new Date(json.sys.sunrise * 1000);
      const sunsetTime = new Date(json.sys.sunset * 1000);
      sunrise.innerHTML = `${sunriseTime.getHours()}:${sunriseTime.getMinutes()} AM`;
      sunset.innerHTML = `${sunsetTime.getHours()}:${sunsetTime.getMinutes()} PM`;

      weatherBox.style.display = "";
      weatherDetails.style.display = "";
      weatherBox.classList.add("fadeIn");
      weatherDetails.classList.add("fadeIn");
      container.style.height = "auto";
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateLocation = (latitude, longitude) => {
  const APIKey = "eca7ab8bf05cee8659afa29992bf0bf0";
  const locationElement = document.getElementById("current-location");

  fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        const locationName = `${data[0].name}, ${data[0].country}`;
        locationElement.textContent = locationName;
      } else {
        locationElement.textContent = "Location not found";
      }
    })
    .catch((error) => {
      console.error("Error fetching location name:", error);
      locationElement.textContent = "Error fetching location";
    });
};

// Automatically fetch weather and location for the user's current position
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    fetchWeatherByLocation(latitude, longitude);
    updateLocation(latitude, longitude);
  },
  (error) => {
    console.error("Error fetching location:", error);
    document.getElementById("current-location").textContent =
      "Unable to fetch location";
    alert("Unable to fetch your location. Please search manually.");
  }
);

const updateTime = () => {
  const currentTimeElement = document.getElementById("current-time");
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = months[now.getMonth()]; // Get month in words
  const year = now.getFullYear();

  currentTimeElement.textContent = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};

// Update the time every second
setInterval(updateTime, 1000);
updateTime(); // Initialize the time immediately