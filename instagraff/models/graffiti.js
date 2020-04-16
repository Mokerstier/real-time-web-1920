const mongoose = require("mongoose");

const graffitiSchema = new mongoose.Schema({

   

        artist:{
            type: String,
            lowercase: true,
            index: true
        },
        date:{
            type: String,
            index: true
        },
        gps:{
            type: Array,
            index: true
        },
        uploader:{
            type: String,
            index: true
        },
        ref:{
            type: String,
            index: true
        },
        style:{
            type: String,
            index: true
        },
        king:{
            type: Number,
            index: true
        },
        toy:{
            type: Number,
            index: true
        }
    

})

exports.graffitiSchema = mongoose.model("images", graffitiSchema)