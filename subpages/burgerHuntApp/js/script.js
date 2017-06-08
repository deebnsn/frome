/*-------------------------------------------------------------------------------------------------------------------
------------------------------------------------Contents----------------------------------------------------------------

1. Scrolling and Movement
2. Google API Search functions
3. Foursquare API Functions
4. Activation Functions

 ---------------------------------------------------------------------------------------------------------------------------------------*/
var client_id = "BLYTJT5GGQ5JQIES5WI4OGE0IHS0VSHBMDW4H4LTKLGFVNEG";
var client_secret = "XQO0A0DQ3CWA5YEFQOUXOOQT400RZUMI0JNAEUUXWCJB0Y2U";
/*Variables created for foursquare id and secret.
-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------1-----------------------------Scrolling and Movement-------------------------------------------------------------------------*/
var scrollDown = function () {
  document.getElementById("results").style.display="block";
  document.getElementById("opener").style.display="none";
 
};

//   var edgeOffset= -2;
//   var results = document.getElementById("placeholder");
//   var defaultDuration = 2000;
//   zenscroll.setup(defaultDuration,edgeOffset);
//   zenscroll.to(results,2000);
// };
/*The scrollDown function is triggered when the find-me or lets-go button are clicked on. It displays the results secction and the 
Zenscroll library provides automatic animated scrolling down to the placeholder element. It needs a slight offset to fit exact.*/
// var scroll2 = function() {
//   window.onscroll = function (oEvent) {
//     var scrollPos = document.getElementsByTagName("body")[0].scrollTop;
//     var mydivpos = document.getElementById("navbar").offsetTop;
//     if (mydivpos >= scrollPos) {
//       document.getElementById("navbar").className = "navbar";
//       var opennav = document.getElementById("openingnav");
//       opennav.innerHTML = "";
//       var opener = document.getElementById("opener");
//       document.getElementById("opener").style.background = "url(images/burgervans.jpg) no-repeat center fixed";
//       document.getElementById("reload").className = "showreload";
//     }
//     else {
//     document.getElementById("navbar").className = "navbar";
//     }
//   };
// };
// window.onscroll = function (oEvent) {
//   var scrollPos = document.getElementsByTagName("body")[0].scrollTop;
//   var mydivpos = document.getElementById("placeholder").offsetTop;
//   if (scrollPos >= mydivpos) {
//     document.getElementById("navbar").className = "navbar";
//     scroll2();}
//   else{
//     document.getElementById("navbar").className = "navbarbehind";
//   }
// };
/*The scrolling code above is used so that when they user moves back up the page after being transported to the results section, the 
original home menu is changed, and a new background image displayed. The blackspace includes a neon burger logo with a reload
button. The navagation bar appears behind the other elements and then is placed in the placeholder. Note- this does not appear to
work in Firefox.*/

var home = document.getElementById("home");
var changeText = function() {
  home.innerHTML="Reload";
  home.className="switchReload";
  var switchBack= function() {
  home.innerHTML="Burger Hunt";
  home.className="home";
};
  home.addEventListener("mouseout",switchBack);
}
home.addEventListener("mouseover",changeText);
/*The function above is used to change the text of the 'Burger Hunter' logo to Reload, which links back to the home screen.
--------------------------------------------------------------------------------------------------------------------------------
------------------2------------------------Google API Search Functions-----------------------------------------------------------*/
var autocomplete;
  function initialize() {
    autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById("autocomplete")),
    {types: ["geocode"]});
    google.maps.event.addListener(autocomplete, "place_changed", function() {
  });
}
initialize();
//Above code is for the google places autocompletion. Retrieved from the google documentation.
//https://developers.google.com/maps/documentation/geocoding/intro

var parseResponseGeo = function() {
  try{
    var response = JSON.parse(this.response);
    console.log(response);
    var lat = response.results[0].geometry.location.lat;
    var lng = response.results[0].geometry.location.lng;
    var latlng = lat + "," + lng;
    explore = lat + "," + lng;
    doSearch();
  }
  catch(err){location.reload();}
};
/* Above retrieves the longitude and latitude from whatever is search for in the search bar, then runs the doSearch function.
If the user enters something invalid, the page should reload, instead of sending the user down the page.*/

var x = document.getElementById("autocomplete").value;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } 
  else {
        x.innerHTML = "Geolocation not working. Please enter address";
  }
}

