// multi-depth inundation module

function init() {

	setTimeout(function() {
			
		window.hand = readTextFile(input.HAND_path);
		window.parents = readTextFile(input.parent_path);
		window.area = readTextFile(input.area_path);
		//console.log('check input: ', hand.length);
		
	}, 3000);

	window.markersArray=[];

	window.map1, window.map2;
	window.mapCenter = {lat: (input.LowerLeft.lat+input.UpperRight
		.lat)/2, lng: (input.LowerLeft.lng+input.UpperRight.lng)/2};
	map1 = new google.maps.Map(document.getElementById('map1'), {
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		zoom: 10,
		disableDoubleClickZoom: true,
		streetViewControl: false,
		fullscreenControl: false,
		scaleControl: true,
		zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER,
    },
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		center: mapCenter,
		styles: [
				  {
				    "featureType": "administrative",
				    "elementType": "geometry",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "administrative.land_parcel",
				    "elementType": "labels",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "poi",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "poi",
				    "elementType": "labels.text",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "road",
				    "elementType": "labels.icon",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "road.local",
				    "elementType": "labels",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "transit",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  }
		]
	});

	map2 = new google.maps.Map(document.getElementById('map2'), {
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		zoom: 10,
		disableDoubleClickZoom: true,
		streetViewControl: false,
		fullscreenControl: false,
		scaleControl: true,
		zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER,
    },
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		center: mapCenter,
		styles: [
				  {
				    "featureType": "administrative",
				    "elementType": "geometry",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "administrative.land_parcel",
				    "elementType": "labels",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "poi",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "poi",
				    "elementType": "labels.text",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "road",
				    "elementType": "labels.icon",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "road.local",
				    "elementType": "labels",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "transit",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  }
		]
	});

	var uy = input.UpperRight.lat.toFixed(3)*1;
	var rx = input.UpperRight.lng.toFixed(3)*1;
	var ly = input.LowerLeft.lat.toFixed(3)*1;
	var lx = input.LowerLeft.lng.toFixed(3)*1;
	window.bounds = {north: uy, south: ly, east: rx, west: lx};

	var imgurl = 'img/DEM.png';
	var imgcache = new Image();
	var proxyimg = 'inc_proxy.php?mimetype=image/png&url='+encodeURIComponent(imgurl);
	imgcache.src = proxyimg;

	window.mapoverlay = new google.maps.GroundOverlay(proxyimg, bounds);
    mapoverlay.setMap(map1);
    mapoverlay.vis = true;

    input.markerPos.forEach(item => addMarker(item, map1, true));
    input.markerPos.forEach(item => addMarker(item, map2));

    window.scope = new google.maps.Rectangle({
      bounds: bounds,
      strokeColor: '#000',
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: '#008',
      fillOpacity: 0.3
    });
    scope.setMap(map2);
    scope.vis = true;

	document.getElementById("drarea1").innerHTML = 'Default depth is: '+input.defaultDepth.toString()+' ft';

	window.floodoverlay = null;
	window.floodURL = null;
	window.floodoverlay_ds = null;

}


function toggle_box() {
	document.getElementById('gaugeNote').style.visibility='hidden';
}


function addMarker(latlng, map ,flag=false) {

	const ima = {
		url: 'img/stream_gauge.png',
		scaledSize: new google.maps.Size(14, 18),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(7, 9),
	};

	const shape = {
		coords: [1,1, 1,17, 13,17, 13,1],
		type: "poly",
	};

	let marker = new google.maps.Marker({
		map:map,
		position:latlng,
		shape:shape,
		icon:ima,
	});


	markersArray.push(marker);

	if (flag) {

		google.maps.event.addListener(marker, "click", function(e) {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {marker.setAnimation(null);}, 1200);

			document.getElementById("userDepth").innerHTML = (input.markerDepth[markersArray.indexOf(marker)]).toString()+' ft';
			document.getElementById("gaugeNote").style.visibility = "visible";
		
		});
	}
}


function setCanvas(depth) {
	var myCanvas=document.createElement("canvas");
	var myCanvasContext=myCanvas.getContext("2d");

	var imgWidth=input.width;
	var imgHeight=input.height;
	myCanvas.width = imgWidth;
	myCanvas.height = imgHeight;
	var ctx = myCanvas.getContext('2d');
	var imgData=ctx.getImageData(0,0, imgWidth, imgHeight);
	
	var z = 0;
	for (var i = 0; i < imgData.data.length; i+=4) {
		if (depth[z] > 0) {
			imgData.data[i] = 16;
	        imgData.data[i + 1] = 193;
	        imgData.data[i + 2] = 117;
	        imgData.data[i + 3] = 255;			
		} else {
			imgData.data[i + 3] = 0;
		}
		z++;
	}

    ctx.putImageData(imgData, 0, 0);
	return myCanvas.toDataURL();
}


