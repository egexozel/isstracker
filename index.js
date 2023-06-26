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
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        let { latitude, longitude, altitude, velocity, visibility } = data;

        document.getElementById("lon").textContent = longitude.toFixed(2);
        document.getElementById("lat").textContent = latitude.toFixed(2);
        document.getElementById("alt").textContent = altitude.toFixed(3);
        document.getElementById("vel").textContent = velocity.toFixed(2);

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
    } catch (error) {
        console.error(error);
    }
}

// Function to look up the country from lat and lon
async function locationLookup() {
    try {
        const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" });
        const { latitude, longitude } = await getData(); // Retrieve latitude and longitude values from getData()
        const response = await fetch(
            "https://api.wheretheiss.at/v1/coordinates/" + latitude.toFixed(6) + "," + longitude.toFixed(6)
        );
        const data = await response.json();
        let { country_code } = data;
        console.log(country_code);

        // If ISS is on international waters, the API either does not respond or returns a value of "??"
        if (!country_code || country_code === "??") {
            document.getElementById("cc").textContent = "Unavailable";
        } else {
            document.getElementById("cc").textContent = regionNamesInEnglish.of(country_code);
        }
    } catch (error) {
        document.getElementById("cc").textContent = "Unavailable";
        console.error(error);
    }
}

getData();
locationLookup();

// Increased the interval slightly above 1 second because it was rate limited occasionally.
setInterval(getData, 1500);
setInterval(locationLookup, 5000);
