function initPage() {
    // Assigning a unique API to a variable
    var APIKey = "45b540a8cd42aaa42f8c70494dbe864b";
    var cityEl = $("#enter-city");
    var searchEl = $("#search-button")
    var nameEl = $("#city-name");
    var currentPicEl = $("#current-pic");
    var currentTempEl = $("#temperature");
    var currentHumidityEl = $("#humidity");
    var currentWindEl = $("#wind-speed");
    var historyEl = $("#history");
    var fivedayEl = $("#fiveday-header");
    var todayweatherEl = $("#today-weather");
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    // api.openweathermap.org/data/2.5/weather?q="
    /* Given City by the user */
    /* Daily forecast function */

    function getWeather(cityName) {
        console.log(cityName)
        var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

        fetch(requestUrl)
            .then(function (response) {
                response.json().then(function (parsedResponse) {
                console.log(parsedResponse)  
                todayweatherEl.removeClass("d-none");
                // Parse response to display current weather
                const currentDate = new Date(parsedResponse.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.text(parsedResponse.name + " (" + month + "/" + day + "/" + year + ") ");
                let weatherPic = parsedResponse.weather[0].icon;
                currentPicEl.attr("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPicEl.attr("alt", parsedResponse.weather[0].description);
                currentTempEl.text("Temperature: " + k2f(parsedResponse.main.temp) + '\xB0' + 'F');
                currentHumidityEl.text("Humidity: " + parsedResponse.main.humidity + "%");
                currentWindEl.text("Wind Speed: " + parsedResponse.wind.speed + " MPH");

                // Get 5 day forecast for this city
                let cityID = parsedResponse.id;
                let forecastrequestUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;

                fetch(forecastrequestUrl)
                    .then(function (secondResponse) {
                        secondResponse.json().then(function (parsedSecondResponse) {
                        fivedayEl.removeClass("d-none");
                        console.log("Second response", parsedSecondResponse)
                        //  Parse response to display forecast for next 5 days
                        const forecastEls = $(".forecast");
                        console.log(forecastEls.length)
                        console.log(forecastEls)
                        for (var i = 0; i < forecastEls.length; i++) {
                            // Creating elements, tablerow, tabledata, and anchor
                            // Setting the text of link and the href of the link
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(parsedSecondResponse.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = $("<p>");
                            console.log(forecastDateEl)
                            forecastDateEl.attr("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.text(forecastMonth + "/" + forecastDay + "/" + forecastYear);
                            console.log(forecastDateEl)
                            forecastEls[i].append(forecastDateEl[0]);

                            // Icon for current weather
                            const forecastWeatherEl = $("<img>");
                            forecastWeatherEl.attr("src", "https://openweathermap.org/img/wn/" + parsedSecondResponse.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeatherEl.attr("alt", parsedSecondResponse.list[forecastIndex].weather[0].description);
                            forecastEls[i].append(forecastWeatherEl[0]);
                            const forecastTempEl = $("<p>");
                            forecastTempEl.text("Temp: " + k2f(parsedSecondResponse.list[forecastIndex].main.temp) + '\xB0' + 'F');
                           
                            forecastEls[i].append(forecastTempEl[0]);
                            const forecastHumidityEl = $("<p>");
                            forecastHumidityEl.text("Humidity: " + parsedSecondResponse.list[forecastIndex].main.humidity + "%");
                            forecastEls[i].append(forecastHumidityEl[0]);
                        }
                    })});
            })})
    }
    // Get history from local storage if any
    searchEl.on("click", function () {
        const searchTerm = cityEl.val();
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
        historyEl.text = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = $("<input>");
            historyItem.attr("type", "text");
            historyItem.attr("readonly", true);
            historyItem.attr("class", "form-control d-block bg-white");
            historyItem.attr("value", searchHistory[i]);
            historyItem.on("click", function () {
                getWeather(historyItem.val());
            })
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }

}
initPage();
// searchEl.on('click', function () {
//     // console.log("save your schedule", event.target)
//     console.log("search city for forecast", $(this))
//     // $('col-8 col-md-10 description').siblings(event)
//     var textDes = $(this).siblings(".card-body").val()
//     console.log(textDes)
//     // var cityForecast = $(this).parent().attr("id")
//     // console.log(cityForecast)

//     localStorage.setItem(searchEl, textDes);
// });
// set the search city in localStorage