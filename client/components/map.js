var apiKey = "<key here>";
Session.set("toggleFlags", false);

//temp vars for geo coords since Twitter doesn't do them centering Kansas City
var latValue = 39.10;  
var lngValue = -94.57;
var heatmapLayer;

if (Meteor.isClient) {
   
  Template.map.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(latValue, lngValue),
          zoom: 4  //USA view
        };
      }
    },
    showRedFlags: function () {
            return Session.get("toggleFlags");
    },
    showMap: function () {
          return Session.get("toggleMap");
    }
  });  
  
  Template.map.onRendered(function() {
    
    //load API
    GoogleMaps.load({ key:apiKey, libraries: 'geometry,places,visualization' });
    console.log("GoogleAPI loaded with key: " + apiKey);
    
    //Prep API and insert initial dataset
    GoogleMaps.ready('map', function(map) {
      
      //set click event listener for map
      google.maps.event.addListener(map.instance, 'click', function(event) {
        Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });
    
      //set basic vars for map layers
      var markers = {};
      var heatmapData = new google.maps.MVCArray();
      
      //create heatmap layer
      heatmapLayer = new google.maps.visualization.HeatmapLayer ({
        data: heatmapData,
        radius: 25
      });
      heatmapLayer.setMap(map.instance);
      
      Tweets.find().observe({
          
        added: function(document) {
              
          //Add tweet to the heat map array.
          var tweetLocation = new google.maps.LatLng(document.lat, document.lng);
          heatmapData.push(tweetLocation);
          
          if (document.keyword_found==1) {
          
            // Create a marker for this document
            var marker = new google.maps.Marker({
                draggable: false,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(document.lat, document.lng),
                title: "Tweet ID: " + document.tweet_id + "Click for details",
                map: map.instance,
                id: document._id  // We store the document _id on the marker in order 
              });
            
            //build info window
            var contentString = "<b>Tweet ID: " + document.tweet_id + "</b><br>" +
            "Lat " + document.lat + ", Lon " + document.lng + "<br>" +
            "User Name: " + document.user + "<br>" +
            "Handle <a href='https://twitter.com/" + document.userscreen + "' target=_new>@" + document.userscreen + "</a><br>" +
            "Date: " + document.date + "<br>" +
            "<b>Tweet</b><br>: " + document.tweet;
            
            var infowindow = new google.maps.InfoWindow ({
                content: contentString,
                maxWidth: 200
              });
            
            //add click listener for window
            marker.addListener('click', function() {
                infowindow.open(map.instance, marker);
              });
            
            //set marker color to green for general non keyword matches
            if (document.keyword_found==1) {
              marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            }
          
          //render markers
          markers[document._id] = marker;          
          }         
        },
        
        changed: function(newDocument, oldDocument) {
            /*
              markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
              console.log("changed marker");
              */
              },
        
        removed: function(oldDocument) {
              /*
              // Remove the marker from the map
              markers[oldDocument._id].setMap(null);
          
              // Clear the event listener
              google.maps.event.clearInstanceListeners(
                markers[oldDocument._id]);
          
              // Remove the reference to this marker instance
              delete markers[oldDocument._id];
              
              console.log("removing marker");
              */
            }
          });
      });
  });
  
  Template.map.events({
    
  //reveal button to make work
   "click .toggle-flag": function () {
      var newState = ! Session.get("toggleFlags");
      Session.set("toggleFlags", newState);
      
      if (Session.get("toggleFlags")) {
        heatmapLayer.setMap(null);
      } else {
        heatmapLayer.setMap(map.instance);
      }
   }
  });
}
