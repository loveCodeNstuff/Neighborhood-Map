'use strict';

//////////////////////////////
//         Model            //
//////////////////////////////
const locations = [
    {
      "name": "John",
      "lat" : 123,
      "log" : 5595
    },
    {
      "name": 'Smith',
      "lat" : 123,
      "log" : 5595
    },
    {
      "name": "Matty",
      "lat" : 123,
      "log" : 5595
    },
    {
      "name": "Prince",
      "lat" : 123,
      "log" : 5595
    },
    {
      "name": "Jewel",
      "lat" : 123,
      "log" : 5595
    }
]

//////////////////////////////
//     Place Object         //
//////////////////////////////
const Place = function(data) {
  this.name = ko.observable(data.name);
  this.lat = ko.observable(data.lat);
  this.log = ko.observable(data.log);
};

//////////////////////////////
//       View Model         //
//////////////////////////////
const ViewModel = ()=> {
  const self = this,
        locationLength = locations.length;

  self.locationList = ko.observableArray([]);
  for(let x = 0; x < locationLength; x++) {
    self.locationList.push( new Place(locations[x]) );
  }

  self.name = ko.observable(self.locationList()[0].name());
};

ko.applyBindings(new ViewModel());
