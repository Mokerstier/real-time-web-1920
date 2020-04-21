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

#### Real time events

#### Posting an image
Client
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

#### API's

### Flickr

### mapBox
