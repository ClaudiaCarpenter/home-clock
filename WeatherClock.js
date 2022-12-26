import WeatherData from "./components/getWeatherData.js";
import WeatherDisplayer from "./components/showWeather.js";
import DateTimeDisplayer from "./components/showDateAndTime.js";

export default class WeatherClock {

    constructor() {
        this.lat = 37.382760892759286;
        this.long = -122.11061512439103;
        this.zipcode = 94022;
        this.query = this.zipcode.toString();
        this.apiKey = 'dcdfd704e8f84920845184808213012';

        const SEC = 1000;
        setInterval(this.updateDateAndTime, SEC);          // update current date/time and day/night every second
        setTimeout(this.updateData, SEC / 10);             // show weather on startup
        setInterval(this.updateData, SEC * 60 * 60 * 15);  // update weather every 15 minutes
    }

    updateData = () => {
        DateTimeDisplayer.update(this.lat, this.long);
        //  WeatherData.getData(this.apiKey, this.query, (results) => {
        //     DateTimeDisplayer.update(this.lat, this.long);
        //     WeatherDisplayer.update(results);
        // });
    }

    updateDateAndTime = () => {
        DateTimeDisplayer.update(this.lat, this.long);
    }

}

new WeatherClock();