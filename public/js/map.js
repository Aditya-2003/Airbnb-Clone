const key = MAPTILER_API_KEY; 
const listingTitle = title;
const listingLocation = Location;
      const map = L.map('map').setView([49.2125578, 16.62662018], 14); //starting position
      L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{ //style URL
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        crossOrigin: true
      }).addTo(map);

function getCoordinates() {

  fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(listingLocation)}.json?key=${key}`)
    .then(res => res.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates; // [lng, lat]
        const lat = coords[1];
        const lng = coords[0];

        // Set map view to new coordinates
        map.setView([lat, lng], 14);

        // Add a marker
        L.marker([lat, lng]).addTo(map)
          .bindPopup(listingTitle)
          .openPopup();
      } else {
        alert("Location not found.");
      }
    })
    .catch(err => {
      console.error("Geocoding error:", err);
      alert("Something went wrong.");
    });
}
getCoordinates();