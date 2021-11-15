const lat = 37.382760892759286;
const long = -122.11061512439103;
const dateTimeFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const key = urlParams.get('key');

let savedTemp = 0;

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
    // const text = [];
    // text.push('Sunrise:');
    // text.push(getTime(new Date(weather.current.sunrise * 1000)));
    // text.push('Sunset:');
    // text.push(getTime(new Date(weather.current.sunset * 1000)));
    // document.getElementById('weather').innerHTML = text.join(' ');
    savedTemp = Math.round(kToF(weather.current.temp));
}

function kToF(kelvin) {
    return (parseFloat(kelvin) - 273.15) * 1.8 + 32;
}

function formatTempRange(temps) {
    var temp = temps.low + ' - ' + temps.high + '&deg; F';
    return temp;
}

function getTime(time) {
    const parts = dateTimeFormat.formatToParts(new Date(time));
    return parts[8].value + ':' + parts[10].value;
}

function updateTime() {
    const time = new Date();
    const parts = dateTimeFormat.formatToParts(new Date());
    console.log('time', time.getTime());
    document.getElementById('time').innerHTML = parts[8].value + ':' + parts[10].value;
    document.getElementById('date').innerHTML = parts[0].value + ', ' + parts[2].value + '&nbsp' + parts[4].value;
    document.getElementById('temp').innerHTML = savedTemp ? (savedTemp + '°F') : 'No API Key';
}

const SEC = 1000;
setInterval(updateTime, SEC);                          // show current time every second
setTimeout(getAndUpdateWeather, SEC / 10);             // show weather on startup
setInterval(getAndUpdateWeather, SEC * 60 * 60 * 15);  // update weather every 15 minutes
