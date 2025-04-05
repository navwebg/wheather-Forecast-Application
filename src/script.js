document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "4246ed328dee48d95a2d818da480219d"; //API key ('_') 
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const locationBtn = document.getElementById("location-btn");
    const cityName = document.getElementById("city-name");
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("wind-speed");
    const pressure = document.getElementById("pressure");
    const weeklyForecast = document.getElementById("weekly-forecast");

    // Search history dropdown menu----->
    const searchHistoryDropdown = document.createElement("ul");
    searchHistoryDropdown.className = "absolute bg-gray-800 text-white cursor-pointer w-full mt-1 rounded shadow-md hidden z-50";
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

    // Adding City to Search History & Updating the Dropdown Menu
    function addToSearchHistory(city) {
        const existingIndex = searchHistory.findIndex(c => c.toLowerCase() === city.toLowerCase());
        if (existingIndex !== -1) {
            searchHistory.splice(existingIndex, 1); 
        }
        searchHistory.unshift(city);
        if (searchHistory.length > 5) searchHistory.pop(); 
        localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
        renderSearchHistory();
    }
    

    // Showing Recent Search in Dropdown Menu
    function renderSearchHistory() {
        searchHistoryDropdown.innerHTML = "";
        searchHistoryDropdown.classList.toggle("hidden", searchHistory.length === 0);
    
        searchHistory.forEach(city => {
            const li = document.createElement("li");
            li.className = "flex justify-between items-center p-2 hover:bg-gray-700";
    
            const citySpan = document.createElement("span");
            citySpan.textContent = city;
            citySpan.className = "cursor-pointer flex-1";
    
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "&times;";
            deleteBtn.className = `text-red-400 text-xl ml-2 mt-[-2px] hover:text-white hover:bg-red-500 rounded-full w-7 h-7 flex items-center justify-center transition duration-150 hover:scale-110 cursor-pointer`;

            // When clicking city span it i'll again add it to search
            citySpan.addEventListener("click", () => {
                searchInput.value = city;
                fetchWeather(city);
                hideSearchHistory();
            });
    
            // When clicking delete button it will remove from history
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                console.log("delete clicked"); // checking on console
                searchHistory = searchHistory.filter(c => c.toLowerCase() !== city.toLowerCase());
                localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
                renderSearchHistory();
            });
    
            li.appendChild(citySpan);
            li.appendChild(deleteBtn);
            searchHistoryDropdown.appendChild(li);
        });
    }
    

    // Showing search history when clicking search input in dropdown menu
    searchInput.addEventListener("focus", () => {
        if (searchHistory.length > 0) {
            searchHistoryDropdown.classList.remove("hidden");
        }
    });

    
    // Hide dropdown on blur or mouse leaving the dropdown/input
    searchInput.addEventListener("blur", () => {
        setTimeout(hideSearchHistory, 100);
    });
    
    searchHistoryDropdown.addEventListener("mouseleave", () => {
        hideSearchHistory();
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

    function handleSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            alert("Please enter a city name.");
            return;
        }
        fetchWeather(query);
    }
    
    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSearch();
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
    fetchWeather("Goa"); // Default city
});
