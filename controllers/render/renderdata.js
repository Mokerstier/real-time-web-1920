function onRenderData(req, res) {
  const featureList = res.locals.results.map((element) => {
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
            toy: element.toy.length,
          },
        },
      ],
    };

    return element;
    // buildLocationList(element);
    // element.features.forEach(function (marker) {
    //   var el = document.createElement("div");
    //   el.className = "marker";
    //   const graff = marker.properties;
    //   new mapboxgl.Marker(el)
    //     .setLngLat(marker.geometry.coordinates)
    //     .setPopup(
    //       new mapboxgl.Popup({ offset: 25 }) // add popups
    //         .setHTML(`<img src="${graff.ref}" alt="">
    //                   <h3>${graff.title}</h3>
    //                   <p> ${graff.description}</p>
    //                   <button aria-label="${graff.id}" class="king">King</button>
    //                   <span class="king-value">${graff.king}</span>
    //                   <button aria-label="${graff.id}" class="toy">Toy</button>
    //                   <span class="toy-value">${graff.toy}</span>
    //                   `)
    //     )
    //     .addTo(map);
    // });
  });


  console.log("dataobject is " + featureList);
  res.send(featureList);
}
module.exports = { onRenderData };
