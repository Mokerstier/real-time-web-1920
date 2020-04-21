const upload = document.querySelector("#upload");
function hasClass(elem, className) {
  return elem.classList.contains(className);
}


(function () {
  const socket = io();
  console.log("hello");
  upload.addEventListener("submit", function (e) {
    e.preventDefault();
    const style = []
    const checkboxes = document.querySelectorAll('input[type=checkbox]')
    console.log(checkboxes)
    checkboxes.forEach(checkbox =>{
      if(checkbox.checked === true){
        console.log(checkbox)
        style.push(checkbox.value)
      }
    })
    
    console.log(style)
    const geoLat = document.querySelector("#lat").value;
    const geoLon = document.querySelector("#lon").value;
    const geoTag = [geoLon, geoLat];
    const artist = document.querySelector('#artist').value

    const img = sendFiles()
     
    socket.emit("image upload", geoTag, artist, style);
    // upload.submit();
    upload.reset();
    return false
  });

  document.addEventListener('click', function (e) {
    if (hasClass(e.target, 'king')) {
      
      const photoID = e.target.getAttribute('aria-label')
      socket.emit('vote king', photoID, userID)
    } else if (hasClass(e.target, 'toy')) {
      
      const photoID = e.target.getAttribute('aria-label')
      socket.emit('vote toy', photoID, userID)
        // Do your other thing
    }
  }, false);
  //Update Map
  socket.on("update map", function (geoTag, artist, style) {
    console.log("adding graffiti to map on location " + geoTag);
    var geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: geoTag,
          },
          properties: {
            title: artist,
            description: style,
            // ref: ref
          },
        },
      ],
    };
    geojson.features.forEach(function (marker) {
      var el = document.createElement("div")
      el.className = "marker"

      new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(`<img src="${marker.properties.ref}" alt"${marker.properties.description} by ${marker.properties.title} ">
                <h3>${marker.properties.title}</h3>
                <p> ${marker.properties.description}</p>
                `))
      .addTo(map)
    });
  });
})();
