export default class WeatherData {

    static mapConditionData(result) {
        let current = {};
        current.temp = Math.round(result.current.temp_f);
        current.night = !result.current.is_day;
        current.code = result.current.condition.code;
        current.clouds = result.current.cloud;
        current.rain = result.current.precip_in;
        current.wind = result.current.wind_mph;
        // current.air = result.current.air_quality['us-epa-index'];
        return current;
    }

    static mapForecastDayData(result) {
        let day = {};
        day.date = new Date(result.date);
        day.low = Math.round(result.day.mintemp_f);
        day.high = Math.round(result.day.maxtemp_f);
        day.rain = result.day.daily_chance_of_rain || result.day.daily_chance_of_snow;
        day.wind = result.day.maxwind_mph;
        day.icon = result.day.condition.icon;
        return day;
    }

    static mapForecastData(result) {
        console.log(result);
        let forecast = {};
        forecast.current = WeatherData.mapConditionData(result);
        forecast.days = []
        for (let i = 0; i < result.forecast.forecastday.length; i++) {
            forecast.days.push(WeatherData.mapForecastDayData(result.forecast.forecastday[i]))
        }
        return forecast;
    }

    static getData(key, query, callback) {
        const forecastURL = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${query}&days=10&aqi=no&alerts=no`;
        try {
            $.ajax({
                type: "GET",
                url: forecastURL,
                dataType: "json"
            }).done(function (result) {
                callback(WeatherData.mapForecastData(result));
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log('fail', jqXHR, textStatus, errorThrown);
            });
        } catch (ex) {
            console.log(ex);
        }
    }
}
