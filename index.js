// Initialize the map and marker properties
const map = L.map("issMap").setView([0, 0], 2);
const issIcon = L.icon({
  iconUrl: "iss_marker_v2.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
const marker = L.marker([0, 0], { icon: issIcon }).addTo(map);

// Add OpenStreetMap tiles to the map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// API Url for the iss tracking
const apiUrl = "https://api.wheretheiss.at/v1/satellites/25544";

// Get the current location of the ISS from the API and update the info elements and the map marker on the map
async function getData() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  let { latitude, longitude, altitude } = data;

  document.getElementById("lon").textContent = longitude.toFixed(2);
  document.getElementById("lat").textContent = latitude.toFixed(2);
  document.getElementById("alt").textContent = altitude.toFixed(3);
  marker.setLatLng([latitude, longitude]);
  map.setView([latitude, longitude]);
}


getData();
setInterval(getData, 1000);
