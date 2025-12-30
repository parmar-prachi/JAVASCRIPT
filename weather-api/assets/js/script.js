const apiKey = "5a31335d191d029ee9e77b9692d9a144";
const cityInput = document.getElementById("cityInput");

document.getElementById("currentDate").innerText =
    new Date().toDateString();

// Search on Enter
cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") getWeather();
});

function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    // CURRENT WEATHER
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if(data.cod !== 200) {
                alert("City not found");
                return;
            }

            setText("cityName", `${data.name}, ${data.sys.country}`);
            setText("mainTemp", Math.round(data.main.temp));
            setText("weatherDesc", data.weather[0].description);
            setText("humidity", data.main.humidity + "%");
            setText("wind", Math.round(data.wind.speed) + " km/h");
            setText("precipitation", "—");

            setImage("weatherIcon", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            
            // Show cards
            document.getElementById("weatherIcon").style.display = "block";
            document.getElementById("detailsCard").style.display = "block";
            document.getElementById("hourlyCard").style.display = "block";
            document.getElementById("weeklyCard").style.display = "block";
        });

    // FORECAST
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            renderHourly(data.list.slice(0, 8));
            renderWeekly(data.list);
        });
}

/* ---------- UI RENDER FUNCTIONS ---------- */

function renderHourly(hours) {
    const container = document.getElementById("hourlyForecast");
    container.innerHTML = "";

    hours.forEach(item => {
        const time = new Date(item.dt * 1000).getHours();
        container.innerHTML += `
            <div class="hour-item">
                <p class="small">${time}:00</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                <p class="fw-bold">${Math.round(item.main.temp)}°</p>
            </div>
        `;
    });
}

function renderWeekly(list) {
    const container = document.getElementById("weeklyForecast");
    container.innerHTML = "";

    const days = {};
    list.forEach(item => {
        const day = new Date(item.dt * 1000).toDateString();
        if (!days[day]) days[day] = item;
    });

    Object.values(days).slice(0, 7).forEach(day => {
        container.innerHTML += `
            <div class="col-md-2 col-6">
                <div class="week-item">
                    <p class="small">${new Date(day.dt * 1000).toLocaleDateString("en-US",{weekday:"short"})}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                    <p class="fw-bold">${Math.round(day.main.temp)}°</p>
                </div>
            </div>
        `;
    });
}

/* ---------- HELPERS ---------- */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function setImage(id, src) {
    const img = document.getElementById(id);
    if (img) img.src = src;
}
