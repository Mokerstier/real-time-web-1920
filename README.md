## Instagraff
Instagram for graffiti fans

### Concept
Track graffiti's as they are posted by other users and show them on a map based on GEO-location.
The app is connected through an Oauth flow with the Flickr API

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
- [X] Add location based on map target (click event mapBox)

#### Core server functionality
- [X] Saving meta-data of images to the database per user
- [ ] Use sockets to show live data changes on Feed
- [X] Use sockets to show live data changes on Map

#### Bonus
- [ ] Like pictures
- [ ] Comment on pictures

### DLC Diagram
![DLC - Instagraff](https://github.com/Mokerstier/real-time-web-1920/blob/b247101cb3a9a2dccb0ff761afe5fe6046aefb58/repo-img/DLC-instagraff.png)

### Socket events

#### Posting an image
Client-side user submits a form to upload an image

```
upload.addEventListener("submit", function (e) {
    e.preventDefault();
     
    socket.emit("image upload", geoTag, artist, style, img);

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
Server initializes the event after the user uploaded an image
```
io.emit('update map', geoTag, artist, style, img)
```

Client-side
```
socket.on("update map", function (geoTag, artist, style, ref) {
    !! logic to make markers on the map !!
  });
```
#### Update list
Server initializes the event after the user uploaded an image
```
io.emit("update list", geoTag, artist, style, url, photoID)
```
#### Update feed
```
io.emit("update feed", geoTag, artist, style, url, photoID)
```

### API's

#### Flickr
The app uses Flickr for hosting the images.

#### mapBox
The app uses mapbox to create a map.