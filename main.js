const lat = 37.382760892759286;
const long = -122.11061512439103;
const key = 'd0b7b4a1e449b434e60316eae428877c';
const apiCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&appid=' + key;
const dateTimeFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' });

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
            success: function (yesterdayData) {
                savedYesterday = [];
                savedYesterday.low = yesterdayData.history.dailysummary[0].mintempi;
                savedYesterday.high = yesterdayData.history.dailysummary[0].maxtempi;
                displayWeather();
            }
        });
    } catch (ex) {
        debugger;
    }

    try {
        savedToday = null;
        $.ajax({
            type: "GET", url: todayRequest, dataType: "jsonp",
            success: function (todayData) {
                savedToday = todayData.query.results.channel.item.condition;
                savedSunset = todayData.query.results.channel.astronomy.sunset;
                savedTime = new Date(todayData.query.results.channel.lastBuildDate);
                savedForecast = todayData.query.results.channel.item.forecast;
                displayWeather();
            }
        });
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
    console.log(new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).formatToParts(date));

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
    var days = new Array("Sunday", "Monday", "Tueday", "Wedday", "Thursday", "Friday", "Satday");
    return days[date.getDay()] + '&nbsp;&nbsp;&middot;&nbsp;&nbsp;' + (date.getMonth() + 1) + '/' + date.getDate();
}

function updateTime() {
    const parts = dateTimeFormat.formatToParts(new Date());
    console.log(parts);
    document.getElementById('time').innerHTML = parts[8].value + ':' + parts[10].value;
    document.getElementById('date').innerHTML = parts[0].value + '&nbsp;&nbsp;&middot;&nbsp;&nbsp;' + parts[2].value + '&nbsp' + parts[4].value;
}

const SEC = 1000;
setTimeout(updateTime, SEC);                             // show current time every second
// setTimeout(getAndUpdateWeather, SEC / 10);               // show weather on startup
// setInterval(getAndUpdateWeather, SEC * 60 * 60 * 15);    // update weather every 15 minutes

// setInterval(function() {$('#bgDiv').toggleClass( "dark light" );}, 60000);

// 13) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// 0: {type: 'weekday', value: 'Monday'}
// 1: {type: 'literal', value: ', '}
// 2: {type: 'month', value: 'November'}
// 3: {type: 'literal', value: ' '}
// 4: {type: 'day', value: '15'}
// 5: {type: 'literal', value: ', '}
// 6: {type: 'year', value: '2021'}
// 7: {type: 'literal', value: ' at '}
// 8: {type: 'hour', value: '9'}
// 9: {type: 'literal', value: ':'}
// 10: {type: 'minute', value: '18'}
// 11: {type: 'literal', value: ' '}
// 12: {type: 'dayPeriod', value: 'AM'}
// length: 13
// [[Prototype]]: Array(0)
