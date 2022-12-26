let savedTemp = 0;
let sunset = new Date();
let isNight = true;
const lat = 37.382760892759286;
const long = -122.11061512439103;

function getAndUpdateWeather() {
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const apikey = urlParams.get('key');
    const apikey = "5JLfsPRyRdPmhyAhHXalpUuVQYEDclXL";
    if (apikey) {
        try {
            displayWeather();
            return;
            // debugger;
            const getTimelineURL = "https://data.climacell.co/v4/timelines?";
            const location = [37.3556909, -122.0952004]; // [lat, long];
            const units = "imperial";
            const timesteps = ["current", "1h", "1d"];

            // return these fields
            const fields = [
                "precipitationIntensity",
                "windSpeed",
                "temperature",
                "temperatureApparent",
                "cloudCover",
                "weatherCode",
            ].join(',');


            // Can configure the time frame up to 6 hours back and 15 days out
            const now = new Date();

            //now.setMinutes(now.getMinutes() - 60);
            const startTime = now.toISOString();

            //now.setMinutes(now.getMinutes() + 60);
            //now.setDate(now.getDate() + 1);
            const endTime = now.toISOString();
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // request the timelines with all the query string parameters as options
            const paramValues = {
                apikey,
                location,
                fields,
                units,
                timesteps,
                //startTime,
                //endTime,
                timezone,
            };
            const params = new URLSearchParams(paramValues);
            const queryParams = params.toString();
            console.log(paramValues);

            const apiCall = getTimelineURL + queryParams;
            console.log(apiCall);
            console.log(startTime, endTime);
            // debugger;
            $.ajax({
                type: "GET",
                url: apiCall,
                dataType: "json"
            }).done(function (result, textStatus, jqXHR) {
                console.log('done', result, textStatus, jqXHR);
                // displayWeather(result);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log('fail', jqXHR, textStatus, errorThrown);
            });
        } catch (ex) {
            console.log(ex);
        }
    }
}

function pickMoonImage(phase) {
    return './phases/' + Math.round(phase * 28) + '.png';
}

function displayWeather(weather) {
//    get_phase(moon_day(new Date()));
    var now = new Date();
    // now.setDate(4);
    var times = SunCalc.getTimes(now, lat, long);
    var values = SunCalc.getMoonIllumination(now);
    const img = pickMoonImage(values.phase);
    $('#moon').attr('src', img);
    return;
    // const moonDate = new Date();
    //moonDate.setDate(1);
    // console.log('moon phase', getLunarPhase(moonDate), getLunarAge(moonDate), getLunarAgePercent(moonDate));
    return;
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
        document.body.className = isNowNight ? 'night' : 'day';
    }

    const formattedTime = date.toLocaleString('en-US', { timeStyle: 'short' });
    const timeParts = formattedTime.split(' ');
    document.getElementById('time').innerHTML = timeParts[0];

    const formattedDate = date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    document.getElementById('date').innerHTML = formattedDate;
    document.getElementById('temp').innerHTML = savedTemp ? (savedTemp + '°F') : '59°F';
}

function updateMoon() {
    // drawPlanetPhase(document.body, 0.1, true, { diameter: 200, earthshine: 0.1, blur: 10, lightColour: '#9bf', image: '../moon.jpeg' })
}


const getJulianDate = (date = new Date()) => {
    const time = date.getTime();
    const tzoffset = date.getTimezoneOffset()
    return (time / 86400000) - (tzoffset / 1440) + 2440587.5;
}

const LUNAR_MONTH = 29.530588853;
const getLunarAge = (date = new Date()) => {
    const percent = getLunarAgePercent(date);
    const age = percent * LUNAR_MONTH;
    return age;
}
const getLunarAgePercent = (date = new Date()) => {
    return normalize((getJulianDate(date) - 2451550.1) / LUNAR_MONTH);
}
const normalize = value => {
    value = value - Math.floor(value);
    if (value < 0)
        value = value + 1
    return value;
}

