/**
 * Notification that the UI is about to transition to a new screen.
 * Perform custom prescreen-transition logic here.
 * @param {String} currentScreenId 
 * @param {String} targetScreenId 
 * @returns {boolean} true to continue transtion; false to halt transition
 */
 
 
 
 function queryDB(tx) {
	tx.executeSql('select * from promotions;', [], querySuccess, errorCB);
}

 
 function populateDB(tx) {
     //tx.executeSql('DROP TABLE IF EXISTS DEMO');
     tx.executeSql('CREATE TABLE IF NOT EXISTS  promotions (id INTEGER PRIMARY KEY, start_date text, stop_date text, start_time text, stop_time text, promotion_name text, value text, lat number, lon number, link text);');
    tx.executeSql("INSERT INTO promotions values(null, 'start_date','stop_date','start_time','stop_time','promotion_name','value', 10, 25, 'link');");
	

	// tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
     //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
	 }
	 
	 function querySuccess(tx, results) {
    console.log("Returned rows = " + results.rows.length);
    // this will be true since it was a select statement and so rowsAffected was 0
    if (!results.rowsAffected) {
        console.log('No rows affected!');
        return false;
    }
    // for an insert statement, this property will return the ID of the last inserted row
    console.log("Last inserted row ID = " + results.insertId);
}



function errorCB(err) {
    alert("Error processing SQL: "+err.code);
	}


function successCB() {
    alert("success!");
	}


 
 
 // creating data base
 var dbShell = window.openDatabase('promotions.db', 1, 'promotions.db', 1000);
 
 
 

 var directions = null;
var directionsDisplay = null;
var end = "33.208666,-97.145877";
var directionsService = null;
var mapPos = null;
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
 dbShell.transaction(populateDB, errorCB, successCB);
 dbShell.transaction(queryDB, errorCB);


alert("Calculating Route");
 $('[id$=MapOfGarage]').gmapready(function(gmap) {
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(gmap);

      if (navigator.geolocation){
          navigator.geolocation.getCurrentPosition(showPosition)
          };
      function showPosition(position){
        start = (position.coords.latitude+','+position.coords.longitude)
        gmap.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude), 12);
      
        
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
               
     };

});

  
}

