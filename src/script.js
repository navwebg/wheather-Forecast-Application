document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "4246ed328dee48d95a2d818da480219d"; //API key 
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const locationBtn = document.getElementById("location-btn");
    const cityName = document.getElementById("city-name");
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("wind-speed");
    const pressure = document.getElementById("pressure");
    const weeklyForecast = document.getElementById("weekly-forecast");

    // Search history dropdown
    const searchHistoryDropdown = document.createElement("ul");
    searchHistoryDropdown.className = "absolute bg-gray-800 text-white w-full mt-1 rounded shadow-md hidden";
    searchInput.parentElement.appendChild(searchHistoryDropdown);

    let searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];

    function fetchWeather(query, isCoords = false) {
        let url = isCoords
            ? `https://api.openweathermap.org/data/2.5/forecast?lat=${query.lat}&lon=${query.lon}&units=metric&appid=${API_KEY}`
            : `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&appid=${API_KEY}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.cod !== "200") throw new Error(data.message);
                cityName.innerText = data.city.name;
                updateMainWeather(data.list[0]);
                updateForecast(data.list);
                addToSearchHistory(data.city.name);
                hideSearchHistory(); 
            })
            .catch(error => {
                alert("Error fetching weather: " + error.message);
            });
    }

    function updateMainWeather(weather) {
        temperature.innerText = `${Math.round(weather.main.temp)}°C`;
        humidity.innerText = `${weather.main.humidity}%`;
        windSpeed.innerText = `${weather.wind.speed} km/h`;
        pressure.innerText = `${weather.main.pressure} hPa`;
    }

    function updateForecast(list) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        let todayIndex = list.findIndex(item => {
            let itemDate = new Date(item.dt * 1000);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate.getTime() === today.getTime();
        });

        if (todayIndex === -1) todayIndex = 0;

        for (let i = 0; i < 7; i++) {
            let dayIndex = todayIndex + (i * 8);
            if (dayIndex >= list.length) break;

            let dayData = list[dayIndex];
            let date = new Date(dayData.dt * 1000);

            document.getElementById(`day-${i + 1}-name`).innerText = date.toLocaleDateString(undefined, { weekday: 'short' });
            document.getElementById(`day-${i + 1}-temp`).innerText = `${Math.round(dayData.main.temp)}°C`;
        }
    }

    // Add City to Search History & Update Dropdown Menu
    function addToSearchHistory(city) {
        if (!searchHistory.includes(city)) {
            searchHistory.unshift(city);
            if (searchHistory.length > 5) searchHistory.pop(); // Keep only last 5 searches
            localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
        }
        renderSearchHistory();
    }

    // Show Recent Search in Dropdown Menu
    function renderSearchHistory() {
        searchHistoryDropdown.innerHTML = "";
        searchHistoryDropdown.classList.toggle("hidden", searchHistory.length === 0);

        searchHistory.forEach(city => {
            const item = document.createElement("li");
            item.className = "p-2 cursor-pointer hover:bg-gray-700 flex justify-between";
            item.innerHTML = `<span>${city}</span> <button class="text-red-400">&times;</button>`;

            // Fetching weather when clicked
            item.querySelector("span").addEventListener("click", () => {
                searchInput.value = city;
                fetchWeather(city);
                hideSearchHistory();
            });

            // Removeing from history
            item.querySelector("button").addEventListener("click", (e) => {
                e.stopPropagation();
                searchHistory = searchHistory.filter(c => c !== city);
                localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
                renderSearchHistory();
            });

            searchHistoryDropdown.appendChild(item);
        });
    }

    // Showing search history when clicking search input in dropdown menu
    searchInput.addEventListener("focus", () => {
        searchHistoryDropdown.classList.remove("hidden");
    });

    // hiding search history when clicking outside or moving cursor away
    document.addEventListener("click", (event) => {
        if (!searchInput.contains(event.target) && !searchHistoryDropdown.contains(event.target)) {
            hideSearchHistory();
        }
    });

    // hiding search history after searching
    function hideSearchHistory() {
        searchHistoryDropdown.classList.add("hidden");
    }

    searchBtn.addEventListener("click", () => fetchWeather(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") fetchWeather(searchInput.value);
    });

    locationBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                fetchWeather({ lat: position.coords.latitude, lon: position.coords.longitude }, true);
            }, () => alert("please enter correct location."));
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });

    // Initial Load
    renderSearchHistory();
    fetchWeather("New York"); // Default city
});
