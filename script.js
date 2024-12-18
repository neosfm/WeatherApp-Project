function getWeather() {
    const apiKey = '894c9428288846cbbc5122444241812';

    const city = document.getElementById('city').value;
    const weatherInfo = document.getElementById('weatherInfo');
    const temp = document.getElementById('temp');
    const weatherIcon = document.getElementById('weatherIcon');
    const hourlyContainer = document.querySelector('.hourlyContainer');

    // CLEAR
    loc.innerHTML = '';
    weatherInfo.innerHTML = '';
    temp.innerHTML = '';
    weatherIcon.src = '';
    hourlyContainer.innerHTML = '';

    if (!city) {
        weatherInfo.innerHTML = 'Please enter a city name.';
        weatherInfo.style.fontSize = "2rem";
        weatherInfo.style.marginTop = "3rem";
        weatherIcon.style.display = "none";
        return;
    }

    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            weatherInfo.style.fontSize = "3rem";
            weatherInfo.style.marginTop = "-2rem";
            // EXTRACT DATA
            const location = data.location.name + ', ' + data.location.country;
            const temperature = data.current.temp_c + '°C';
            const condition = data.current.condition.text;
            const iconUrl = 'https:' + data.current.condition.icon;

            // UPDATE THE HTML ELEMENTS WITH DATA
            loc.innerHTML = `${location}`;
            weatherInfo.innerHTML = `${condition}`;
            temp.innerHTML = `${temperature}`;
            weatherIcon.src = iconUrl;
            weatherIcon.alt = condition;
            weatherIcon.style.display = "inline";
        })
        .catch(error => {
            weatherInfo.innerHTML = `${error.message}`;
        });

        fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            weatherInfo.style.fontSize = "3rem";
            weatherInfo.style.marginTop = "-2rem";
            
            const hourlyData = data.forecast.forecastday[0].hour.slice(0, 24);

            hourlyData.forEach(hour => {
                const hourElement = document.createElement('div');
                hourElement.classList.add('hourlyItems');

                // EXTRACT HOUR DETAILS
                const time = hour.time.split(' ')[1]; // Extract the time (e.g., "00:00")
                const temp = hour.temp_c + '°C';
                const condition = hour.condition.text;
                const iconUrl = 'https:' + hour.condition.icon;

                // ADD CONTENT TO THE HOUR ELEMENT
                hourElement.innerHTML = `
                    <div class="hourlyItems">
                        <div>${time}</div>
                        <img src="${iconUrl}" alt="${condition}" />
                        <div>${condition}</div>
                        <div class="hourlyTemp">${temp}</div>
                    </div>
                `;
                hourlyContainer.appendChild(hourElement);
            });
        })
        .catch(error => {
            hourlyContainer.innerHTML = `${error.message}`;
        });
}
