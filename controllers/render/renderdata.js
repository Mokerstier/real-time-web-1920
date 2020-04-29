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
  });
  res.send(featureList);
}
module.exports = { onRenderData };
