	var muchWeatherAPI = "https://api.forecast.io/forecast/47e31406d16becf6b5f9cd7c36157eb2/";
	// So I decided to attempt object oriented javascript
	// Its actually quite interesting, and provided some
	// interesting solutions to concurrency in ajax calls
	// as you'll see later. 
	
	// The variable function serves as the scope that creates
	// the pseudo-class. The function itself serves as the constructor
	var Doge = function (picture) {
		// here I declare private functions and variables
		var currentDoge = 'regular',			// basically weather varible
		lat, lon, time = new Date().getTime(),	// self-referencial names
		suchPicture = picture,					// location off picture (doesnt work for some reason)
		soTemp,									// self-referencial names are nice
		muchDescription = [],					// a list of all the items that pop up
		ready = true,							// to maintain concurrency
		verySuccess = function (position) {		// success function for geoposition
			lat = position.coords.latitude;		// save latitude
			lon = position.coords.longitude;	// save longitude
			ready = true;						// ready for another ajax call
		},
		soFailure = function() {				// failure function
			currentDoge = "cry-doge";			// doge, very disappoint
			tick();								// update the page
			$("#info").text("Location couldn't be found :'(")
		},
		muchWeather = function (data) {					// success function for weather data
			ready = true;								// ready for another ajax call
			currentDoge = data["currently"]["icon"];	// get current weather
			if(currentDoge != "partly-cloudy-day" 		// these 4 corner cases
			&& currentDoge != "partly-cloudy-night"		// are examples of when -day
			&& currentDoge != "clear-day"				// or -night are already on the weather
			&& currentDoge != "clear-night") {			// I use sunset and sunrise time to 
				if(time < data["daily"]["data"][0]["sunriseTime"] 	//determine whether its
				|| time > data["daily"]["data"][0]["sunsetTime"]) {	// day or night
					currentDoge += "-night";						// if its night add a -night
				} else {			
					currentDoge += "-day";							// otherwise add a -day
				}
			}
																// temperature here is in groups
			if(data["currently"]["temperature"] < 0) {			// I use these groups in to better
				soTemp = "below0";								// fit descriptive words from a 
			} else if(data["currently"]["temperature"] < 32) {	// json file I pull later
				soTemp = "0to32";
			} else if(data["currently"]["temperature"] < 45) {	// these categories are actually 
				soTemp = "32to45";								// completely arbitrary, as I made
			} else if(data["currently"]["temperature"] < 60) {	// them up on the fly
				soTemp = "45to60";
			} else if(data["currently"]["temperature"] < 80) {	
				soTemp = "60to80";
			} else {
				soTemp = "above80";
			}
			
			var veryWind = "wow " + Math.floor(data["currently"]["windSpeed"]);
			if( data["currently"]["windBearing"] < 22.5) {			// to try and add some more 
				veryWind += "mph N";								// reall data to the page
			} else if( data["currently"]["windBearing"] < 67.5) {	// I also pull wind information 
				veryWind += "mph NE";								// from the weather API
			} else if( data["currently"]["windBearing"] < 112.5) {	// every cardinal and half-cardinal
				veryWind += "mph E";								// direction (N, NE, E, ect.)
			} else if( data["currently"]["windBearing"] < 157.5) {	// has 45 degrees of accuracy in
				veryWind += "mph SE";								// its direction
			} else if( data["currently"]["windBearing"] < 202.5) {
				veryWind += "mph S";
			} else if( data["currently"]["windBearing"] < 247.5) {
				veryWind += "mph SW";
			} else if( data["currently"]["windBearing"] < 292.5) {
				veryWind += "mph W";
			} else if( data["currently"]["windBearing"] < 337.5) {
				veryWind += "mph NW";
			} else {
				veryWind += "mph N";
			}
			
			// finally, I just packet the information into the page, fixed underneath the doge
			$("#info").html(
				Math.floor(data["currently"]["temperature"]) + "&ordm;F" + "<br/>" + veryWind
			);
			
			tick();
			
		},
		soDescription = function (data) {				// final success function, for my json file
			ready = true;								// he format of the file is explained in the
			var doge = ["much", "very", "so", "such"];	// readme, as well as the logic. Here i just 
			for(var key in data["temp"][soTemp]) {		// loop through and append all of the accepted
				for( var first in doge ) {				// phrases into an array (muchDescription)
					if(data["temp"][soTemp][key].indexOf(doge[first]) == -1) {
						muchDescription.push(doge[first] + " " + key)
					}									// I do this first with temperature
				}										// and then with the weather
			}											// I probably spent too much time 
			for(var key in data["weather"][currentDoge]) { // on the json file, and I'm still
				for( var first in doge ) {				// not satisfied, but oh well
					if(data["weather"][currentDoge][key].indexOf(doge[first]) == -1) {
						muchDescription.push(doge[first] + " " + key)
					}
				}
			}
			muchDescription.push("wow");				// the much needed wow
			window.setInterval(populate,2000);			// populate the page ever 2 seconds
		},
		populate = function() {							// called every 2 seconds to add data to page
			var item = muchDescription[Math.floor(Math.random()*muchDescription.length)]; // pick a random item
			var newItem = $.parseHTML("<div class='item'>" + item + "</div>");	// parse that item as data
			$(newItem).css({			//add random color and positioning
				"color":"rgb("+ Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) + ")",
				"top":  Math.floor( Math.random() * ($('#center').height() - $(newItem).height()        ) ),
				"left": Math.floor( Math.random() * ($('body').width()     - $(newItem).text().length*15 ) )
			});
			window.setTimeout( function() {	// after 6 seonds
				$(newItem).remove();		// remove the item
			}, 6000);
			$('body').append(newItem)		// and the item to the body
		}
		tick = function() { 					// updates the picture and background image
			$(suchPicture).css("background-image", "url('doge/" + currentDoge + ".png')");
			if(currentDoge != "doge-regular" && currentDoge != "cry-doge") {
				$('body').css("background-image", "url('sky-img/" + currentDoge + ".png')");
				$('body').addClass("back");
			} else {
				$('body').removeClass("back");
			}
		};
		tick(); 								// update once at launch
		return {								// returns an object of public functions
			getCurrentDoge: function() {		// simple getters and setters I used for  
				return currentDoge;				// testing, no purpose in deleting them
			},
			setCurrentDoge: function(newDoge) { // simply adding get current doge after get weather 
				currentDoge = newDoge;			// in execute changes the weather words and the 
				tick();							// pictures
			},
			getLocation: function () {			// first real getter function, uses geolocation API
				ready = false;					// to prevent the program from continuing until data
				$("#info").text("Getting Location...");	// is gotten, waiting on locator
				if (navigator.geolocation) {	// calls success if gotten, failure if not
					navigator.geolocation.getCurrentPosition(verySuccess, soFailure);
				} else {						// or if they don't support geolocation
					soFailure();				// call failure function
				} 
			},
			getData: function () {				// ajax call to weather API
				ready = false;					// pretty standard stuff here
				$("#info").text("Getting Weather...");
				$.ajax({
					type: "GET",
					url: muchWeatherAPI + lat + ',' + lon,
					dataType: "jsonp",
					success: muchWeather
					});
			},
			getDescriptions: function() {		// another ajax call to my data
				ready = false;					// again, ready to false, just a
				$.ajax({						// semantic good practice
					type: "GET",
					url: "desc.json",
					dataType: "json",
					success: soDescription
				})
			},
			isReady: function () {				// used to tell when to call next getter
				return ready;
			}
		};
	}
			
	function execute(obj, funcs) {				// this recursive function is used to 
		var ID = window.setInterval( 			// guarantee concurrence  
			function() {						// set an interval function every .3 seconds
				if(obj.isReady() ) {			// to see if the object is ready for the next function
					funcs[0]();					// if it is, call the function and
					funcs.shift();				// shift it out of the array
					window.clearInterval(ID);	// clear the old interval and 
					if(funcs.length != 0) {		// if there are more functions
						execute(obj, funcs);	// recurse
					}
				}
			}, 300
		);
	}
			
	var newDoge = Doge("#center"); 				// construct the class and call all getters
	execute(newDoge, [newDoge.getLocation, newDoge.getData, newDoge.getDescriptions]);