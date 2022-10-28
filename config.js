// variables testing
var input = {

	// These are the coordinates of the two corners of the study area
	'LowerLeft': {lat: 41.658024, lng: -91.431656},
	'UpperRight': {lat: 41.888554, lng: -91.139201},

	// This is the resolution of raster files
	'resolution': 25,

	// This is the position of those points where custom water depths are assigned
	'markerPos': [{lat: 41.775333492297925, lng: -91.17564154973843},
				  {lat: 41.70666752012138, lng: -91.19582828838108},
				  {lat: 41.69826394076581, lng: -91.14656240673482},
				  {lat: 41.78020689158433, lng: -91.30766414993342},
				  {lat: 41.813992298462644, lng: -91.3808149845309}],

	// This is the depths assigned to the above points
	'markerDepth': [10, 50, 15, 20, 25],

	// The upstream area each local custom pixel controlled, should have a same dimension 
	// as the markerDepth array.
	// If not provided, the module will compute one based on D8 flow direction.
	'markerDrainageArea': null,

	// The total stream length each local custom pixel controlled, should have a same dimension 
	// as the markerDepth array.	
	// If not provided, the module will compute one based on D8 flow direction.
	'markerStreamLength': null,

	// This is the default depth for all pixels not drained by any custom locations
	'defaultDepth': 2,

	// These two are the dimentions of the study area measured by pixel numbers
	'width': 1000,
	'height': 1000,

	// This is used in cases where the custom point may not exactly overlap with a
	// drainage pixel. The threshold four is used to find the nearest drainage pixel that
	// is no more than 4 pixels away from the custom location. Set it to a small number
	// if you feel confident that those two locations will overlap, otherwise, increase it 
	'distanceShiftingThreshold': 2,


	'HAND_path': 'files/HAND.txt',   // The HAND matrix
	'parent_path': 'files/parents.txt',   // The parent matrix based on D8, it documents the total number of pixels draining to the current pixel followed by the location of those parent pixels
	'area_path': 'files/DrainageArea.txt',    // The accumulation area matrix based on D8
	'example_path': 'files/example.txt'
}