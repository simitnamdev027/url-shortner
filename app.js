
require('dotenv').config();
const express = require("express");
const app = express();
const crypto = require("crypto"); 
const urlSchema = require("./models/url-models")


const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.set("view engine", "ejs");


async function connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected successfully");
    } catch (err) {
      console.error("Database connection error:", err);
      process.exit(1);
    }
  }
  connectDB();





app.get('/', (req, res)=>{
    res.render("url-views", {
        shortUrl : null,
        error: ""
    });
})


app.post("/shorten",async (req, res)=>{
    const {longUrl} = req.body;
     
    if(isValidUrl(longUrl)){
 
const existurl = await urlSchema.findOne({longUrl: longUrl});
if(existurl){return res.render("url-views", { shortUrl: existurl.shortUrl , error: null });
}else{ // Generate unique short code
    const shortCode = crypto.randomBytes(3).toString("hex");

    //Construct short URL
    const shortUrl = `http://localhost:3000/${shortCode}`;

    //Save to database
    const newUrl = new urlSchema({ longUrl, shortUrl, shortCode });
    await newUrl.save();

    //Render success view
    return res.render("url-views", {
        shortUrl,
        error: null
    });
}

       
    }else{
        res.render("url-views", {shortUrl : null, error: "Invalid URL"})
    }
    
    function isValidUrl(string){
        try{
            new URL(string);
            return true;
        }catch(err){
            return false;
        }
    }
});


app.get('/:shortCode', (req, res) => {
    const {shortCode } = req.params;

   
    urlSchema.findOne({ shortCode: shortCode })
        .then((urlRecord) => {
            if (urlRecord) {
                return res.redirect(urlRecord.longUrl);
            } else{
                return res.status(404).send('Short URL not found');
            }
        })
        .catch((err) => res.status(500).send('Server Error'));
});




app.listen(3000);