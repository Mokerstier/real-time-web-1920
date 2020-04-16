const { userSchema } = require("../models/user");
const { graffitiSchema } = require("../models/graffiti");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const ExifImage = require("exif").ExifImage;
const Coordinate = require("coordinates-converter");
require("dotenv").config();

var Flickr = require("flickrapi"),
  flickrOptions = {
    permissions: "write",
    api_key: process.env.FLICKR_KEY,
    secret: process.env.FLICKR_SECRET,
    user_id: process.env.FLICKR_USER_ID,
    access_token: process.env.FLICKR_ACCESS_TOKEN,
    access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
  }

const uploads = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: uploads,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("userImage");
// check filetype for uploads
function checkFileType(file, next) {
  // allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // chekc mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
	
    return next(null, true);
  }
  next("Error: images only");
}

function onUpload(req, res) {
  const user_id = req.session.passport.user;

  upload(req, res, (err) => {
    if (err) {
      res.render("/settings", {
        msg: err,
      });
    } else {
      if (req.file === undefined) {
        res.redirect("/", {
          msg: "Error: no file selected!",
        });
      } else {
		Flickr.authenticate(flickrOptions, function (error, flickr) {
			var uploadOptions = {
			  photos: [
				{
				  title: "test",
				  tags: [req.body.artist, req.body.style],
				  photo: "public/uploads/" + req.file.filename,
				}
			  ],
			};
		  
			Flickr.upload(uploadOptions, flickrOptions, function (err, result) {
			  if (err) {
				return console.error(error);
			  }
			  console.log("photos uploaded", result);
			});
		  });
        try {
          new ExifImage(
            { image: "public/uploads/" + req.file.filename },
            function (error, exifData) {
              if (error) console.log("Error: " + error.message);
              else console.log(exifData);
              if (exifData.gps !== "") {
                latDeg = exifData.gps.GPSLatitude[0];
                latMin = exifData.gps.GPSLatitude[1];
                latSec = exifData.gps.GPSLatitude[2];
                latRef = exifData.gps.GPSLatitudeRef;
                lat = `${latDeg} ${latMin} ${latSec} ${latRef}`;

                longDeg = exifData.gps.GPSLongitude[0];
                longMin = exifData.gps.GPSLongitude[1];
                longSec = exifData.gps.GPSLongitude[2];
                longRef = exifData.gps.GPSLongitudeRef;
                long = `${longDeg} ${longMin} ${longSec} ${longRef}`;

                coordWithSpaces = new Coordinate(`${lat} ${long}`);

                console.log(coordWithSpaces.toGeoJson());
                let image = new graffitiSchema({
                  artist: req.body.artist,
                  gps: coordWithSpaces.toGeoJson(),
                  date: exifData.exif.DateTimeOriginal,
                  uploader: user_id,
                  ref: req.file.filename,
				});
				
                image.save();
              }
            }
          );
        } catch (error) {
          console.log("Error: " + error.message);
        }
        userSchema.findOne({ _id: user_id }, async (err, doc) => {
          if (err) throw err;

          doc.img.push(req.file.filename);
          await doc.save();

          res.render("pages/home.ejs");
        });
      }
    }
  });
}

module.exports = { onUpload };
