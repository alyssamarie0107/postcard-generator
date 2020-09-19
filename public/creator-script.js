// Always include at top of Javascript file
"use strict";

//------------------------------------------------------------------------------
// UPLOAD IMAGE using a POST request
// Server gets two different kinds of AJAX requests from creator: "new photo" and "save postcard"
// Called by the event listener that is waiting for a file to be chosen
//------------------------------------------------------------------------------
function uploadFile() {
  // get the file chosen by the file dialog control
  const selectedFile = document.getElementById("imageChooser").files[0];
  // store it in a FormData object
  const formData = new FormData();
  // name of field, the file itself, and its name
  formData.append("newImage", selectedFile, selectedFile.name);

  // build a browser-style HTTP request data structure
  const xhr = new XMLHttpRequest();
  // it will be a POST request, the URL will this page's URL+"/upload"
  xhr.open("POST", "/upload", true);

  // display "uploading..." when the image is starting to load
  xhr.onloadstart = function(e) {
    document.getElementById("choose-image").innerHTML = "Uploading...";
  };

  // callback function executed when the HTTP response comes back
  xhr.onloadend = function(e) {
    // Get the server's response body
    console.log(xhr.responseText);
    // now that the image is on the server, we can display it!
    let newImage = document.getElementById("serverImage");
    // in response to "new photo", server stores the uploaded photo in its "/images" directory
    newImage.src = "../images/" + selectedFile.name;

    // change text "choose image" to "replace image"
    document.getElementById("choose-image").innerHTML = "Replace Image";

    // need to change the style of the replace image button
    document.getElementById("controls-item").style.border =
      "thin solid #000000";
    //document.getElementById("controls-item").style.flexDirection = "column";
    document.getElementById("controls-item").style.paddingTop = "10px";
    document.getElementById("controls-item").style.paddingBottom = "10px";
    document.getElementById("controls-item").style.marginTop = "40px";
  };

  // actually send the request
  xhr.send(formData);
}

// Add event listener to the file input element
document.getElementById("imageChooser").addEventListener("change", uploadFile);

//------------------------------------------------------------------------------
// Javascript to change postcard color background
// when color box button is selected, change postcard to color choice clicked on
// help from w3schools
// let buttons = document.querySelector("color buttons")
// foreach (var elm in button)
// {
//   elm.addEventListener("click", function()
//                       {
//     document.querySelector(".postcard").style.backgroundColor =
//         elm.style.backgroundColor;
//   })
// advice from office hours
//------------------------------------------------------------------------------

//Color display
const colors = [
  "#e6e2cf",
  "#dbcaac",
  "#c9cbb3",
  "#bbc9ca",
  "#a6a5b5",
  "#b5a6ab",
  "eccfcf",
  "#eceeeb",
  "#bab9b5"
];

// quertSelectorAll() returns all elements in the document that matches a specified CSS selector(s), as a static NodeList object.
// get all .classButtons elements in the document
const colorButton = document.querySelectorAll(".colorButtons");

// first color box should be selected when page uploads
// should be color box with "#e6e2cf" background color
colorButton[0].style.border = "thin solid #000000";
// initalize current color to first the first color button
let currColor = colorButton[0];

// forEach() method calls a function once for each element in an colors array
colorButton.forEach(function(button, index) {
  //set the button
  button.style.backgroundColor = colors[index];

  // add event listener for when button is clicked
  button.addEventListener("click", function() {
    currColor.style.border = "none";
    // when a color button is clicked, want a black solid border
    button.style.border = "thin solid #000000";
    //querySelector() method only returns the first element that matches the specified selectors.
    // only want to select the postcard so that the background color can be changed to color[index]
    document.querySelector("#postcard-container").style.backgroundColor =
      colors[index];
    currColor = button;
  });

  // add eventer listener for when the mouse pointer is over the selected element.
  button.addEventListener("mouseover", function() {
    // when hovered over, want a black dashed border
    button.style.border = "thin dashed #000000";
    document.querySelector("#postcard-container").style.backgroundColor =
      colors[index];
  });

  // add event listener for when the mouse pointer leaves any child elements as well the selected element.
  button.addEventListener("mouseout", function() {
    if (button != currColor) {
      // don't want to change the style of the border
      button.style.border = "none";
      document.querySelector("#postcard-container").style.backgroundColor =
        currColor.style.backgroundColor;
    } else {
      // if button == currColor during a mouseout, don't want it to change to dash border, thus assign a solid border
      button.style.border = "thin solid #000000";
    }
  });
});

//------------------------------------------------------------------------------
// Javascript to change postcard text fonts
// when color box button is selected, change postcard message to font choice clicked on
//------------------------------------------------------------------------------

// current font symbol
let currfontSym = document.querySelector("#fonts span");
console.log(currfontSym);

// get all .font-container input elements in document
// this create a nodelist of elements, size = 4
document.querySelectorAll(".font-container input").forEach(i => {
  i.addEventListener("change", function() {
    // check if radio button is checked
    if (i.checked) {
      console.log("checked");
      console.log(i);
      // change message font family to the value of selected radio button
      let msg = (document.querySelector("#message").style.fontFamily = i.value);
      console.log(msg);
    }
  });
});

//------------------------------------------------------------------------------
//  SAVE POSTCARD AJAX POST Request that sends the postcard JSON to the server
// when "share postcard" button is clicked, the name of the image, msg, font,
// color are sent to the server as an AJAX request, which the server should store in a file
// Server has to save this data in a file so that it knows how to configure reciepent's view
// call the file : "postcardData.json"
//------------------------------------------------------------------------------
  
  let shareButton = document.querySelector("#sharePostcard");
  
  // when share button is clicked on, want to send a AJAX POST request
  shareButton.addEventListener("click", sharePost);
                               
  function sharePost() {
  // getting input values
  let msg = document.querySelector("#message");
  let img = document.querySelector("#serverImage");
    
  // wrap values in JSON object
  let data = {
    image: img.src,
    message: msg.textContent,
    font: msg.style.fontFamily.replace(/['"]+/g, ''),
    color: currColor.style.backgroundColor
    }
   console.log(data);
                    
  // build a browser-style HTTP request data structure
  let xhr = new XMLHttpRequest ();
  let url = '/sharePostcard';
  // it will be a POST request, the URL will this page's URL+"/display"
  xhr.open("POST", url, true);
  //set 'content-type' in the header, telling the server we're sending a json
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  
  // convert js obect to a string
  // send out the string
  xhr.send(JSON.stringify(data));  
  
  // callback function executed when the HTTP response comes back
  xhr.onloadend = function (e) {
  // property responseText returns the text received from a server following a request being sent.
  console.log(xhr.responseText);
  // redirect to display view
  window.location = "https://post-tranquil-creator.glitch.me/display.html";
  }
  // convert js obect to a string
  // send out the string
  xhr.send(JSON.stringify(data));  
}