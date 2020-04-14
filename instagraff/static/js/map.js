mapboxgl.accessToken = 'pk.eyJ1IjoibW9rZXJzdGllciIsImEiOiJjazFxbm5za2sxMWE2M2NwZGNncGFzazZlIn0.0oOI9FSQB1saUbuCqq9nCw'; // replace this with your access token
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // replace this with your style URL
  center: [-87.661557, 41.893748],
  zoom: 10.7
});