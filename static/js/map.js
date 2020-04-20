let Lat = document.querySelector("#lat")
let Lon = document.querySelector("#lon")
const dropMarker = document.querySelector('#drop-marker')

mapboxgl.accessToken =
  "pk.eyJ1IjoibW9rZXJzdGllciIsImEiOiJjazFxbm5za2sxMWE2M2NwZGNncGFzazZlIn0.0oOI9FSQB1saUbuCqq9nCw"; // replace this with your access token

var bounds = [
  [3, 50], // Southwest coordinates
  [7.5, 54], // Northeast coordinates
];

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11", // replace this with your style URL
  center: [4.903681, 52.356654],
  zoom: 10.7,
  maxBounds: bounds,
});

dropMarker.addEventListener('click', function(e){
  e.preventDefault()
  createMarker()
})

map.on("load", () => {
  dataJSON.forEach((element) => {
    element = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [element.gps.lat, element.gps.long],
          },
          properties: {
            title: element.artist,
            description: element.style,
            ref: element.ref,
            id: element._id,
          },
        },
      ],
    };
    element.features.forEach(function (marker) {
      var el = document.createElement("div");
      el.className = "marker";

      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<img src="${marker.properties.ref}" alt="">
                <h3>${marker.properties.title}</h3>
                <p> ${marker.properties.description}</p>
                <button aria-label="${marker.properties.id}" class="king">King</button>
                <button aria-label="${marker.properties.id}" class="toy">Toy</button>
                `)
        )
        .addTo(map);
    });
  });
});


const marker = new mapboxgl.Marker({
  draggable: true,
})

function createMarker() {
  coords = map.getCenter()
  
    marker
    .setLngLat([coords.lng, coords.lat])
    .addTo(map);
    let lngLat = marker.getLngLat();
    Lat.value = String(lngLat.lat).substring(0, 7);
    Lon.value = String(lngLat.lng).substring(0, 7);
    
  function onDragEnd() {
    lngLat = marker.getLngLat();
    Lat.value = String(lngLat.lat).substring(0, 7);
    Lon.value = String(lngLat.lng).substring(0, 7);
  }
  
  marker.on("dragend", onDragEnd);
}