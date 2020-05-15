## Instagraff
Instagram for graffiti fans

### Concept
Track graffiti's as they are posted by other users and show them on a map based on GEO-location.
The app is connected through an Oauth flow with the Flickr API

### Tech setup
Server NPM dependencies
- Bcrypt
- Body-parser
- Chokidar-cli
- Cookie-parser
- coordinates-converter
- ejs
- Exif
- Express
- Express-session
- flickrapi
- mapbox-gl
- Node.js
- Socket.io

Development dependencies
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
- [X] Use sockets to show live data changes on Feed
- [X] Use sockets to show live data changes on Map

#### Bonus
- [X] Like pictures
- [ ] Comment on pictures

#### Wishlist
- Suggesties doen van graffiti's in de buurt op basis van de locatie van de gebruiker
- Een top 3 lijst maken met foto's met de meeste stemmen
- Service worker integreren zodat de applicatie als web-app gebruikt kan worden.
- Micro-interacties toevoegen
- Profiel pagina toevoegen (om gelikte en geposte foto's te beheren)
- Build scripts toevoegen voor JS


### DLC Diagram
![DLC - Instagraff](https://github.com/Mokerstier/real-time-web-1920/blob/master/repo-img/DLC-instagraff.V1.1.png?raw=true)

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
#### Follow artist (unfollow works basicly the same)
Client side click follow
```
socket.emit('follow artist', artistName)
```
Serverside
```
socket.join(`${artistName}`)
```
Socket will join artist ROOM to get live updates
```
socket.emit("update follow", results)
```
Socket's feed will be updated

### Database
All meta-data is stored in a database, there are different models:
- Graffiti's are stored with the following meta-data:
    - Artist
    - Date
    - GPS: {lat, long}
    - uploader
    - url (flickr)
    - style (tag, piece, throw-up)
    - Ranking (king, toy)
- Users are stored with the following meta-data:
    - email
    - password (hashed)
    - firstname
    - lastname
    - img (uploaded)
    - following (used to personalize feed)
    - liked (king)
    - disliked (toy)

### API's

#### Flickr
The app uses Flickr for hosting the images.
When a user uploads an image its sent to the server where it's `Exif` meta-data (if available) is scraped after that its uploaded from the server to Flickr using the API where the images are hosted.

The app is connected with an Flickr account through a Oauth connection.

#### mapBox
The app uses mapbox to create a map.
The database is checked for all graffiti meta-data which is send to the client where the mapBox.js parses the data to create markers on the map wich are visable for all users. 

### Privacy
The users can't see who uploaded the image because only the user-ID is sent to the browser and the user data is never send to the browser.
