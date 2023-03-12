
const weatherAPIURL = "https://api.openweathermap.org"
const weatherAPIKey = "556d1e5bc879529384ffe0b885c752a7"
let searchHistory = []
let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHistoryContainer = $("#history")


function fetchCoordinates(search) {
    let queryURL =`${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`;
    fetch(queryURL, ).then(function(data){
        return data.json()
    }).then(function(response){
        if(!response[0]){
            alert("No such location");
        }
        else {
            searchHistory.push(search);
            localStorage.setItem("search-history", JSON.stringify(searchHistory))
            searchHistoryContainer.html("")
            for (let i=0; i<searchHistory.length; i++){
            let btn = $("<button>");
            btn.attr("type", "button")
            btn.addClass("history-btn btn-history")

            btn.attr("data-search", searchHistory[i])
            btn.text(searchHistory[i])
            searchHistoryContainer.append(btn)
            }
        }
    })
}



function submitSearchForm(event) {
    event.preventDefault();
    let search = searchInput.val().trim()

    fetchCoordinates(search);
}

searchForm.on("submit", submitSearchForm)











