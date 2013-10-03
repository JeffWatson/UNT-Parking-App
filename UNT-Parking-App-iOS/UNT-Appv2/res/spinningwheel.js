/**
 * 
 * Find more about the Spinning Wheel function at
 * http://cubiq.org/spinning-wheel-on-webkit-for-iphone-ipod-touch/11
 *
 * Copyright (c) 2009 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 1.4 - Last updated: 2009.07.09
 * 
 */

var SpinningWheel = {
	cellHeight: 44,
	friction: 0.003,
	slotData: [],
	multiselect: false,
	platform: null,


	/**
	 *
	 * Event handler
	 *
	 */
	handleEvent: function (e) {
		if (e.type == this.platform.touchstart) {
			this.lockScreen(e);
			if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
				this.tapDown(e);
			} else if (e.currentTarget.id == 'sw-frame') {
				this.scrollStart(e);
			}
		} else if (e.type == this.platform.touchmove) {
			this.lockScreen(e);
			
			if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
				this.tapCancel(e);
			} else if (e.currentTarget.id == 'sw-frame') {
				this.scrollMove(e);
			}
		} else if (e.type == this.platform.touchend) {
			if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
				this.tapUp(e);
			} else if (e.currentTarget.id == 'sw-frame') {
				this.scrollEnd(e);
			}
		} else if (e.type == 'webkitTransitionEnd') {
			if (e.target.id == 'sw-wrapper') {
				this.destroy();
			} else {
				this.backWithinBoundaries(e);
			}
		} else if (e.type == this.platform.onresize) {
			this.onOrientationChange(e);
		} else if (e.type == 'scroll') {
			this.onScroll(e);
		}
	},


	/**
	 *
	 * Global events
	 *
	 */

	onOrientationChange: function (e) {
		window.scrollTo(0, 0);
		this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
		this.calculateSlotsWidth();
	},
	
	onScroll: function (e) {
		this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
	},

	lockScreen: function (e) {
		e.preventDefault();
		e.stopPropagation();
	},


	/**
	 *
	 * Initialization
	 *
	 */

	reset: function () {
		this.slotEl = [];

		this.activeSlot = null;
		
		this.swWrapper = undefined;
		this.swSlotWrapper = undefined;
		this.swSlots = undefined;
		this.swFrame = undefined;
	},

	calculateSlotsWidth: function () {
		var div = this.swSlots.getElementsByTagName('div');
		for (var i = 0; i < div.length; i += 1) {
			this.slotEl[i].slotWidth = div[i].offsetWidth;
		}
	},
	
	create: function () {
		var i, l, out, ul, div;
		
		var touchevents = phoneui._platform.touchevents();
		this.platform = {
			touchstart : touchevents ? 'touchstart' : 'mousedown',
			touchmove : touchevents ? 'touchmove' : 'mousemove',
			touchend : touchevents ? 'touchend' : 'mouseup',
			onresize : touchevents ? 'orientationchange' : 'resize',
			getPos : touchevents ? 
					function(e) { return e.targetTouches[0]; } :
					function(e) { return e; }
		} 

		this.reset();	// Initialize object variables

		// Create the Spinning Wheel main wrapper
		div = document.createElement('div');
		div.id = 'sw-wrapper';
		div.style.top = window.innerHeight + window.pageYOffset + 'px';		// Place the SW down the actual viewing screen
		div.style.webkitTransitionProperty = '-webkit-transform';
		var multiClass = (this.multiselect ? ' class="multi"' : '');
		div.innerHTML = '<div id="sw-header"><div id="sw-cancel">Cancel</' + 
			'div><div id="sw-done">Done</div></' + 
			'div><div id="sw-slots-wrapper"><div id="sw-slots" ' + multiClass + 
			'></' + 'div></' + 'div><div id="sw-frame"' + 
			multiClass + '></' + 'div>';

		document.body.appendChild(div);

		this.swWrapper = div;													// The SW wrapper
		this.swSlotWrapper = document.getElementById('sw-slots-wrapper');		// Slots visible area
		this.swSlots = document.getElementById('sw-slots');						// Pseudo table element (inner wrapper)
		this.swFrame = document.getElementById('sw-frame');						// The scrolling controller

		// Create HTML slot elements
		for (l = 0; l < this.slotData.length; l += 1) {
			// Create the slot
			ul = document.createElement('ul');
			this.ul = ul;
			out = '';
			for (i in this.slotData[l].values) {
				out += '<li value="' + i + '">' + this.slotData[l].values[i].text + '<' + '/li>';
			}
			ul.innerHTML = out;

			div = document.createElement('div');		// Create slot container
			div.className = this.slotData[l].style;		// Add styles to the container
			div.appendChild(ul);
	
			// Append the slot to the wrapper
			this.swSlots.appendChild(div);
			
			ul.slotPosition = l;			// Save the slot position inside the wrapper
			ul.slotYPosition = 0;
			ul.slotWidth = 0;
			ul.slotMaxScroll = this.swSlotWrapper.clientHeight - ul.clientHeight - 86;
			ul.style.webkitTransitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)';		// Add default transition
			
			this.slotEl.push(ul);			// Save the slot for later use
			
			this.updateSelectedState(l);

			// Place the slot to its default position (if other than 0)
			if (!this.multiselect) {
				var sv = this.slotData[l].selectedValues;
				for (var v in sv) {
					this.scrollToValue(l, v, "0ms");
					break; 
				}
			} else {
				var sv = this.slotData[l].values;
				for (var v in sv) {
					this.scrollToValue(l, v, "0ms");
					break; 
				}
			}
		}
		
		this.calculateSlotsWidth();
		
		// Global events
		document.addEventListener(this.platform.touchstart, this, false);			// Prevent page scrolling
		document.addEventListener(this.platform.touchmove, this, false);			// Prevent page scrolling
		window.addEventListener(this.platform.onresize, this, true);		// Optimize SW on orientation change
		window.addEventListener('scroll', this, true);				// Reposition SW on page scroll

		// Cancel/Done buttons events
		document.getElementById('sw-cancel').addEventListener(this.platform.touchstart, this, false);
		document.getElementById('sw-done').addEventListener(this.platform.touchstart, this, false);

		// Add scrolling to the slots
		this.swFrame.addEventListener(this.platform.touchstart, this, false);
	},

	updateSelectedState: function (l) {
		var ul = this.slotEl[l];
		for (var i=0; i<ul.childNodes.length; i++){
			var el = ul.childNodes[i];
			var valueIndex = el.attributes.getNamedItem('value').value;
			var clName = '';
			if (this.multiselect && this.slotData[l].selectedValues[valueIndex]) {
				clName +='sw-checked ';
			}
			if (!('index' in this.slotData[l].values[valueIndex])) {
				clName +='sw-optgroup';
			}
			
			el.className = clName; 
		}	
	},
	
	open: function (multiselect) {
		this.multiselect = multiselect;
		this.create();
		this.swWrapper.style.webkitTransitionTimingFunction = 'ease-out';
		this.swWrapper.style.webkitTransitionDuration = '400ms';
		this.swWrapper.style.webkitTransform = 'translate3d(0, -260px, 0)';
	},
	
	/**
	 *
	 * Unload
	 *
	 */

	destroy: function () {
		this.swWrapper.removeEventListener('webkitTransitionEnd', this, false);

		this.swFrame.removeEventListener(this.platform.touchstart, this, false);

		document.getElementById('sw-cancel').removeEventListener(this.platform.touchstart, this, false);
		document.getElementById('sw-done').removeEventListener(this.platform.touchstart, this, false);

		document.removeEventListener(this.platform.touchstart, this, false);
		document.removeEventListener(this.platform.touchmove, this, false);
		window.removeEventListener(this.platform.onresize, this, true);
		window.removeEventListener('scroll', this, true);
		
		this.slotData = [];
		this.cancelAction = function () {
			return false;
		};
		
		this.cancelDone = function () {
			return true;
		};
		
		this.reset();
		
		document.body.removeChild(document.getElementById('sw-wrapper'));
	},
	
	close: function () {
		this.swWrapper.style.webkitTransitionTimingFunction = 'ease-in';
		this.swWrapper.style.webkitTransitionDuration = '400ms';
		this.swWrapper.style.webkitTransform = 'translate3d(0, 0, 0)';
		
		this.swWrapper.addEventListener('webkitTransitionEnd', this, false);
	},


	/**
	 *
	 * Generic methods
	 *
	 */

	addSlot: function (values, style, selection) {
		if (!style) {
			style = '';
		}
		
		style = style.split(' ');

		for (var i = 0; i < style.length; i += 1) {
			style[i] = 'sw-' + style[i];
		}
		
		style = style.join(' ');

		var obj = { 
				'values': values, 
				'style': style,
				'selectedValues' : {}, 
		};
		
		for (var s in selection) {
			obj.selectedValues[s] = selection[s];
			// console.log("X:", s);
		}

		this.slotData.push(obj);
	},

	onclick: function () {	
		var slot = this.slotEl[this.activeSlot];

		// Calculate index of element the user has clicked
		var yoff = this.startY - this.ul.getBoundingClientRect().top;
		var ind = Math.floor(yoff / this.cellHeight);

		if (slot.childNodes.length > ind && ind >= 0 && 
				('index' in this.slotData[this.activeSlot].values[ind])) {			
			var value = slot.childNodes[ind].attributes.getNamedItem('value').value;
	
			if (!this.multiselect) {
				this.slotData[this.activeSlot].selectedValues = {};
			}

			var selectedValues = this.slotData[this.activeSlot].selectedValues; 
			selectedValues[value] = !(selectedValues[value]);
			this.selectedAction(value, selectedValues[value]);

			this.updateSelectedState(this.activeSlot);
			this.scrollToValue(this.activeSlot, value);
		}
	},

	getSelectedValues: function () {
		var keys = [], values = [];
		var index, count,
		    i, l;
	
		for (i in this.slotEl) {
			// Remove any residual animation
			this.slotEl[i].removeEventListener('webkitTransitionEnd', this, false);
			this.slotEl[i].style.webkitTransitionDuration = '0';

			if (!this.multiselect) {
				if (this.slotEl[i].slotYPosition > 0) {
					this.setPosition(i, 0);
				} else if (this.slotEl[i].slotYPosition < this.slotEl[i].slotMaxScroll) {
					this.setPosition(i, this.slotEl[i].slotMaxScroll);
				}
	
				index = -Math.round(this.slotEl[i].slotYPosition / this.cellHeight);
	
				count = 0;
				for (l in this.slotData[i].values) {
					if (count == index) {
						keys.push([ l ]);
						break;
					}
					
					count += 1;
				}
			} else {
				var slkeys = [];
				for (l in this.slotData[i].selectedValues) {
					if (this.slotData[i].selectedValues[l]) {
						slkeys.push(l);					
					}
				}
				keys.push(slkeys);
			}
		}
	
		return { 'keys': keys };
	},


	/**
	 *
	 * Rolling slots
	 *
	 */

	setPosition: function (slot, pos) {
		this.slotEl[slot].slotYPosition = pos;
		this.slotEl[slot].style.webkitTransform = 'translate3d(0, ' + pos + 'px, 0)';
	},
	
	scrollStart: function (e) {
		// Find the clicked slot
		var xPos = this.platform.getPos(e).clientX - this.swSlots.offsetLeft;	// Clicked position minus left offset (should be 11px)

		// Find tapped slot
		var slot = 0;
		for (var i = 0; i < this.slotEl.length; i += 1) {
			slot += this.slotEl[i].slotWidth;
			
			if (xPos < slot) {
				this.activeSlot = i;
				break;
			}
		}

		// If slot is readonly do nothing
		if (this.slotData[this.activeSlot].style.match('readonly')) {
			this.swFrame.removeEventListener(this.platform.touchmove, this, false);
			this.swFrame.removeEventListener(this.platform.touchend, this, false);
			return false;
		}

		this.slotEl[this.activeSlot].removeEventListener('webkitTransitionEnd', this, false);	// Remove transition event (if any)
		this.slotEl[this.activeSlot].style.webkitTransitionDuration = '0';		// Remove any residual transition
		
		// Stop and hold slot position
		var theTransform = window.getComputedStyle(this.slotEl[this.activeSlot]).webkitTransform;
		theTransform = new WebKitCSSMatrix(theTransform).m42;
		if (theTransform != this.slotEl[this.activeSlot].slotYPosition) {
			this.setPosition(this.activeSlot, theTransform);
		}
		
		this.startY = this.platform.getPos(e).clientY;
		this.wasMoved = false;
		this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
		this.scrollStartTime = e.timeStamp;

		this.swFrame.addEventListener(this.platform.touchmove, this, false);
		this.swFrame.addEventListener(this.platform.touchend, this, false);
		
		return true;
	},

	scrollMove: function (e) {
		var topDelta = this.platform.getPos(e).clientY - this.startY;
		
		if (topDelta > 0) {
			this.wasMoved = true;
		}

		if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
			topDelta /= 2;
		}
		
		this.setPosition(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition + topDelta);
		this.startY = this.platform.getPos(e).clientY;

		// Prevent slingshot effect
		if (e.timeStamp - this.scrollStartTime > 80) {
			this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
			this.scrollStartTime = e.timeStamp;
		}
	},
	
	scrollEnd: function (e) {		
		this.swFrame.removeEventListener(this.platform.touchmove, this, false);
		this.swFrame.removeEventListener(this.platform.touchend, this, false);

		// If we are outside of the boundaries, let's go back to the sheepfold
		if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
			this.scrollTo(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition > 0 ? 0 : this.slotEl[this.activeSlot].slotMaxScroll);

			return false;
		}

		// Lame formula to calculate a fake deceleration
		var scrollDistance = this.slotEl[this.activeSlot].slotYPosition - this.scrollStartY;
		
		// The drag session was too short
		if (scrollDistance < this.cellHeight / 1.5 && scrollDistance > -this.cellHeight / 1.5) {
			if (this.slotEl[this.activeSlot].slotYPosition % this.cellHeight) {
				this.scrollTo(this.activeSlot, Math.round(this.slotEl[this.activeSlot].slotYPosition / this.cellHeight) * this.cellHeight, '100ms');
			}
			if (scrollDistance == 0 && !this.wasMoved) {
				this.onclick();
			}

			return false;
		}

		var scrollDuration = e.timeStamp - this.scrollStartTime;

		var newDuration = (2 * scrollDistance / scrollDuration) / this.friction;
		var newScrollDistance = (this.friction / 2) * (newDuration * newDuration);
		
		if (newDuration < 0) {
			newDuration = -newDuration;
			newScrollDistance = -newScrollDistance;
		}

		var newPosition = this.slotEl[this.activeSlot].slotYPosition + newScrollDistance;

		if (newPosition > 0) {
			// Prevent the slot to be dragged outside the visible area (top margin)
			newPosition /= 2;
			newDuration /= 3;

			if (newPosition > this.swSlotWrapper.clientHeight / 4) {
				newPosition = this.swSlotWrapper.clientHeight / 4;
			}
		} else if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
			// Prevent the slot to be dragged outside the visible area (bottom margin)
			newPosition = (newPosition - this.slotEl[this.activeSlot].slotMaxScroll) / 2 + this.slotEl[this.activeSlot].slotMaxScroll;
			newDuration /= 3;
			
			if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4) {
				newPosition = this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4;
			}
		} else {
			newPosition = Math.round(newPosition / this.cellHeight) * this.cellHeight;
		}

		this.scrollTo(this.activeSlot, Math.round(newPosition), Math.round(newDuration) + 'ms');
 
		return true;
	},

	scrollTo: function (slotNum, dest, runtime) {
		this.slotEl[slotNum].style.webkitTransitionDuration = runtime ? runtime : '100ms';
		this.setPosition(slotNum, dest ? dest : 0);

		// If we are outside of the boundaries go back to the sheepfold
		if (this.slotEl[slotNum].slotYPosition > 0 || this.slotEl[slotNum].slotYPosition < this.slotEl[slotNum].slotMaxScroll) {
			this.slotEl[slotNum].addEventListener('webkitTransitionEnd', this, false);
		}
	},
	
	scrollToValue: function (slot, value, runtime) {
		var yPos, count, i;

		this.slotEl[slot].removeEventListener('webkitTransitionEnd', this, false);

		count = 0;
		for (i in this.slotData[slot].values) {
			if (i == value) {
				yPos = count * this.cellHeight;
				this.slotEl[slot].style.webkitTransitionDuration = runtime ? runtime : '200ms';
				this.setPosition(slot, yPos);
				break;
			}
			
			count -= 1;
		}
	},
	
	backWithinBoundaries: function (e) {
		e.target.removeEventListener('webkitTransitionEnd', this, false);

		this.scrollTo(e.target.slotPosition, e.target.slotYPosition > 0 ? 0 : e.target.slotMaxScroll, '150ms');
		return false;
	},


	/**
	 *
	 * Buttons
	 *
	 */

	tapDown: function (e) {
		e.currentTarget.addEventListener(this.platform.touchmove, this, false);
		e.currentTarget.addEventListener(this.platform.touchend, this, false);
		e.currentTarget.className = 'sw-pressed';
	},

	tapCancel: function (e) {
		e.currentTarget.removeEventListener(this.platform.touchmove, this, false);
		e.currentTarget.removeEventListener(this.platform.touchend, this, false);
		e.currentTarget.className = '';
	},
	
	tapUp: function (e) {
		this.tapCancel(e);

		if (e.currentTarget.id == 'sw-cancel') {
			this.cancelAction();
		} else {
			this.doneAction();
		}
		
		this.close();
	},

	setSelectedAction: function (action) {
		this.selectedAction = action;
	},
	
	selectedAction: function () {
	},

	setCancelAction: function (action) {
		this.cancelAction = action;
	},

	setDoneAction: function (action) {
		this.doneAction = action;
	},
	
	cancelAction: function () {
		return false;
	},

	cancelDone: function () {
		return true;
	}
};