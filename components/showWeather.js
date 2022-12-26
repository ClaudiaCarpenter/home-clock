import DayNightDisplayer from "./showDayOrNight.js";

export default class WeatherDisplayer {

    static updateWeather(conditions, lat, long) {
        DayNightDisplayer.updateDayOrNight(lat, long);
    }

    static updateForecast(days) {
        let containerDiv = document.getElementById('forecast');
        let html = '';
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            html += '<div>';
            html += `${day.date.toLocaleString('en-US', { weekday: 'short' })}<br />`;
            html += `<img src=${day.icon} /><br />`;
            html += `${day.low} - ${day.high}°F<br />`;
            html += '</div>';
        }
        containerDiv.innerHTML = containerDiv.innerHTML + html;
    }

    static update(weather, lat, long) {
        this.updateWeather(weather.current, lat, long);
        this.updateForecast(weather.days);
    }
}