async function getFoursquare(business) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "fsq3FqwGi+3TRAWxAPqCSAW/TCAf3R0hFxO2Soz5bl8Eiwg=",
    },
  };
  let limit = 5;
  let lat = 40.880135071811374;
  let lon = -74.05889867956665;
  let response = await fetch(
    `https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`,
    options
  );
  let data = await response.text();
  let parsedData = JSON.parse(data);
  let businesses = parsedData.results;
  console.log(data);
  return businesses;
}

console.log(getFoursquare("restaurant"))