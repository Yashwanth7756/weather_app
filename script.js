const apiKey = "2b44e3e637d30c72e17468da9689fc76"; 

const wrapper = document.querySelector(".wrapper");
const input = document.querySelector("input");
const button = document.querySelector("button");
const weatherPart = document.querySelector(".weather-part");
const infoTxt = document.querySelector(".info-txt");
const loader = document.querySelector(".loader");
const backBtn = document.querySelector("header i");

// 🔹 Enter key event
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    getWeather(input.value.trim());
  }
});

// 🔹 Button click (location)
button.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let { latitude, longitude } = pos.coords;
        let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        fetchData(api);
      },
      (err) => {
        infoTxt.textContent = "Location access denied!";
      }
    );
  }
});

// 🔹 Fetch by city
function getWeather(city) {
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetchData(api);
}

// 🔹 Fetch Data
async function fetchData(api) {
  try {
    loader.style.display = "block";
    infoTxt.textContent = "Fetching weather details...";
    
    let res = await fetch(api);

    if (!res.ok) {
      throw new Error("City not found");
    }

    let data = await res.json();

    loader.style.display = "none";
    infoTxt.textContent = "";

    showWeather(data);

  } catch (err) {
    loader.style.display = "none";
    infoTxt.textContent = err.message;
  }
}

// 🔹 Show Weather
function showWeather(data) {
  const { name } = data;
  const { country } = data.sys;
  const { temp, feels_like, humidity } = data.main;
  const { description, icon } = data.weather[0];

  // 🔥 Capitalize first letter
  const desc = description.charAt(0).toUpperCase() + description.slice(1);

  document.querySelector(".numb").innerText = (temp - 273.15).toFixed(1);
  document.querySelector(".weather").innerText = desc;
  document.querySelector(".location span").innerText = `${name}, ${country}`;
  document.querySelector(".numb-2").innerText = (feels_like - 273.15).toFixed(1);
  document.querySelector(".humidity").innerText = `${humidity}%`;

  document.querySelector("img").src =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  wrapper.classList.add("active");
}

// 🔹 Back button
backBtn.addEventListener("click", () => {
  wrapper.classList.remove("active");
  input.value = "";
});