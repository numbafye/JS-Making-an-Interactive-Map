// Map object with refined logic and structure
const myMap = {
  coordinates: [],
  businesses: [],
  map: null,
  markers: [],

  buildMap() {
    if (this.coordinates.length === 0) {
      console.error("Coordinates are not set.");
      return;
    }
    this.map = L.map("map", {
      center: this.coordinates,
      zoom: 11,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 11,
    }).addTo(this.map);

    L.marker(this.coordinates)
      .addTo(this.map)
      .bindPopup("<p><b>You are here</b></p>")
      .openPopup();
  },

  addMarkers() {
    this.businesses.forEach((business) => {
      const marker = L.marker([business.lat, business.long])
        .bindPopup(`<p>${business.name}</p>`)
        .addTo(this.map);
      this.markers.push(marker);
    });
  },
};

async function getCoords() {
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return [pos.coords.latitude, pos.coords.longitude];
  } catch (error) {
    console.error("Failed to get geolocation:", error);
    return null; // Consider default coordinates or UI notification
  }
}

async function getFoursquare(business) {
  if (!myMap.coordinates.length) {
    console.error("No coordinates available for Foursquare query.");
    return [];
  }
  const [lat, lon] = myMap.coordinates;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8=",
    },
  };
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?&query=${business}&limit=5&ll=${lat}%2C${lon}`,
      options
    );
    if (!response.ok) throw new Error("Failed to fetch businesses");
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching from Foursquare:", error);
    return [];
  }
}

function processBusinesses(data) {
  return data.map((business) => ({
    name: business.name,
    lat: business.geocodes.main.latitude,
    long: business.geocodes.main.longitude,
  }));
}

window.onload = async () => {
  const coords = await getCoords();
  if (coords) {
    myMap.coordinates = coords;
    myMap.buildMap();
  }
};

document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();
  const business = document.getElementById("business").value;
  const data = await getFoursquare(business);
  myMap.businesses = processBusinesses(data);
  myMap.addMarkers();
});