function download(filename, content) {

	var text, fileName;

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
	element.setAttribute('download', filename+'.asc');
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}


// Reading input from text files
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText, textSplit, text2num;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                textSplit = allText.split(" ");
                text2num = textSplit.map(Number);

            }
        }
    }
    rawFile.send(null);
    return text2num;
}



// Below are the functional components of the multi-depth module
function multiplyVector(a,b){
    return a.map((e,i) => e * b[i]);
}

// Calculate the angular distance between two points on the Earth's surface
function HaversineDistance(longitude1, latitude1, longitude2, latitude2) {
	var R = 6371000;
	var theta1 = latitude1 * Math.PI/180, theta2, deltaTheta, deltaLambda, a, c, d;
	theta2 = latitude2 * Math.PI/180;
	deltaTheta = (latitude2 - latitude1) * Math.PI/180;
	deltaLambda = (longitude2 - longitude1) * Math.PI/180;
	a = Math.sin(deltaTheta/2) * Math.sin(deltaTheta/2) + Math.cos(theta1) * Math.cos(theta2) * Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
	c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	d = R * c;                  // d is in meter

	return d;
}


// Get the corrseponding x, y dimensions of any points using its location measured in 1D array
function get2d (d1,m) {
    var d2 = [Math.floor(d1/m), (d1 % m)];
    return d2;
}


// Dye upstream pixels using the color (the accumulation area value) of their drainage point
function dye(w,h,currentPosition,currentArea) {

    var color = new Int32Array(w * h);
    function dyepixel(x, y, col) {
        var pos = x * w + y;
        if (gaugeCheck[pos]) return gaugeArea[pos];
        gaugeArea[pos]++;
        if (color[pos] === 0) {
        	color[pos] = col;
        } else if (color[pos] >= col) {
        	color[pos] = col;
        }

        for (var i = 0; i < parents[pos*8]; i++) {              
            var p = parents[pos*8 + i + 1];
            var d2 = get2d(p,w);
            var newx = d2[0];
            var newy = d2[1];
            gaugeArea[pos] += dyepixel(newx, newy, col);
        }
        gaugeCheck[pos] = 1;

        return gaugeArea[pos];
    }

    for (var it = 0; it < currentPosition.length; it++) {
    	var d3 = get2d(currentPosition[it], w);
    	var x1 = d3[0];
    	var y1 = d3[1];
    	gaugeCheck = new Int8Array(w * h);
        gaugeArea = new Int32Array(w * h);
    	dyepixel(x1, y1, currentArea[it]);
    }
            
    return color;
}


// Compute depth matrix
function generateDepth(waterDepth) {

	var depth = new Array(input.width*input.height).fill(0);

	for (var i = 0; i < input.width*input.height; i ++) {
 
        if (hand[i] < waterDepth) depth[i] = waterDepth- hand[i];

	}

	return depth;
}


