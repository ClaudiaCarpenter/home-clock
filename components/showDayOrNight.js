export default class DayNightDisplayer {

    static updateDayOrNight(lat, long) {
        function getMoonImage() {
            const ilumination = SunCalc.getMoonIllumination(new Date());
            const phase = Math.round(ilumination.phase * 28)
            return `/phases/${phase}.png`;
        }

        function getSunImage() {
            return '/images/sun.png';
        }

        const date = new Date();
        const times = SunCalc.getTimes(date, lat, long);
        const time = date.getTime();
        const isNight = time > times.sunset.getTime() && time < times.sunrise.getTime();
        const newClass = isNight ? 'night' : 'day';
        if (document.body.className != newClass) {
            document.body.className = newClass;
        }

        const newImg = newClass === 'day' ? getSunImage() : getMoonImage();
        const prevImg = document.getElementById('planet').getAttribute('src');
        if (prevImg != newImg) {
            console.log('setting new planet', newImg);
            document.getElementById('planet').setAttribute('src', newImg);
        }
    }

    // var times = SunCalc.times = [
    //     [-0.833, 'sunrise',       'sunset'      ],
    //     [  -0.3, 'sunriseEnd',    'sunsetStart' ],
    //     [    -6, 'dawn',          'dusk'        ],
    //     [   -18, 'nightEnd',      'night'       ],
    // ];

    static condition = {
        CLEAR: Symbol("clear"),
        CLOUDS: Symbol("clouds"),
        HAZE: Symbol("haze"),
        RAIN: Symbol("rain")
    };

    static updateCondition(currentCondition) {
        let newImg = './images/clear';
        switch (currentCondition) {
            case this.condition.CLOUDS:
                newImg = './images/cloudy'
                break;
            case this.condition.HAZE:
                newImg = './images/haze'
                break;
            case this.condition.RAIN:
                newImg = './images/rain'
                break;
        }
        const prevImg = document.getElementById('condition').getAttribute('img');
        if (newImg != prevImg) {
            document.getElementById('condition').setAttribute('img', newImg);
        }
    }
}