## Instagraff
Instagram for graffiti fans

### Concept
Track graffiti's as they are posted by other users and show them on a map based on GEO-location.
### Tech setup
Server
- Node.js
- Express
- Express-session
- Cookie-parser
- Body-parser
- Socket.io

Development environment
- Nodemon
- Dotenv

Database
- MongoDb
- Mongoose

### Features

#### Core user functionality
- [X] User-model
- [X] User login
- [X] Upload pictures
- [X] Add meta-data to pictures
- [X] Display marker on a map (mapBox)
- [X] Display pictures in a map (mapBox)
- [ ] Add location based on map target (click event mapBox)

#### Core server functionality
- [ ] Use sockets to show live data changes on Feed
- [X] Use sockets to show live data changes on Map

#### Bonus
- [ ] Like pictures
- [ ] Comment on pictures

### DLC Diagram
![DLC - Instagraff](https://github.com/Mokerstier/real-time-web-1920/blob/b247101cb3a9a2dccb0ff761afe5fe6046aefb58/repo-img/DLC-instagraff.png)

### Real time events

#### Posting an image
Client-side user submits a form to upload an image

```
upload.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const img = await sendFiles()
     
    socket.emit("image upload", geoTag, artist, style, img);

    upload.reset();
    return false
})
```

Server
```
socket.on('image upload', function(geoTag, artist, style, img){
		console.log('update map')
		io.emit('update map', geoTag, artist, style, img)
	})
```
#### Updating map
Server initializes the event
```
io.emit('update map', geoTag, artist, style, img)
```

Client-side
```
socket.on("update map", function (geoTag, artist, style, ref) {
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
      .setHTML(`<img src="${marker.properties.ref}" alt"${marker.properties.description} by ${marker.properties.title} ">
                <h3>${marker.properties.title}</h3>
                <p> ${marker.properties.description}</p>
                `))
      .addTo(map)
    });
  });
```

### API's

#### Flickr

#### mapBox
