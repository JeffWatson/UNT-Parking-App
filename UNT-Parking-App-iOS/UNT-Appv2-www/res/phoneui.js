/*
 *  MobiOne PhoneUI Framework
 *  version 2.5.0.201311011215
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
// 

var phoneui = {};

/**
  * Support for deprecated API mobione namespace
  * @deprecated
  * @see phoneui
  */
var mobione = phoneui;

/**
 * PhoneGap/Cordova abstraction
 */
phoneui.cordovaAvailable = function() {
	return "PhoneGap" in window || "cordova" in window;
}

phoneui.cordova = (function() {
	if ("PhoneGap" in window)
		return window.PhoneGap;
	else
		return window.cordova;
})();

phoneui._calcAR = function(el, def, that, x, y) {
	if (el.complete) {
		return el.naturalWidth/el.naturalHeight;
	} else {
		var $el = $(el);
		var waitingFor = $el.data('phoneuiWaitingForSrc');
		if (!waitingFor || waitingFor != el.src) {
			var ff = function() { 
				if (el.src == $el.data('phoneuiWaitingForSrc')) {
				that.resize(x, y);
				el.removeEventListener(ff);
					$el.data('phoneuiWaitingForSrc', null);
			}
			}
			el.addEventListener('load', ff)
			$el.data('phoneuiWaitingForSrc', el.src);
		}
		return def;
	}
}