const getLunarPhase = (date = new Date()) => {
    const age = getLunarAge(date);
    if (age < 1.84566)
        return "New";
    else if (age < 5.53699)
        return "Waxing Crescent";
    else if (age < 9.22831)
        return "First Quarter";
    else if (age < 12.91963)
        return "Waxing Gibbous";
    else if (age < 16.61096)
        return "Full";
    else if (age < 20.30228)
        return "Waning Gibbous";
    else if (age < 23.99361)
        return "Last Quarter";
    else if (age < 27.68493)
        return "Waning Crescent";
    return "New";
}

const SEC = 1000;
setInterval(updateTime, SEC);                          // show current time every second
setTimeout(getAndUpdateWeather, SEC / 10);             // show weather on startup
setInterval(getAndUpdateWeather, SEC * 60 * 60 * 15);  // update weather every 15 minutes


const mock = {
    "data": {
        "timelines": [
            {
                "timestep": "current",
                "startTime": "2021-12-21T13:08:00-08:00",
                "endTime": "2021-12-21T13:08:00-08:00",
                "intervals": [
                    {
                        "startTime": "2021-12-21T13:08:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 0.29,
                            "windGust": 1.54,
                            "windDirection": 36.63,
                            "temperature": 57.76,
                            "temperatureApparent": 57.76,
                            "cloudCover": 5,
                            "cloudBase": null,
                            "cloudCeiling": null,
                            "weatherCode": 1000
                        }
                    }
                ]
            },
            {
                "timestep": "1h",
                "startTime": "2021-12-21T12:00:00-08:00",
                "endTime": "2021-12-22T13:00:00-08:00",
                "intervals": [
                    {
                        "startTime": "2021-12-21T12:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 0.69,
                            "windGust": 4.76,
                            "windDirection": 173.13,
                            "temperature": 56.3,
                            "temperatureApparent": 56.3,
                            "cloudCover": 12,
                            "cloudBase": 0.37,
                            "cloudCeiling": null,
                            "weatherCode": 1100
                        }
                    },
                    {
                        "startTime": "2021-12-21T13:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 0.29,
                            "windGust": 1.54,
                            "windDirection": 36.63,
                            "temperature": 57.76,
                            "temperatureApparent": 57.76,
                            "cloudCover": 5,
                            "cloudBase": null,
                            "cloudCeiling": null,
                            "weatherCode": 1000
                        }
                    },
                    {
                        "startTime": "2021-12-21T14:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 1.57,
                            "windGust": 5.1,
                            "windDirection": 33.88,
                            "temperature": 53.82,
                            "temperatureApparent": 53.82,
                            "cloudCover": 93.47,
                            "cloudBase": 2.22,
                            "cloudCeiling": null,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-21T15:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 1.54,
                            "windGust": 5.55,
                            "windDirection": 2.19,
                            "temperature": 53.85,
                            "temperatureApparent": 53.85,
                            "cloudCover": 29.56,
                            "cloudBase": 1.09,
                            "cloudCeiling": null,
                            "weatherCode": 1100
                        }
                    },
                    {
                        "startTime": "2021-12-21T16:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 2.75,
                            "windGust": 5.03,
                            "windDirection": 348.54,
                            "temperature": 52.52,
                            "temperatureApparent": 52.52,
                            "cloudCover": 89.19,
                            "cloudBase": 0.8,
                            "cloudCeiling": null,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-21T17:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 3.22,
                            "windGust": 5.97,
                            "windDirection": 320.52,
                            "temperature": 50.5,
                            "temperatureApparent": 50.5,
                            "cloudCover": 100,
                            "cloudBase": 0.76,
                            "cloudCeiling": 0.85,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-21T18:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 3.4,
                            "windGust": 4.16,
                            "windDirection": 276.42,
                            "temperature": 49.89,
                            "temperatureApparent": 49.89,
                            "cloudCover": 100,
                            "cloudBase": 0.75,
                            "cloudCeiling": 0.75,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-21T19:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 2.86,
                            "windGust": 3.06,
                            "windDirection": 212.7,
                            "temperature": 49.6,
                            "temperatureApparent": 49.6,
                            "cloudCover": 100,
                            "cloudBase": 0.91,
                            "cloudCeiling": null,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-21T20:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 1.45,
                            "windGust": 1.97,
                            "windDirection": 242.32,
                            "temperature": 48.81,
                            "temperatureApparent": 48.81,
                            "cloudCover": 100,
                            "cloudBase": 1.01,
                            "cloudCeiling": 1.29,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-21T21:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 5.37,
                            "windGust": 9.98,
                            "windDirection": 301.49,
                            "temperature": 48.78,
                            "temperatureApparent": 48.78,
                            "cloudCover": 100,
                            "cloudBase": 0.94,
                            "cloudCeiling": 1.01,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-21T22:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0.0142,
                            "precipitationType": 1,
                            "windSpeed": 2.48,
                            "windGust": 5.84,
                            "windDirection": 47.73,
                            "temperature": 48.49,
                            "temperatureApparent": 48.49,
                            "cloudCover": 100,
                            "cloudBase": 0.9,
                            "cloudCeiling": 1.09,
                            "weatherCode": 4000
                        }
                    },
                    {
                        "startTime": "2021-12-21T23:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0.0142,
                            "precipitationType": 1,
                            "windSpeed": 4,
                            "windGust": 5.23,
                            "windDirection": 252.43,
                            "temperature": 48.42,
                            "temperatureApparent": 48.42,
                            "cloudCover": 100,
                            "cloudBase": 0.55,
                            "cloudCeiling": 1.58,
                            "weatherCode": 4000
                        }
                    },
                    {
                        "startTime": "2021-12-22T00:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0.033,
                            "precipitationType": 1,
                            "windSpeed": 3.22,
                            "windGust": 5.7,
                            "windDirection": 125.54,
                            "temperature": 48.18,
                            "temperatureApparent": 48.18,
                            "cloudCover": 100,
                            "cloudBase": 0.82,
                            "cloudCeiling": 0.04,
                            "weatherCode": 4200
                        }
                    },
                    {
                        "startTime": "2021-12-22T01:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 6.22,
                            "windGust": 16.98,
                            "windDirection": 130.03,
                            "temperature": 48.29,
                            "temperatureApparent": 48.29,
                            "cloudCover": 98.91,
                            "cloudBase": 0.57,
                            "cloudCeiling": null,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T02:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 9.26,
                            "windGust": 20.31,
                            "windDirection": 139.4,
                            "temperature": 50.32,
                            "temperatureApparent": 50.32,
                            "cloudCover": 100,
                            "cloudBase": 0.55,
                            "cloudCeiling": 1.32,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T03:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 11.25,
                            "windGust": 22.59,
                            "windDirection": 145.55,
                            "temperature": 52.47,
                            "temperatureApparent": 52.47,
                            "cloudCover": 100,
                            "cloudBase": 0.48,
                            "cloudCeiling": 0.63,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T04:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0.1849,
                            "precipitationType": 1,
                            "windSpeed": 10.58,
                            "windGust": 21.32,
                            "windDirection": 144.74,
                            "temperature": 52.83,
                            "temperatureApparent": 52.83,
                            "cloudCover": 100,
                            "cloudBase": 0.47,
                            "cloudCeiling": 1.01,
                            "weatherCode": 4001
                        }
                    },
                    {
                        "startTime": "2021-12-22T05:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 10.8,
                            "windGust": 19.82,
                            "windDirection": 145.79,
                            "temperature": 53.38,
                            "temperatureApparent": 53.38,
                            "cloudCover": 100,
                            "cloudBase": 0.53,
                            "cloudCeiling": 5.83,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T06:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 9.35,
                            "windGust": 17.94,
                            "windDirection": 144.31,
                            "temperature": 53.82,
                            "temperatureApparent": 53.82,
                            "cloudCover": 100,
                            "cloudBase": 0.4,
                            "cloudCeiling": 1.63,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T07:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0.0594,
                            "precipitationType": 1,
                            "windSpeed": 8.23,
                            "windGust": 15.91,
                            "windDirection": 144.16,
                            "temperature": 53.67,
                            "temperatureApparent": 53.67,
                            "cloudCover": 100,
                            "cloudBase": 0.41,
                            "cloudCeiling": 0.6,
                            "weatherCode": 4200
                        }
                    },
                    {
                        "startTime": "2021-12-22T08:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 7.16,
                            "windGust": 15.82,
                            "windDirection": 150,
                            "temperature": 52.56,
                            "temperatureApparent": 52.56,
                            "cloudCover": 96.09,
                            "cloudBase": 0.22,
                            "cloudCeiling": 0.42,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T09:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0.0005,
                            "precipitationType": 1,
                            "windSpeed": 6.8,
                            "windGust": 15.1,
                            "windDirection": 140.11,
                            "temperature": 54.68,
                            "temperatureApparent": 54.68,
                            "cloudCover": 89.84,
                            "cloudBase": 0.19,
                            "cloudCeiling": 0.24,
                            "weatherCode": 4000
                        }
                    },
                    {
                        "startTime": "2021-12-22T10:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0.0005,
                            "precipitationType": 1,
                            "windSpeed": 8.03,
                            "windGust": 17.9,
                            "windDirection": 149.37,
                            "temperature": 57.04,
                            "temperatureApparent": 57.04,
                            "cloudCover": 97.66,
                            "cloudBase": 0.19,
                            "cloudCeiling": 0.3,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T11:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 9.13,
                            "windGust": 19.55,
                            "windDirection": 155.81,
                            "temperature": 58.37,
                            "temperatureApparent": 58.37,
                            "cloudCover": 83.59,
                            "cloudBase": 0.17,
                            "cloudCeiling": 0.35,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T12:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 8.95,
                            "windGust": 19.19,
                            "windDirection": 152.68,
                            "temperature": 59.59,
                            "temperatureApparent": 59.59,
                            "cloudCover": 82.03,
                            "cloudBase": 0.18,
                            "cloudCeiling": null,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T13:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0,
                            "precipitationType": 1,
                            "windSpeed": 8.72,
                            "windGust": 18.88,
                            "windDirection": 158.88,
                            "temperature": 60.57,
                            "temperatureApparent": 60.57,
                            "cloudCover": 99.22,
                            "cloudBase": 0.21,
                            "cloudCeiling": 0.3,
                            "weatherCode": 1001
                        }
                    }
                ]
            },
            {
                "timestep": "1d",
                "startTime": "2021-12-21T06:00:00-08:00",
                "endTime": "2021-12-22T06:00:00-08:00",
                "intervals": [
                    {
                        "startTime": "2021-12-21T06:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0.1849,
                            "precipitationType": 1,
                            "windSpeed": 11.25,
                            "windGust": 22.59,
                            "windDirection": 178.06,
                            "temperature": 57.76,
                            "temperatureApparent": 57.76,
                            "cloudCover": 100,
                            "cloudBase": 2.22,
                            "cloudCeiling": 5.83,
                            "weatherCode": 1001
                        }
                    },
                    {
                        "startTime": "2021-12-22T06:00:00-08:00",
                        "values": {
                            "precipitationIntensity": 0.0594,
                            "precipitationType": 1,
                            "windSpeed": 9.13,
                            "windGust": 19.55,
                            "windDirection": 150.14,
                            "temperature": 60.57,
                            "temperatureApparent": 60.57,
                            "cloudCover": 100,
                            "cloudBase": 0.41,
                            "cloudCeiling": 0.6,
                            "weatherCode": 1001
                        }
                    }
                ]
            }
        ]
    },
    "warnings": [
        {
            "code": 246009,
            "type": "Missing Time Range",
            "message": "The timestep is not supported in full for the time range requested.",
            "meta": {
                "timestep": "current",
                "from": "now",
                "to": "+1m"
            }
        }
    ]
};