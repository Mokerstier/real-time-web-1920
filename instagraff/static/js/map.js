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
// map.on("load", function () {
//   map.loadImage(
//     "./ui/icons/graffiti.png",
//     function (error, image) {
//       if (error) throw error;
//       map.addImage("graffiti", image);
//       map.addSource("point", {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: [
//             {
//               type: "Feature",
//               geometry: {
//                 type: "Point",
//                 coordinates: [ 5.23, .688611 ],
//               },
//             },
//           ],
//         },
//       });
//       map.addLayer({
//         id: "points",
//         type: "symbol",
//         source: "point",
//         layout: {
//           "icon-image": "graffiti",
//           "icon-size": 0.12,
//         },
//       });
//     }
//   );
// });

