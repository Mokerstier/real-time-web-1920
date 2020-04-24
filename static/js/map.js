let Lat = document.querySelector("#lat")
let Lon = document.querySelector("#lon")
const dropMarker = document.querySelector('#drop-marker')
const listings = document.getElementById('listings');

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
            king: element.king.length,
            toy : element.toy.length
          },
        },
      ],
    };
    buildLocationList(element)
    element.features.forEach(function (marker) {
      var el = document.createElement("div");
      el.className = "marker";
      const graff = marker.properties
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<img src="${graff.ref}" alt="">
                <h3>${graff.title}</h3>
                <p> ${graff.description}</p>
                <button aria-label="${graff.id}" class="king">King</button>
                <span class="king-value">${graff.king}</span>
                <button aria-label="${graff.id}" class="toy">Toy</button>
                <span class="toy-value">${graff.toy}</span>
                `)
        )
        .addTo(map);
    });
  
  });
  
});
function buildLocationList(data) {
  data.features.forEach(function(graff, i){
    /**
     * Create a shortcut for `store.properties`,
     * which will be used several times below.
    **/
    var prop = graff.properties;

    /* Add a new listing section to the sidebar. */
    
    var listing = listings.appendChild(document.createElement('div'));
    /* Assign a unique `id` to the listing. */
    listing.id = "listing-" + prop.id;
    /* Assign the `item` class to each listing for styling. */
    listing.className = 'item';

    /* Add the link to the individual listing created above. */
    const link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.classList.add('title','link')
    link.id = "link-" + prop.id;
    link.innerHTML = prop.title;
    link.data = graff.geometry.coordinates
    const details = listing.appendChild(document.createElement('p'));
    details.innerHTML = prop.description;
    
    
  })
}
document.addEventListener('click', function(e){
  
  if (hasClass(e.target, 'link')) {
    e.preventDefault()
  let clickedListing = e.target.data
  console.log(clickedListing)
  flyToGraff(clickedListing);
  
  let activeItem = document.getElementsByClassName('active');
  if (activeItem[0]) {
    activeItem[0].classList.remove('active');
  }
  e.target.parentNode.classList.add('active');
  }
}, false);


const geoMarker = new mapboxgl.Marker({
  draggable: true,
})

function flyToGraff(currentFeature) {
  map.flyTo({
    center: currentFeature,
    zoom: 15
  });
}

function createMarker() {
  coords = map.getCenter()
  
    geoMarker
    .setLngLat([coords.lng, coords.lat])
    .addTo(map);
    let lngLat = geoMarker.getLngLat();
    Lat.value = String(lngLat.lng).substring(0, 7);
    Lon.value = String(lngLat.lat).substring(0, 7);
    
  function onDragEnd() {
    lngLat = geoMarker.getLngLat();
    Lat.value = String(lngLat.lng).substring(0, 7);
    Lon.value = String(lngLat.lat).substring(0, 7);
  }
  
  geoMarker.on("dragend", onDragEnd);
}