// Initialize webapp for use by phoneui framework
$(document).ready(function() {
	phoneui._whenBackHandlers = {};

	// Hide splash screen if we're in Cordova
	document.addEventListener("deviceready", function () {
		navigator.splashscreen.hide();
	}, false);

	var FN_EMPTY = function() {};

	var webappCache = window.applicationCache;
	if (webappCache) {
		/*
		webappCache.addEventListener("checking", function() {
			phoneui.showActivityDialog("Checking for update...");
		}, false);
		*/
		var wasDownloaded = false;
		webappCache.addEventListener("noupdate", function() {
			phoneui.hideActivityDialog();
		}, false);
		webappCache.addEventListener("downloading", function() {
			phoneui.showActivityDialog("Updating...");
			wasDownloaded = true;
		}, false);
		webappCache.addEventListener("cached", function() {
			phoneui.hideActivityDialog();
		}, false);
		webappCache.addEventListener("updateready", function() {
			location.reload(); // Reload page right after update came.
		}, false);
		webappCache.addEventListener("obsolete", function() {
			phoneui.hideActivityDialog();
			// alert("Error: The manifest is no longer available (code 404). Unable to cache web page for offline use.");
			location.reload(); // Reload page, it seems user just switched off appcache
		}, false);
		webappCache.addEventListener("error", function() {
			phoneui.hideActivityDialog();
			if (wasDownloaded) {
				alert("Error: Unable to cache web page for offline use. Visit Safari settings and clear cache.");
			}
		}, false);
	}

	// Default platform (mostly for desktop browsers
	var touchEventsSupported;

	var defPlatform = {
			initAddressBarHiding : FN_EMPTY,
			hideAddressBar : FN_EMPTY,
			init : function() {
				$(window).resize(function(e) {
					handleResizing();
				});
			},
			docsize : function() { return { x : window.innerWidth, y : window.innerHeight }; },
			touchevents : function() {
				if (typeof(touchEventsSupported) != "boolean") {
				    try {
				        document.createEvent("TouchEvent");
				        touchEventsSupported = !window.navigator.userAgent.toLowerCase().match(/Chrome/i);
				    } catch (e) {
				    	touchEventsSupported = false;
				    }
				}
				return touchEventsSupported;
			},
			nativespinner : false,
			translateTransition : function (t) { return t; },
			handleOrientation : function(f) { f(); },
			showURLInMainWindowUsing : doHref,
			playVideoImplementation : function(videoUrl) {
				if (phoneui.cordovaAvailable() && videoUrl.indexOf(":") < 0) {
					phoneui.cordova.exec(
						function(result) {
							if (result === "true")
								phoneui.cordova.exec(null, null, "MobiOne", "playVideo", [videoUrl]);
							else
								phoneui.showURL(videoUrl, '_self');
						},
						function(error) {
							phoneui.showURL(videoUrl, '_self');
						},
						"MobiOne",
						"useNativeVideoPlayer",
						[]);
				} else {
					phoneui.showURL(videoUrl, '_self');
				}
			},
			forceRemoteAudioRestart: false
	};
	
	function workaroundIOSFormSubmitBug(context) {
		$('input[type=email],input[type=number],' +
				  'input[type=tel],input[type=text],' + 
				  'input[type=url]').keypress(function(e) {
					var key = e.which;
					if(key == 13 || key == 10) {
						e.preventDefault();
						e.stopPropagation();
						phoneui.submitForm(this.form.name);
					}
				});	
	}

	var android = window.navigator.userAgent.match(/(Linux; U; Android )/i);
	var silk = window.navigator.userAgent.match(/(; Silk\/)/i);
	
	if (window.navigator.userAgent.toLowerCase().match(/(iphone|ipod)( simulator)?;/i)) {
		var isIPhone5 = (window.screen.height == 568);

		// iphone platform
		phoneui._platform = $.extend(defPlatform, {
			_isInFullScreenMode : false,
			init : function() {
				$('input, textarea, select').bind('blur', function(e) {
					// virtual keyboard disappeared, let's hide address bar
					phoneui._platform.hideAddressBar();
				});

				// Fix for Bug 19213
				phoneui._extraPreprocessDOM.push(workaroundIOSFormSubmitBug);

				$(window).resize(function() {
					if (phoneui._platform._isInFullScreenMode != phoneui._platform.isFullScreenMode()) {
						handleResizing();
						if (phoneui._platform._isInFullScreenMode && m1Design.shouldHideAddressBar) {
							phoneui._platform.hideAddressBar();
						}
					}
					phoneui._platform._isInFullScreenMode = phoneui._platform.isFullScreenMode();
				});
			},
			initAddressBarHiding : function() {
				setTimeout(function() {
					phoneui._platform.hideAddressBar();
				}, 1000);
			},
			hideAddressBar : function() {
				window.scrollTo(0, 0);
			},
			isFullScreenMode : function() {
				return window.innerHeight == 320 &&
					(isIPhone5 ? window.innerWidth == 568 : window.innerWidth == 480);
			},
			docsize : function() {
				if (phoneui._platform.isFullScreenMode()) {
					return { x : window.innerWidth, y : window.innerHeight };
				}
				var p = (window.orientation % 180) == 0;

				// Take statusbar into account
				var bb = m1Design.fullScreenMode ? 0 : 20;
				var bbVisible =
					!(phoneui.cordovaAvailable()) &&
					!window.navigator.standalone;
				if (bbVisible) {
					// Take buttonbar into account
					bb += (p ? 44 : 30);
					// Take addressbar height into account
					bb += m1Design.shouldHideAddressBar ? 0 : 60;
				}
				return {
					x : (p ? 320 : (480 + (isIPhone5 ? 88 : 0))),
					y : ((p ? (480 + (isIPhone5 ? 88 : 0)) : 320) - bb) };
			},
			touchevents : function() {
				return true;
			},
			nativespinner : true,
			showURLInMainWindowUsing : doHrefWithWindowOpenFallback
		});
	} else if (window.navigator.userAgent.toLowerCase().match(/(ipad)( simulator)?;/i)) {
		// ipad platform
		phoneui._platform = $.extend(defPlatform, {
			init : function() {
				$(window).resize(function(e) {
					handleResizing();
				});
				$(window).bind('orientationchange', function(e) {
					handleResizing();
				});
				$('input, textarea, select').bind('blur', function(e) {
					// virtual keyboard disappeared, let's hide address bar
					phoneui._platform.hideAddressBar();

					// Wait for some time and resize page then. This should fix 22194
					setTimeout(function() {
						// handleResizing();
						var activeTag = document.activeElement ? document.activeElement.tagName.toLower() : ""; 
						if (activeTag != "input" && activeTag != "textarea" && activeTag != "select") {
							// Return body to it's original state
							handleResizing();
						}
					}, 50);
				});
				// Fix for Bug 19213
				phoneui._extraPreprocessDOM.push(workaroundIOSFormSubmitBug);
			},
			initAddressBarHiding : FN_EMPTY,
			hideAddressBar : function() {
				window.scrollTo(0, 0);
			},
			docsize : function() {
				return { x : window.innerWidth, y : window.innerHeight };
			},
			touchevents : function() {
				return true;
			},
			nativespinner : true,
			showURLInMainWindowUsing : doHrefWithWindowOpenFallback
		});
	} else if (android || silk){
		var version;
		if (android) {
			version = window.navigator.userAgent.match(/Linux; U; Android\s+([\d\.]+)/)[1];
		} else {
			// Silk browser
			version = "2.3";
		}

		var transitions = phoneui.transitions;

		// Support all transitions except flips
		var realTranslateTransition = function(trans) {
			if (trans == transitions.flipRight || trans == transitions.flipLeft) {
				return transitions.fade;
			}
			return trans;
		}

		if (version.match(/^1\./) || version.match(/^3\./)) {
			// Android 1.x, 3.x - Animations support is very pure there, only fade works OK
			realTranslateTransition = function(trans) {
				return trans == transitions.none ? trans : transitions.fade;
			}
		}

		// Android platform
		phoneui._platform = $.extend(defPlatform, {
			browserDataState : { "true" : {} , "false" : {} },
			keybIsOn : false,
			restoreFunctions : [],
			init : function() {
				$('input, textarea, select').bind('focus', function(e) {
					if (SpinningWheel.swWrapper) {
						SpinningWheel.cancelAction();
						SpinningWheel.close();
					}
				});

				var browserData = function() {
					var p = (window.orientation % 180) == 0;
					return phoneui._platform.browserDataState[p];
				};

				//
				if (!phoneui._platform.alternateTransition) {
					$("." + m1Design.css('top-root') + ", " + "." + m1Design.css('root'))
						.css({"-webkit-transform" : "translate3d(0,0,0)"});
				}

				browserData().maxHeight =
					window.outerHeight + (phoneui._platform.keybIsOn ? 150 : 0);

				var prevResize;
				var updateSpinner;
				var cnt = 0;
				$(window).resize(function(e) {
					var that = phoneui._platform;

					if (prevResize) {
						clearTimeout(prevResize);
						prevResize = 0;
						if (updateSpinner) {
							clearTimeout(updateSpinner);
						}
					}

					prevResize = setTimeout(function() {
						if (m1Design.softSpinnerEnabled) {
							updateSpinner = setTimeout(function() {
								if (openedWheel) {
									SpinningWheel.onScroll();
								}
							}, 100);
						}

						var that = phoneui._platform;

						if (!browserData().maxHeight) {
							browserData().maxHeight = window.outerHeight + (that.keybIsOn ? 150 : 0);
						}

						if (browserData().maxHeight - window.outerHeight > 150) {
							if (!that.keybIsOn) {
								var that = phoneui._platform;

								//
								/*
								for (var el = document.activeElement;
									el != document.body; el = el.parentElement) {
									if (el.style.webkitTransform) {
										var comps = window.getComputedStyle(el);
										var strTransform = comps.webkitTransform;
										var matrix = new WebKitCSSMatrix();
										var top = matrix.f;
										var left = matrix.e;

										el.style.webkitTransform = "";
										el.style.top = top + "px";
										el.style.left = left + "px";
										// el.offsetHeight;

										that.restoreFunctions.push(function() {
											el.style.top = 0;
											el.style.left = 0;
											el.style.webkitTransform = strTransform;
										});
									}
								}
								*/
								$(currentScreen.anchor_id).find('.' + m1Design.css("iscroll-scroller")).each(function() {
									var el = $(this).get(0);
									var comps = window.getComputedStyle(el);
									var strTransform = comps.webkitTransform;
									var strTransition = comps.webkitTransition;
									var matrix = new WebKitCSSMatrix();
									var top = matrix.f;
									var left = matrix.e;

									el.style.webkitTransition = "";
									el.style.webkitTransform = "";
									el.style.top = top + "px";
									el.style.left = left + "px";
									// el.offsetHeight;

									that.restoreFunctions.push(function() {
										el.style.top = 0;
										el.style.left = 0;
										el.style.webkitTransform = strTransform;
										el.style.webkitTransition = strTransition;
									});
								});

								var pos = getElementPosition(document.activeElement);

								// Scroll to make editbox visible.
								var scrollPos =
									Math.max(0, pos.top + document.activeElement.offsetHeight - window.innerHeight - 5);

								var oldScrollTop = document.body.scrollTop;
								// document.body.scrollTop = -scrollPos;
								$(document.body.parentElement).css('top', -scrollPos);

								// document.body.style.overflow = "hidden";
								// overflow-y:hidden
							}
							that.keybIsOn = true;
						} else {
							if (that.keybIsOn) {
								// 

								// $("." + m1Design.css('top-root')).scrollTop = 0;
								$("." + m1Design.css('top-root')).css('top', 0);

								if (m1Design.shouldHideAddressBar) {
									if (window.outerHeight != browserData().maxHeight) {
										phoneui._platform.initAddressBarHiding();
									}
								} else {
									$(document.body).scrollTop = 0;
									$(document.body).height(window.innerHeight);
								}

								that.restoreFunctions.forEach(function(f) { f(); });
								that.restoreFunctions = [];

								// Wait for some time and resize page then.
								setTimeout(function() {
									handleResizing();
								}, 500);
							}
							that.keybIsOn = false;
						}

						if (window.outerHeight > browserData().maxHeight) {
							browserData().maxHeight = window.outerHeight;
						}
					}, 100);
				});
			},
			initAddressBarHiding : function() {
				phoneui._platform.hideAddressBar();
			},
			doUntilWindowSizeStops : function(fnStep, fnMiddle, fnEnd) {
				var attempt = 0;
				var s = phoneui._platform.docsize();
				var prevDocSize = phoneui._platform.docsize();
				var prevDocSizeTime = attempt;
				var fnPeriod = function() {
			    	var e;
			    	try {
				    	var wait = true;
				    	if (attempt < 80) {
				    		fnStep();
				    		var s2 = phoneui._platform.docsize();
							if (s.y < s2.y || s.x < s2.x) {
								if (prevDocSize.x != s2.x || prevDocSize.y != s2.y) {
									prevDocSize = s2;
									prevDocSizeTime = attempt;

									fnMiddle();
								}

								wait = (attempt - prevDocSizeTime) < 2;
							}

							if (wait) {
								attempt++;
								setTimeout(fnPeriod, 100);
							} else {
								fnEnd();
							}
				    	} else {
				    		fnEnd();
				    	}
			    	} catch (e) {
			    		console.error(e);
			    	}
			    }
			    setTimeout(fnPeriod, 50);

			},
			hideAddressBar : function(fnAfter) {
				$(document.body).height(window.innerHeight + 200);

				phoneui._platform.doUntilWindowSizeStops(
						function() {
							window.scrollTo(0, 1);
						},
						function() {
							window.scrollTo(0, 1);

							handleResizing();
						},
						function() {
							$(document.body).scrollTop = 0;
							$(document.body).height(window.innerHeight);
							if (fnAfter) {
								fnAfter();
							}
						});
			},
			handleOrientation : function(f) {
				// Delay orientation processing - kindle fire doesn't return correct window.inner*
				// when orientation event is fired
				f();
				this.doUntilWindowSizeStops(FN_EMPTY, FN_EMPTY, f);
			},
			docsize : function() {
				return { x : window.innerWidth, y : window.innerHeight };
			},
			touchevents : function() {
				return true;
			},
			nativespinner : false,
			translateTransition : realTranslateTransition,
			alternateTransition : silk || version.match(/^4\./),
			showURLInMainWindowUsing : doWindowOpen,
			playVideoImplementation : function(videoUrl) {
				var a = document.createElement('a');
				a.href = videoUrl;
				var absoluteUrl = a.href;

				if (phoneui.cordovaAvailable()) {
					phoneui.cordova.exec(
						function(result) {
							if (result === "true")
								phoneui.cordova.exec(null, null, "MobiOne", "playVideo", [absoluteUrl]);
							else
								phoneui.showURL(videoUrl, '_system');
						},
						function(error) {
							phoneui.showURL(videoUrl, '_system');
						},
						"MobiOne",
						"useNativeVideoPlayer",
						[]);
				} else {
					// AY: webapp: Android forbids popups by default and have 4 tabs limit, so use self
					phoneui.showURL(videoUrl, '_self');
				}
			},
			forceRemoteAudioRestart: true
		});
	} else {
		// Desktop (or unknown/unsupported) browser
		phoneui._platform = defPlatform;
	}

	function resizeScreen(currentScreen, movingBack) {	
		var s = phoneui._platform.docsize();
		// Set root screen element height - otherwise addressbar wouldn't disappear on iOS
		var t = $("." + m1Design.css('top-root') + ", " + currentScreen.anchor_id);
		
		t.height(s.y);
		t.css('min-height', s.y + 'px');

		t.width(s.x);
		currentScreen.resize(s.x, s.y); // Make first resize

		var $root = $(currentScreen.anchor_id);
		reinitscrollers($root, movingBack);

		// Perform extra pre-process steps.
		$.each(phoneui._extraPageInitializers, function(i, f) {
			f($root);
		});
		
		// Fix for Heisenbug 23075 - force to apply all styles immediately
		t[0].offsetHeight;
	}

	function getElementPosition(fakeEl) {
		var off = {left:0, top:0};
		for (var op = fakeEl; op != null; op = op.offsetParent) {
			off.left += op.offsetLeft;
			off.top += op.offsetTop;

			if (op.myScroll) {
				off.left += op.myScroll.x;
				off.top += op.myScroll.y;
			}
		}
		return off;
	}

	function handleResizing() {
		if (currentScreen) {
			resizeScreen(currentScreen, true);
		}
	}

	phoneui.forceLayout = function() {
		handleResizing();
	}

	var firstScreenTime = 1;
	var defAncPars = [m1Design.root(), 'NONE', firstScreenTime];
	var currentScreen = parseAnchor('');

	phoneui.getCurrentScreen = function() {
		return currentScreen;
	}

	handleResizing();

	/**
	 * This method decides whether we need to do AJAX request for the next page
	 */
	function needToLoadAjaxPage(currentScreen, nextScreen, back) {
		return ('html_url' in nextScreen) &&
			($(nextScreen.anchor_id).length == 0 || m1Design.ajaxPageReloadApproach == 'ALWAYS') &&
			// following case is special one - returning back from static page
			// to dynamic one shouldn't cause reload, otherwise our SLM pages
			// stops to work
			!(back && currentScreen && !('html_url' in currentScreen));
	}

	function createAnchor(screen, transition, time) {
		return screen.id + ":" + transition + ":" + time;
	}
	
	// FORMAT: page_id:transition:time
	function parseAnchor(str) {
		var spl = str == "" ? [] : str.substr(1).split(":");

		// Append default params
		if (spl.length < defAncPars.length) {
			spl = spl.concat(defAncPars.slice(spl.length));
		}

		function obj() {};
		if (!(spl[0] in m1Design.pages)) {
			console.error('Page ' + spl[0] + ' is not found!');
			console.trace("Call");
			return null;
		}
		obj.prototype = m1Design.pages[spl[0]];

		var ret = new obj();
		ret.transition = spl[1];
		ret.time = spl[2];
		ret.equals = function(el) {
			return !el || (this.anchor_id == el.anchor_id);
		};

		return ret;
	}

	// Install checkNewScreen as history change listener
	if ('onhashchange' in window) {
		window.onhashchange = checkNewScreen;
	} else {
		setInterval(checkNewScreen, 200);
	}

	phoneui._platform.init();

	if ('orientation' in window) {
		window.onorientationchange = function() {
			phoneui._platform.handleOrientation(function() {
				handleResizing();
				if (m1Design.shouldHideAddressBar) {
					phoneui._platform.initAddressBarHiding();
				}
				if ('postOrientationChange' in phoneui) {
					phoneui.postOrientationChange(window.orientation);
				}
			});
		};
	}

	checkNewScreen();

	var prevHref;
	var prevHash;

	function checkNewScreen() {
		var initialCall = !prevHref;
		if (prevHref != window.location.href) {
			var prevExistingHash = prevHash;
			var prevExistingHref = prevHref;
			prevHref = window.location.href;
			prevHash = window.location.hash;

			var nextScreen = parseAnchor(window.location.hash);

			if (!nextScreen.equals(currentScreen)) {
				var trans = nextScreen.transition;
				var back = false;

				if ((+nextScreen.time) < (+currentScreen.time)) {
					// We're moving back in history!
					trans = currentScreen.transition;
					back = true;
				}

				if (needToLoadAjaxPage(currentScreen, nextScreen, back)) {
					// call "prePageLoad" hook
					var allowedToLoad = true;
					if ('prePageLoad' in phoneui) {
						allowedToLoad =
							!!runUserCode(phoneui.prePageLoad, null, [nextScreen.anchor_id], true);
						if (!allowedToLoad) {
							console.log('Page ' + nextScreen.anchor_id + ' prePageLoad veto');
						}
					}

					if (allowedToLoad) {
						// Load page first
						var url = nextScreen.html_url();
						phoneui.showActivityDialog();
						
						var req = new XMLHttpRequest();
						req.open("GET", url, true);
						// req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
						var timer = setTimeout(function() {
							   req.abort();
							 }, 10000);
						req.onreadystatechange = function() {
							if (req.readyState == req.DONE) {
								var ok = (req.status >= 200 && req.status < 300) || (req.status == 0 && req.responseText.length > 0);
								if (ok) {
									clearTimeout(timer);
	
									parseDPIPageData(req.responseText, trans, back, nextScreen.time);
								} else {
									phoneui.hideActivityDialog();
								}
							}
						}
						req.send(null);
					} else {
						// revert location
						window.location.hash = prevHash = prevExistingHash;
						prevHref = window.location.href;
						return;
					}
				} else {
					// Animate!
					var $next = $(nextScreen.anchor_id);

					// Vadim.Ridosh: here we're analyzing whether we're moving
					// back, calling pretransition event and check whether user
					// cancelled transition.
					if (back && !callPreTransition(nextScreen)) {
						window.location.hash = prevHash = prevExistingHash;
						prevHref = window.location.href;
						return;
					} else {
						// calling "back" handler
						var fnBack = phoneui._whenBackHandlers[nextScreen.id];
						phoneui._whenBackHandlers[nextScreen.id] = null;
						(fnBack || FN_EMPTY)();
					}

					resizeScreen(nextScreen, back);

					animateNavigation(
							$next, $(currentScreen.anchor_id),
							initialCall ? "NONE" : trans, back, function() {
								currentScreen = nextScreen;
								callPostTransition();
							});
				}
			}
		}
	}

	function parseDPIPageData(data, transition, back, nextTimeId) {
		phoneui._loadingJSDone = function(pageObjects) {
			// register pages in pages object
			for (var i=0; i<pageObjects.length; ++i) {
				var pageObject = pageObjects[i];
				m1Design.pages[pageObject.id] = pageObject;
			}
			// First page description is a page we need to switch at
			var pageObject = pageObjects[0];

			var nextScreen = parseAnchor("#" + createAnchor(pageObject, transition, currentScreen.time));

			if (callPreTransition(nextScreen)) {
				resizeScreen(nextScreen, back);

				var $next = $(nextScreen.anchor_id);
				animateNavigation(
						$next, $(currentScreen.anchor_id),
						transition, back, function(transition) {
							nextScreen.time = currentScreen.time + 1;
							if (!nextScreen.equals(parseAnchor(window.location.hash))) {
								window.location.hash = createAnchor(nextScreen, transition, nextTimeId);
							}
							currentScreen = nextScreen;
							callPostTransition();
						});
			}

			phoneui.hideActivityDialog();

			phoneui._loadingJSDone = null;
		};

		var pg = $('<div></div>');
		pg.html(data);
		var rt = pg.find('.' + m1Design.css('root'));

		rt.each(function(i, v) {
			var $next = $("#" + $(v).attr('id'));
			// Remove old div
			$next.remove();
		});

		preProcess(rt);
		rt.hide();
		rt.appendTo('.' + m1Design.css('top-root'));
	}

	phoneui.loadCssAsync = function(cssFileUrl, onok) {
		onok = onok || FN_EMPTY;
		$.ajax({
			  url: cssFileUrl,
			  dataType: 'text',
			  complete: function(xhr) {
				$('<style type="text/css">' + xhr.responseText +'</style>').appendTo("head");
				onok();
			  }
			});
	}

	phoneui.loadJsAsync = function(jsFileUrl, onok) {
		onok = onok || FN_EMPTY;
		$.ajax({
			  url: jsFileUrl,
			  dataType: 'script',
			  success: onok,
			  error: onok // Call onok anyway, we don't care about failed JS loading
			});
	}
		
	// AY TODO: review this code
	phoneui.__postPageTransitionHandlers = [];
	phoneui.addPostPageTransitionHandler = function(fu) {
		var self = this;
		var handlers = self.__postPageTransitionHandlers;
		handlers.push(fu);
		return {
			dispose: function() {
				var pos = handlers.indexOf(fu);
				if (pos != -1) {
					self.__postPageTransitionHandlers =
						handlers.slice(0, pos).concat(handlers.slice(pos + 1));
				}
			}
		};
	}

	function callPreTransition(nextScreen) {
		if (currentScreen.equals(nextScreen)) {
			console.error('Page ' + currentScreen.anchor_id + ' already active');
			return false;
		}
		if ('prePageTransition' in phoneui) {
			var result =
				!!runUserCode(phoneui.prePageTransition, null, [currentScreen.anchor_id, nextScreen.anchor_id], true);
			if (!result) {
				console.log('Page ' + nextScreen.anchor_id + ' pretransition veto');
			}
			return result;
		}
		return true;
	}

	function callPostTransition() {
		// Unclick while transitioning to page
		var clickeable = $('.' + m1Design.css("clicked") + '.' + m1Design.css("hyperlink-internal"),
				$(currentScreen.anchor_id));
		unclickme(clickeable);

		if ('postPageTransition' in phoneui) {
			runUserCode(phoneui.postPageTransition, null, [currentScreen.anchor_id]);
		}
		for (var i in phoneui.__postPageTransitionHandlers) {
			runUserCode(phoneui.__postPageTransitionHandlers[i], null, [currentScreen.anchor_id]);
		}
	}

	/**
	 * Get ID of current page.
	 *
	 * @return ID String of the page. Is in the form of anchor (e.g., #m1-page1)
	 */
	phoneui.getCurrentPageId = function() {
		return currentScreen.anchor_id;
	}

	var getURIParameterByName = function(name) {
	  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	  var regexS = "[\\?&]" + name + "=([^&#]*)";
	  var regex = new RegExp(regexS);
	  var results = regex.exec(window.location.href);
	  if(results == null)
	    return "";
	  else
	    return decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	phoneui.resetForm = function(formId) {
		var form = document.forms.namedItem(formId);
		form.reset();
		// preProcess($('.' + m1Design.css("top-root")));
		var context = $(currentScreen.anchor_id);
		$('.' + m1Design.css('select-list-menu-spinner') + "," +
			'.' + m1Design.css('select-list-menu'), context).each(function(i, v) {
				hiddenSelectToSLM(v, context);
			});
		$('.' + m1Design.css('selection-list'), context).each(function(i, v) {
			hiddenSelectToSL(v, context)
		});
	}

	phoneui.submitForm = function(formId) {
		var form = document.forms.namedItem(formId);
		if (form == null) {
			return false;
		}
		
		var $form = $(form);
    	var presubmitName = "preSubmitForm_" + form.name;
	    var method = $form.attr('method');
	    var restype = $form.attr('data-resulttype');
	    var transition = $form.attr('data-transition');
		var result = false;

		// call preSubmit method right now, may be user want to modify fields here
	    if (presubmitName in phoneui) {
	      result = !!runUserCode(phoneui[presubmitName], this, [form], true);
	      if (!result) return false;
	    }

        // Drop placeholders before serialization and do serialize
	    var str = doWhilePlaceholdersDropped(function() { return $form.serialize() });
	    
	    var aftersubmitName = "postSubmitForm_" + form.name;		

	    var path = $form.attr('action');
	    //validate non-empty path
	    if (!path) return false; //no path provided
	    //trim path
	    path = $.trim(path);
	    //validate non-empty path
	    if (path.length == 0) return false; //no path provided	    	    
	    	    
	    //mailto: protocol issues on iOS:
	    // 1) fails on iOS3 standalone webapp
	    // 2) on iOS4 standalone webapp, the mail client does not return to webapp
	    if (path.indexOf('mailto:') == 0) {
	    	var to = path.substring(7);
	    	var subject = $form.attr('data-email-subj');
	    	var bodyTemplate = $form.attr('data-email-body');
	    	
	    	result = doWhilePlaceholdersDropped(function() {
	    			return phoneui.composeEmailFromPage($form, to, subject, bodyTemplate);
	    	});
	    	
	        if (result && aftersubmitName in phoneui) {
	        	result = !!runUserCode(phoneui[aftersubmitName], this, [true], true);
	        }
	        
	        return result;
	    }	    

		if (restype == 'WEB_PAGE') {
			doWhilePlaceholdersDropped(function() {
				// Pure Web submisson
				$form[0].submit();
			});
			return;
		}

		phoneui.showActivityDialog();

		// "serverRedirectUrl"

		var redirect = getURIParameterByName('serverRedirectUrl');
		path += (method == "GET" ? ("?" + str) : "");

		var dtype; // Undefined by default
		if (restype == 'DYNAMIC_PAGE') {
			dtype = 'text';
		} else if (restype == 'DATA_XML') {
			dtype = 'xml';
		} else if (restype == 'DATA_JSON') {
			dtype = 'json';
		} else if (restype == 'DATA_JSONP') {
			dtype = 'jsonp';
			redirect = null; // We don't need redirect for JSONP, because that's not a subject of cross-domain restrictions
		} else if (restype == 'DATA_TEXT') {
			dtype = 'text';
		} else if (restype == 'DATA_HTML') {
			dtype = 'html';
		}

		var ajaxRequest = {
			type: method,
			url: (redirect || path),
			cache: false,
			dataType : dtype,
			beforeSend: function(xhr){
				if (redirect) {
					// Perform trick to resolve relative URL to absolute one
				    var img = document.createElement('img');
				    img.src = path;
				    path = img.src;
				    img.src = null;

					xhr.setRequestHeader("X-Original-http-address", path);
				}
				return true; //return false if execution should terminate
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.error("AJAX request failed", textStatus, errorThrown);
				phoneui.hideActivityDialog();
				if (aftersubmitName in phoneui) {
					runUserCode(phoneui[aftersubmitName], this, [false, textStatus]);
				}
			},
			complete: function(xMLHttpRequest, textStatus) {
				// console.log(textStatus);
			},
			success: function(data) {
				result = true;

				if (aftersubmitName in phoneui) {
					result = !!runUserCode(phoneui[aftersubmitName], this, [true, data], true);
				}

				if (result) {
					if (restype == 'DYNAMIC_PAGE') {
						parseDPIPageData(data, transition, false, +currentScreen.time + 1);
					}
				}
			
				phoneui.hideActivityDialog();
			}
		};
		if (method == "POST") {
			ajaxRequest['data'] = str;
		}

		jQuery.ajax(ajaxRequest);

		return result;
	}
		
	phoneui.composeEmailFromPage = function($context, to, subject, bodyTemplate) {
    	try {	    	
	    	var variables = bodyTemplate.match(/\$\{[\S^\}]*\}/g);

	    	var $formElements = $("input,select,textarea", $context);

	    	for (var i in variables) {
	    		var varName = variables[i]; 
	    		var varNameClean = varName.substring(2, varName.length - 1);
	    		var value = "";
	    		
	    		if (varNameClean == "subject") {
	    			value = subject;
	    		} else {
	    		
		    		var $tag = $formElements.filter("[name='" + varNameClean + "']");

		    		if ($tag.length == 0) {
		    			console.warn("Can't find control for " + i + ", " + varName);
		    			continue;
		    		}
		    					    		
		    		switch($tag[0].tagName) {
		    		case "INPUT":
		    			var type = $tag.attr("type");
		    			switch (type) {
		    			case "radio":
		    				value = $tag.filter("[checked]").attr("value");
		    				break;
		    			case "checkbox":
		    				value = $tag.attr("value") == "on" ? "on" : "off"; 
		    				break;
		    			default:
		    				value = $tag.attr("value");
		    				break;
		    			}
		    			break;
		    		case "SELECT":
		    			value = $.map($tag.children("[selected]"), 
		    					function(e) { 
		    						return $(e).html().replace(",", "\,"); 
		    					}).join(", ");
		    			break;
		    		case "TEXTAREA":
		    			value = $tag.attr("value");
		    			break;
		    		default:
		    			console.error("Unknown tag name: " + $tag);
		    		}
	    		}
	    		
	    		bodyTemplate = bodyTemplate.replace(varName, value);
	    	}		    	
	    	phoneui.composeEmail(subject, bodyTemplate, to, "", "", false);
    	} catch (e) {
    		console.error(e);
    		return false;
    	}	

        return true;		
	}

	phoneui.gotoSlmPage = function(pageId, transition, slmId) {
		var sel = $("#" + $("#" + slmId).attr("data-hiddenInputId"));
		var lis = sel.children('option');
		var selections = [];

		var newScreen = phoneui.getPageByAnchorId(pageId);
		var li = $("ul", $(newScreen.anchor_id)).children('li');

		for(var i = 0; i < lis.length; i++) {
			var lbl = $(lis[i]);
			var isSelected = lbl.get(0).selected;
			$(li[i])[isSelected ? 'addClass' : 'removeClass'](m1Design.css("selected"));

			selections.push(isSelected);
		}

		phoneui.gotoPage(pageId, transition, function() {
			for(var i = 0; i < lis.length; i++) {
				var lbl = $(lis[i]);
				if (lbl.get(0).selected != selections[i]) {
					// Fire "change" event
					var evt = document.createEvent("HTMLEvents");
				    evt.initEvent("change", true, true ); // event type,bubbling,cancelable
				    sel[0].dispatchEvent(evt);

					return;
				}
			}
		});
	}

	phoneui.gotoScreen = phoneui.gotoPage = function(pageId, transition, fnWhenBack) {
		var currentScreen = phoneui.getCurrentScreen();
		phoneui._whenBackHandlers[currentScreen.id] = fnWhenBack;
		var newScreen = phoneui.getPageByAnchorId(pageId);
		if (newScreen == null) {
			console.error('Page ' + pageId + ' not found');
			return;
		}

		// Here we want to call PreTransition only if no need to load ajax page
		// otherwise, it will be called later, after page loading.
		if (needToLoadAjaxPage(currentScreen, newScreen, false) || callPreTransition(newScreen)) {
			window.location.hash = createAnchor(newScreen,
				(transition || phoneui.transitions.slideLeft),
				(currentScreen ? ((+currentScreen.time) + 1) : "0"));
		}
	}

	phoneui.gotoMultiPagePage = function(widgetId, targetType, pageId, transition) {
		var selectedClass = m1Design.css('selected');
		var oldSelected = $("#" + widgetId + ">" + "." + selectedClass);

		// Resolve target type
		var pages = [];
		var widget = $("#" + widgetId); 
		widget.children().each(function() {
			pages.push($(this).attr("id"));
		});
		var thisPageIndex = pages.indexOf(oldSelected.attr("id"));
		pageId = {
			SET_PAGE : function() { return pageId; },
			FIRST : function() { return pages[0]; }, 
			LAST : function() { return pages[pages.length - 1]; },
			NEXT_STOP_AT_LAST : function() { 
				return thisPageIndex < (pages.length - 1) ? pages[thisPageIndex + 1] : this.LAST(); 
			},
			PREVIOUS_STOP_AT_FIRST : function() { 
				return thisPageIndex > 0 ? pages[thisPageIndex - 1] : this.FIRST(); 
			},
			NEXT_CIRCULAR : function() {
				return thisPageIndex < (pages.length - 1) ? pages[thisPageIndex + 1] : this.FIRST();
			},
			PREVIOUS_CIRCULAR : function() { 
				return thisPageIndex > 0 ? pages[thisPageIndex - 1] : this.LAST();
			},
		}[targetType]();
		
		var newSelected = $("#" + widgetId + " " + "#" + pageId);
		
		var changingAction = widget.attr("data-action-changing-id");
		if (changingAction) {
			var allow = runUserCode(m1Design.actions[changingAction], widget[0], [oldSelected[0], newSelected[0]], true);
			if (!allow) {
				// transition is vetoed, do nothing
				return;
			}
		}

		// Perform extra pre-process steps.
		$.each(phoneui._extraPageInitializers, function(i, f) {
			f(newSelected);
		});
		
		animateNavigation(newSelected, oldSelected, transition, false, function() {			
			var changedAction = widget.attr("data-action-changed-id");
			if (changedAction) {
				runUserCode(m1Design.actions[changedAction], widget[0], [oldSelected[0], newSelected[0]]);
			}

			oldSelected.removeClass(selectedClass);
			newSelected.addClass(selectedClass);
			
			// Update tabbars
			$("[data-attached-multibox='" + widgetId + "']" + " ." + selectedClass).removeClass(selectedClass);
			$("[data-attached-multiboxpage=" + pageId + "]").addClass(selectedClass);
		});
	}

	function animateNavigation($new, $old, transition, revertTransition, fnAfterTransition) {
		if (document && document.activeElement && ('blur' in document.activeElement)) {
			document.activeElement.blur(); // Unfocus currently active document.
		}

		if ($new.attr('id') != $old.attr('id'))  {
			if ($new.length == 0) {
				console.error("Animation target page is not found");
				return; // Target page is not found
			}

			var tr = phoneui.transitions;

			if (transition == 'DEFAULT') {
				transition = tr.slideLeft;
			}

			transition = phoneui._platform.translateTransition(transition);

			var trNone = transition == tr.none;
			var trFade = transition == tr.fade;
			var trFlipRight = transition == tr.flipLeft;
			var trFlipLeft = transition == tr.flipRight;
			var trSlideRight = transition == tr.slideRight;
			var trSlideUp = transition == tr.slideUp;
			var trSlideDown = transition == tr.slideDown;
			var trSlideLeft = transition == tr.slideLeft;

			$new.css('pointer-events', 'none');
			$old.css('pointer-events', 'none');
			
			// Stop all scrollers - we don't want them to process when sliding
			$('.' + m1Design.css("iscroll-scroller"), $old).each(function() {
				if (this.myScroll) {
					this.myScroll.stop();
				}
			});

			var afterTransition = function() {
				$new.css('pointer-events', 'auto');
				// clickbuster.preventGhostClickAfterTransition();
				fnAfterTransition(transition);
				reinitscrollers($(currentScreen.anchor_id), revertTransition);
			}
			
			var doTransition = function(transitionDesc, next) {
				var d = transitionDesc.shift();

				d.from.forEach(function(e) {				
					e.el.css(e.css);

					// Trick: forces pages to apply all styles
					// http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
					e.el[0].offsetHeight;
				})

				var timer;
				var boundTo;

				var trStart;
				var performAfterTrans = function() {
					clearTimeout(timer);

					d.last.forEach(function(e) { e.el.css(e.css); })

					boundTo.unbind('webkitTransitionEnd', performAfterTrans);

					if (transitionDesc.length == 0) {
						afterTransition();
					} else {
						doTransition(transitionDesc, true);
					}
				}

				d.to.forEach(function(e) {
					var props = [];
					for (var pr in e.css) {
						props.push(pr);
					}

					e.el.css({
						"-webkit-transition-delay" : "0ms",
						"-webkit-transition-property" : props.join(","),
						"-webkit-transition-duration" : d.time + "ms",
						"-webkit-transition-timing-function" : "ease-in-out"
					});

					if (!boundTo) {
						boundTo = e.el;
						e.el.bind('webkitTransitionEnd', performAfterTrans);
					}
					e.el.css(e.css);
				});

				// If time is out but webkitTransitionEnd didn't come yet,
				// than timer should do the job.
				/*
				timer = setTimeout(function() {
					performAfterTrans();
				}, d.time * 3);
                */
			}

			if (trFade) {
				doTransition([{
					time : 350,
					from : [
					 {el : $old, css : { "opacity" : "1", "z-index" : "10" }},
					 {el : $new, css : { "opacity" : "0", "z-index" : "0", "display" : "block" }}
					],
					to : [
					 {el : $old, css : { "opacity" : "0" }},
					 {el : $new, css : { "opacity" : "1" }}
					],
					last : [
					 {el : $old, css : { "opacity" : "1", "display" : "none" }}
					]
				}]);
			} else if (trFlipRight || trFlipLeft) {
				var l = (trFlipLeft ? -1 : 1) * (revertTransition ? -1 : 1);
				doTransition([{
					// Step 1
					time : 300,
					from : [
					 {el : $old, css : { "-webkit-transform-style" : "preserve-3d",
						                 "-webkit-transform" : "rotateY(0) scale(1) skewY(0deg)" }}
					],
					to : [
					 {el : $old, css : { "-webkit-transform" : "rotateY(" + 90*l +"deg) scale(.9) skewY(" + 10*l + "deg)" }}
					],
					last : [
					 {el : $old, css : { "-webkit-transform" : "rotateY(0) scale(1) skewY(0deg)", "display" : "none" }}
					]
				}, {
					// Step 2
					time : 300,
					from : [
					 {el : $new, css : { "-webkit-transform-style" : "preserve-3d",
						                 "display" : "block",
						                 "-webkit-transform" : "rotateY(" + -90*l + "deg) scale(.9) skewY(" + -10*l + "deg)" }}
					],
					to : [
					 {el : $new, css : { "-webkit-transform" : "rotateY(0) scale(1) skewY(0deg)" }}
					],
					last : [
					]
				}]);
			} else if (trSlideRight || trSlideLeft || trSlideUp || trSlideDown) {
				if (phoneui._platform.alternateTransition) {
					var l = ((trSlideLeft || trSlideUp) ? 1 : -1) * (revertTransition ? -1 : 1);
					if (trSlideRight || trSlideLeft) {
						doTransition([{
							time : 350,
							from : [
							 {el : $old, css : { left : "0", opacity : 1 }},
							 {el : $new, css : { left : l*100 + "%", "display" : "block", opacity : 0.99 }}
							],
							to : [
							 {el : $old, css : { left : l*-100 + "%", opacity : 0.99}},
							 {el : $new, css : { left : "0", opacity : 1 }}
							],
							last : [
							 {el : $old, css : { left : "0", "display" : "none", opacity : 1 }}
							]
						}]);
					} else {
						doTransition([{
							time : 350,
							from : [
							 {el : $old, css : { top : "0", opacity : 1 }},
							 {el : $new, css : { top : l*100 + "%", "display" : "block", opacity : 0.99 }}
							],
							to : [
							 {el : $old, css : { top : l*-100 + "%", opacity : 0.99}},
							 {el : $new, css : { top : "0", opacity : 1 }}
							],
							last : [
							 {el : $old, css : { top : "0", "display" : "none", opacity : 1 }}
							]
						}]);
					}
				} else {
					var l = ((trSlideLeft || trSlideUp) ? 1 : -1) * (revertTransition ? -1 : 1);
					var trans = "translate" + ((trSlideRight || trSlideLeft) ? "X" : "Y");

					doTransition([{
						time : 350,
						from : [
						 {el : $old, css : { "-webkit-transform" : trans + "(0) scale(1)" }},
						 {el : $new, css : { "-webkit-transform" : trans + "(" + l*100 + "%) scale(1)", "display" : "block" }}
						],
						to : [
						 {el : $old, css : { "-webkit-transform" : trans + "(" + l*-100 + "%) scale(1)"}},
						 {el : $new, css : { "-webkit-transform" : trans + "(0) scale(1)" }}
						],
						last : [
						 {el : $old, css : { "-webkit-transform" : trans + "(0)", "display" : "none" }},
						 {el : $old.parent(), css : {"-webkit-transform" : ""} }
						]
					}]);
				}
			} else {
				// No animation for "NONE" transitions
				$old.hide();
				$new.css({left:'0px', display:'block'});

				// 0 timeout is required here, otherwise list item highlighting
				// won't work properly
				setTimeout(afterTransition, 0);
			}
		}
	};

	function reinitscrollers(root, isBack) {
		root.find('.' + m1Design.css("iscroll-scroller")).each(function() {
			var el = $(this).get(0);
			if (el.myScroll) {
				if (!isBack) {
					el.myScroll._pos(0, 0);
				}

				if (el.parentNode.clientHeight > 0) {
					el.myScroll.refresh();
				}				
			}
		});
	}

	function doWindowOpen(url) {
		window.open(url, "_self");
	}

	phoneui.iOSAppURLPatterns = [
        /^http(s?):\/\/maps.google/i
	];

	function doHrefWithWindowOpenFallback(url) {
		for (var i=0; i<phoneui.iOSAppURLPatterns.length; ++i) {
			if (url.match(phoneui.iOSAppURLPatterns[i])) {
				doWindowOpen(url);
				return;
			}
		}
		doHref(url);
	}

	function runUserCode(f, _this, args, defRetVal) {
		var ex;
		try {
			var val = f.apply(_this, args);
			// Special case: user didn't provide return value, let's return default one
			return (typeof val === 'undefined') ? defRetVal : val;
		} catch (ex) {
			console.error(ex.type + ": " + ex.message + "\nStack:\n" + ex.stack, ex);
			return defRetVal;
		}
	}

	function doHref(href, tg) {
		// Special processing for SMS URL - they do not work in standalone mode
		// when set directly as window.location.href. So, we're implementing
		// workaround here
		var el = jQuery('<a href="' + href + '" style="position:absolute;" ' +
				( tg ? (' target="' + tg + '"') : '') + '/>')
			.appendTo(document.body);
		var e = el[0];

		var evt = e.ownerDocument.createEvent('MouseEvents');
		evt.initMouseEvent('click', true, true,
				e.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		e.dispatchEvent(evt);
		el.remove();
	}

	phoneui.callPhone = function(number) {
		number = $.trim(number);
		if (phoneui.cordovaAvailable()) {
			phoneui.cordova.exec(
					function(result) {
						if (result === "true")
						    phoneui.cordova.exec(null, null, "MobiOne", "dialPhone", [{"number":number,}]);
						else
							doHref("tel:" + number);
					},
					function(error) {
						doHref("tel:" + number);
					},
					"MobiOne",
					"useNativeDialPhone",
					[]);
		} else {
			doHref("tel:" + number);
		}
	}

	phoneui.sendSms = function(number) {
		number = $.trim(number);
		doHref("sms:" + number);
	}

	/**
	 * options are:
	 * 	showLocationBar
	 *  showNavigationBar
	 *  showAddress
	 */
	phoneui.showURL = function(url, openIn, options) {
		openIn = openIn || "_self";
		
		options = options || {
			showLocationBar: true,
			showNavigationBar: true,
			showAddress: true,
			patchWindowClose: false
		};
		
		// Android web view doesn't support PDF files, so adding a hack here
		if (phoneui.cordovaAvailable() && 
			device.platform === "Android" && 
			url.indexOf(".pdf", url.length - ".pdf".length) !== -1) {
			return phoneui.showPdf(url);
		}

		if (openIn === "_self") {
			phoneui._platform.showURLInMainWindowUsing(url);
		} else if (phoneui.cordovaAvailable()) {
			if (!(window.plugins && window.plugins.childBrowser))
				if (ChildBrowser.install)
					ChildBrowser.install();
			if (window.plugins && window.plugins.childBrowser) {
				if (openIn === "_system") {
					return window.plugins.childBrowser.openExternal(url, false);
				} else {
					var ref = window.plugins.childBrowser.showWebPage(url, options);
					
					if (options.patchWindowClose) {
						var loadStopHandler = function() {
							ref.removeEventListener("loadstop", loadStopHandler);
						 	ref.executeScript({code: "window.close = function() { window.location = '/mobione/closeinappbrowser'; }; "}, function(dummy) {});
						}
						var loadStartHandler = function(event) {
							if (event.url.match("mobione/closeinappbrowser")) {
								ref.close();
							}	 
						}
						var closeHandler = function() {
							ref.removeEventListener("loadstart", loadStartHandler);
							ref.removeEventListener("exit", closeHandler);
						}
						
 						ref.addEventListener("loadstart", loadStartHandler);
						ref.addEventListener("loadstop", loadStopHandler);
						ref.addEventListener("exit", closeHandler);						
					}
					
					return ref;
				}
			} else {
				// fallback, shouldn't happen
				return window.open(url, "_blank");
			}			
		} else {
			var win = window.open(url, "_blank");
			if(win == null || typeof(win)=='undefined') {
				if (!('_mobione_viewports_support' in window)) {
					alert('Can not complete this action. Please disable the "Block Pop-ups" setting for your browser and try again.');
				}
			}
			return win;
		}
	}
	
	/**
	 * Shows PDF file ither from remote (http) or local location (relative url).
	 * 
	 * @param url - url to the file
	 * @param cacheFile - if true - don't delete local copy of file 
	 * 
	 * Behavior is platform specific, on iOS file is opened on web view without local caching,
	 * on Android file is stored to default location, which is external card if available or local app storage.
	 */
	phoneui.showPdf = function(url, cacheFile) {
		if (phoneui.cordovaAvailable() && device.platform == "Android") {
			if (url.substring(0, 4) != "http") {
				// local file, viewer will handle aceess rights & cleanup
				window.plugins.viewer.showFile(url, "application/pdf", 
					function(res) {}, 
					function(error) { console.log(error); });
			} else {
				// remote file, download it first
				phoneui.showActivityDialog();
				window.plugins.downloader.downloadFile(
					url, 
					{}, // default location, no overwrite
					function(res) { 
						if (res.status == 1) { 
							// downloaded
							phoneui.hideActivityDialog();
							var url = res.dir + "/" + res.file;
							window.plugins.viewer.showFile(
								url, 
								"application/pdf", 
								function(res) { 
									if (!cacheFile) {
										window.resolveLocalFileSystemURI(res.file, 
											function(fe) {
												console.log("deleting " + res.file);
												fe.remove();
											}, 
											function(error) { console.log(error); });
									}
								}, 
								function(error) { console.log(error); });
						}
					},
					function(error) { console.log(error); phoneui.hideActivityDialog(); });
			}
		} else {
			// iOS supports PDF in webview
			phoneui.showURL(url);				
		}
	}
	
	
	/**
	 *  Open native "Compose Email" UI.
	 *  subject, body - text or html
	 *	to, cc, bcc - collections of recipients
	 *  For web applications length of all url-encoded parameters should not exceed 2000 chars.
	 */
	phoneui.composeEmail = function(subject, body, to, cc, bcc, isHTML) {
		if (phoneui.cordovaAvailable() && window.plugins.emailComposer) {
			window.plugins.emailComposer.showEmailComposer(subject, body, to, cc, bcc, isHTML);
		} else {
			phoneui.showURL("mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body), "_system");
		}
	}	
	
	phoneui.playVideo = function(videoUrl) {
		phoneui._platform.playVideoImplementation(videoUrl);
	}

	function setNewScreen(nextScreen) {
		if (!nextScreen.equals(currentScreen)) {
			if (callPreTransition(nextScreen)) {
				// Add timestamp
				window.location.hash = createAnchor(nextScreen, "NONE", ((+currentScreen.time) + 1));
			}
		}
	}

	function setNewLocation(href) {
		if (href.match(/^#/)) {
			var nextScreen = parseAnchor(href);
			setNewScreen(nextScreen);
		} else if (href.match(/^sms:/i)) {
			doHref(href);
		} else if (href.match(/^tel:/i)) {
			phoneui.callPhone(href.substr(4));
		} else {
			window.location.href = href;
		}
	}

	function unclickme($that) {
		if ($that.length > 0) {
			// Delaying "addClass(m1Design.css("unclicked"));" to 0 ms - because we can
			// set "clicked" just in same message loop iteration. So we need to wait
			// until effect of "clicked" class appears, otherwise it won't look good.
			setTimeout(function() {
				// We shouldn't remove "clicked" just now, otherwise animations won't work
				$that.addClass(m1Design.css("unclicked"));
				// Delay dropping "clickable" for 100 ms, allow all effects to be drawn
				setTimeout(function() {
					$that.removeClass(m1Design.css("unclicked")).removeClass(m1Design.css("clicked"));
				}, 150);
			}, 0);
		}
	}

	// === TC <audio> hack
	if (window['__tc_native_player']) {
		var audioPlayer = window['__tc_native_player'];

		// we're in TC
		var createAudioElement = function() {
			// we wont emulate whole HTMLElement behavior, so we're wrapping Java component to <audio>
			var proxy = document.__oldCreateElement('audio');
			var handler = audioPlayer.createAudioElement();
			var id = "m1-audio-h-" + new Date().getTime() + Math.random();

			proxy.id = id;
			handler.id = id;

			proxy.handler = handler;
			proxy.canPlayType = function(t) { return this.handler.canPlayType(t); }
			proxy.play = function() { this.handler.play(id, proxy.src); }
			proxy.pause = function() { this.handler.pause(id); }
			proxy.load = function() { this.handler.load(id, proxy.src); }
			proxy.readyState = 4;
			proxy.__defineSetter__("currentTime", function(t) { this.handler.seek(t); });
			proxy.__defineGetter__("currentTime", function() { return this.__currentTime; });
			proxy.__currentTime = 0.0;
			proxy.__defineGetter__("duration", function() { return this.__duration; });
			proxy.__defineGetter__("seekable", function() {  });
			proxy.__duration = -1;

			handler.init(id, {
				timeupdate : function(current, duration) {
					proxy.__currentTime = current;
					proxy.__duration = duration;
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent("timeupdate", true, true);
					proxy.dispatchEvent(evt);
				},
				onEvent : function(e) {
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent(e, true, true);
					proxy.dispatchEvent(evt);
				},
			});

			return proxy;
		};

		// intercept creation of an audio element, patch it with our functions
		document.__oldCreateElement = document.createElement;
		document.createElement = function(el) {
			if (el.toLowerCase() == 'audio') {
				return createAudioElement();
			} else {
				return document.__oldCreateElement(el);
			}
		};


	} // if (native)

	// === end of TC <audio> hack

	var timeMs = function() {
		return (new Date()).getTime();
	}

	var videoPlayingCssLoaded = false;
	// This function is called for each page to initialize it's controls
	var lastScrollTime = timeMs();

	var eventHandlers = {};
	var openedWheel = false;
	var hiddenSelectToSLM;
	var hiddenSelectToSL;
	var doWhilePlaceholdersDropped = function(fn) {
		return fn.apply(this);
	};
	var preprocessTextAreas = FN_EMPTY; 
	
	var coordinates = [];
	var lastTransition = 0;
	var maxMoveX = screen.availWidth/10;
	var maxMoveY = screen.availHeight/10;
	var clickbuster = {
		preventGhostClick: function(x, y) {
			coordinates.push(x, y);
			window.setTimeout(clickbuster.pop, 500);
		},

		/*
		preventGhostClickAfterTransition: function() {
			// lastTransition = timeMs();
		},
		*/

		pop: function() {
			coordinates.splice(0, 2);
		},
		
		needToIgnore: function(eventX, eventY) {
			if (timeMs() - lastTransition < 500) {
				return true;
			}
			
			var ignore = false;
			for (var i = 0; i < coordinates.length; i += 2) {
				var x = coordinates[i];
				var y = coordinates[i + 1];
				if (Math.abs(eventX - x) < maxMoveX && Math.abs(eventY - y) < maxMoveY) {
					ignore = true;
				}
			}

			return ignore;
		}
	};

	// Check whether placeholders are supported for textarea
    if (!('placeholder' in $('<textarea>')[0])) {
    	var add = function() {
            if($(this).val() == ""){
                $(this).val($(this).attr('placeholder')).addClass(m1Design.css('placeholder'));
            }
        }

    	var remove = function() {
            if($(this).val() == $(this).attr('placeholder')){
                $(this).val('').removeClass(m1Design.css('placeholder'));
            }
        }
    	
    	doWhilePlaceholdersDropped = function(fn) {
    		$('textarea[placeholder]').each(remove);
    		var res = fn.apply(this);
    		$('textarea[placeholder]').each(add);
    		return res;
    	};

        preprocessTextAreas = function(context) {
	        // Select the elements that have a placeholder attribute
	        $('textarea[placeholder]', context).blur(add).focus(remove).each(add);
        }
    }

	function preProcess(context) {
		// Perform extra pre-process steps.
		$.each(phoneui._extraPreprocessDOM, function(i, f) {
			f(context);
		});

		// Init forms - catch "Go" button and call phoneui.submitForm instead. Fixes Bug 22806 
		$('.' + m1Design.css("root") + ' form').submit(function(e) {
		    e.preventDefault();  // Prevent form submission
		    phoneui.submitForm(this.name);
		});

		// Pre-process all text area placeholders
		preprocessTextAreas(context);

		// also, process "max length" property
		$("textarea[data-maxlength]").live("keyup blur", function(e) {
			var maxlength = $(this).attr('data-maxlength');
	        var val = $(this).val();

	        // Trim the field if it has content over the maxlength.
	        if (val.length > maxlength) {
	            $(this).val(val.substr(0, maxlength));
	        }
		});
		
		// Init audio players ui
		$(document).ready(function(){
			if (typeof AudioPlayerWidget != "undefined") {
				var initPlayers = function() {
					$("div[data-m1-audio-url]", context).each(function() {
						new AudioPlayerWidget($(this).attr("id"), true);				
					});
					
					// compat layer
					phoneui.activeAudioPlayer = function(widgetId) {
						var player = widgetId  ? AudioPlayerWidget.fromWidget("#" + widgetId) : AudioPlayerWidget.active;
						return {
							jPlayer: function(verb, param1, param2) {
								console.warn("jPlayer API is DEPRECATED and will be removed in future. Please use AudioPlayerWidget and phoneui.createMedia()");
								
								if (verb === "play") {
									player.play();
								} else if (verb === "pause") {
									player.pause();
								} else if (verb === "stop") {
									player.getMedia().stop();
								} else if (verb === "setMedia") {
									player.setMedia(param1.mp3);
								} else {
									throw Error("Illegal command: " + verb);
								} 
							}
						};
					};
					
					if (phoneui.cordovaAvailable() && device.platform === "Android") {
						document.addEventListener("pause", function() {
							AudioPlayerWidget.active.pause();
						}, false);
					}					
				};
				
				if (phoneui.cordovaAvailable()) {
					document.addEventListener("deviceready", function() { initPlayers(); }, false);					
				} else {
					// we don't need to wait in web app
					initPlayers();
				}

				phoneui.addPostPageTransitionHandler(function() {
		    		if (AudioPlayerWidget.active.autostop)
		    			AudioPlayerWidget.active.pause();
		    	});

			} // if AudioPlayerWidget != undefined
		});		

		// Video Players TC hack
		if (window['__tc_native_player']) {
			$("div[m1-video-player]").each(function() {
				var a = $(this).children("a")[0];
				if (a.onclick) {
					a.onclick = function() {
						var loadHTML = function() {
							videoPlayingCssLoaded = true;
							$.ajax({
								dataType: 'text',
								url: "CEBC3B9D-950E-4C0F-8FB1-BE744BD438B4/jplayer.video.playing.html",
								complete: function(xhr) {
									var el = $(xhr.responseText);
									el.appendTo("body").click(function() {
										el.remove();
									});
								}
							});
						};
						if (videoPlayingCssLoaded) {
							loadHTML();
						} else {
							phoneui.loadCssAsync("CEBC3B9D-950E-4C0F-8FB1-BE744BD438B4/jplayer.video.playing.css", loadHTML);
						}
					};
				}
			});
		}

		// Pre-process toggles and radio buttons
		$('.' + m1Design.css("toggle") + ",."  + m1Design.css("toggle5") + ",."  + m1Design.css("radiobutton"), context).each(function() {
			var $thatRoot = $(this);
			$thatRoot.bind("click", function(e) {
				var $that = $(this);
				if (!clickbuster.needToIgnore(e.clientX, e.clientY)) {
					var inp = $("input", $that)[0];
					if ($thatRoot.is("." + m1Design.css("radiobutton"))) {
						inp.checked = true;
						doClick($thatRoot, event.clientX, event.clientY);
					} else {
						inp.checked = !inp.checked;
					}
					// Prevent host clicks - we've changed the state already 
					clickbuster.preventGhostClick(e.clientX, e.clientY);
	
					// Fire "change" event manually
					var evt = inp.ownerDocument.createEvent('HTMLEvents');
					evt.initEvent('change', true, true);
					inp.dispatchEvent(evt);
				}
			});
		});

		var clickeable = $('.' + m1Design.css("clickable"), context);

		$('.' + m1Design.css("iscroll-scroller"), context).each(function() {
			var el = this;

			if (!('myScroll' in el)) {
				el.myScroll = new iScroll(el.parentElement, {
					hScroll : false,
					vScroll : true,
					hScrollbar : false,
					vScrollbar : true,
					// handleClick: false,
					bounce: $(el).attr('data-bounce') == 'true',
					// desktopCompatibility : true,
					onBeforeScrollStart : function(e) {
						if (e.target.nodeName.toLowerCase() == 'textarea') {
							return true;
						}

						var el = e.target;
						var clname = m1Design.css("iscroll-no-prevent-default");
						for (;el != document.body &&
							!($(el).hasClass(clname) || $(el).is('input'));
							el = el.parentElement) {
						}
						if (el == document.body) {
							e.preventDefault();
						}
					},
					onScrollMove : function(e) {						
						lastScrollTime = timeMs();

						var sx, sy;
						if (event.type === 'touchmove') {
							sx = event.changedTouches[0].clientX;
							sy = event.changedTouches[0].clientY;
						} else {
							sx = event.clientX;
							sy = event.clientY;
						}

						if (el.myScroll.move) {
							clickbuster.preventGhostClick(sx, sy);
						}
					},
					onBeforeScrollMove : function(that, e) {
						clickeable = $('.' + m1Design.css("clickable"), context);

						// Vadim.Ridosh: I can't remove "filter", otherwise bouncing effect is broken.
						clickeable.filter("." + m1Design.css("unclicked")).removeClass(m1Design.css("unclicked"));
						clickeable.filter("." + m1Design.css("clicked")).removeClass(m1Design.css("clicked"));
					}
				});

				// Let old iScroll3 snippets work
				el.myScroll.setPosition = function(x, y) {
					this.scrollTo(x, y, 0);
				}
			}
		});

		var highlightClick = function($that) {
			$that.data('warmupStartTime', 0);
			$that.removeClass(m1Design.css("unclicked")).addClass(m1Design.css("clicked"));
		}

		/**
		 * @return true if event is not processed and should be bubbled, false otherwise
		 */
		var doClick = function($that, sx, sy) {
			var ret = true;

			if (!clickbuster.needToIgnore(sx, sy)) {
				// Instead of firing doclick event just call doclick handler manually
				var actionId = $that.attr('data-action-click-id');
				if (!!actionId) {
					runUserCode(m1Design.actions[actionId], $that, []);
				}
				ret = !actionId;
			}
			
			if (!ret) {
				clickbuster.preventGhostClick(sx, sy);
			}

			return ret;
		}

		function doBind(evName, $elements, attrId, fn) {
			eventHandlers[attrId] = eventHandlers[attrId] || fn;

			$elements.each(function(i, v) {
				var element = $(this);
				if (!element.data("m1-initialized-event-" + evName)) {
					var ex;
					try {
						element.unbind(eventHandlers[attrId]);
					} catch (ex) {
					}
					element.bind(evName, eventHandlers[attrId]);
					element.data("m1-initialized-event-" + evName, true);
				}
			});
		}

		var createEventSunbscription = function(evName, attrId) {
			doBind(evName, $("[" + attrId + "]", context), attrId, function(event) {
				var $that = $(this);
				var actionId = $that.attr(attrId);
				if (actionId) {
					runUserCode(m1Design.actions[actionId], $that, []);
				}
			});
		}

		createEventSunbscription('doclick', 'data-action-click-id');
		createEventSunbscription('click', 'data-action-hard-click-id');
		createEventSunbscription('change', 'data-action-change-id');

		doBind("click", $('.' + m1Design.css("hyperlink") + '.' + m1Design.css("clickable"), context), "hyperlinkClick", function(event) {		
			var href = $(event.target).attr('href');
			if (href) {
				setNewLocation(href);
			}
		});

		// Support for elements that contain links but not clickable
		doBind("click", $('.' + m1Design.css("hyperlink") + ':not(' + '.' + m1Design.css("clickable") + ')', context), "hlinkClickAction", function(event) {
			event.preventDefault();
			event.stopPropagation();

			doClick($(event.target), event.clientX, event.clientY);
		});

		clickeable.each(function(i, v) {
			var $this = $(this);
			
			if (!$this.data('m1-clickeable-initialized')) {
				$this.bind((phoneui._platform.touchevents() ? "touchstart" : "mousedown"), function(event) {
					if (!(event.originalEvent && event.originalEvent.phoneuiprocessed)) {
						var $that = $(this);
	
						if (!$that.data('warmupStartTime') ||
								(lastScrollTime >= + ($that.data('warmupStartTime')))) {
							$that.data('warmupStartTime', timeMs());
							setTimeout(function() {
								if (lastScrollTime <= $that.data('warmupStartTime')) {
									highlightClick($that);
								}
							}, 200);
						}
	
						if (event.originalEvent) {
							event.originalEvent.phoneuiprocessed = true;
						}
					}
				});
	
				$this.bind("click", function(event) {
					return doClick($(this), event.clientX, event.clientY);
				});
	
				$this.bind((phoneui._platform.touchevents() ? "touchcancel touchend" : "mouseleave mouseup"), function(event) {
					var click = event.type == "touchend" || event.type == "mouseup";
					var $that = $(this);
					if (!(event.originalEvent && event.originalEvent.phoneuiprocessed)) {
						if (click && (lastScrollTime <= +($that.data('warmupStartTime')))) {
							highlightClick($that);
						}
	
						if ($that.is("." + m1Design.css("clicked")) && !$that.is("." + m1Design.css("unclicked"))) {
							// special case below - list items with hyperlink will lose selection
							// only when we're returning back to the page
							if (!$that.is("." + m1Design.css("hyperlink-internal")) ||
								$that.is("." + m1Design.css("button"))) {
								unclickme($that);
								if (event.originalEvent) {
									event.originalEvent.phoneuiprocessed = true;
								}
	
								if ($that.is('.' + m1Design.css("selection-list") + ' > li[data-val]')) {
									var elt = $that.closest('ul')[0];
									if($(elt).attr('data-multiple')=='false') {
										$(elt).children('li[data-val]').removeClass(m1Design.css("selected"));
										$that.addClass(m1Design.css("selected"));
									} else {
										if ($that.is("." + m1Design.css("selected"))) {
											$that.removeClass(m1Design.css("selected"));
										} else {
											$that.addClass(m1Design.css("selected"));
										}
									}
									processSelectionList(elt, $that.is('.' + m1Design.css("immediate-change-fire") + ' > li[data-val]'));
								};
							}
	
							if (click) {
								if (!$that.hasClass(m1Design.css("iscroll-no-prevent-default"))) {
									var ret;
									var sx, sy;
									if (event.type === 'touchend') {
										sx = event.originalEvent.changedTouches[0].clientX;
										sy = event.originalEvent.changedTouches[0].clientY;
									} else {
										sx = event.originalEvent.clientX;
										sy = event.originalEvent.clientY;
									}

									return doClick($(event.target), sx, sy);
								}
							}
						}
					}
				});
				
				$this.data('m1-clickeable-initialized', true);
			}
		});

		var moveHiddenInputOverFake = function (el, fakeEl) {
			var off = getElementPosition(fakeEl);

			el.parentElement.style.left = off.left + "px";
			el.parentElement.style.top = off.top + "px";
		};

		hiddenSelectToSL = function(v, context) {		
			var sel = $("#" + $(v).attr("data-hiddenInputId"), context);
			var lis = sel.children('option');
			var li = $(v).children('li');
			for(var i = 0; i < lis.length; i++) {
				var lbl = $(lis[i]);
				$(li[i])
					[lbl.get(0).selected ? 'addClass' : 'removeClass']
						(m1Design.css("selected"));
			}
		};

		// This function takes HTML element (SLM or combo)
		// and subscribes to appropriate events for setting selected label text
		// in "info" label after changing hidden <select> element
		hiddenSelectToSLM = function(v, context) {
			var sel = $("#" + $(v).attr("data-hiddenInputId"), context);
			var verboseItemsInfo = $(v).attr("data-verbose-items-info") == "true";
			var selInfoId = $("#" + $(v).attr("data-selectionInfoId"), context);
			if (selInfoId) {
				var onSelectionChange = function() {
					var labelsArray = [];
					var lis = sel.children('option');
					for(var i = 0; i < lis.length; i++) {
						var lbl = $(lis[i]);
						if (lbl.get(0).selected) {
							labelsArray.push(lbl.text());
						}
					}
					if ($(v).attr('data-multiple')=='false') {
						selInfoId.text(labelsArray[0]);
					} else {
						if (verboseItemsInfo) {
							selInfoId.text(labelsArray.length == 1 ?
									(labelsArray[0]) :
									(labelsArray.length + " Items"));
						} else {
							selInfoId.text("" + labelsArray.length);
						}
					}
				}

				onSelectionChange();
				sel.unbind('change', onSelectionChange).bind('change', onSelectionChange);
				// For iOS4 support, subscribe to blur too
				sel.unbind('blur', onSelectionChange).bind('blur', onSelectionChange);
				moveHiddenInputOverFake($(sel)[0], $(v)[0]);
			}
		};

		$('.' + m1Design.css('select-list-menu-spinner') + "," +
			'.' + m1Design.css('select-list-menu') , context).each(function(i, v) {
				hiddenSelectToSLM(v, context)
			});

		$('input select').bind('focus blur', function() {
			$('.' + m1Design.css('select-list-menu-spinner'), context).each(function(i, v) {
				var sel = $("#" + $(v).attr("data-hiddenInputId"));
				var el = sel.get(0);

				moveHiddenInputOverFake(el, $(v)[0]);
			});
		});

		// Subscribe to "click" event and support for "hardware" and "software" spinners
		$('.' + m1Design.css("select-list-menu-spinner"), context).click(function(e) {
			if (phoneui._platform.nativespinner) {
				var sel = $("#" + $(this).attr("data-hiddenInputId"));
				var el = sel.get(0);

				moveHiddenInputOverFake(el, $(this)[0]);

				var evt = el.ownerDocument.createEvent('MouseEvents');
				evt.initMouseEvent('mousedown', true, true, el.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
				el.dispatchEvent(evt);
			} else if (m1Design.softSpinnerEnabled) {
				var $that = $(this);
				var sel = $("#" + $that.attr("data-hiddenInputId"));
				var multi = $that.attr('data-multiple') != 'false';

				if (openedWheel) {
					// Previous instance was not closed yet, let's
					return;
				}

				openedWheel = true;

				var selectedValues = {};
				var data = [];
				// Update options states

				sel.children('option').each(function(i, e) {
					if (this.selected) {
						selectedValues[i] = true;
					}
					data.push({ value : this.value , text : this.text, index : i });
				});

				if (!multi) {
					selectedValues[sel[0].selectedIndex] = true;
				}

				SpinningWheel.addSlot(data, "", selectedValues);
				SpinningWheel.setCancelAction(function() {
					openedWheel = false;
				    // Hide address bar if needed.
					if (m1Design.shouldHideAddressBar) {
						phoneui._platform.initAddressBarHiding();
					}
				});
				SpinningWheel.setSelectedAction(function(val, tt) {
				});
				SpinningWheel.setDoneAction(function() {
					openedWheel = false;
					var results = SpinningWheel.getSelectedValues();
					sel.children('option').each(function(i, e) {
						for (var j in results.keys[0]) {
							if (i == results.keys[0][j]) {
								this.selected = true;
								return;
							}
						}
						this.selected = false;
					});
					hiddenSelectToSLM($that, context);

					// Fire "change" event
					var evt = document.createEvent("HTMLEvents");
				    evt.initEvent("change", true, true ); // event type, bubbling, cancelable
				    sel[0].dispatchEvent(evt);

				    // Hide address bar if needed.
					if (m1Design.shouldHideAddressBar) {
						phoneui._platform.initAddressBarHiding();
					}

					return;
				});

				SpinningWheel.open(multi);
			}
		});

		// hide spinner on page transition
		if ($('.' + m1Design.css("select-list-menu-spinner")).size() != 0) {

			// mimic conditions in the block above
			if (phoneui._platform.nativespinner) {
				phoneui.addPostPageTransitionHandler(function() {
					document.activeElement.blur();
				});
			} else if (m1Design.softSpinnerEnabled) {
				phoneui.addPostPageTransitionHandler(function() {
					// emulating cancel button press
					if (SpinningWheel.swWrapper) {
						SpinningWheel.cancelAction();
						SpinningWheel.close();
					}
				});
			}
		}

		jQuery.each($('.' + m1Design.css("selection-list")), function(i, v) {
			processSelectionList(v, false);
		});
	}

	preProcess($('.' + m1Design.css("top-root")));

	phoneui.preprocessDOM = function(rootNode) {
		preProcess($(rootNode));
	}

	if ('documentReadyHandler' in phoneui) {
		phoneui.documentReadyHandler();
	}

	function processSelectionList(elt, fireChangedEvent) {
		var selInfoId = $("#" + $(elt).attr("data-selectionInfoId"));
		var labelsArray = [];
		var resultMap = {};
		var lis = $(elt).children('li[data-val]');
		for(var i = 0; i < lis.length; i++) {
			var lbl = $(lis[i]);
			if(lbl.hasClass(m1Design.css("selected"))) {
				resultMap[i] = true;
				if (selInfoId) {
					labelsArray.push(lbl.text());
				}
			}
		}
		var hiddenSel = $("#" + $(elt).attr("data-hiddenInputId"));

		// Update options states
		hiddenSel.children('option').each(function() {
			this.selected = resultMap[this.index];
		});

		if (selInfoId) {
			if ($(elt).attr('data-multiple')=='false') {
				selInfoId.text(labelsArray[0]);
			} else {
				selInfoId.text("" + labelsArray.length);
			}
		}

		if (fireChangedEvent) {
			// Firing "change" event for hidden select
			var e = document.createEvent('HTMLEvents');
	        e.initEvent('change', true, true);
	        hiddenSel[0].dispatchEvent(e);
		}
	}

	function SetCookie(sName, sValue) {
			document.cookie = sName + "=" + escape(sValue);
			var date = new Date();
			var expdate = date.getTime();
			expdate += 3600*1000 //expires (milliseconds - 1000 is for a day)
			date.setTime(expdate);
			document.cookie += ("; expires=" + date.toUTCString());
	}

	function GetCookie(sName) {
			var aCookie = document.cookie.split("; ");
			for (var i=0; i < aCookie.length; i++)
			{
					var aCrumb = aCookie[i].split("=");
					if (sName == aCrumb[0])
							return unescape(aCrumb[1]);
			}
			return null;
	}

	var cname = 'phc';
	var hsp = $('.' + m1Design.css('homescreen-prompt'));
	if(!(phoneui.cordovaAvailable()) &&
			window.navigator.standalone != true &&
			!!window.navigator.userAgent.match(/(iphone|ipod|ipad)( simulator)?;/i)) {
		if(GetCookie(cname)) {
			// Hide the dialog box - to avoid scrolling
			hsp.hide();
		} else {
			// Show prompt dialog
			SetCookie(cname,'true');
			var s = phoneui._platform.docsize();
			var onipad = window.navigator.userAgent.toLowerCase().indexOf('ipad')!=-1;

			if (hsp.length > 0) {
				var canvas = hsp[0];
				var ctx = canvas.getContext("2d");
				var myImage = new Image();
				var top = onipad ? 40 : 30;
				var myIconLoaded = false;
				var myImageLoaded = false;
				myImage.onload = function() {
					myIconLoaded = true;
				};
				var myIcon = new Image();
				myIcon.onload = function() {
					myImageLoaded = true;
				};
				myImage.src = "res/images/homescreenPrompt.png";
				myIcon.src = "res/images/icon.png";

				var startCss = {opacity: '0.0'};
				var endCss = {opacity: '1.0'};
				if (onipad) {
					startCss['top'] = (- 100) + 'px';
					endCss['top'] = '0px';
					// Take into account in iOS > 5 this button is shifted
					hsp.css({ left : (82 + (window.navigator.userAgent.match(/OS [1-4]_\d like Mac OS X/i) ? 0 : -48) ) + 'px'});
				} else {
					startCss['top'] = (s.y - 20) + 'px';
					endCss['top'] = (s.y - 120) + 'px';
					hsp.css({ 'margin-left' : '-125px'});
				}
				hsp.css(startCss);

				var transitionF = function() {
					if (!myImageLoaded || !myIconLoaded) {
						setTimeout(transitionF, 50);
						return;
					}
					ctx.save();
					if (onipad) {
						ctx.translate(0, canvas.height);
					}
					ctx.scale(canvas.width/myImage.width,
							(onipad ? -1 : 1)*canvas.height/myImage.height);
					ctx.drawImage(myImage, 0, 0);
					ctx.restore();
					ctx.font = "16px Helvetica";
					var t = ['Click button to', 'add this page to', 'your homescreen'];
					t.forEach(function (e, i) {
						ctx.fillText(e, 110, top + 10 + i * 20);
					});

					ctx.drawImage(myIcon, 30, top);

					hsp .animate(
						endCss,
						{duration: 400, complete: function() {
							setTimeout(function() { hsp .animate({opacity: '0'}, {
								duration:400,
								complete: function() { hsp .hide(); }
							})}, 5000);
						} });
				};
				setTimeout(transitionF, 0);
			}
		}
	} else {
		hsp .hide();
	}
});

if (m1Design.shouldHideAddressBar) {
	window.addEventListener("load", function() {
		phoneui._platform.initAddressBarHiding();
	}, false);
}

document.addEventListener('DOMContentLoaded', function() {
	document.addEventListener('touchmove', function(e){
		// Vadim.Ridosh: some controls (textarea and input[type=range])
		// need to process touchmove, so we allow them to process it.
		if (e.target.nodeName.toLowerCase() != 'textarea' && 
			!(e.target.nodeName.toLowerCase() == 'input' && 
			  e.target.getAttribute('type').toLowerCase() == 'range')) {
			e.preventDefault();
		}
	});
});


/**
 * Cordova Media API implementation using <audio> HTML5 tag.
 */
(function(parent) {
	var MediaAudioImpl = function(mediaUrl, onEndedHandler, onErrorHandler, onStatusChangeHandler) {
		this._audio = document.createElement("AUDIO");
		this._audio.src = mediaUrl;
		
		var self = this;
		
		// mapping
		
		this.onPlay = function() {
			self.onStatusChange(MediaAudioImpl.MEDIA_STARTING);
		}
		this.onPlaying = function() {
			self.onStatusChange(MediaAudioImpl.MEDIA_RUNNING);
		}
		this.onPause = function() {
			self.onStatusChange(MediaAudioImpl.MEDIA_PAUSED);
		}

		// external 
		
		this.onEnded = function() {
			onEndedHandler && onEndedHandler();
		}
		
		this.onError = function(error) {
			onErrorHandler&& onErrorHandler(error);
		}
		
		this.onStatusChange = function(status) {
			onStatusChangeHandler && onStatusChangeHandler(status);
		}
		
		this.onDurationChange = function() {
			self.onStatusChange(MediaAudioImpl.MEDIA_DURATION_UPDATED);
		}

		this._audio.addEventListener("ended", this.onEnded);
		this._audio.addEventListener("error", this.onError);
		
		this._audio.addEventListener("play", this.onPlay);
		this._audio.addEventListener("playing", this.onPlaying);
		this._audio.addEventListener("pause", this.onPause);
		
		this._audio.addEventListener("durationchange", this.onDurationChange);
	}

	MediaAudioImpl.prototype.play = function() {
		this._audio.play();
	}

	MediaAudioImpl.prototype.pause = function() {
		this._audio.pause();
	}
	
	MediaAudioImpl.prototype.stop = function() {
		// this doesn't work for network streams
		//this.pause();
		//this._audio.currentTime = 0;
		
		var src = this._audio.src;
		this._audio.src = src;
		
		// emulating an event
		var self = this;
		setTimeout(function() {
			self.onStatusChange(MediaAudioImpl.MEDIA_STOPPED);
		}, 0);
	}
	
	MediaAudioImpl.prototype.setVolume = function(vol) {
		this._audio.volume = vol;
	}	

	MediaAudioImpl.prototype.seekTo = function(milliseconds) {
		this._audio.currentTime = milliseconds / 1000;
	}

	MediaAudioImpl.prototype.getDuration = function() {
		return this._audio.duration;
	}

	MediaAudioImpl.prototype.getCurrentPosition = function(succ, err) {	
		succ(this._audio.currentTime);
	}

	MediaAudioImpl.prototype.release = function() {
		this.pause();
		
		this._audio.removeEventListener("ended", this.onEnded);
		this._audio.removeEventListener("error", this.onError);
		
		this._audio.removeEventListener("play", this.onPlay);
		this._audio.removeEventListener("playing", this.onPlaying);
		this._audio.removeEventListener("pause", this.onPause);
		
		this._audio.removeEventListener("durationchange", this.onDurationChange);
		
		this._audio = null;
	}

	// Media states
	MediaAudioImpl.MEDIA_NONE = 0;
	MediaAudioImpl.MEDIA_STARTING = 1;
	MediaAudioImpl.MEDIA_RUNNING = 2;
	MediaAudioImpl.MEDIA_PAUSED = 3;
	MediaAudioImpl.MEDIA_STOPPED = 4;
	MediaAudioImpl.MEDIA_DURATION_UPDATED = 5; // MobiOne Only!
	MediaAudioImpl.MEDIA_MSG = ["None", "Starting", "Running", "Paused", "Stopped", "Duration Updated"];

	// Media messages
	MediaAudioImpl.MEDIA_STATE = 1;
	MediaAudioImpl.MEDIA_DURATION = 2;
	MediaAudioImpl.MEDIA_POSITION = 3;
	MediaAudioImpl.MEDIA_ERROR = 9;

	parent.MediaAudioImpl = MediaAudioImpl;
	
})(phoneui);

/**
 * Note: This API is provisional and might be changed in upcoming releases.
 * 
 * Create Media object (see Cordova Media API scecification) which works both on iOS and Android platforms.
 * 
 * @param {string} [mediaUrl] relative or absolute file/http url to the media.
 * @param {function} [onSuccess] called when audio succesfully played to the end.
 * @param {function} [onError] called in case of any error.
 * @param {function} [onStatus] called on status changed.
 * 
 * @see http://cordova.apache.org/docs/en/2.9.0/cordova_media_media.md.html
 */
phoneui.createMedia = function(mediaUrl, onSuccess, onError, onStatus) {
	if (phoneui.cordovaAvailable() && device.platform === "Android") {
		var qualifyURL = function(url) {
			var a = document.createElement('a');
			a.href = url;
			return a.href;
		}

		mediaUrl = qualifyURL(mediaUrl);
		
		// this is for /android_asset urls, TODO: make sure it works for sdcard
		if (mediaUrl.indexOf("file://") == 0) {
			mediaUrl = decodeURIComponent(mediaUrl.substring(7));
		}
		
		return new Media(mediaUrl, onSuccess, onError, onStatus);
	} else {
		return new phoneui.MediaAudioImpl(mediaUrl, onSuccess, onError, onStatus);
	}
}

/**
 * Translates object ID, jQuery object selector, DOM object or jQuery object into jQuery object.
 */
phoneui.jqeval = function(selectorOrId) {
	return (typeof(selectorOrId) == 'string' && selectorOrId.charAt(0) != '#') ? $("#" + selectorOrId) : $(selectorOrId);
}


/**
 * Page Transition Effects
 */
phoneui.transitions = {
	none : 'NONE',
	fade : 'FADE',
	flipRight : 'FLIP_RIGHT',
	flipLeft : 'FLIP_LEFT',
	slideRight : 'SLIDE_RIGHT',
	slideLeft : 'SLIDE_LEFT',
	slideUp : 'SLIDE_UP',
	slideDown : 'SLIDE_DOWN'
};

/**
 * Display an alert dialog, calls fnContinue when closed. 
 * The styling parameters are only recognized when used in native app. 
 * On mobile web browser the standard blocking javascript alert dialog rendered.
 * On native app the blocking Cordova/PhoneGap alert dialog is rendered.
 * On test center a non-blocking custom dialog is rendered.
 * 
 * @param {string} message  Display text
 * @param {function} [fnContinue]  Callback invoked when dialog is dismissed
 * @param {string} [title]  Dialog title
 * @param {string} [buttonLabel]
 */
phoneui.alert = function(message, fnContinue, title, buttonLabel) {
	if (window['_mobione_dialogs']) {
		_mobione_dialogs.alert(message, fnContinue || function() {});
	} else if (phoneui.cordovaAvailable()) {
		navigator.notification.alert(message, fnContinue || function() {}, title, buttonLabel);
	} else {
		alert(message);
		if (fnContinue) {
			fnContinue();
		}
	}
}

/**
 * Display a confirmation dialog, calls fnContinue when closed. 
 * The styling parameters are only recognized in native app context. 
 * On mobile web browsers the standard blocking javascript confirm dialog rendered.
 * On native app the nonblocking Cordova/PhoneGap confirm dialog is rendered.
 * 
 * @param {string} message Display text
 * @param {function} [fnContinue]  Callback with 1-based index of selected button (1,2,3) or 0 if closed with no selection
 * @param {string} [title] dialog title
 * @param {string} [buttonLabels] comma-separated button labels
 */
phoneui.confirm = function(message, fnContinue, title, buttonLabels) {
	if (phoneui.cordovaAvailable()) {
		navigator.notification.confirm(message, fnContinue, title, buttonLabels);
	} else {
		var res = confirm(message);
		fnContinue(res);
	}
}

/**
 * @deprecated Obsolete, use phoneui.gotoScreen instead 
 */
phoneui.gotoPage;

/**
 * Navigate to page with transition effect
 *
 * @param pageId String
 * @param transition, The phoneui.transitions visual effect
 */
phoneui.gotoScreen;

/**
 * Navigate to page in multipage widget
 * 
 * @param widgetId String
 * @param targetType String, one of
 * 	'SET_PAGE' - next parameter (pageId) is an id of page we're going to switch into
 *  'FIRST' - go to the very first page in the list
 *  'LAST' - go to the very last page in the list
 *  'NEXT_STOP_AT_LAST' - go to the next page in the list, does nothing if last one is already selected
 *  'PREVIOUS_STOP_AT_FIRST' - go to the previous page in the list, does nothing if first one is already selected
 *  'NEXT_CIRCULAR' - go to the next page in the list, or to the first one if last one is already selected
 *  'PREVIOUS_CIRCULAR' - go to the previous page in the list, or to the last one if first one is already selected
 * @param pageId String
 * @param transition, The phoneui.transitions visual effect
 */
phoneui.gotoMultiPagePage;

/**
 * Navigate to previous URL in history
 */
phoneui.back = function() {
	// never remove setTimeout - otherwise TC has a bug with
	// loading images (see BZ ticket 21763)
	setTimeout(function() {
		history.go(-1);
	}, 50);
}

/**
 * Returns page object from passed anchorId (id of root HTML element for the page)
 */
phoneui.getPageByAnchorId = function(anchorId) {
	for (var p in m1Design.pages) {
		var page = m1Design.pages[p];
		if (page.anchor_id == anchorId || (page.anchor_id == ('#' + anchorId))) {
			return page;
		}
	}
	return null;
}

/**
 *  Show a small dialog composed of an animated graphic and an optional text
 *  message. Use this function to indicate to the user that a potentially
 *  long running activity is underway, such as loading resources or waiting for
 *  computation to complete.
 *
 *  @param text option String message to show
 *  @see #hideActivityDialog
 */
phoneui.showActivityDialog = function (text) {
	if (!text && (text != "")) {
		text = "Loading...";
	}

	$('.' + m1Design.css('loading-text')) .html(text);

	if (!phoneui.showActivityDialog.controller) {
		var canvas = $('.' + m1Design.css("loading-spinner"))[0];

		var ctx = canvas.getContext("2d");
		var bars = 12;
		var currOffs = 0;

		var draw = function(ctx, offset) {
			clearFrame(ctx);
			ctx.save();
			ctx.translate(15, 15); // Center coordinates
			for(var i = 0; i<bars; i++){
				var cb = (offset+i) % bars;
				var angle = 2 * Math.PI * cb / bars;

				ctx.save();
				ctx.rotate(angle);

				var op = (1 + i)/bars;
				ctx.fillStyle = "rgba(255, 255, 255, " + op*op*op + ")";
				ctx.fillRect(-1, 3, 2, 6);

				ctx.restore();
			}
			ctx.restore();
		}
		var clearFrame = function() {
			ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
		}
		var nextAnimation = function(){
			currOffs = (currOffs + 1) % bars;
			draw(ctx, currOffs);
		}
		phoneui.showActivityDialog.controller = {
			timer: -1,
			stop: function (){
				clearFrame();
				clearInterval(this.timer);
			},
			start: function (){
				this.timer = setInterval(nextAnimation, 80); // 20 fps
			}
		};
	}
	phoneui.showActivityDialog.controller.start();

	$('.' + m1Design.css('loading')) .show();
}

/**
 *  Terminate the activity dialog and remove it from the display.
 *  This function is a NOP if the activity dialog is not already exposed.
 *
 *  @see #showActivityDialog
 */
phoneui.hideActivityDialog = function () {
	if (phoneui.showActivityDialog.controller) {
		phoneui.showActivityDialog.controller.stop();
	}
	$('.' + m1Design.css('loading')) .hide();
}

/**
 *  Should be called for each new DOM tree to pre-process elements
 *  (f.e. required for lists to have clickable behavior). Can be called
 *  only after document is loaded.
 */
phoneui.preprocessDOM;

/**
 *  Forces page's re-layout (for now required if user changed image's src manually
 */
phoneui.forceLayout;

/**
 * Returns true for standalone pages
 */
phoneui.isStandalone = function() {
	return "standalone" in window.navigator && window.navigator.standalone;
}

phoneui.callPhone;
phoneui.sendSms;
phoneui.showURL;

phoneui._extraPreprocessDOM = [];
/**
 * Array of functions to be called on Screen or MultiPage initialization. They are called always  
 * before page becomes visible, so if you need to do something only once it's up to this function
 * to control it.
 */
phoneui._extraPageInitializers = [];

/**
 *  Current PhoneUI framework version info
 */
phoneui.version = {
	major : 2,
	minor : 5,
	maintenance : 0,
	toString : function() {
		return this.major + "." + this.minor + "." + this.maintenance;
	}
}