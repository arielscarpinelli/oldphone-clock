var days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

var clockElement = document.getElementById("clock");
var amPmElment = document.getElementById("amPm");
var dateElement = document.getElementById("date");
var currentTemperatureElement = document.getElementById("currentTemperature");
var forecastTemperatureElement = document.getElementById("forecastTemperature");

var currentLat = -34.52;
var currentLon = -58.49;

var APP_ID = "d0296b188dd9593e131ea56a86da5cab";

function showTime() {

    setTimeout(showTime, 1000);

    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59

    var amPm = "AM";
    
    if (h >= 7 && h <= 21) {
        document.body.classList.remove("night");
    } else {
        document.body.classList.add("night");
    }

    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        amPm = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    
    clockElement.innerText = h + ":" + m;
    amPmElment.innerText = amPm;
    dateElement.innerText = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()]

}

function get(url, callback, err) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function () {
      if (this.status === 200) {
        callback(JSON.parse(this.responseText));
      } else {
        err(error)
      }
    };

    xhr.onerror = function() {
        err("XHRError");
    }
    
    xhr.send();
}

function formatTemp(t) {
    return (Math.round(t * 10) / 10) + "ºC";
}

function fetchCurrentTemperature() {
    setTimeout(fetchCurrentTemperature, 1800000);
    get("https://api.openweathermap.org/data/2.5/weather?lat=" + currentLat + "&lon=" + currentLon + "&appid=" + APP_ID + "&units=metric", function(response) {
        currentTemperatureElement.innerHTML = formatTemp(response.main.temp);
    }, function(err) {
        currentTemperatureElement.innerHTML = err;
    });
}

function fetchForecastTemperature() {
    setTimeout(fetchForecastTemperature, 3 * 3600000);
    get("https://api.openweathermap.org/data/2.5/forecast?lat=" + currentLat + "&lon=" + currentLon + "&appid=" + APP_ID + "&units=metric", function(response) {

        var nextTwelveHours = (Date.now() / 1000) + 24 * 3600

        var temps = response.list
            .filter(function(item) { return item.dt <= nextTwelveHours })
            .map(function(item) { return item.main.temp });

        var min = Math.min.apply(null, temps);
        var max = Math.max.apply(null, temps);

        forecastTemperatureElement.innerHTML = formatTemp(min) + " - " + formatTemp(max);
    }, function(err) {
        forecastTemperatureElement.innerHTML = err;
    });
}

showTime();
fetchCurrentTemperature();
fetchForecastTemperature();