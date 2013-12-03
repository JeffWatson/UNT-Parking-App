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
var yourLocIcon = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/009900/");
phoneui.prePageTransition = function(currentScreenId,targetScreenId) {
//alert("prePage Entered");

if (targetScreenId == '#m1-list') {
	buildList();
	directionsDisplay.setMap(null);
  } else if (targetScreenId == '#m1-landing') {
	//alert("Pre UpdateLandingCall");
    updateLandingScreen();
  }


  return true;
}

/**
 * Notification that the UI has transitioned to a new screen.
 * 
 * @param {String} newScreenId 
 */
phoneui.postPageTransition = function(newScreenId) {
  if (newScreenId == '#m1-list') {
    //rebind all list-items to be selectable
    phoneui.preprocessDOM('#m1-list');  
	
  }
}

/**
 * Notification that device orientation has changed. 
 * 
 * @param {String} newOrientation 
 */
phoneui.postOrientationChange = function(newOrientation) {
  
}
//

function buildList() {
//alert("buildList entered");

  var list = $('#m1-list-list1'); //lookup <ul>

  // lookup number of listItems from home screen; convert to number
  var itemCnt = counter; 

  //remove current list items
  list.children('#m1-list-listItem1').remove();

  //build list 
  firstItemClass = 'm1-first';
  internalItemClass = ' m1-clickable m1-highlight m1-hyperlink-internal';
  lastItemClass = ' m1-last';
  for (i=1; i <= itemCnt; i++) {
// template code for each list-item
/*
<li id="m1-list-listItem1" class="m1-first m1-last m1-clickable m1-highlight 
       m1-hyperlink-internal" data-action-click-id="action0" data-listitem-index="1">
    <div id="m1-list-listItem1-inner-div">
         <img id="m1-list-accessoryImage1" class="m1-clickable" 
             src="res/images/tableRowDisclosureIndicator.png"/>
         <div id="m1-list-text2" class="m1-text">Item</div>
    </div>
</li>
*/    
    
   //build list css class list
   cssClassList = i==1 ? firstItemClass : '';
   cssClassList += i==itemCnt ? lastItemClass : '';
   cssClassList += internalItemClass;

    list.append(
     '<li id="m1-list-listItem1" class="' + cssClassList + '"' +
     '      data-action-click-id="action6" data-listitem-index="' + i + '">'+
     '   <div id="m1-list-listItem1-inner-div">'+
     '      <img id="m1-list-accessoryImage1" class="m1-clickable" '+
     '         src="res/images/tableRowDisclosureIndicator.png"/>'+
     '       <div id="m1-list-text2" class="m1-text">' + promotion_nameArray[i-1] + ": " + promotion_valueArray[i-1] + '</div>'+
     '   </div>'+
     '</li>');
  }

  //Update panel's content height, set the ht value on the panel's 
  //  scroller <div> data-layout-content-height attribute.
  //  panelHt = header ht + listItems ht + footer ht
  var panelHt = 30 + itemCnt * 44;
  $('#m1-list-panel1-scroller').attr('data-layout-content-height', panelHt);
}
  
function updateLandingScreen() {
	//alert("Click Sucess");
  //find the <li> root of the selected list-item
  var selectedItem = $(event.srcElement).closest('li[data-listitem-index]');

  //get the index of the selected list-item and update details
  var idx = $(selectedItem).attr('data-listitem-index');
  
 // intIDX = the Array Index of the selected item
  var intIDX = (parseInt($(selectedItem).attr('data-listitem-index')) - 1);
  end = posArray[intIDX];
 
 var landingMap = $('#m1-landing-landingMap').gmap();
 
 alert("Calculating Route");
$('[id$=landingMap]').gmapready(function(gmap) {
 
     directionsDisplay = new google.maps.DirectionsRenderer(); 
      directionsDisplay.setMap(gmap);

    
        start = myPos;
        gmap.setCenter(myPos, 12);
		
		//alert("setCenter - Sucess!");
      
        
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }else
			{
			alert("Driving Directions Not Available");
			}
        });
               
     

    
   });

 


  
  //get the selected list-item's label and update details
  var label = $('li[data-listitem-index=' + idx + '] .m1-text').text();      
  $('#m1-landing-labelTxt').text(label);
  $('#m1-landing-indexTxt').text(idx);
  $('#m1-landing-text1').text('Directions to ' + promotion_nameArray[intIDX]);
}



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
		 

		// alert(promotion_nameArray[counter]);
		 
		 		 
		 counter = counter + 1;
		 
		 db.transaction(populateDB, errorCB, successCB);
		
		//alert(id + start_date + stop_date + start_time + stop_time + promotion_name + promotion_value + lat + lon + vendor + link);
		
		//+ id + start_date + stop_date + start_time + stop_time + promotion_name + promotion_value + lat + lon + vendor + link
		}
		//after JSON parsing
		
		
		//alert("Calculating Route");
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
		animation: google.maps.Animation.DROP,
		icon: yourLocIcon,
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
//alert("db opened");
loadJSONdoc(db);

		


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

