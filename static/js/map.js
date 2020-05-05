let Lat = document.querySelector("#lat");
let Lon = document.querySelector("#lon");
const dropMarker = document.querySelector("#drop-marker");
const listings = document.getElementById("listings");
// let dataJSON = JSON.stringify(results)
function hasClass(elem, className) {
  return elem.classList.contains(className);
}
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
  zoom: 8.7,
  maxBounds: bounds,
});

dropMarker.addEventListener("click", function (e) {
  e.preventDefault();
  createMarker();
});
const url = "/livedata";
map.on("load", async () => {
  
  let response = await fetch(url);
  let data = await response.json()

  let dataJSON = data

  dataJSON.forEach((element) => {
    
    buildLocationList(element);
    element.features.forEach(function (marker) {
      var el = document.createElement("div");
      el.className = "marker";
      
      const graff = marker.properties;
      
      marker.options= {anchor:'bottom'}
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<img src="${graff.ref}" alt="">
                <h3>${graff.title}</h3>
                <p> ${graff.description}</p>
                <a href="/follow/${graff.title}">#follow artist</a>
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
  data.features.forEach(function (graff, i) {
    /**
     * Create a shortcut for `store.properties`,
     * which will be used several times below.
     **/
    var prop = graff.properties;

    /* Add a new listing section to the sidebar. */

    var listing = listings.appendChild(document.createElement("div"));
    /* Assign a unique `id` to the listing. */
    listing.id = "listing-" + prop.id;
    /* Assign the `item` class to each listing for styling. */
    listing.className = "item";

    /* Add the link to the individual listing created above. */
    
    const thumbNail = document.createElement('img')
    const textContainer = listing.appendChild(document.createElement('div'))
    const link = textContainer.appendChild(document.createElement("a"));
    textContainer.className = 'text_container'
    thumbNail.src = prop.ref
    thumbNail.alt = `${prop.description} by artist: ${prop.title}`
    thumbNail.className = 'thumbList'
    link.href = "#";
    link.classList.add("title", "link");
    link.id = "link-" + prop.id;
    link.innerHTML = prop.title;
    link.data = graff;
    
    const details = textContainer.appendChild(document.createElement("p"));
    details.innerHTML = prop.description;
    listing.appendChild(thumbNail)
  });
}
document.addEventListener(
  "click",
  function (e) {
    if (hasClass(e.target, "link")) {
      e.preventDefault();
      let clickedListing = e.target.data;
      console.log(clickedListing);
      flyToGraff(clickedListing.geometry.coordinates);
      createPopUp(clickedListing)
      let activeItem = document.getElementsByClassName("active");
      if (activeItem[0]) {
        activeItem[0].classList.remove("active");
      }
      e.target.parentNode.classList.add("active");
    }
  },
  false
);

const geoMarker = new mapboxgl.Marker({
  draggable: true,
});

function flyToGraff(currentFeature) {
  map.flyTo({
    center: currentFeature,
    zoom: 10,
  });
}
function createPopUp(currentFeature) {
  let popUps = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  if (popUps[0]) popUps[0].remove();
  const graff = currentFeature.properties;
  let popup = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(`<img src="${graff.ref}" alt="">
                <h3>${graff.title}</h3>
                <p> ${graff.description}</p>
                <button aria-label="${graff.id}" class="king">King</button>
                <span class="king-value">${graff.king}</span>
                <button aria-label="${graff.id}" class="toy">Toy</button>
                <span class="toy-value">${graff.toy}</span>
                `)
    .addTo(map);
}


function createMarker() {
  coords = map.getCenter();

  geoMarker.setLngLat([coords.lng, coords.lat]).addTo(map);
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
