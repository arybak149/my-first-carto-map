// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([42.609706,-74.608154], 7);

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
  maxZoom: (20)
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'apikey',
  username: 'arybak149'
});

// Initialze source data
var source = new carto.source.SQL('select * from nys_parks');

// Create style for the data
var style = new carto.style.CartoCSS(`
  #layer {
     marker-width: 7;
  marker-fill: ramp([category], (#7F3C8D, #11A579, #3969AC, #F2B701, #E73F74, #A5AA99), ("State Park", "State Historic Site", "Marine Facility", "State Historic Park", "State Park Preserve"), "=");
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
  }
`);

// Add style to the data
var layer = new carto.layer.Layer(source, style);



//checerbox functions - for reminder :) 


/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the checkbox by class. If you are using a different class, change this.
var element = document.querySelector('.state-park-checkbox');

// Step 2: Add an event listener to the checkbox. We will run some code whenever the button is clicked.
element.addEventListener('change', function (e) {
  // Sometimes it helps to log messages, here we log to let us know the button was clicked. You can see this if you open developer tools and look at the console.
  console.log('State Park was clicked', e.target.checked);
  
  if (e.target.checked) {
    source.setQuery("SELECT * FROM nys_parks WHERE category= 'State Park'");
    
  }
  else {
    source.setQuery("SELECT * FROM nys_parks");
  }
});

/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the checkbox by class. If you are using a different class, change this.
var element = document.querySelector('.state-historic-site-checkbox');

// Step 2: Add an event listener to the checkbox. We will run some code whenever the button is clicked.
element.addEventListener('change', function (e) {
  // Sometimes it helps to log messages, here we log to let us know the button was clicked. You can see this if you open developer tools and look at the console.
  console.log('State Historic Site was clicked', e.target.checked);
  
  if (e.target.checked) {
    source.setQuery("SELECT * FROM nys_parks WHERE category= 'State Historic Site'");
  }
  else {
      source.setQuery("SELECT * FROM nys_parks");
  }
});
/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the checkbox by class. If you are using a different class, change this.
var element = document.querySelector('.marine-facility-checkbox');

// Step 2: Add an event listener to the checkbox. We will run some code whenever the button is clicked.
element.addEventListener('change', function (e) {
  // Sometimes it helps to log messages, here we log to let us know the button was clicked. You can see this if you open developer tools and look at the console.
  console.log('Marine Facility was clicked', e.target.checked);
  
  if (e.target.checked) {
    source.setQuery("SELECT * FROM nys_parks WHERE category= 'Marine Facility'");
  }
  else {
    source.setQuery("SELECT * FROM nys_parks");
  }
});
/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the checkbox by class. If you are using a different class, change this.
var element = document.querySelector('.state-park-preserve-checkbox');

// Step 2: Add an event listener to the checkbox. We will run some code whenever the button is clicked.
element.addEventListener('change', function (e) {
  // Sometimes it helps to log messages, here we log to let us know the button was clicked. You can see this if you open developer tools and look at the console.
  console.log('State Park Preserve was clicked', e.target.checked);
  
  if (e.target.checked) {
    source.setQuery("SELECT * FROM nys_parks WHERE category= 'State Park Preserve'");
  }
  else {
    source.setQuery("SELECT * FROM nys_parks");
  }
});
/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the checkbox by class. If you are using a different class, change this.
var element = document.querySelector('.state-historic-park-checkbox');

// Step 2: Add an event listener to the checkbox. We will run some code whenever the button is clicked.
element.addEventListener('change', function (e) {
  // Sometimes it helps to log messages, here we log to let us know the button was clicked. You can see this if you open developer tools and look at the console.
  console.log('State Park was clicked', e.target.checked);
  
  if (e.target.checked) {
    source.setQuery("SELECT * FROM nys_parks WHERE category= 'State Historic Park'");
  }
  else {
    source.setQuery("SELECT * FROM nys_parks");
  }
});
// POP UP BOX
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var layer = new carto.layer.Layer(source, style, {
  featureClickColumns: ['name', 'county']
});

var popup = L.popup();
layer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h3>' + event.data['name'] + '</h3>'
  content +=  event.data['county']; 
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);