// Multi-depth function based on different depth calculation mode
function flood_mapping(depthMode) {
	if (!depthMode) {
		depthMode = document.getElementById("depth").value;
	}
	
	if (floodoverlay != null && depthMode != 'Ds') {
		floodoverlay.setMap(null);
	}

	if (floodoverlay_ds != null && depthMode == 'Ds') {
		floodoverlay_ds.setMap(null);
	}

	var depth = new Array(hand.length).fill(0);
	if (depthMode == 'Ds') {
		depth = generateDepth(input.defaultDepth);
	} else {

    	var dx = (input.UpperRight.lng - input.LowerLeft.lng)/input.width;
    	var dy = (input.UpperRight.lat - input.LowerLeft.lat)/input.height;
    	var maxDistance = HaversineDistance(input.LowerLeft.lng, input.LowerLeft.lat, input.UpperRight.lng, input.UpperRight.lat);                //  The distance of the two diagonal points of the map
		var currentArea = new Array(input.markerDepth.length).fill(0);
		var currentLength = new Array(input.markerDepth.length).fill(0);
		var currentDistance = new Array(input.markerDepth.length).fill(maxDistance);
		var currentPosition = new Int32Array(input.markerDepth.length);	


		for (var i = 0; i < hand.length; i++) {
			if (!hand[i]) {         //  Check main stream points only
				var currentLon = input.LowerLeft.lng + (i % input.width) * dx;
				var currentLat = input.LowerLeft.lat + (input.height - Math.floor(i/input.width)) * dy;        // Original point is the lowerleft
				for (var j = 0; j < currentLength.length; j++) {
					if (area[i] > currentArea[j]) {
						var distance = HaversineDistance(currentLon, currentLat, input.markerPos[j].lng, input.markerPos[j].lat);

						if (distance <= currentDistance[j] && Math.floor(Math.abs(currentLat-input.markerPos[j].lat)/dy) + Math.floor(Math.abs(currentLon-input.markerPos[j].lng)/dx) <= input.distanceShiftingThreshold) {		
							currentDistance[j] = distance;
							currentArea[j] = area[i];
							currentPosition[j] = i;   
						}
					}
				}
			}
		}

		var color = dye(input.width,input.height,currentPosition,currentArea);
		var colorcount = new Array(input.markerDepth.length).fill(0);
		for (var i = 0; i < color.length; i++) {
			if (color[i] !== 0) {
				colorcount[currentArea.indexOf(color[i])]++;
				if (!hand[i]) {
					currentLength[currentArea.indexOf(color[i])]++;
				}
			}
		}	

		var lastPart;
		if (depthMode == 'Da') {
			if (input.markerDrainageArea != null) colorcount = input.markerDrainageArea;   // Overwrite the area array if provided
			lastPart = 'custom area is: '+'<br>'+colorcount+' (x625 m<sup>2</sup>)<br>'+'custom depth is: '+'<br>'+ ((multiplyVector(colorcount, input.markerDepth).reduce((a,b) => a+b, 0))/colorcount.reduce((a,b) => a+b, 0)).toFixed(2)+' ft';
			//console.log('custom area is: ', colorcount, 'custom area is: ', (multiplyVector(colorcount, input.markerDepth).reduce((a,b) => a+b, 0))/colorcount.reduce((a,b) => a+b, 0));
			depth = generateDepth(multiplyVector(colorcount, input.markerDepth).reduce((a,b) => a+b, 0)/colorcount.reduce((a,b) => a+b, 0));

		} else if (depthMode == 'Dl') {
			if (input.markerStreamLength != null) currentLength = input.markerStreamLength;    // Overwrite the stream length array if provided
			lastPart = 'custom length is: '+'<br>'+currentLength+' (x25 m)<br>'+'custom depth is: '+'<br>'+ ((multiplyVector(currentLength, input.markerDepth).reduce((a,b) => a+b, 0))/currentLength.reduce((a,b) => a+b, 0)).toFixed(2)+' ft';
			//console.log('custom length is: ', currentLength, 'weight depth is: ', (multiplyVector(currentLength, input.markerDepth).reduce((a,b) => a+b, 0))/currentLength.reduce((a,b) => a+b, 0));
			depth = generateDepth(multiplyVector(currentLength, input.markerDepth).reduce((a,b) => a+b, 0)/currentLength.reduce((a,b) => a+b, 0));
		} else if (depthMode == 'Dlocal') {
			lastPart = 'depth array is: '+'<br>'+input.markerDepth+' (ft)';
			for (var z = 0; z < color.length; z++) {


				if (color[z] !== 0) {
					depth[z] = Math.max((input.markerDepth[currentArea.indexOf(color[z])] - hand[z]), 0);
				} else if(hand[z] < input.defaultDepth) {				
					depth[z] = (input.defaultDepth - hand[z]);
				} 

			}
		}
		document.getElementById("innerText2").style.visibility = "visible";	
		document.getElementById("depthLabel").innerHTML = 'Depth mode: '+depthMode+'<br>'+lastPart;		
		
	}

	floodURL = setCanvas(depth);

	if (depthMode==='Ds') {
		if (mapoverlay.vis) {
			mapoverlay.setMap(null);
			mapoverlay.vis = false;
		} 
		floodoverlay_ds = new google.maps.GroundOverlay(floodURL, bounds);
		floodoverlay_ds.setMap(map1);
	} else {
		if (scope.vis) {
			scope.setMap(null);
			scope.vis = false;	
		}
		floodoverlay = new google.maps.GroundOverlay(floodURL, bounds);
		floodoverlay.setMap(map2); 
	}

	//console.log('depth length check: ', depth.length);

	/* Enable the following codes to download depth matrix */
	// var header ="ncols "+input.width+"\n"+"nrows "+input.height+"\n"+"xllcorner "+input.LowerLeft.lng+"\n"+"yllcorner "+input.LowerLeft.lat+"\n"+"cellsize "+input.resolution+"\n"+"nodata_value -32768"+"\n";
	// var text = header+depth.join(" ");
	// var fileName = "depth_"+depthMode;
	// download(fileName, text); 

	//return depth;

}
