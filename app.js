const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
  parameterLimit: 1000000,
});
const cookieParser = require("cookie-parser");
const passport = require("passport");

const { userSchema } = require("./models/user");
const { graffitiSchema } = require("./models/graffiti");
const vote = require("./controllers/vote");
const getter = require("./controllers/graffitis");
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
const MemoryStore = session.MemoryStore;
const sessionStore = new MemoryStore();
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

mongoose.connect(uri, options);
mongoose.connection.on("open", function (err, doc) {
  console.log(`connection established with ${process.env.DB_NAME}`);
  if (err) throw err;
});

app
  .use(
    bodyParser.json({
      limit: "50mb",
    })
  )
  .use(
    bodyParser.urlencoded({
      limit: "50mb",
      parameterLimit: 100000,
      extended: true,
    })
  )
  .use(express.static(__dirname + "/static"))
  .use(express.json())
  .use(cookieParser())

  .use("/register", user)
  .use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use("/", routes)
  .set("view engine", "ejs")
  .set("trust proxy", 1); // used because not communicating over HTTPS and want to set cookie

// io.use(passportSocketIo.authorize(config));
const IOsession = session({
  resave: true,
  saveUninitialized: true,
  key: "connect.sid", // this will be used for the session cookie identifier
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
});

io.use((socket, next) => {
  IOsession(socket.handshake, {}, next);
});

io.on("connection", async function (socket) {
  let userID = "";
  const liked = [];
  const following = [];
  if (socket.handshake) {
    console.log(socket.handshake.session);
    userID =
      socket.handshake.session.passport &&
      socket.handshake.session.passport.user;
  }
  if (userID !== undefined) {
    userSchema.findById(userID, (err, results) => {
      if (err) throw console.error(err);
      liked.push(results.liked);
      following.push(results.following);
      console.log(liked);

      following.forEach((element) => {
        console.log(element);
        graffitiSchema.find({ artist: element }, (err, results) => {
          if (err) throw console.error(err);
          socket.emit("my following", results);

        });
      });
      socket.emit("my likes", liked);
    });
  }

  console.log(`⚡︎ user connected as ${userID} ⚡︎`);

  socket.on("image upload", function (geoTag, artist, style, url, photoID) {
    console.log("update map");
    io.emit("update map", geoTag, artist, style, url, photoID);
    io.emit("update list", geoTag, artist, style, url, photoID);
    io.emit("update feed", geoTag, artist, style, url, photoID);
  });

  // Rank photo's
  socket.on("vote king", async function (photoID) {
    // write data to DB
    if (userID === undefined) {
      socket.emit("feedback message", 0);
    } else {
      value = await vote.king(photoID, userID);
      console.log(value);
      io.emit("update king", photoID, value);
    }
  });
  socket.on("vote toy", async function (photoID) {
    if (userID === undefined) {
      socket.emit("feedback message", 0);
    } else {
      // write data to DB
      value = await vote.toy(photoID, userID);
      console.log(value);
      io.emit("update toy", photoID, value);
    }
  });

  socket.on("disconnect", function () {
    console.log(`⚡︎ user disconnected ⚡︎`);
  });
});
// app.listen(port, () => console.log(`server is gestart op port ${port}`));

http.listen(process.env.PORT, function () {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
