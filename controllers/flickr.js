const { userSchema } = require("../models/user");
const { graffitiSchema } = require("../models/graffiti");
const ExifImage = require("exif").ExifImage;
const Coordinate = require("coordinates-converter");

require("dotenv").config();


const Flickr = require("flickrapi"),
  flickrOptions = {
    permissions: "write",
    api_key: process.env.FLICKR_KEY,
    secret: process.env.FLICKR_SECRET,
    user_id: process.env.FLICKR_USER_ID,
    access_token: process.env.FLICKR_ACCESS_TOKEN,
    access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
  };

async function flickrUpload(req, res, user_id) {
  Flickr.authenticate(flickrOptions, async function (error, flickr) {
    var uploadOptions = {
      photos: [
        {
          title: req.body.artist,
          tags: req.body.style,
          photo: "public/uploads/" + req.file.filename,
        },
      ],
    };
    Flickr.upload(uploadOptions, flickrOptions, function (err, result) {
      if (err) {
        return console.error(error);
      }
      console.log("photo uploaded", result[0]);
      return getFlickrURL(req, res, result[0], user_id)
      

    });
  });
}

async function getFlickrURL(req, res, photoId, user_id) {
  console.log("fetching foto data");
  Flickr.authenticate(flickrOptions, function (error, flickr) {
    flickr.photos.getInfo(
      {
        photo_id: photoId,
      },
      function (err, result) {
        if (err) console.log(err);
        const flickrPhoto = result.photo
        let photoURL = `https://farm${flickrPhoto.farm}.staticflickr.com/${flickrPhoto.server}/${flickrPhoto.id}_${flickrPhoto.secret}.${flickrPhoto.originalformat}`
        console.log('got a URL '+ photoURL) 
        try {
          new ExifImage(
            { image: "public/uploads/" + req.file.filename },
            async function (error, exifData) {
              if (error) console.log("Error: " + error.message);
              
              if (exifData) {
                if (exifData.gps.GPSLatitude) {
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
  
                  
                  let image = new graffitiSchema({
                    artist: req.body.artist,
                    gps: {
                      lat: coordWithSpaces.toGeoJson()[0],
                      long: coordWithSpaces.toGeoJson()[1]
                    },
                    date: exifData.exif.DateTimeOriginal,
                    uploader: user_id,
                    ref: photoURL,
                    style: req.body.style,
                  });
  
                  await image.save();
                  console.log("image saved");
                } else { 
                  console.log("no GPS data");
  
                  let image = new graffitiSchema({
                    artist: req.body.artist,
                    gps: {
                      lat: req.body.lat,
                      long: req.body.lon
                    },
                    date:exifData.exif.DateTimeOriginal,
                    uploader: user_id,
                    ref: photoURL,
                    style: req.body.style,
                    
                  })
                  console.log("image saved " + image)
                  await image.save();
                
                }
              } else {
                geoTag = [req.body.lat, req.body.lon]
                let image = new graffitiSchema({
                  artist: req.body.artist,
                  gps: {
                    lat: req.body.lat,
                    long: req.body.lon
                  },
                  date: Date.now(),
                  uploader: user_id,
                  ref: photoURL,
                  style: req.body.style,
                  
                })
                console.log("no Exif data");
                await image.save();
                console.log("image saved " + image );
              }
            }
          );
          console.log('returning this URL: '+photoURL)
            res.send({url:photoURL, id:photo_id})
            return(photoURL)
        } catch (error) {
          console.log("Error: " + error.message);
        }
      }
    );
  });
}

module.exports = { flickrUpload };
