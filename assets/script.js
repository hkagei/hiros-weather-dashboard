var searchCityEl = document.getElementById("enterCity");
var currentCity = document.getElementById("currentCity");
var currentTemp = document.getElementById("currentTemp");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
var currentUV = document.getElementById("currentUV");
var searchBtn = document.getElementById("searchBtn");
var weatherApiKey = "5c8633926c7e7b10de268890c0287251";
var lat = "";
var lon = "";
var searchHistoryList = [];
var searchHistoryContainer = document.querySelector('#history')
var searchForm = document.querySelector('#search-form')
var oneCallUrl = "";



var renderItems = function (data){
  currentWind.innerHTML = data.current.wind_speed;
  currentTemp.innerText = data.current.temp;
  currentWind.innerText = data.current.wind_speed;
  currentHumidity.innerText = data.current.humidity;
  currentUV.innerText = data.current.uvi;
};

function currentCondition(){
  console.log("current condition called");

};

searchBtn.addEventListener("click", function(event) {
  console.log("searchCityValue", searchCityEl.value);
  event.preventDefault();

  var city = $("enterCity").val();
  currentCondition(city);

  if (!searchHistoryList.includes(city)) {
      searchHistoryList.push(city);
  };
    
//   localStorage.setItem("city", JSON.stringify(searchHistoryList));
  getApi(searchCityEl.value);
  currentCity.textContent = searchCityEl.value;
  var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');
    btn.setAttribute('data-search', searchCityEl.value);
    btn.textContent = searchCityEl.value;
    searchHistoryContainer.append(btn);
    // btn.addEventListener

});

function getApi(searchCity) {
    var geoLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&limit=5&appid=" + weatherApiKey;
  
    fetch(geoLocationUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        lat = data[0].lat;
        lon = data[0].lon;
        console.log(lat, lon);
        console.log(data)
        oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + weatherApiKey + "&units=Imperial";
        fetchWeather(oneCallUrl);
      });
  }
  
  
function fetchWeather(oneCallUrl) {
    console.log('oneCallUrl', oneCallUrl)
    var city = location.name;
  
    fetch(oneCallUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log('futureWeatherData', data);
        renderItems(data);
        futureCondition(data);
      })
      .catch(function (err) {
        console.error(err);
      });
  };
  

function fetchCoords(search) {
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
          appendToHistory(search);
          fetchWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  };

function futureCondition(futureResponse) {


        $("#fiveDay").empty();
        
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: futureResponse.daily[i].dt,
                icon: futureResponse.daily[i].weather[0].icon,
                temp: futureResponse.daily[i].temp.day,
                humidity: futureResponse.daily[i].humidity,
                wind: futureResponse.daily[i].wind_speed
            };

            var currDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;

            
            var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${currDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °F</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                            <p>Wind: ${cityInfo.wind} mph</p>
                        </div>
                    </div>
                <div>
            `);

            $("#fiveDay").append(futureCard);
        }
    // }); 
}


function appendToHistory(search) {

  searchHistoryList.push(search)
   localStorage.setItem("city", JSON.stringify(searchHistoryList));
  console.log(searchHistoryList);
  renderSearchHistory();
}

function initSearchHistory() {
  var storedHistory = localStorage.getItem('city');
  if(storedHistory) {
    searchHistoryList = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

  
btn.addEventListener("click", function () {
  if (searchHistoryList !== null) {
    var lastSearchedIndex = searchHistoryList.length - 1;
    var lastSearchedCity = searchHistoryList[lastSearchedIndex];
    currentCondition(lastSearchedCity);
    console.log(`Last searched city: ${lastSearchedCity}`);
}

});


function handleSearchFormSubmit(e) {

if(!searchCityEl.value) {
  return;
}
e.preventDefault();
var search = searchCityEl.value.trim();
fetchCoords(search);
searchCityEl.value = "";
  
}


function handleSearchHistoryClick(e) {
  if(!e.target.matches('class')) {
return
  }
var btn = e.target;
var search = btn.getAttribute("data-search");
fetchCoords(search);
}


initSearchHistory();
searchForm.addEventListener("submit", handleSearchFormSubmit)
searchHistoryContainer.addEventListener("click", handleSearchHistoryClick)