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
var id, start_date, stop_date, start_time, stop_time, promotion_name, promotion_value, lat, lon, vendor, link;
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
//
function loadJSONdoc(db) {
    var xmlhttp;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		
		var JSONdata = JSON.parse(xmlhttp.responseText);
		
		for (var i in JSONdata)
		{
		var x = JSON.parse(i);
		 id = JSONdata[x].id
		 start_date = JSONdata[x].start_date;
		 stop_date = JSONdata[x].stop_date;
		 start_time = JSONdata[x].start_time;
		 stop_time = JSONdata[x].stop_time;
		 promotion_name = JSONdata[x].promotion_name;
		 promotion_value = JSONdata[x].promotion_value;
		 lat = JSONdata[x].lat;
		 lon = JSONdata[x].lon;
		 vendor = JSONdata[x].vendor;
		 link = JSONdata[x].link;
		 
		 db.transaction(populateDB, errorCB, successCB);
		
		alert(id + start_date + stop_date + start_time + stop_time + promotion_name + promotion_value + lat + lon + vendor + link);
		
		//+ id + start_date + stop_date + start_time + stop_time + promotion_name + promotion_value + lat + lon + vendor + link
		}
	//	alert(xmlhttp.responseText);
		//return xmlhttp.responseText;
           // document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
        }
    }

    xmlhttp.open("GET", "http://students.cse.unt.edu/~jcw0227/apps/UNT-Parking-App/getdiscounts.php", true);
    xmlhttp.send();
}


    

    // Populate the database 
   
function populateDB(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS DEMO');
     tx.executeSql('CREATE TABLE IF NOT EXISTS  PROMOTIONS (id INTEGER PRIMARY KEY, start_date text, stop_date text, start_time text, stop_time text, promotion_name text, value text, lat number, lon number, link text);');
    tx.executeSql("INSERT OR REPLACE INTO PROMOTIONS values("+id+", '"+start_date+"','"+stop_date+"','"+start_time+"','"+stop_time+"','"+promotion_name+"','"+promotion_value+"', "+lat+", "+lon+", '"+link+"');");
    }

    // Query the database
    //
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM PROMOTIONS', [], querySuccess, errorCB);
    }

    // Query the success callback
    //
    function querySuccess(tx, results) {
	//	alert("querySucess Function entered");
		for(var j=0; j<results.rows.length; j++)
		{
		
		// build List here
		
		// gets each longitude
        alert("Returned rows = " + results.rows.item(j).lon);
		}
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

 
 //var JSON = loadJSONdoc();
 loadJSONdoc(db);
 //alert(JSON);
 
 
 
 
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

