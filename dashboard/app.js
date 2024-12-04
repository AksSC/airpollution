document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '20FJCTOQM80U0EUN';
    const channelId = '2683021';
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let latestData = data.feeds[0];
            let pm25 = latestData.field3;
            let pm10 = latestData.field4;
            let temperature = latestData.field1;
            let co2 = latestData.field5;
            pm25 *= 0.9913;
            pm25 += 0.0046;
            pm10 *= 0.7457;
            pm10 += 1.1026;

            document.getElementById('pm25').textContent = pm25;
            document.getElementById('pm10').textContent = pm10;
            document.getElementById('temperature').textContent = temperature;
            document.getElementById('co2').textContent = co2;

            // Calculate AQI
            const aqi = calculateAQI(pm25, pm10);
            document.getElementById('aqi').textContent = aqi;
            document.getElementById('aqi-status').textContent = getAQIStatus(aqi);
        })
        .catch(error => console.error('Error fetching data:', error));

    function calculateAQI(pm25, pm10) {
        let aqi25 = 50/30;
        let tmp = pm25 % 30;
        aqi25 *= tmp;
        tmp = Math.floor(pm25/30);
        tmp *= 50;
        aqi25 += tmp;

        let aqi10 = pm10 % 50;
        tmp = Math.floor(pm10/50);
        tmp *= 50;
        aqi10 += tmp;
        console.log(aqi25, aqi10);
      
        aqi =  Math.max(aqi25, aqi10).toFixed(2);

        return aqi;
    }

    function getAQIStatus(aqi) {
        if (aqi <= 50) return "Air Quality is Good!";
        if (aqi <= 100) return "Air Quality is Satisfactory!";
        if (aqi <= 200) return "Air Quality is Moderate!";
        if (aqi <= 300) return "Air Quality is Poor!";
        if (aqi <= 400) return "Air Quality is Very Poor!";
        return "Air Quality is Severe!";
    }
});
