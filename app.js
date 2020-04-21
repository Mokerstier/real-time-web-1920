const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({limit:'3000mb', extended: false, parameterLimit: 1000000 });
const cookieParser = require("cookie-parser");
const passport = require("passport");
// const {onUpload} = require('./controllers/upload')

// routes
const { routes } = require("./routes/index");
// controllers
const user = require("./controllers/user");

require("dotenv").config();
require("./controllers/login")(passport);

const options = {
    useUnifiedTopology: true, 
	useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
	// autoIndex: false, // Don't build indexes
	// reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	// reconnectInterval: 500, // Reconnect every 500ms
	// poolSize: 10, // Maintain up to 10 socket connections
	// // If not connected, return errors immediately rather than waiting for reconnect
	// bufferMaxEntries: 0,
	// connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
	// socketTimeoutMS: 45000,
	// family: 4 // Use IPv4, skip trying IPv6
};

// Settings for online DATABASE
const uri = process.env.MONGODB_URI;
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)

mongoose.connect(uri, options);
mongoose.connection.on("open", function(err, doc) {
	console.log(`connection established with ${process.env.DB_NAME}`);
	if (err) throw err;
});

app
	.use(urlencodedParser)
	.use(express.static(__dirname + '/static'))
	.use(express.json())
	.use(cookieParser())

	.use("/register", user)
	.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false
		})
	)
	.use(passport.initialize())
	.use(passport.session())
	.use("/", routes)
	.set("view engine", "ejs")
	.set("trust proxy", 1); // used because not communicating over HTTPS and want to set cookie

// app.listen(port, () => console.log(`server is gestart op port ${port}`));
io.on('connection', function(socket){
	console.log('user connected')
	socket.on('image upload', function(geoTag, artist, style, img){
		console.log('update map')
		io.emit('update map', geoTag, artist, style, img)
	})

	// Rank photo's
	socket.on('vote king', function(photoID, userID){
		// write data to DB
		// <-- code here -->
		io.emit('update ranks', photoID, userID)
	})
	socket.on('vote toy', function(photoID, userID){
		// write data to DB
		// <-- code here -->
		io.emit('update ranks', photoID, userID)
	})

	socket.on('disconnect', function(){

		console.log(`user disconnected`)
	})
})
http.listen(process.env.PORT, function(){
	console.log(`listening on ${process.env.PORT}`)
  })