// server.js
// where your node app starts

//------------------------------------------------------------------------------
// init project
//------------------------------------------------------------------------------
const express = require('express');
const app = express();
const assets = require('./assets');
// Multer is a module to read and handle FormData objects, on the server side
const multer = require('multer');

//------------------------------------------------------------------------------
// Make a "storage" object that explains to multer where to store the images...in /images
//------------------------------------------------------------------------------
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/images')    
  },
  // keep the file's original name
  // the default behavior is to make up a random string
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

//------------------------------------------------------------------------------
// Use that storage object we just made to make a multer object that knows how to 
// parse FormData objects and store the files they contain
//------------------------------------------------------------------------------
let uploadMulter = multer({storage: storage});

// First, server any static file requests
app.use(express.static('public'));

//parse JSON
app.use(express.json());

// Next, serve any images out of the /images directory
app.use("/images",express.static('images'));

// Next, serve images out of /assets (we don't need this, but we might in the future)
app.use("/assets", assets);

// Next, if no path is given, assume we will look at the postcard creation page
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

//------------------------------------------------------------------------------
// Next, handle post request to upload an image
// by calling the "single" method of the object uploadMulter that we made above
//------------------------------------------------------------------------------

app.post('/upload', uploadMulter.single('newImage'), function (request, response) {
  // file is automatically stored in /images
  // WARNING!  Even though Glitch is storing the file, it won't show up 
  // when you look at the /images directory when browsing your project
  // until later.  So sorry. 
  console.log("Recieved",request.file.originalname,request.file.size,"bytes")
  // the file object "request.file" is truthy if the file exists
  if(request.file) {
    // Always send HTTP response back to the browser.  In this case it's just a quick note. 
    response.end("Server recieved "+request.file.originalname);
  }
  else {
    console.log("error");
  }
});

//------------------------------------------------------------------------------
// server side code for POST reuqest
//------------------------------------------------------------------------------

app.post('/sharePostcard', express.json(), function(request, response){
  console.log("Received Data:");
  //log request body onto console(called 'payload', here is a json parsed from the string)
  console.log(request.body);
  
  //want to write data in file called postCard.json
  const fs = require('fs');
  fs.writeFile('postcardData.json', JSON.stringify(request.body), function (err){
    if (err) {
      console.error(err);
    }
    else {
    console.log("Data written to file successfully");
    console.log(request.body);
    // server must send a response
    response.send("sharePostcard Received");
    }
  })
});

//------------------------------------------------------------------------------
// server side for GET request
//make sure that server.js has an GET endpoint which reads the file and responds with the JSON data.
//------------------------------------------------------------------------------

app.get('/getData', express.json(), function (request, response){
  console.log("GET request received");
  // read the postcardData.json file 
  const fs = require ('fs');
  fs.readFile('postcardData.json', function(err, data){
    if (err){
      console.error(err);
    }
    else {
    // long version
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(data);
    response.end();
    }
  })
});

//------------------------------------------------------------------------------
// listen for HTTP requests :)
//------------------------------------------------------------------------------
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
