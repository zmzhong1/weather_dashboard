// Global Storage
let APIKey = "ba99390b22ae058217c7ce443e6dd668";
let fetchButton = document.getElementById("fetch-button");
let addCity = document.getElementById("cities");
let locationName = document.getElementById("locationName");
let temp = document.getElementById("temp");
let wind = document.getElementById("wind");
let humidity = document.getElementById("humidity");
let UV = document.getElementById("UV");

let cityList = [];

// Fetches API and insert requested criteria content on the HTML
function getApi(userInput) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + APIKey;
    fetch(queryURL) 
        .then(function (response) {
            return response.json();
    })
    .then(function (data) {
        console.log(data);
        locationName.textContent = data.name + " " + moment().format('l');
        const queryURLforecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&limit=5&exclude={part}&appid=${APIKey}`;

        fetch(queryURLforecast) 
            .then(function (resp) {
                return resp.json();
        })

        //Renders the current weather 
        .then(function (weatherData) {
            console.log(weatherData);
            let kelvin = (weatherData.current.temp - 273.15) * 1.8 + 32;
            temp.textContent = "Temp: " + kelvin.toFixed(2) + "°F";
            let milesPerHour = weatherData.current.wind_speed * 2.237; 
            wind.textContent = "Wind: " + milesPerHour.toFixed(2) + " MPH";
            humidity.textContent = "Humidity: " + weatherData.current.humidity;
            if(weatherData.current.uvi < 3) {
                $('#UV').css("background-color", "green");
            } else if (weatherData.current.uvi > 5) {
                $('#UV').css("background-color", "red");
            } else {
                $('#UV').css("background-color", "yellow");
            }
            UV.textContent = "UV Index: " + weatherData.current.uvi;
            // Renders the next 5 days forecast
            for (let i = 0; i < 5; i++) {
                $('#forecastDate'+i).html(moment().add(i + 1, 'days').format('l'));
                $('#icon'+i).html("<img src=http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png>");
                let k = ((weatherData.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(2);
                $('#forecastTemp'+i).html("Temp: " + k + "°F");
                let MPH = weatherData.daily[i].wind_speed * 2.237;
                $('#forecastWind'+i).html("Wind: " + MPH.toFixed(2) + " MPH");
                $('#forecastHumidity'+i).html("Humidity: " + weatherData.daily[i].humidity + " %");
            }
        });
    });
}

// When user inserts a city name, it checks if the city name has been inserted. If not adds into a list.
fetchButton.addEventListener("click", function (event) {
    event.preventDefault();
    let userInput = $("#city-name").val().trim();
    getApi(userInput);
    if (!cityList.includes(userInput)) {
        cityList.push(userInput);
        var history = $(`<li class="list-group-item">${userInput}</li>`);
        $("#cities").append(history);
    }
    localStorage.setItem("history", JSON.stringify(cityList));
    console.log(cityList);
});

// When the list is clicked, renders the weather content
$(document).on("click", ".list-group-item", function () {
    let selectedCity = $(this).text();
    getApi(selectedCity);
});

// Displays the last searched city on the weather page
$(document).ready(function () {
    let historyArray = JSON.parse(localStorage.getItem("history"));
    if (historyArray !== null) {
        let lastSearchIndex = historyArray.length -1;
        let lastSearchedCity = historyArray[lastSearchIndex];
        getApi(lastSearchedCity);
    }
});

