export default class DateTimeDisplayer {
    static update() {
        const date = new Date();
        const formattedTime = date.toLocaleString('en-US', { timeStyle: 'short' });
        const timeParts = formattedTime.split(' ');
        document.getElementById('time').innerHTML = timeParts[0];

        const formattedDate = date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        document.getElementById('date').innerHTML = formattedDate;
    }
}