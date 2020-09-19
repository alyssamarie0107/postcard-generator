// Always include at top of Javascript file
"use strict";

//------------------------------------------------------------------------------
// AJAX GET Request immediately when the page comes up
// want to get the postcard data from the server
// want to display the postcard with correct img, msg, font, and color
//------------------------------------------------------------------------------

// function to recreate the postcard with the data
function display(postcardData) {
  //console.log(postcardData["image"]);
  //console.log(postcardData["message"]);
  //console.log(postcardData["font"]);
  //console.log(postcardData["color"]);

  let image = postcardData["image"];
  let msg = postcardData["message"];
  let font = postcardData["font"];
  let color = postcardData["color"];

  document.querySelector("#serverImage").src = image;
  document.querySelector("#message").textContent = msg;
  document.querySelector("#message").style.fontFamily = font;
  document.querySelector("#postcard-container").style.backgroundColor = color;
}

// This will trigger as soon as the page is finished loading
window.onload = () => {
  console.log("page is fully loaded");
  // Get request here in order to get the data
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/getData");

  // add an event listener for when the HTTP response is loaded
  xhr.addEventListener("load", function() {
    // get JSON string
    let response = xhr.responseText;
    
    // check if success 
    if (xhr.status == 200) {
    // turn it into an object
    let postcardData = JSON.parse(response);
    console.log(postcardData);
    // print out the creator's postcard to the receiver view
    display(postcardData);
    }
    else{
      console.log(response);
    }
  });

  // send request to server
  xhr.send();
};
