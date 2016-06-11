var yesterdayRequest = "https://api.wunderground.com/api/63291acfffacc47e/yesterday/q/CA/94022.json";
var todayRequest = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where" +
    "%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22los%20altos%2C%20ca%22)" +
    "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

var savedYesterday = null;
var savedToday = null;
var savedForecast = null;
var savedTime = null;
var savedSunset = null;

function getAndUpdateWeather() {
    try {
        savedYesterday = null;
        $.ajax({
            type: "GET", url: yesterdayRequest, dataType: "jsonp",
            success: function(yesterdayData) {
                savedYesterday = [];
                savedYesterday.low = yesterdayData.history.dailysummary[0].mintempi;
                savedYesterday.high = yesterdayData.history.dailysummary[0].maxtempi;
                displayWeather();
            }});
    } catch (ex) {
        debugger;
    }

    try {
        savedToday = null;
        $.ajax({
            type: "GET", url: todayRequest, dataType: "jsonp",
            success: function(todayData) {
                savedToday = todayData.query.results.channel.item.condition;
                savedSunset = todayData.query.results.channel.astronomy.sunset;
                savedTime = new Date(todayData.query.results.channel.lastBuildDate);
                savedForecast = todayData.query.results.channel.item.forecast;
                displayWeather();
            }});
    } catch (ex) {
        debugger;
    }
}

function displayWeather() {
    if (savedToday != null) {
        $('#weatherIcon').attr('class', "wi wi-" + yahooCodes[savedToday.code]); //attr('src', subDir + savedToday.code + '.png');
        $('#weatherTemp').html(savedToday.temp + '&deg; F');
    }

    if (savedYesterday != null) {
        $('#weathery').html('Yesterday<br>' + formatTempRange(savedYesterday));
    }

    if (savedForecast != null) {
        $('#weather0').html('Today<br>' + formatTempRange(savedForecast[0]) +
            '<br><i class="wi wi-' + yahooCodes[savedForecast[0].code] + '"></i>');
        $('#weather1').html('Tomorrow<br>' + formatTempRange(savedForecast[1]) +
                '<br><i class="wi wi-' + yahooCodes[savedForecast[1].code] + '"></i>');
        $('#weather2').html(savedForecast[2].day + '<br>' + formatTempRange(savedForecast[2]) +
            '<br><i class="wi wi-' + yahooCodes[savedForecast[2].code] + '"></i>');
    }

    if (savedTime != null) {
        var hours = savedTime.getHours();
        if (hours == 0) {
            hours = 12;
        } else if (hours > 12) {
            hours -= 12;
        }
        var minutes = parseInt(savedTime.getMinutes());
        var minutesString = minutes.toString();
        if (minutes < 10) {
            minutesString = '0' + minutesString;
        }
        var seconds = parseInt(savedTime.getSeconds());
        var secondsString = seconds.toString();
        if (seconds < 10) {
            secondsString = '0' + secondsString;
        }
        $('#time').html(hours + ':' + minutesString);
        $('#date').html(formatDate(savedTime));
    }

    if (savedSunset != null) {
       $('#sunset').html('If all goes according to plan, the sun should set tonight @ ' + savedSunset);
    }
}

function formatTempRange(temps) {
    var temp = temps.low + ' - ' + temps.high + '&deg; F';
    if (temps.code && false) {
        temp = '<img src="' + temps.icon_url + '" /><br>' + temp;
    }
    return temp;
}

function setCookie(name, value) {
    document.cookie = name + "=" + value + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function formatDate(date) {
    var days = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    return days[date.getDay()].toUpperCase() + '&nbsp;' + (date.getMonth() + 1) + '/' + date.getDate();
}


setTimeout(getAndUpdateWeather, 100);
setInterval(getAndUpdateWeather, 1800000);
setInterval(function() {$('#bgDiv').toggleClass( "dark light" );}, 60000);

var yahooCodes = ["tornado",
    "day-storm-showers",
    "hurricane",
    "thunderstorm",
    "thunderstorm",
    "rain-mix",
    "rain-mix",
    "rain-mix",
    "hail",
    "showers",
    "hail",
    "showers",
    "showers",
    "snow",
    "day-snow",
    "snow-wind",
    "snow",
    "hail",
    "rain-mix",
    "dust",
    "fog",
    "windy",
    "smoke",
    "strong-wind",
    "strong-wind",
    "snowflake-cold",
    "cloudy",
    "night-cloudy",
    "day-cloudy",
    "night-cloudy",
    "day-cloudy",
    "night-clear",
    "day-sunny",
    "night-partly-cloudy",
    "day-sunny-overcast",
    "rain-mix",
    "hot",
    "day-storm-showers",
    "day-storm-showers",
    "day-storm-showers",
    "showers",
    "snow-wind",
    "snow",
    "snow-wind",
    "day-sunny-overcast",
    "day-storm-showers",
    "snow",
    "day-storm-showers",
    "stars"];
