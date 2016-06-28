'use strict';

//////////////////////////////
//         Model            //
//////////////////////////////
var locations = [
    {
      "name": "Empire State Building",
      "lat" : 40.7484444,
      "log" : -73.9878441,
      "info": "The Empire State Building is a 102-storty skyscraper located in Midtown Manhattan, New York City, on Fifth Avenue between West 33rd and 34th Streets."
    },
    {
      "name": "Statue of Liberty",
      "lat" : 40.6892534,
      "log" : -74.0466891,
      "info": "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City, in the United States."
    },
    {
      "name": "Times Square",
      "lat" : 40.758899,
      "log" : -73.9873197,
      "info": "Times Square is a major commercial intersection and neighborhood in Midtown Manhattan, New York City, at the junction of Broadway and Seventh Avenue, and stretching from West 42nd to West 47th Streets."
    },
    {
      "name": "Botanical Gardens",
      "lat" : 40.866559,
      "log" : -73.8852977,
      "info": "A botanical garden or botanic garden is a garden dedicated to the collection, cultivation and display of a wide range of plants labelled with their botanical names."
    },
    {
      "name": "Ellis Island Immigration Museum",
      "lat" : 40.6977041,
      "log" : -74.0391417,
      "info": "Ellis Island, in Upper New York Bay, was the gateway for over 12 million immigrants to the United States as the nation's busiest immigrant inspection station from 1892 until 1954."
    },
    {
      "name": "Yankee Stadium",
      "lat" : 40.8279884,
      "log" : -73.9278355,
      "info": "Yankee Stadium is a stadium located in the Bronx, a borough of New York City. It serves as the home ballpark for the New York Yankees of Major League Baseball (MLB), and the home stadium of New York City FC of Major League Soccer (MLS)."
    },
    {
      "name": "Bronx Zoo",
      "lat" : 40.8505989,
      "log" : -73.8791869,
      "info": "The Bronx Zoo is a zoo located in the Bronx, a borough of New York City, within Bronx Park. It is the largest metropolitan zoo in the United States and among the largest in the world."
    },
    {
      "name": "Grand Central Terminal",
      "lat" : 40.7527302,
      "log" : -73.9794181,
      "info": "Grand Central Terminal is a commuter, rapid transit railroad terminal at 42nd Street and Park Avenue in Midtown Manhattan in New York City, United States."
    },
    {
      "name": "Central Park",
      "lat" : 40.7828687,
      "log" : -73.9675438,
      "info": "Central Park is an urban park in middle-upper Manhattan, within New York City. Central Park is the most visited urban park in the United States, with 40 million visitors in 2013. It is also one of the most filmed locations in the world."
    },
    {
      "name": "Brooklyn Museum",
      "lat" : 40.6712102,
      "log" : -73.9658193,
      "info": "The Brooklyn Museum is an art museum located in the New York City borough of Brooklyn. At 560,000 square feet (52,000 m2), the museum is New York City's third largest in physical size and holds an art collection with roughly 1.5 million works"
    }
]

//////////////////////////////
//     Place Object         //
//////////////////////////////
var Place = function Place(data) {
  this.name = ko.observable(data.name);
  this.lat = ko.observable(data.lat);
  this.log = ko.observable(data.log);
  this.info = ko.observable(data.info);
  this.visibleBool = ko.observable(true);
  this.infoVisible = ko.observable(false);
};

//////////////////////////////
//       View Model         //
//////////////////////////////
var ViewModel = function ViewModel() {
  var self = this,
      locationLength = locations.length;

  // add all locations to a ko array
  self.locationList = ko.observableArray([]);
  for(var x = 0; x < locationLength; x++) {
    self.locationList.push( new Place(locations[x]) );
  }

  // show infoWindow on Click of li also hide infomation if the li
  // click while the infoWindow is open
  self.showInfo = function(name) {
    var position = self.getLocationListObject(name());

    if(self.locationList()[position].infoVisible() === false) {
      showInfo(markerArr[position]);
      self.locationList()[position].infoVisible(true);
    }else{
      closeInfo(markerArr[position]);
      self.locationList()[position].infoVisible(false);
    }
  };

  // figure out locationList object
  self.getLocationListObject = function(name) {
    for(var x = 0; x < locationLength; x++) {
      if(self.locationList()[x].name() === name) {
        return x;
      }
    }
  };

  // filter visible list items
  self.filter = function() {
    var inputLength = self.input().length,
        inputLowerCase = self.input().toLowerCase().substring(0,inputLength);

    // clear #images div
    $($infoPics).empty();
    // first lowercase all letters in locationList array item and user input from
    // text box.  Then see if both match if so show those items.  Otherwise turn visability
    // off for that item.  And if input is empty retun all items back to list.
    // Also hiding or showing mathing google maps makers
    for(var x = 0; x < locationLength; x++) {
      var nameLowerCase = self.locationList()[x].name(),
          nameLowerCase = nameLowerCase.toLowerCase().substring(0,inputLength);

      if(inputLowerCase !== nameLowerCase) {
        markerArr[x].setVisible(false);
        self.locationList()[x].visibleBool(false);
        closeInfo(markerArr[x]);
      }else{
        markerArr[x].setVisible(true);
        self.locationList()[x].visibleBool(true);
      }
    }
  };

  // text value start
  self.input = ko.observable('');
};

ko.applyBindings(new ViewModel());

//////////////////////////////
//         Map              //
//////////////////////////////
var map,
    locationLength = locations.length,
    markerArr = [];

