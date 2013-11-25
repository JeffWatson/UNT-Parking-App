// records





/**
 * Notification that the UI is about to transition to a new screen.
 * Perform custom prescreen-transition logic here.
 * @param {String} currentScreenId 
 * @param {String} targetScreenId 
 * @returns {boolean} true to continue transtion; false to halt transition
 */
 
 


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


    

    // Populate the database 
   
function populateDB(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS DEMO');
     tx.executeSql('CREATE TABLE IF NOT EXISTS  PROMOTIONS (id INTEGER PRIMARY KEY, start_date text, stop_date text, start_time text, stop_time text, promotion_name text, value text, lat number, lon number, link text);');
    tx.executeSql("INSERT INTO PROMOTIONS values(null, 'start_date','stop_date','start_time','stop_time','promotion_name','value', 10, 25, 'link');");
    }

    // Query the database
    //
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM PROMOTIONS', [], querySuccess, errorCB);
    }

    // Query the success callback
    //
    function querySuccess(tx, results) {
		alert("querySucess Function entered");
        alert("Returned rows = " + results.rows.length);
        // this will be true since it was a select statement and so rowsAffected was 0
        if (!results.rowsAffected) {
            alert('No rows affected!');
            return false;
        }
        // for an insert statement, this property will return the ID of the last inserted row
        alert("Last inserted row ID = " + results.insertId);
    }

    // Transaction error callback
    //
    function errorCB(err) {
        alert("Error processing SQL: "+err.code);
    }

    // Transaction success callback
    //
    function successCB() {
		alert("success Callback entered");
       // var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);

    }

 
    
  
   



/**
 * Called when document is loaded.
 */
phoneui.documentReadyHandler = function() {
// opens database
var db = window.openDatabase("Promotions", "1.0", "Cordova Demo", 200000);
 
 
 
 // route calculation
 
 
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



// DB testing

 db.transaction(populateDB, errorCB, successCB);
		db.transaction(queryDB, errorCB);
		
		alert("DB query complete!");


  
}

/**
 * Notification that the page's HTML/CSS/JS is about to be loaded.
 * Perform custom logic here, f.e. you can cancel request to the server.
 * @param {String} targetScreenId 
 * @returns {boolean} true to continue loading; false to halt loading
 */
phoneui.prePageLoad = function(targetScreenId) {
  // add custom pre-load code here
  // return false to terminate page loading, this cancels transition to page as well
  return true;
}

