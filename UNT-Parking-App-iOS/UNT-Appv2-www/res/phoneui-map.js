/*
 *  MobiOne PhoneUI Framework - Map Implementation
 *  version 2.3.2.201304250842
 *  <http://genuitec.com/mobile/resources/phoneui>
 *  (c) Copyright 2010-2012 Genuitec, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ 

(function() {
	function createMap($that, location) {
		var mapType = {
			"Roadmap" : google.maps.MapTypeId.ROADMAP,
			"Satellite" : google.maps.MapTypeId.SATELLITE,
			"Terrain" : google.maps.MapTypeId.TERRAIN,
			"Hybrid" : google.maps.MapTypeId.HYBRID
		}[$that.attr('data-map-type')] || google.maps.MapTypeId.ROADMAP;
		var _map = new google.maps.Map($that[0], {
		    zoom: +$that.attr('data-scale'),
		    center: location,
		    mapTypeId: mapType,
			disableDefaultUI: $that.attr('data-default-ui') != "true",
			panControl: $that.attr('data-pan-control') == "true",
			// zoomControl: $that.attr('data-zoom-control') == "true",
			mapTypeControl: $that.attr('data-map-type-control') == "true",
			scaleControl: $that.attr('data-scale-control') == "true",
			streetViewControl: $that.attr('data-street-view-control') == "true",
			overviewMapControl: $that.attr('data-overview-map-control') == "true",
			// rotateControl: $that.attr('data-rotate-control') == "true"
		});
		if ($that.attr('data-show-pin') == "true") {
			var marker = new google.maps.Marker({  
				  position: location,  
				  map: _map,
				  title: $that.attr('data-pin-title'),  
				  clickable: false,  
				  icon: $that.attr('data-pin-url') 
				});
		}
		// Save map to variable to be accessible to external API
		$that.data('map', _map);
		// Indicate that map is already initialized
		$that.addClass(m1Design.css("map-initialized"));
		
		if ($that.data('mapReady')) {
			$.each($that.data('mapReady'), function(i, f) {
				f(_map);
			});
		}
	}
	
	phoneui._extraPageInitializers.push(function(context) {
		var uninitmaps = $('.' + m1Design.css("map") + ":not(" + m1Design.css("map-initialized") + ")", context);
		
		if (uninitmaps.length > 0) {
			// Vadim.Ridosh: setTimeout is required here, otherwise you're getting problems like
			// https://www.genuitec.com/product_dev/bugzilla/show_bug.cgi?id=24157
			setTimeout(function() {
				// Setting display:block is mandatory here, otherwise map would be
				// incorrectly initialized.
				context.css({ display:'block', left: '100%'});
				
				uninitmaps.each(function() {
					var $that = $(this);
					// This tricky code stops maps from initialization if they are located
					// on hidden pages. This initialization will be performed later, when
					// user goes on these pages. Should fix #23538
					for (var $p=$that.parent(); $p[0]!=context[0]; $p=$p.parent()) {
						if ($p.is("." + m1Design.css("multipanel-page")) &&
							!$p.is("." + m1Design.css("selected"))) {
							return; // Skip initialization for me!
						}
					}
					
					var complete = false;
					var address = $that.attr('data-addr');
					if (address) {						
						function doInitializeMaps() {
							try {
								if(typeof(Storage) !== "undefined") {
									var location = localStorage["m1.map " + address];
									if (location) {
										var latlon = location.split(",");
										createMap($that, new google.maps.LatLng(latlon[0], latlon[1]));
										complete = true;
									}
								}
								if (!complete) {
									var geocoder = new google.maps.Geocoder();
									geocoder.geocode( { 'address': address }, function(results, status) {
										if (status == google.maps.GeocoderStatus.OK) {
											createMap($that, results[0].geometry.location);
											if(typeof(Storage) !== "undefined") {
												localStorage["m1.map " + address] = results[0].geometry.location.toUrlValue();
											}
										} else {
											$that.html("Unable to locate \"" + address + "\"");
										}
									});
								}
							} catch (e) {
								console.error(e);
							}
						}
						
						if (!('google' in window)) {
							phoneui._maps_initialize = doInitializeMaps;
							phoneui.loadJsAsync($('.' + m1Design.css('maps-api-script')).attr('src') + "&callback=phoneui._maps_initialize");

							$that.html("Network connection is required for map initialization.");
						} else {
							doInitializeMaps();
						}
					}
				});
				
				context.css({ left: '0'});
			}, 0);
		}
	});
	
	// register self as jQuery plugin, provide googleMap method to access google maps component directly
	(function($) {
		$.fn.gmap = function() {
			return this.data('map');
		};
		$.fn.gmapready = function(f) {
			if (this.data('map')) {
				// Already initialized. call immediately
				f(this.data('map'));
			}
			if (!this.data('mapReady')) {
				this.data('mapReady', []);
			}
			this.data('mapReady').push(f);
		};
	})(jQuery);
})();