function showPosition(position) {
  latlng = position.coords.latitude + "," + position.coords.longitude; 
  explore = position.coords.latitude + "," + position.coords.longitude;
  scrollDown();
  doSearch();
}
//code for geolocator on findMe http://www.w3schools.com/html/html5_geolocation.asp. ScrollDown and DoSearch functions are performed.

var llGrabber = function() {
	var xhttp = new XMLHttpRequest();
  xhttp.addEventListener("load", parseResponseGeo);
  var url = "//maps.googleapis.com/maps/api/geocode/json?address=" + replace;
  xhttp.open("GET", url);
  xhttp.send();
};
var addressSeparator = function() {
  var search_term = document.getElementById("autocomplete").value;
  replace = search_term.replace(/ /g, "+");
  llGrabber();
};
/* The addressSeparator is to replace spaces with + in order for google geocode api to work. It allows the user to enter something like
whitchurch road, cardiff gb and the llgraber grabs the longitude and latidude from this search from the google API.

http://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with//
------------------------------------------------------------------------------------------------------------------------------------
------------------3------------------------------Foursquare API Functions------------------------------------------------------------*/
var parseResponseBurgers = function() {
  var response = JSON.parse(this.response);
  console.log(response);
  var output = document.getElementById("grid");
  output.innerHTML = "";
  for (var i = 0; i<response.response.groups[0].items.length;i++) {
    var venueName = response.response.groups[0].items[i].venue.name;
    var venueRating = response.response.groups[0].items[i].venue.rating;
    packery();
    var gridItem = document.createElement("div");
    output.appendChild(gridItem);
    gridItem.innerHTML = venueName;
    gridItem.className = "grid-item";
    gridItem.id = response.response.groups[0].items[i].venue.id;
    gridItem.title = response.response.groups[0].items[i].venue.rating;   //gives a popup of the rating on hover of each venue grid item
    if (typeof response.response.groups[0].items[i].venue.rating != "undefined") {
        gridItem.title = response.response.groups[0].items[i].venue.rating + "/10";
     }
    else {
      gridItem.title="";
    }
    //Above gets the foursquare JSON information and displays them with packery grids.-----------------------

    var info = document.getElementById("info");
    var parseResponseVenue = function() {
    var response = JSON.parse(this.response);
    console.log(response);
    var vName = response.response.venue.name;
    var vHeading = document.createElement("p");
    info.appendChild(vHeading);
    vHeading.id = "placeName";
    vHeading.innerHTML = vName;
    try {
      var vOpen = response.response.venue.hours.status;
      var vOpenTill = document.createElement("p");
      info.appendChild(vOpenTill);
      vOpenTill.id = "open";
      vOpenTill.innerHTML = vOpen;
    }
    catch(err){}
    try{
      var pictureFolder = document.createElement("div");
      info.appendChild(pictureFolder);
      pictureFolder.className = "picture-folder";
      for(var i = 0; i<3;i++){
        var picsPrefix = response.response.venue.photos.groups[0].items[i].prefix;
        var picsSuffix = response.response.venue.photos.groups[0].items[i].suffix;
        var picURL = picsPrefix + "150x150" + picsSuffix;
        var pictureCell = document.createElement("div");
        pictureFolder.appendChild(pictureCell);
        pictureCell.className= "picture-cell";
        var pic = document.createElement("img");
        pic.src= picURL;
        pic.className="vPics";
        pictureCell.appendChild(pic);
        }
        }
      catch(err){
        info.removeChild(pictureFolder);
      }//so no gap if tips given but no photos 
    var fRating = document.createElement("p");
    info.appendChild(fRating);
    fRating.id="rating";
    var cUrl = response.response.venue.canonicalUrl;
    var getRating = response.response.venue.rating;
    if(typeof getRating != "undefined") {
        fRating.innerHTML = vName + " scores " + getRating + ' out of 10. <br> A rating from <a target="_blank" href="' +cUrl+ '" > Foursquare </a>.'
    }
    else {
      fRating.innerHTML = "";
    }
    //Code just above checks if a rating is given or not.  http://stackoverflow.com/questions/4186906/check-if-object-exists-in-javascript
    try {
    var vTip = response.response.venue.tips.groups[0].items[0].text;
    var vTipGiver = response.response.venue.tips.groups[0].items[0].user.firstName;
    var vTipP= document.createElement("p");
    info.appendChild(vTipP);
    vTipP.id = "tips";
    vTipP.innerHTML = '"' + vTip + '" - ' + vTipGiver;
    }
    catch(err){}
    var vLat = response.response.venue.location.lat;
    var vLng = response.response.venue.location.lng;
    var vName = response.response.venue.name;
    var vAddress = response.response.venue.location.address;
    var vCity = response.response.venue.location.city;
    var mapDiv = document.createElement("div");
    info.appendChild(mapDiv);
    mapDiv.id= "mapid";
    var mymap = L.map("mapid").setView([vLat, vLng], 13);
    L.tileLayer("//api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGJlbnNvbjI3IiwiYSI6ImNpd3MwdWJydjAwMTMyb3BjaXllb2Z0N2gifQ.L3Ch698YOx4UeC83ONrAXQ", {
    attribution: 'Map data &copy; <a href="//openstreetmap.org">OpenStreetMap</a> contributors, <a href="//creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="//mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: "Burgers",
    accessToken: "pk.eyJ1IjoiZGJlbnNvbjI3IiwiYSI6ImNpd3MwdWJydjAwMTMyb3BjaXllb2Z0N2gifQ.L3Ch698YOx4UeC83ONrAXQ"
    }).addTo(mymap);
    var marker = L.marker([vLat, vLng]).addTo(mymap);
    marker.bindPopup('<b>' + vName + '</b>' + '<br>' + vAddress + ',' + '<br>' + vCity).openPopup();
    //Above displays the map location of the venue with the help of leaflet and mapbox.

    
  }

  var getVenueInfo = function() {
  var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("load",parseResponseVenue);
    var url = "//api.foursquare.com/v2/venues/" + venueID  + "?&client_id=" + client_id + "&client_secret=" + client_secret + "&v=" + formattedDate + "&m=foursquare";
    xhttp.open("GET",url);
    xhttp.send();
  }
  var venueInfo = function() {
    info.innerHTML="";
    venueID = this.id; //http://stackoverflow.com/questions/4825295/javascript-onclick-to-get-the-id-of-the-clicked-button
    getVenueInfo();
  }
  gridItem.addEventListener("click",venueInfo);
  //On click of a grid-Item the foursquare API is searched using the venue ID given as the element ID. The information is then displayed in the info section.
  if (venueRating>8.5) {
    gridItem.className = "grid-item grid-item--large";
  }
  else if (venueRating>7) {
   gridItem.className = "grid-item";
   }
  else {
  gridItem.className = "grid-item grid-item--height2";
  }//Gives different sized grids depending on the rating of the venue.
} 
output.appendChild(gridItem);
gridItem.className = "grid-item grid-item--height2";
packery();
document.getElementById("grid").firstChild.click();
} //This automatically clicks the first venue on the list so it is displayed already in the information section.  

