// to get the javaScript code I followed pretty much Drew's thinking and method presented at his speedrun
const weatherAPIURL = "https://api.openweathermap.org"
const weatherAPIKey = "API"
let searchHistory = []
let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHistoryContainer = $("#history");
let forecastContainer = $("#forecast");
let todayWeatherContainer = $("#today")

function collectSearchHistory() {
    searchHistoryContainer.html("")
        for (let i=0; i<searchHistory.length; i++){
        let btn = $("<button>");
        btn.attr("type", "submit")
        btn.addClass("btn btn-primary history-btn btn-history")
        btn.attr("data-search", searchHistory[i])
        btn.text(searchHistory[i])
        searchHistoryContainer.append(btn)
        }
}

function appendSearchHistory(search) {
    if (searchHistory.indexOf(search) !==-1) {
        return;
    }
    searchHistory.push(search);
    localStorage.setItem("search-history", JSON.stringify(searchHistory))
    collectSearchHistory()
}
 // resource for this function: Drew's speedrun
function renderCurrentWeather(city, weatherData){
    let date = moment().format("DD, MMM, YYYY");
    let tempC = weatherData["main"]["temp"];
    let windKph = weatherData["wind"]["speed"];
    let humidity = weatherData["main"]["humidity"];
    let iconURL = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    let iconDescription = weatherData.weather[0].description || weatherData[0].main;
    let heading = $("<h2>");
    heading.attr("class", "h3-title")
    let card = $("<div>");
    card.attr("class", "card")
    let cardBody = $("<div>");
    cardBody.attr("class", "card-body")
    card.append(cardBody)
    let weatherIcon = $("<img>")

    let tempEl = $("<p>");
    tempEl.attr("class", "p-text")
    let windEl = $("<p>");
    windEl.attr("class", "p-text")
    let humidityEl = $("<p>");
    humidityEl.attr("class", "p-text")
    heading.text(`${city} (${date})`)
    weatherIcon.attr("src", iconURL)
    weatherIcon.attr("alt", iconDescription)
    heading.append(weatherIcon);
    tempEl.text(`🌡️ ${tempC} ℃`);
    windEl.text(`🌬️ ${windKph} Kph`);
    humidityEl.text(`💦 ${humidity} %`);
    cardBody.append(heading, tempEl, windEl, humidityEl);
    todayWeatherContainer.html("");
    todayWeatherContainer.append(card);

}

function renderForecast(weatherData) {
    let headingColumn = $("<div>");
    let heading = $("<h4>");
    headingColumn.attr("class", "col-12");
    heading.text("5-day Forecast");
    headingColumn.append(heading);

    forecastContainer.html("");
    forecastContainer.append(headingColumn)
    let futureForecast = weatherData.filter(function(forecast) {
        return forecast.dt_txt.includes("12")
        })
    for (let i=0; i<futureForecast.length; i++) {
        let iconURL = `https://openweathermap.org/img/w/${futureForecast[i].weather[0].icon}.png`
        let iconDescription = futureForecast[i].weather[0].description;
        let tempC = futureForecast[i].main.temp;
        let windKph = futureForecast[i].wind.speed;
        let humidity = futureForecast[i].main.humidity;
        
        

        let col = $("<div>");
        col.attr("class", "col-md")
        let card = $("<div>");
        card.attr("class", "card bg-primary h-100 text-white")
        let cardBody = $("<div>");
        cardBody.attr("class", "card-body")
        let title = $("<h5>");
        title.attr("card-title")
        title.text(moment(futureForecast[i].dt_txt).format("DD/MM/YYYY"))
        let weatherIcon = $("<img>");
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", iconDescription)
        let tempEl = $("<p>");
        tempEl.attr("class", "p-text")
        
        let windEl = $("<p>");
        windEl.attr("class", "p-text")
        
        let humidityEl  = $("<p>");
        humidityEl.attr("class", "p-text")
        
        
        col.append(card)
        card.append(cardBody)
        
        cardBody.append(title, weatherIcon, tempEl, windEl, humidityEl);
        
        tempEl.text(`🌡️ ${tempC} ℃`);
        windEl.text(`🌬️ ${windKph} Kph`);
        humidityEl.text(`💦 ${humidity} %`);
        
        forecastContainer.append(col)

    }
    
}


// resource for this function: Drew's speedrun
function fetchWeather(location) {
    let latitude = location.lat;
    let longitude = location.lon;
    let city = location.name;
    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIKey}`

    $.ajax({
        url: queryWeatherURL,
        method: "GET"
    }).then(function(response){
        renderCurrentWeather(city, response.list[0]);
        renderForecast(response.list);

    })
}


function fetchCoordinates(search) {
    let queryURL =`${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`;
    fetch(queryURL, ).then(function(data){
        return data.json()
    }).then(function(response){
        if(!response[0]){
            alert("No such location");
        }
        else {
            appendSearchHistory(search)
            fetchWeather(response[0]) 
        }
    })
}

function initaliseHistory() {
    let storedHistory = localStorage.getItem("search-history");

    if (storedHistory){
        searchHistory = JSON.parse(storedHistory);
    
    }
    collectSearchHistory();
}



function submitSearchForm(event) {
    event.preventDefault();
    let search = searchInput.val().trim()

    fetchCoordinates(search);
    searchInput.val("");
}

function searchClickHistory(event) {
    if(!$(event.target).hasClass("btn-history")){
        return
    }
    let search = $(event.target).attr("data-search")
    fetchCoordinates(search);
    searchInput.val("")
}

initaliseHistory()
searchForm.on("submit", submitSearchForm)
searchHistoryContainer.on("click", searchClickHistory)










