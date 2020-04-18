const { userSchema } = require("../models/user");
const { graffitiSchema } = require("../models/graffiti");
const flickr = require('./flickr')
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const ExifImage = require("exif").ExifImage;
const Coordinate = require("coordinates-converter");


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
        res.redirect( "/", 200, {
          msg: "Error: no file selected!",
        });
      } else {
        flickr.flickrUpload(req, user_id) 

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
