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
        const AQI25_high = 300;
        const AQI25_low = 20;
        const PM25_high = 120;
        const PM25_low = 15;
      
        const PM10_high = 350;
        const PM10_low = 5;

        const aqi25 = ((AQI25_high - AQI25_low) / (PM25_high - PM25_low)) * (pm25 - PM25_low) + AQI25_low;
        const aqi10 = ((AQI25_high - AQI25_low) / (PM10_high - PM10_low)) * (pm10 - PM10_low) + AQI25_low;
        console.log(aqi25, aqi10);
      
        aqi =  Math.max(aqi25, aqi10).toFixed(2);

        return aqi;
    }

    function getAQIStatus(aqi) {
        if (aqi <= 50) return "Air Quality is Good!";
        if (aqi <= 100) return "Air Quality is Moderate!";
        if (aqi <= 150) return "Air Quality Could be Unhealthy for Sensitive Groups!";
        return "Air Quality is Unhealthy!";
    }
});
