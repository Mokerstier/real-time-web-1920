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
            lat:{
                type:String,
                match: [/[0-9]{1,2}(\.{1}[0-9]{1,6})?/, 'is invalid']
            },
            long:{
                type:String,
                match: [/[0-9]{1,2}(\.{1}[0-9]{1,6})?/, 'is invalid']
            },
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
            user:{
                type: String,
                index: true
            },
            vote:{
                type: Number,
                index: true
            },
        },
        toy:{
            user:{
                type: Array,
                index: true
            },
            vote:{
                type: Number,
                index: true
            },
        }
    

})

exports.graffitiSchema = mongoose.model("images", graffitiSchema)