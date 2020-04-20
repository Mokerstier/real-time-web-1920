const upload = document.querySelector("#upload");

(function () {
  // eslint-disable-next-line no-undef
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
    const geoTag = [geoLat, geoLon];
    const artist = document.querySelector('#artist').value
    

    
    sendFiles()
    socket.emit("image upload", geoTag, artist);
    // upload.submit();
    upload.reset();
    return false
  });

  //Update Map
  socket.on("update map", function (geoTag, artist, ref) {
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
            description: "Recently updated",
            ref: ref
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
      .setHTML(`
                <h3>${marker.properties.title}</h3>
                <p> ${marker.properties.description}</p>
                `))
      .addTo(map)
    });
  });
})();
