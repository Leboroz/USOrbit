import { US_STATES_COORDINATES } from "./data.js";

const select = document.querySelector("#citySelected");
const loader = document.querySelector("#loader");
const section = document.querySelector("#section");

const options = US_STATES_COORDINATES.map(stateInfo => {
  const option = document.createElement('option');
  option.value = `{"lon": "${stateInfo.lon}", "lat": "${stateInfo.lat}"}`;
  option.innerText = stateInfo.state;
  return option;
});

select.append(...options);

function celsiusToFahrenheit(celsius) {
  const fahrenheit = celsius * 9 / 5 + 32;
  return fahrenheit;
}

function parseYYYYMMDD(dateString) {
  // Check if the string is in the correct format
  if (!/^\d{4}\d{2}\d{2}$/.test(dateString)) {
    throw new Error("Invalid date format. Please use YYYYMMDD.");
  }

  // Extract year, month (adjust for zero-based indexing), and day
  const year = parseInt(dateString.substring(0, 4));
  const month = parseInt(dateString.substring(4, 6)) - 1;
  const day = parseInt(dateString.substring(6, 8));

  // Create a new Date object
  return new Date(year, month, day).toDateString();
}

select.addEventListener('change', (e) => {
  const coordinates = JSON.parse(e.currentTarget.value);
  if (loader.hasAttribute("data-hidden")) {
    loader.removeAttribute("data-hidden");
  }

  const ul = document.querySelector("#cards");
  ul.innerHTML = "";
  fetch(`http://www.7timer.info/bin/api.pl?lon=${coordinates.lon}&lat=${coordinates.lat}&product=civillight&output=json`)
    .then(res => res.json())
    .then((json) => {
      loader.setAttribute("data-hidden", "true");
      const cards = json.dataseries.map(day => {
        const li = document.createElement("li");
        li.innerHTML =
          `
        <div class="card">
          <div class="card-top center">
            <h3>${parseYYYYMMDD(`${day.date}`)}</h3>
            <img src="/images/${day.weather}.png" alt="${day.weather}">
          </div>
          <div class="card-bottom center">
            <h4>${day.weather}</h4>
            <div>
              <p>H: ${celsiusToFahrenheit(day.temp2m.max)}ºF</p>
              <p>L: ${celsiusToFahrenheit(day.temp2m.min)}ºF</p>
            </div>
          </div>
        </div>
      `
        return li;
      });
      ul.append(...cards);
    })
    .catch(e => {
      loader.setAttribute("data-hidden", "true");
      ul.innerHTML = '<h4 class="sub-title">Not Found</h4>'
    });
});

// fetch(`http://www.7timer.info/bin/api.pl?lon=${US_STATES_COORDINATES[0].lon}&lat=${US_STATES_COORDINATES[0].lat}&product=civillight&output=json`).then(res => res.json()).then(console.log);
