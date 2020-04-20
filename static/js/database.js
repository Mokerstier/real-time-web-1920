function dataBase(result){
var dataJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [result.gps.lat, gps.long],
        },
        properties: {
          title: result.artist,
          description: "Recently updated",
        },
      },
    ],
  };
  dataJson.features.forEach(function (marker) {
    var el = document.createElement("div")
    el.className = "marker"

    new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML(`<img src="${result.ref}"
              <h3>${marker.properties.title}</h3>
              <p> ${marker.properties.description}</p>
              `))
    .addTo(map)
  });
}
