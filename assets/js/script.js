
const weatherAPIURL = "https://api.openweathermap.org"
const weatherAPIKey = ""
let searchHistory = []
let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHistoryContainer = $("#history")

function renderSearchHistory() {
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
            
        }
    })
}



function submitSearchForm(event) {
    event.preventDefault();
    let search = searchInput.val().trim()

    fetchCoordinates(search);
}

searchForm.on("submit", submitSearchForm)











