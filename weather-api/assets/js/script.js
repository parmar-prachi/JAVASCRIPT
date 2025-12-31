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

    /*  CURRENT WEATHER  */

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                alert("City not found");
                return;
            }

            setText("cityName", `${data.name}, ${data.sys.country}`);
            setText("mainTemp", Math.round(data.main.temp));
            setText("weatherDesc", data.weather[0].description);
            setText("humidity", data.main.humidity + "%");
            setText("wind", Math.round(data.wind.speed) + " km/h");

            // 🌧️ Rain amount (last 1 hour)
            const rainAmount = data.rain && data.rain["1h"]
                ? data.rain["1h"] + " mm"
                : "0 mm";
            setText("precipitation", rainAmount);

            setImage(
                "weatherIcon",
                `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            );

            document.getElementById("weatherIcon").style.display = "block";
            document.getElementById("detailsCard").style.display = "block";
            document.getElementById("hourlyCard").style.display = "block";
            document.getElementById("weeklyCard").style.display = "block";
        });

    /*  FORECAST DATA */
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {

            renderHourly(data.list.slice(0, 8));
            renderWeekly(data.list);

            // ☔ Rain Probability (next 3 hours)
            const rainChance = Math.round(data.list[0].pop * 100);

            const alertText = document.getElementById("rainAlert");
            alertText.style.display = "block";

            if (rainChance > 60) {
                alertText.innerText = "🌧️ High chance of rain. Carry an umbrella!";
            } else if (rainChance > 30) {
                alertText.innerText = "☁️ Possible rain today. Be prepared.";
            } else {
                alertText.innerText = "🌤️ No rain expected today.";
            }
        });
}


/* hourly forecast */

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

    const today = new Date().toDateString();
    const days = {};

    list.forEach(item => {
        const dateObj = new Date(item.dt * 1000);
        const dayString = dateObj.toDateString();

        if (dayString === today) return;

        if (!days[dayString]) {
            days[dayString] = item;
        }
    });

    Object.values(days).slice(0, 7).forEach(day => {
        container.innerHTML += `
            <div class="col-md-2 col-6">
                <div class="week-item">
                    <p class="small">
                        ${new Date(day.dt * 1000).toLocaleDateString("en-US", {
                            weekday: "short"
                        })}
                    </p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                    <p class="fw-bold">${Math.round(day.main.temp)}°</p>
                </div>
            </div>
        `;
    });
}


/*  HELPERS  */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function setImage(id, src) {
    const img = document.getElementById(id);
    if (img) img.src = src;
}
