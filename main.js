const lat = 37.382760892759286;
const long = -122.11061512439103;
const dateTimeFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const key = urlParams.get('key') || 'd0b7b4a1e449b434e60316eae428877c';

let savedTemp = 0;
let sunset = new Date();
let isNight = true;

function getAndUpdateWeather() {
  console.log('calling getAndUpdateWeather', key);
  if (key) {
        try {
            const apiCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&appid=' + key;
            $.ajax({
                type: "GET", url: apiCall, dataType: "jsonp",
                success: function (result) {
                  console.log('called getAndUpdateWeather', result);
                  displayWeather(result);
                }
            });
        } catch (ex) {
            console.log('error', ex);
        }
    }
}
 
function displayWeather(weather) {
    sunset = new Date(weather.current.sunset * 1000);
    savedTemp = Math.round(kToF(weather.current.temp));
    console.log('sunset', sunset, savedTemp, weather.current);
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

    console.log('updateTime', savedTemp);
    document.getElementById('tempNum').innerHTML = savedTemp || 0;
}

const listCalendarEvents = () => {
  calendar.events.list(
    {
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    },
    (error, result) => {
      if (error) {
        console.log("Something went wrong: ", error); // If there is an error, log it to the console
      } else {
        if (result.data.items.length > 0) {
          console.log("List of upcoming events: ", result.data.items); // If there are events, print them out
        } else {
          console.log("No upcoming events found."); // If no events are found
        }
      }
    }
  );
};

const SEC = 1000;
setInterval(updateTime, SEC);                          // show current time every second
setTimeout(getAndUpdateWeather, SEC / 10);             // show weather on startup
setInterval(getAndUpdateWeather, SEC * 60 * 60 * 15);  // update weather every 15 minutes
