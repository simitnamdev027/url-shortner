
const mongoose = require("mongoose");


const urlSchema = mongoose.Schema({
    shortUrl: {
         type: String,
    },
    longUrl: {
        type: String,
        required: true
    },
    shortCode: {type: String,
              unique: true

    }
})

module.exports = mongoose.model("url", urlSchema)