// records





/**
 * Notification that the UI is about to transition to a new screen.
 * Perform custom prescreen-transition logic here.
 * @param {String} currentScreenId 
 * @param {String} targetScreenId 
 * @returns {boolean} true to continue transtion; false to halt transition
 */
 
 

var dataReady = 0;
 var directions = null;
var directionsDisplay = null;
var end = "33.208666,-97.145877";
var directionsService = null;
var mapPos = null;
var counter=0;
var posArray = new Array(80);
var markerArray = new Array(80);
var infoWindowArray = new Array(80);
var promotion_nameArray = new Array(80);
var promotion_valueArray = new Array(80);
var tempWindow;
var tempMarker;
var myPos;
var id, start_date, stop_date, start_time, stop_time, promotion_name, promotion_value, lat, lon, vendor, link;
phoneui.prePageTransition = function(currentScreenId,targetScreenId) {
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
		counter = 0;
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
		 
		 posArray[counter]= new google.maps.LatLng(lat, lon);
		 promotion_nameArray[counter] = promotion_name;
		 promotion_valueArray[counter] = promotion_value;
		 
<<<<<<< HEAD
		// alert(promotion_nameArray[counter]);
		 
=======
>>>>>>> 4506dc9b111b248a95a860ee12381376d5a2251b
		 
		 
		 
		 counter = counter + 1;
		 
		 db.transaction(populateDB, errorCB, successCB);
		
		//alert(id + start_date + stop_date + start_time + stop_time + promotion_name + promotion_value + lat + lon + vendor + link);
		
		//+ id + start_date + stop_date + start_time + stop_time + promotion_name + promotion_value + lat + lon + vendor + link
		}
<<<<<<< HEAD
		//after JSON parsing
		
		
		alert("Calculating Route");
 $('[id$=MapOfGarage]').gmapready(function(gmap) {
 
 // initializing markers on map


	for (var k=0; k<counter; k++){
	
		if (k==0) // sets current location marker first time through
			{
			if (navigator.geolocation){
          navigator.geolocation.getCurrentPosition(showPosition)
          };
      function showPosition(position){
		 myPos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		
		var myPosMarker = new google.maps.Marker({ 
		position:  myPos,
        map: gmap,
        title: 'Your Current Location', 
        clickable: true
		}); 
		
		
        gmap.setCenter(myPos, 12);
		//gmap.setCenter(posArray[3]);
		};  
			} 
		
		
		markerArray[k] = new google.maps.Marker({ 
        position:  posArray[k],
        map: gmap,
        title: "Promotion Name = " + promotion_nameArray[k] + "\nCurrent Promotion = " + promotion_valueArray[k], 
        clickable: true
		}); 
		
		/*infoWindowArray[k] = new google.maps.InfoWindow({
		content: "Promotion Value = " + promotion_valueArray[k]
		});
		
		alert(promotion_valueArray[k]);
		
	//	tempWindow = infoWindowArray[k];
		//tempMarker = markerArray[k];
		
		google.maps.event.addListener(markerArray[k], 'click', function() {
		infoWindowArray[k].open(gmap,markerArray[k]);
		});*/
		
		
		
		}// end of for loop  
		

  


 
  
 


  
   //gmap.setCenter(posArray[5]);
 
 
 
 

	 
	 

	 
	 
});
		
=======
		
		//after JSON parsing
>>>>>>> 4506dc9b111b248a95a860ee12381376d5a2251b
		
		
		
		
		
		
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
      //  alert("Longitude = " + results.rows.item(j).promotion_value);
		
	//	alert("TEST - Number Of Rows  = " + results.rows.length);
		}
        // this will be true since it was a select statement and so rowsAffected was 0
        if (!results.rowsAffected) {
         //   alert('No rows affected!');
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
		//alert("success Callback entered");
      

    }

 
    
  
   



/**
 * Called when document is loaded.
 */
phoneui.documentReadyHandler = function() {
// opens database
//alert("pre DB open");
var db = window.openDatabase("Promotions", "1.0", "Promotionsdb", 200000);
alert("db opened");
<<<<<<< HEAD

loadJSONdoc(db);
=======
 
>>>>>>> 4506dc9b111b248a95a860ee12381376d5a2251b
 

 
 // route calculation
 
 
<<<<<<< HEAD
 

=======
 alert("Calculating Route");
 $('[id$=MapOfGarage]').gmapready(function(gmap) {
 
 // initializing markers on map
 
	
	
 
     
  
	
	
	for (var k=0; k<counter; k++){
	
		if (k==0) // sets current location marker first time through
			{
			if (navigator.geolocation){
          navigator.geolocation.getCurrentPosition(showPosition)
          };
      function showPosition(position){
		 myPos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		
		var myPosMarker = new google.maps.Marker({ 
		position:  myPos,
        map: gmap,
        title: 'Your Current Location', 
        clickable: true
		}); 
		
		
        gmap.setCenter(myPos, 12);
		//gmap.setCenter(posArray[3]);
		};  
			} 
		
		
		markerArray[k] = new google.maps.Marker({ 
        position:  posArray[k],
        map: gmap,
        title: "Promotion Name = " + promotion_nameArray[k] + "\nCurrent Promotion = " + promotion_valueArray[k], 
        clickable: true
		}); 
		
		/*infoWindowArray[k] = new google.maps.InfoWindow({
		content: "Promotion Value = " + promotion_valueArray[k]
		});
		
		alert(promotion_valueArray[k]);
		
	//	tempWindow = infoWindowArray[k];
		//tempMarker = markerArray[k];
		
		google.maps.event.addListener(markerArray[k], 'click', function() {
		infoWindowArray[k].open(gmap,markerArray[k]);
		});*/
		
		
		
		}// end of for loop  
		

  


 
  
 


  
   //gmap.setCenter(posArray[5]);
 
 
 
 
>>>>>>> 4506dc9b111b248a95a860ee12381376d5a2251b
/*Old Route drawing function
 
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
               
     };  */
<<<<<<< HEAD
=======
	 
	 

	 
	 
});


>>>>>>> 4506dc9b111b248a95a860ee12381376d5a2251b

// DB testing

 
 //var JSON = loadJSONdoc();
<<<<<<< HEAD
=======
 loadJSONdoc(db);
 //alert(JSON);
 
 
 
 
		db.transaction(queryDB, errorCB);
		
		//alert("DB query complete!");
>>>>>>> 4506dc9b111b248a95a860ee12381376d5a2251b

		
		//alert("DB query complete!");

db.transaction(queryDB, errorCB);
  
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

