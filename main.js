const lat = 37.382760892759286;
const long = -122.11061512439103;
const dateTimeFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const key = urlParams.get('key');

let savedTemp = 0;
let sunset = new Date();
let isNight = true;

function getAndUpdateWeather() {
    if (key) {
        try {
            const apiCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&appid=' + key;
            $.ajax({
                type: "GET", url: apiCall, dataType: "jsonp",
                success: function (result) {
                    displayWeather(result);
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }
}

function displayWeather(weather) {
    sunset = new Date(weather.current.sunset * 1000);
    console.log('sunset', sunset, weather.current);
    savedTemp = Math.round(kToF(weather.current.temp));
}

function kToF(kelvin) {
    return (parseFloat(kelvin) - 273.15) * 1.8 + 32;
}

function formatTempRange(temps) {
    var temp = temps.low + ' - ' + temps.high + '&deg; F';
    return temp;
}

function updateTime() {
    const date = new Date();

    const isNowNight = date.getHours() < 7;
    if (isNowNight != isNight) {
        isNight = isNowNight;
        document.body.className = isNowNight ? 'night': 'day';
    }
    
    const formattedTime = date.toLocaleString('en-US', {timeStyle: 'short'});
    const timeParts = formattedTime.split(' ');
    document.getElementById('time').innerHTML = timeParts[0];
 
    const formattedDate = date.toLocaleString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});
    document.getElementById('date').innerHTML = formattedDate;
    document.getElementById('temp').innerHTML = savedTemp ? (savedTemp + '°F') : '59°F';
}

const SEC = 1000;
setInterval(updateTime, SEC);                          // show current time every second
setTimeout(getAndUpdateWeather, SEC / 10);             // show weather on startup
setInterval(getAndUpdateWeather, SEC * 60 * 60 * 15);  // update weather every 15 minutes
