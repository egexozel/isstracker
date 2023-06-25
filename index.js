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
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// API Url for the iss tracking
const apiUrl = "https://api.wheretheiss.at/v1/satellites/25544";

// Get the current location of the ISS from the API and update the info elements and the map marker on the map
async function getData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    let { latitude, longitude, altitude, velocity, visibility } = data;

    document.getElementById("lon").textContent = longitude.toFixed(2);
    document.getElementById("lat").textContent = latitude.toFixed(2);
    document.getElementById("alt").textContent = altitude.toFixed(3);
    document.getElementById("vel").textContent = velocity.toFixed(2);

    console.log(visibility);
    console.log(response.status);

    if (visibility === "daylight") {
        document.getElementById("vis").textContent = "The ISS is in daylight";
        document.getElementById("vis").classList.add("bg-amber-200", "text-inherit");
        document.getElementById("vis").classList.remove("bg-sky-900", "text-slate-200");
    } else if (visibility === "eclipsed") {
        document.getElementById("vis").textContent = "The ISS is in the dark";
        document.getElementById("vis").classList.remove("bg-amber-200");
        document.getElementById("vis").classList.add("bg-sky-900", "text-slate-200");
    }

    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude]);
    return { longitude, latitude };
}

// Function to look up the country from lat and lon
async function locationLookup() {
    try {
        const { latitude, longitude } = await getData(); // Retrieve latitude and longitude values from getData()
        const response = await fetch(
            "https://api.wheretheiss.at/v1/coordinates/" + longitude.toFixed(2) + "," + latitude.toFixed(2)
        );
        const data = await response.json();
        let { country_code } = data;
        console.log(country_code);
        document.getElementById("cc").textContent = country_code;
    } catch (error) {
        console.error(error);
    }
}

getData();

// Increased the interval slightly above 1 second because it was rate limited occasionally.
setInterval(getData, 1200);
setInterval(locationLookup, 4000);