var doSearch = function(){
  var xhttp = new XMLHttpRequest();
  xhttp.addEventListener("load", parseResponseBurgers);
  var url = "//api.foursquare.com/v2/venues/explore?&near=" + explore + "&venuePhotos=1&query=burgers" + "&limit=42&client_id="
     + client_id + "&client_secret=" + client_secret + "&v=" + formattedDate + "&m=foursquare";
 xhttp.open("GET", url);
  xhttp.send();
}
/* The doSearch function gets the Foursquare list of recommended venues. --------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------
-------------------4---------------------------Activation functions--------------------------------------------------------------------*/  
 var packery = function() {
  var grid = document.querySelector(".grid");
  var pckry = new Packery( grid, {
      itemSelector: ".grid-item"
});
grid.addEventListener( "click", function( event ) {
  if ( !event.target.classList.contains('grid-item') ) {
  return;
}
pckry.layout();
});
}
//above code from http://packery.metafizzy.co/
var letsGoDown = function() {
  addressSeparator();
  scrollDown();
}
var findMeDown = function() {
  getLocation();
}
var letsGo = document.getElementById("letsGo_button");
letsGo.addEventListener("click",letsGoDown);
var findMe = document.getElementById("findMe_button");
findMe.addEventListener("click",findMeDown);
function handle(e) {
  if(e.keyCode === 13){
    e.preventDefault();
    letsGoDown();
    }
}
var date = new Date();
var formattedDate = moment(date).format("YYYYMMDD");
/*The date is formatted into YYYYMMDD using the moment library. I started formatting the 
date myself but found it to be quite a faff so decided to just use a library and focus on other things.*/

