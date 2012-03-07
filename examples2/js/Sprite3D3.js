/*
* Sprite3D.js - v2 (1)
* Visit the internets for documentation, updates and examples.
* https://github.com/boblemarin/Sprite3D.js
* http://minimal.be/lab/Sprite3D
*
* (1) this is a working version of Sprite3D 2.0,
*     it is not yet finished. Please go to the github
*     repo to get the most up-to-date file.
*
* Copyright (c) 2010 boblemarin emeric@minimal.be http://www.minimal.be
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

var Sprite3D = Sprite3D || {
	
	/********* [PUBLIC STATIC] isSupported() ***********/
	isSupported: function(){
		// init if needed
		if ( !this._isInit ) this._init();
		// return support value
		return this._isSupported;
	},
	
	/********* [PUBLIC STATIC] stage() ***********/
	stage: function(element) {
		// init if needed
		if ( !this._isInit ) this._init();
		// tweak or create root element
		var c,s;
		if (element){
			c = element;
			s = element.style;
			if(s.position == "static" ) s.position = "relative";
		} else {
			c = document.createElement("div");
			s = c.style;
			s[this._browserPrefix+"PerspectiveOrigin"] = "0 0";
			s[this._browserPrefix+"TransformOrigin"] = "0 0";
			s.position = "absolute";
			s.top = "50%";
			s.left = "50%";
			s.margin = "0px";
			s.padding = "0px";
			document.body.appendChild(c);
		}
		s[this._browserPrefix+"Perspective"] = "800px";
		s[this._browserPrefix+"Transform"] = "translateZ(0px)";
		s[this._browserPrefix+"TransformStyle"] = "preserve-3d";
		return this.create(c);
	},
	
	/********* [PUBLIC STATIC] create() ***********/
	create: function(element){
		// init Sprite3D if needed
		if ( !this._isInit ) this._init();
		// create or tweak html element
		if ( arguments.length == 0 ) {
			element = document.createElement("div");
			element.style.margin = "0px";
			element.style.padding = "0px";
			element.style.position = "absolute";
		} else if ( element.style.position == "static" ) element.style.position = "relative";
		//FF10 empty DIV fix
		if ( element.localName == "div" && element.innerHTML == "" ) element.innerHTML = "&nbsp;";
		else console.log("not adding content, localname == " + element.localName );
		// prepare for 3D positionning
		element.style[ this._browserPrefix + "TransformStyle" ] = "preserve-3d";
		element.style[ this._transformProperty ] = "translateZ(0px)";
		// extend element with 3D properties
		for(prop in this._props) {
			if (this._props.hasOwnProperty(prop)){
				element[prop] = this._props[prop];
			}
		}
		return element;
	},

	/********* [PRIVATE STATIC] library's global properties ***********/
	_isInit: false,
	_isSupported: false,
	_browserPrefix: "webkit",
	_transformProperty: "webkitTransform",

	/********* [PRIVATE STATIC] _init() ***********/	
	_init: function(){
		var d = document.createElement("div"), 
			prefixes = ["", "webkit", "Moz", "o", "ms" ],
			n = prefixes.length, i;
			
		Sprite3D._isInit = true;
		// check for 3D transforms
		for( i = 0; i < n; i++ ) {
			if ( ( prefixes[i] + "Perspective" ) in d.style ) {
				Sprite3D._transformProperty = prefixes[i] + "Transform";
				Sprite3D._isSupported = true;
				Sprite3D._browserPrefix = prefixes[i];
				if ( i==2 ) Sprite3D._props.update = Sprite3D._props.updateJoin;
				console.log( "Sprite3D found support for 3D transforms using prefix: " + prefixes[i] );
				return true;
			}
		}
		/*
		// check for 2D transforms -- DROP 2D SUPPORT ???
		for( i = 0; i < n; i++ ) {
			if ( ( prefixes[i] + "Transform" ) in d.style ) {
				Sprite3D._transformProperty = prefixes[i] + "Transform";
				Sprite3D._isSupported = true;
				Sprite3D._browserPrefix = prefixes[i];
				//Sprite3D._props.update = Sprite3D._update2D;
				console.log( "Sprite3D found support for 2D transforms using prefix: " + prefixes[i] );
				return false;
			}
		}
		*/
		// no transform support
		console.log( "Sprite3D found no support for 3D CSS transforms.");
		return false;
	},
	
	/********* Sprite3D objects properties ***********/
	_props: {
		
		  /////////////////////////////////////////////
		 //////////// Position / absolute ////////////
		/////////////////////////////////////////////
		x : function(px) {
			if ( arguments.length ) {
				this._string[this._positions[0]] = px - this._ox;
				return this;
			} else {
				return this._string[this._positions[0]] + this._ox;
			}
		},
		y : function(py) {
			if ( arguments.length ) {
				this._string[this._positions[1]] = py - this._oy;
				return this;
			} else {
				return this._string[this._positions[1]] + this._oy;
			}
		},
		z : function(pz) {
			if ( arguments.length ) {
				this._string[this._positions[2]] = pz - this._oz;
				return this;
			} else {
				return this._string[this._positions[2]] + this._oz;
			}
		},
		position : function( px, py, pz) {
			this._string[this._positions[0]] = px - this._ox;
			this._string[this._positions[1]] = py - this._oy;
			if ( arguments.length >= 3 ) this._string[this._positions[2]] = pz - this._oz;
			return this;
		},
		
		  /////////////////////////////////////////////
		 //////////// Position / relative ////////////
		/////////////////////////////////////////////
		move : function(px,py,pz) {
			this._string[this._positions[0]] += px;
			this._string[this._positions[1]] += py;
			if ( arguments.length >= 3 ) this._string[this._positions[2]] += pz;
			return this;
		},
		
		  /////////////////////////////////////////////
		 //////////// Rotation / absolute ////////////
		/////////////////////////////////////////////
		rotationX : function(rx) {
			if ( arguments.length ) {
				this._string[this._positions[3]] = rx;
				return this;
			} else {
				return this._string[this._positions[3]];
			}
		},
		rotationY : function(ry) {
			if ( arguments.length ) {
				this._string[this._positions[4]] = ry;
				return this;
			} else {
				return this._string[this._positions[4]];
			}
		},
		rotationZ : function(rz) {
			if ( arguments.length ) {
				this._string[this._positions[5]] = rz;
				return this;
			} else {
				return this._string[this._positions[5]];
			}
		},
		rotation : function(rx,ry,rz) {
			this._string[this._positions[3]] = rx;
			this._string[this._positions[4]] = ry;
			this._string[this._positions[5]] = rz;
			return this;
		},
		
		  /////////////////////////////////////////////
		 //////////// Rotation / relative ////////////
		/////////////////////////////////////////////
		rotate : function(rx,ry,rz) {
			this._string[this._positions[3]] += rx;
			this._string[this._positions[4]] += ry;
			this._string[this._positions[5]] += rz;
			return this;
		},
		
		  /////////////////////////////////////////////
		 /////////////////   Scale  //////////////////
		/////////////////////////////////////////////
		scaleX : function(sx) {
			if ( arguments.length ) {
				this._string[this._positions[6]] = sx;
				return this;
			} else {
				return this._string[this._positions[6]];
			}
		},
		scaleY : function(sy) {
			if ( arguments.length ) {
				this._string[this._positions[7]] = sy;
				return this;
			} else {
				return this._string[this._positions[7]];
			}
		},
		scaleZ : function(sz) {
			if ( arguments.length ) {
				this._string[this._positions[8]] = sz;
				return this;
			} else {
				return this._string[this._positions[8]];
			}
		},
		scale : function(sx,sy,sz) {
			switch(arguments.length){
				case 0:
					return this._string[this._positions[6]];
				case 1: 
					this._string[this._positions[6]] = sx;
					this._string[this._positions[7]] = sx;
					this._string[this._positions[8]] = sx;
					return this;
				case 2:
					this._string[this._positions[6]] = sx;
					this._string[this._positions[7]] = sy;
					//this._string[this._positions[8]] = 1;
					return this;
				case 3:
					this._string[this._positions[6]] = sx;
					this._string[this._positions[7]] = sy;
					this._string[this._positions[8]] = sz;
					return this;
			}
			return this;
		},
		
		  /////////////////////////////////////////////
		 /////////////////  Origin  //////////////////
		/////////////////////////////////////////////
		origin : function(ox,oy,oz) {
			if (arguments.length<3) oz = 0;
			this._string[this._positions[0]] += this._ox - ox;
			this._string[this._positions[1]] += this._oy - oy;
			this._string[this._positions[2]] += this._oz - oz;
			this._ox = ox;
			this._oy = oy;
			this._oz = oz;
			return this;
		},

		  /////////////////////////////////////////////
		 ////////////  Transform Origin  /////////////
		/////////////////////////////////////////////
		transformOrigin : function(tx,ty) {
			this.style[ Sprite3D._browserPrefix + "TransformOrigin" ] = (Number(tx)?tx+"px":tx) + " " + (Number(ty)?ty+"px":ty);
			return this;
		},
		
		  /////////////////////////////////////////////
		 /////////////////  Update  //////////////////
		/////////////////////////////////////////////	
		updateJoin : function(){
			this.style[Sprite3D._transformProperty] = this._string.join("");
			return this;
		},
		/* // useless
		update2 : function(){
			var n = this._string.length,
				s = "",
				i = 0;
			for(i;i<n;i++){
				s += this._string[i];
			}	
			this.style[Sprite3D._transformProperty] = s;
			return this;
		},*/
		update : function(){
			var s = "";
			this._string.every( function(value){ s += value; return true; } );
			this.style[Sprite3D._transformProperty] = s;
			//console.log("sprite update : " + s );
			return this;
		},

		  /////////////////////////////////////////////
		 ////////////  Helper Functions //////////////
		/////////////////////////////////////////////
	
		//////////// CSS helper function ////////////
		css : function(name, value) {
			switch(arguments.length) {
				case 0:
					return this.style;
				case 1:
					return this.style[name];
				case 2:
					this.style[name] = value;
			}
			return this;
		},
		
		//////////// HTML helper function ////////////
		html : function(value) {
			if (arguments.length){
				this.domElement.innerHTML = value;
				return this;
			}else{
				return this.domElement.innerHTML;
			}
			return this;
		},

		//////////// Spritesheet helper functions ////////////
		tileWidth: 0,
		tileHeight: 0,
		tileSize : function(width, height) {
			this.tileWidth = width;
			this.tileHeight = height;
			return this;
		},
		tilePosition : function(tilePosX, tilePosY) {
			this.style.backgroundPosition = "-" + (tilePosX * this.tileWidth) + "px -" + (tilePosY * this.tileHeight) + "px";
			return this;
		},

		//////////// All-purpose helper function ////////////
		set : function(name, value) {
			this[name] = value;
			return this;
		},



		//////////////////////////////////////////////////////////////////
		// YOU BETTER NOT MESS WITH THE ABOVE VALUES
		//
		//
		_string : [
			"translate3d(", 0, "px,", 0, "px,", 0, "px) ", 
			"rotateX(", 0, "deg) ", 
			"rotateY(", 0, "deg) ", 
			"rotateY(", 0, "deg) ", 
			"scale3d(", 1, ", ", 1, ", ", 1, ") "
		],
		_positions : [
			 1,  3,  5, // x, y, z
			 8, 11, 14, // rotationX, rotationY, rotationZ
			17, 19, 21 // scaleX, scaleY, scaleZ
		],
		_ox : 0,
		_oy : 0,
		_oz : 0,
		//
		//
		//////////////////////////////////////////////////////////////////

	}
};