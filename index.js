const map = L.map('issMap').setView([0, 0], 2);
const issIcon = L.icon({
    iconUrl: 'iss_marker_v2.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16]

})
const marker = L.marker([0, 0], {icon: issIcon}).addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const apiUrl = 'https://api.wheretheiss.at/v1/satellites/25544'


async function getData () {
    const response = await fetch(apiUrl);
    const data = await response.json();
    let {latitude, longitude, altitude } = data;


    document.getElementById('lon').textContent = longitude.toFixed(2);
    document.getElementById('lat').textContent = latitude.toFixed(2);
    document.getElementById('alt').textContent = altitude.toFixed(3);
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude]);
}

getData();
setInterval(getData, 1000);