function initMap() {
  var customMapType = new google.maps.StyledMapType([
      {
        stylers: [
          {hue: '#f0ece6'},
          {visibility: 'simplified'},
          {gamma: .8},
          {weight: .5}
        ]
      },
      {
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      },
      {
        featureType: 'water',
        stylers: [{
          color: '#729af1'
        }]
      }
    ], {
      name: 'Custom Style'
  }),
  customMapTypeId = 'custom_style',
  image = 'img/pin.png';

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7784051, lng: -73.9464522},
    zoom: 12,
    disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
    }
  });

  // adding styles to map
  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);


  for(var x = 0; x < locationLength; x++) {
    var myLatLng = {lat: locations[x].lat, lng: locations[x].log},
        contentString = getInfoWindowContentString(x),
        infoWindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200
        });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: locations[x].name,
      animation: google.maps.Animation.DROP,
      icon: image
    });

    addListenerMarker(marker, map, infoWindow, locations[x]);
    addListenerCloseMarker(marker, map, infoWindow);

    markerArr.push(marker);
  }
}

// closure function for adding infoWindow content to makers
// Also adding a animation on click and loading pictures from flickr Api
function addListenerMarker(marker, map, infoWindow, item) {
  marker.addListener('click', function() {
    flickerLoad(item);
    infoWindow.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
  });
}

// closure function for adding infoWindow.close() and
// stop animation function to marker
function addListenerCloseMarker(marker, map, infoWindow) {
  marker.addListener('close', function() {
    infoWindow.close();
    marker.setAnimation(null);
  });
}

// trigger infoWindow and animation to start
function showInfo(marker) {
  google.maps.event.trigger(marker, 'click');
}

// trigger close for infoWindow and animation
function closeInfo(marker) {
  google.maps.event.trigger(marker, 'close');
}

// set infoWindow Content substring
function getInfoWindowContentString(x){
  var html = '<div id="contentString">' +
                '</div>' +
                '<p>' +
                    locations[x].info +
                '</p>' +
              '</div>';
  return html;
}

//////////////////////////////
//     Utility Functions    //
//////////////////////////////
var list = document.getElementById('list'),
    closeList = document.getElementById('closeList'),
    flikrApiImage = document.getElementById('apis');

// adding click function to the closeList div and
// moving the list and menu button off to the side of the screen
// and back again if off the screen already
closeList.addEventListener('click', function() {
  if(list.style.transform === 'translateX(100%)') {
    list.style = 'transform:translateX(0%)';
    closeList.style = 'transform:translateX(0%)';
    flikrApiImage.style = 'transform:translateX(0%)';
  }else{
    list.style = 'transform:translateX(100%)';
    closeList.style = 'transform:translateX(1415%)';
    flikrApiImage.style = 'transform:translateX(450%)';
  }
});

//////////////////////////////
//     Flickr Api Calls     //
//////////////////////////////
var $infoPics = $('#images'),
    key = 'f0b0865d687bdae8485ab41a107f73e4',
    secret = '1ac413079d365ce4';

// get items from flickr Api and append them to #images
// Clearing #images div before adding new pictures to div
function flickerLoad(item) {
  var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
            key +
            '&lat=' + item.lat +
            '&lon=' + item.log +
            '&format=json&nojsoncallback=1&content_type=1&per_page=12&page=1&radius=1&radius_units=mi';

  $.getJSON( url, function(data) {
      var items = [],
          x = 0;

      $($infoPics).empty();

      $.each( data.photos.photo, function() {
          var farmId = data.photos.photo[x].farm,
              serverId = data.photos.photo[x].server,
              photoId = data.photos.photo[x].id,
              secret = data.photos.photo[x].secret;
          items.push("<img id='pic' src='" +
                        "https://farm" + farmId +
                        ".staticflickr.com/" + serverId +
                        "/" + photoId + "_" +
                        secret + "_q.jpg' " +
                        "alt='flikr image of location'>"
                    );
          $(items[x]).appendTo($infoPics);
          x++;
      });
    }).error(function() {
      $infoPics.text('Flickr pictures failed to load :-(');
  });
}

// Flikr
// key
// f0b0865d687bdae8485ab41a107f73e4
//
// Secret:
// 1ac413079d365ce4
//
// https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=f0b0865d687bdae8485ab41a107f73e4&lat=40.7484444&lon=-73.9878441&format=json&content_type=1&per_page=10&page=1&radius=1&radius_units=mi
//
// Example
//------------------------
// photos.photo[x].farm
// photos.photo[x].server
// photos.photo[x].id
// photos.photo[x].secrect
//
// var farmId, serverId, photoId, secret;
// "https://farm " + farmId + ".staticflickr.com/" + serverId + "/" + photoId + "_" + secret + "_m.jpg";
// https://farm1.staticflickr.com/2/1418878_1e92283336_m.jpg
//
// farm-id: 1
// server-id: 2
// photo-id: 1418878
// secret: 1e92283336
// size: m
//
// Size Suffixes
//
// The letter suffixes are as follows:
// s	small square 75x75
// q	large square 150x150
// t	thumbnail, 100 on longest side
// m	small, 240 on longest side
// n	small, 320 on longest side
// -	medium, 500 on longest side
// z	medium 640, 640 on longest side
// c	medium 800, 800 on longest side†
// b	large, 1024 on longest side*
// h	large 1600, 1600 on longest side†
// k	large 2048, 2048 on longest side†
// o	original image, either a jpg, gif or png, depending on source format


//<img src='http://davidfeldmanshow.com/wp-content/uploads/2014/01/dogs-wallpaper.jpg'>
// infowindow.setContent();
