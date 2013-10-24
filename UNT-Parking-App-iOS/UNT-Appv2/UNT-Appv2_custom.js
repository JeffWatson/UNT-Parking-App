/**
 * Notification that the UI is about to transition to a new screen.
 * Perform custom prescreen-transition logic here.
 * @param {String} currentScreenId 
 * @param {String} targetScreenId 
 * @returns {boolean} true to continue transtion; false to halt transition
 */
phoneui.prePageTransition = function(currentScreenId,targetScreenId) {
  // add custom pre-transition code here
  // return false to terminate transition
  return true;
}

/**
 * Notification that the UI has transitioned to a new screen.
 * 
 * @param {String} newScreenId 
 */
phoneui.postPageTransition = function(newScreenId) {
  
}

/**
 * Notification that device orientation has changed. 
 * 
 * @param {String} newOrientation 
 */
phoneui.postOrientationChange = function(newOrientation) {
  
}

/**
 * Called when document is loaded.
 */
phoneui.documentReadyHandler = function() {

  var init = function() {
    $('[id$=MapOfGarage]').gmapready(function(gmap) {   
      navigator.geolocation.getCurrentPosition(
        function(geoPosition) {
		// gets current position of phone
          var mapPos = new google.maps.LatLng(geoPosition.coords.latitude,
                                              geoPosition.coords.longitude);
          
		  // shows location of phone and centers map on it
		  showLocation(gmap,mapPos)
		  // position of the garage
		  
		  var garagePos = new google.maps.LatLng(33.208666,-97.145877);
		 
		// sets a market at the garage
		 var marker = new google.maps.Marker({ 
		position:  garagePos,
		map: gmap,
		title: "Highland Street Garage", 
		clickable: false
		});
		
		// drawing route
		 var positions = [mapPos,garagePos];
		drawRoute(gmap,positions);
		  
        },
        function() {
          alert('Unable to find current position');
        });
    });
  };
 
  if ("PhoneGap" in window) {
    document.addEventListener("deviceready", init, false);
  } else {
    init();
  } 
}
 
 function drawRoute(gmap,positions) {
  var routeLine = new google.maps.Polyline({
      path: positions,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
 });
 routeLine.setMap(gmap);
}
 
function showLocation(gmap, pos) {
  gmap.setCenter(pos);
  //add marker
  var marker = new google.maps.Marker({ 
      position:  pos,
      map: gmap,
      title: "Current Location", 
      clickable: false
   });
}

