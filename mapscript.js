// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {zoomControl: false}).setView([32.667969, 2.606179], 2.5);


// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/arybak149/cjg60eqi80qih2sp6md8ccyrs/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJ5YmFrMTQ5IiwiYSI6ImNqZHBhYTNoMDBrazMzM2p2MGkyODdudDQifQ.aMUoANP8dqEXfyOSU78f1Q', {
zoom: false
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'qXAK1M9mb6ddYVDdvOeLpQ',
  username: 'arybak149'
});

///-----CEDAW MAP----//

 

var cedawSource = new carto.source.SQL('SELECT * FROM country_treaty_1_2_2');
var cedawStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([country_status], (#be7ecc, #65bca2, #FFCBA4, #F5F5F5), ("State Party", "No Action", "Signatory", "No Data"), "=");
}
#layer::outline {
  line-width: 1;
  line-color: #ffffff;
  line-opacity: 0.3;
}
`);



// Add style to the data
var cedawlayer = new carto.layer.Layer(cedawSource, cedawStyle, {
 featureOverColumns: ['cartodb_id', 'country']
});  
cedawlayer.hide();

var popup = L.popup();
cedawlayer.on('featureOver', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the mouse-over feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h3>' + event.data['country'] + '</h3>';
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

cedawlayer.on('featureOut', function () {
  popup.removeFrom(map);
});

// Add the data to the map as a layer
client.addLayer(cedawlayer);
client.getLeafletLayer().addTo(map);



/*
 * A function that is called any time a radio changes
 */
function handleRadioChange() {
  // First we find every radio and store them in separate variables
  var year1Radio = document.querySelector('.year1990-radio');
  var year2Radio = document.querySelector('.year2000-radio');
  var year3Radio = document.querySelector('.year2010-radio');
  var year4Radio = document.querySelector('.year2018-radio');
  var year5Radio = document.querySelector('.all-radio');
  var year6Radio = document.querySelector('.reset-radio');
  

  
  // Logging out to make sure we get the radios correctly
  console.log('1990:', year1Radio.checked);
  console.log('2000:', year2Radio.checked);
  console.log('2010:', year3Radio.checked);
  console.log('2018:', year4Radio.checked);
  console.log('all:', year5Radio.checked);
  console.log('reset:', year6Radio.checked);
  
  
  
  // Find the radio that is checked and set Timeline accordingly
  var timeline;
  if (year1Radio.checked) { 
    cedawlayer.show();
    timeline = '1990';
  }
  else if (year2Radio.checked) {
     cedawlayer.show();
    timeline = '2000';
  }
 else if (year3Radio.checked) {
     cedawlayer.show();
    timeline = '2010';
  }
  else if (year4Radio.checked) {
     cedawlayer.show();
    timeline = '2018';
  }
   
   else if (year5Radio.checked) {
     cedawlayer.show();
    
  }
  else if (year6Radio.checked) {
     cedawlayer.hide();
    
  }
  
  
  
  // If there are any values to filter on, do an SQL IN condition on those values,
  // otherwise select all features
  if (timeline) {
    var sql = ("SELECT * FROM country_treaty_1_2_2 WHERE timeline = '" + timeline + "'");
    console.log(sql);
    cedawSource.setQuery(sql);
  }
  
  
  else {
    cedawSource.setQuery("SELECT * FROM country_treaty_1_2_2");
    console.log(sql);
    cedawSource.setQuery(sql);
  }
  
   
}


/*
 * Listen for changes on any radio
 */
var year1Radio = document.querySelector('.year1990-radio');
year1Radio.addEventListener('change', function () {
  handleRadioChange();
});
var year2Radio = document.querySelector('.year2000-radio');
year2Radio.addEventListener('change', function () {
  handleRadioChange();
});
var year3Radio = document.querySelector('.year2010-radio');
year3Radio.addEventListener('change', function () {
  handleRadioChange();
});
var year4Radio = document.querySelector('.year2018-radio');
year4Radio.addEventListener('change', function () {
  handleRadioChange();
});
var year5Radio = document.querySelector('.all-radio');
year5Radio.addEventListener('change', function () {
  handleRadioChange();
});

var year6Radio = document.querySelector('.reset-radio');
year6Radio.addEventListener('change', function () {
  handleRadioChange();
});


//----Best and Worst Places for -----////
// Initialze source data
var bestworstSource = new carto.source.SQL('SELECT * FROM gendergapindex_3');

// Create style for the data
var bestworstStyle = new carto.style.CartoCSS(`
   #layer {
     polygon-opacity: 0.1;
     line-color: #FFFFFF;
     line-width: 0.5;
     line-opacity: 1;
     line-dasharray: 10, 5;

}
#layer {
 [category = 'Most']{
   
   polygon-pattern-file: url(https://www.amcharts.com/lib/3/patterns/black/pattern1.png); 
       polygon-pattern-opacity: 0.9;
     
      
 }

 [category = 'Middle']{
   polygon-pattern-file: url(https://www.amcharts.com/lib/3/patterns/black/pattern2.png);
      polygon-pattern-opacity: 0.9;
 }
  
 [category = 'Least']{    
polygon-pattern-file: url(https://www.amcharts.com/lib/3/patterns/black/pattern4.png);
      polygon-pattern-opacity: 0.9;
 }

[category = 'No Data']{    
polygon-fill: #D3D3D3;
polygon-opacity: 0.4;
   
 }
}
`);

// Add style to the data
var bestworstlayer = new carto.layer.Layer(bestworstSource, bestworstStyle) 
bestworstlayer.hide();
// Add the data to the map as a layer
client.addLayer(bestworstlayer);


// Keep track of whether the boroughs layer is currently visible
var bestworstVisible = false;

// When the boroughs button is clicked, show or hide the layer
var topthirdbutton = document.querySelector('.buttons2');


topthirdbutton.addEventListener('click', function () {
  if (bestworstVisible) {
    // Boroughs are visible, so remove that layer

    
    // Then update the variable tracking whether the layer is shown
    bestworstVisible = false;
  }
  else {
    // Do the reverse if boroughs are not visible
    bestworstlayer.show();
    bestworstVisible = true;
  }
});



/*
 * A function that is called any time a radio changes
 */
function handlebuttonChange() {
  // First we find every radio and store them in separate variables
  var topthirdbutton = document.querySelector('.topthird-b');
  var middlethirdbutton  = document.querySelector('.middlethird-b');
  var bottomthirdbutton = document.querySelector('.bottomthird-b');
  var nodatabutton = document.querySelector('.nodata-b');
  var allbutton = document.querySelector('.all-b');
  var resetbutton = document.querySelector('.reset3-b');
  // Logging out to make sure we get the radios correctly
  console.log('TopThird:', topthirdbutton.clicked);
  console.log('MiddleThird:', middlethirdbutton.clicked);
  console.log('BottomThird:', bottomthirdbutton.clicked);
  console.log('BottomThird:', bottomthirdbutton.clicked);
  console.log('BottomThird:', bottomthirdbutton.clicked);
  console.log('BottomThird:', bottomthirdbutton.clicked);
  
  // Find the radio that is checked and set cateogry accordingly - Top Third is Top Thrid
  var category;
  if (topthirdbutton.clicked) {
    bestworstlayer.show();
    category = 'Most';
  }
  else if (middlethirdbutton.clicked) {
    bestworstlayer.show();
    category = 'Middle';
  }
  else if (bottomthirdbutton.clicked) {
    bestworstlayer.show();
    category = 'Least';
  }
   else if (nodatabutton.clicked) {
    bestworstlayer.show();
    category = 'No Data';
  }
  
    else if (allbutton.clicked) {
    bestworstlayer.show();
    category = 'All';
  }
  
    else if (resetbutton.clicked) {
    bestworstlayer.show();
    category = 'Reset';
  }
  
  // If there are any values to filter on, do an SQL IN condition on those values,
  // otherwise select all features
  if (category) {
    var sql = ("SELECT * FROM gendergapindex_3 WHERE category = '" + category + "'")
    console.log(sql);
    bestworstSource.setQuery(sql);
  }
  else {
    bestworstSource.setQuery("SELECT * FROM gendergapindex_3");
    console.log(sql);
    bestworstSource.setQuery(sql);
  }
}


/*
 * Listen for changes on any radio
 */
var topthirdbutton = document.querySelector('.topthird-b');
topthirdbutton.addEventListener('click', function () {
  //
  // If you want to update all of these at once:
  //
  // UPDATE wps_ranks_v2_1
  // SET category = 'TopThird'
  // WHERE category = 'TopThrid'
  //
  var sql = "SELECT * FROM gendergapindex_3 WHERE category = 'Most'";
  console.log(sql);
  bestworstSource.setQuery(sql);
});
var middlethirdbutton = document.querySelector('.middlethird-b');
middlethirdbutton.addEventListener('click', function () {
 var sql = "SELECT * FROM gendergapindex_3 WHERE category = 'Middle'";
  console.log(sql);
  bestworstSource.setQuery(sql);
});
var bottomthirdbutton = document.querySelector('.bottomthird-b');
bottomthirdbutton.addEventListener('click', function () {
  var sql = "SELECT * FROM gendergapindex_3 WHERE category = 'Least'";
  console.log(sql);
  bestworstSource.setQuery(sql);
});
var nodatabutton = document.querySelector('.nodata-b');
nodatabutton.addEventListener('click', function () {
  var sql = "SELECT * FROM gendergapindex_3 WHERE category= 'No Data'";
  console.log(sql);
  bestworstSource.setQuery(sql);
  });
var allbutton = document.querySelector('.all-b');
allbutton.addEventListener('click', function () {
  var sql = "SELECT * FROM gendergapindex_3";
  console.log(sql);
  bestworstSource.setQuery(sql);
});var restbutton = document.querySelector('.reset3-b');
restbutton.addEventListener('click', function () {
  var sql = "SELECT * FROM gendergapindex_3 WHERE category = 'Reset'";
  console.log(sql);
  bestworstSource.setQuery(sql);
});






//----Women rights - constitution---///
var constitutionSource = new carto.source.SQL('SELECT * FROM womenrights_constitutionv2');

var constitutionStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 7;
  marker-fill: ramp([total_number_of_yes], ( #659EC7, #00FF00, #00FF00,  #FFA500), (3, 1, 2, 0), "=", category);
  marker-fill-opacity: 0.5;
  marker-allow-overlap: false;
  marker-line-width: 15;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}


#layer [ total_number_of_yes = 3] {
  marker-width: 20;
  marker-line-color:  #0000A0;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 2] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 1] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 0] {
  marker-width: 20;
  marker-line-color:  orangered;
  marker-fill-opacity: 0.3;
  marker-line-width: 4;

}
`);
// Add style to the data

var constitutionlayer = new carto.layer.Layer(constitutionSource, constitutionStyle, {

 featureClickColumns: ['cartodb_id', 'countryname', 'does_the_constitution_contain_a_clause_on_nondiscrimination', 
                       'if_there_is_a_nondiscrimination_clause_in_the_constitution_doe', 'does_the_constitution_contain_a_clause_on_equality']
});




constitutionlayer.hide();
// Add the data to the map as a layer
var overlay = document.querySelector('.overlay');
var overlayContent = document.querySelector('.overlay-content');
// overlay.style.display = 'none';
constitutionlayer.on('featureClicked', function (event) {
  overlay.style.display = "block";  
  console.log(event);  
  var content = '<h4>' + event.data['countryname'] + '</h4>'
  content +=  '<div> Does the constitution contain a clause on nondiscrimination?  ' + event.data['does_the_constitution_contain_a_clause_on_nondiscrimination'] + '</div>';
  content +=  '<div> If there is a nondiscrimination clause in the constitution, does it explicitly mention sex or gender? ' + event.data['if_there_is_a_nondiscrimination_clause_in_the_constitution_doe'] + '</div>';
  content +=  '<div> Does the constitution contain a clause on equality? ' + event.data['does_the_constitution_contain_a_clause_on_equality'] + '</div>' ; 
    
  overlayContent.innerHTML = content;
  client.setLatLng(event.latLng);
  client.openOn(map);
});






//----Women rights - property---///
var propertySource = new carto.source.SQL('SELECT * FROM womenrights_property');

var propertyStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 7;
  marker-fill: ramp([total_number_of_yes], ( #659EC7, #00FF00, #00FF00, #00FF00,  #FFA500), (4, 3, 1, 2, 0), "=", category);
  marker-fill-opacity: 0.5;
  marker-allow-overlap: false;
  marker-line-width: 15;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}


#layer [ total_number_of_yes = 4] {
  marker-width: 20;
  marker-line-color:  #0000A0;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 3] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}
#layer [ total_number_of_yes = 2] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 1] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 0] {
  marker-width: 20;
  marker-line-color:  orangered;
  marker-fill-opacity: 0.3;
  marker-line-width: 4;

}

`);
var propertylayer = new carto.layer.Layer(propertySource, propertyStyle, {

 featureClickColumns: ['cartodb_id', 'countryname', 'do_unmarried_men_and_unmarried_women_have_equal_ownership_right', 
                       'do_married_men_and_married_women_have_equal_ownership_rights_to', 'do_female_and_male_surviving_spouses_have_equal_rights_to_inher', 
                      'do_sons_and_daughters_have_equal_rights_to_inherit_assets_from']
});
propertylayer.hide();
var overlay = document.querySelector('.overlay');
var overlayContent = document.querySelector('.overlay-content');
// var overlay = document.querySelector('.overlay');
// overlay.style.display = 'block';
propertylayer.on('featureClicked', function (event) {
  overlay.style.display = 'block';
 console.log(event); 
  
  var content = '<h4>' + event.data['countryname'] + '</h4>';
  content +=  '<div>Do unmarried men and unmarried women have equal ownership rights to property? ' + event.data['do_unmarried_men_and_unmarried_women_have_equal_ownership_right'] + '</div>'; 
  
  content +=  '<div>Do married men and married women have equal ownership rights to property? ' + event.data['do_married_men_and_married_women_have_equal_ownership_rights_to'] + '</div>'; 
  
  content +=  '<div> Do sons and daughters have equal rights to inherit assets from their parents? ' + event.data['do_sons_and_daughters_have_equal_rights_to_inherit_assets_from'] + '</div>'; 
  
  content +=  '<div> Do female and male surviving spouses have equal rights to inherit assets? ' + event.data['do_female_and_male_surviving_spouses_have_equal_rights_to_inher'] + '</div>'; 
 
  overlayContent.innerHTML = content;
  client.setLatLng(event.latLng);
  client.openOn(map);
});
  




//----Women rights - work---///
var workSource = new carto.source.SQL('SELECT * FROM womenrights_work_2');

var workStyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 7;
  marker-fill: ramp([total_number_of_yes], ( #659EC7, #00FF00, #00FF00, #00FF00, #00FF00, #00FF00, #00FF00, #FFA500), (7, 6, 5, 4, 3, 2, 1, 0), "=", category);
  marker-fill-opacity: 0.5;
  marker-allow-overlap: false;
  marker-line-width: 15;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}


#layer [ total_number_of_yes = 7] {
  marker-width: 20;
  marker-line-color:  #0000A0;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 6] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 5] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 4] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 3] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 2] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 1] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 0] {
  marker-width: 20;
  marker-line-color:  orangered;
  marker-fill-opacity: 0.3;
  marker-line-width: 4;

}

`);

// Add style to the data

var worklayer = new carto.layer.Layer(workSource, workStyle, {

 featureClickColumns: ['cartodb_id', 'countryname', 'does_the_law_mandate_nondiscrimination_based_on_gender_in_emplo', 'does_the_law_mandate_nondiscrimination_based_on_gender_in_hirin',
                      'does_the_law_mandate_equal_remuneration_for_work_of_equal_value', 'does_the_law_mandate_nondiscrimination_based_on_gender_in_dismi', 
                       'does_the_law_mandate_paid_or_unpaid_maternity_leave', 'does_the_law_mandate_paid_or_unpaid_paternity_leave', 'does_the_law_mandate_nondiscrimination_based_on_gender_in_promo']
});
worklayer.hide();
var overlay = document.querySelector('.overlay');
var overlayContent = document.querySelector('.overlay-content');
// Add the data to the map as a layer
// var overlay = document.querySelector('.overlay');
// overlay.style.display = 'block';
worklayer.on('featureClicked', function (event) {
   overlay.style.display = 'block';
 console.log(event); 
  var content = '<h4>' + event.data['countryname'] + '</h4>';
  content +=  '<div> Does the law mandate nondiscrimination based on gender in employment? ' + event.data['does_the_law_mandate_nondiscrimination_based_on_gender_in_emplo'] + '</div>'; 
  
  content +=  '<div> Does the law mandate nondiscrimination based on gender in hiring? ' + event.data['does_the_law_mandate_nondiscrimination_based_on_gender_in_hirin'] + '</div>'; 
  
  content +=  '<div>Does the law mandate nondiscrimination based on gender in promotion? ' + event.data['does_the_law_mandate_nondiscrimination_based_on_gender_in_promo'] + '</div>'; 
  
  content +=  '<div> Does the law mandate nondiscrimination based on gender in dismissal? ' + event.data['does_the_law_mandate_nondiscrimination_based_on_gender_in_dismi'] + '</div>'; 
  
  content +=  '<div> Does the law mandate equal remuneration for work of equal value? ' + event.data['does_the_law_mandate_equal_remuneration_for_work_of_equal_value'] + '</div>'; 
  
  content +=  '<div> Does the law mandate paid or unpaid maternity leave? ' + event.data['does_the_law_mandate_paid_or_unpaid_maternity_leave'] + '</div>'; 
  
  content +=  '<div> Does the law mandate paid or unpaid paternity leave? ' + event.data['does_the_law_mandate_paid_or_unpaid_paternity_leave'] + '</div>'; 
  
  overlayContent.innerHTML = content;
  client.setLatLng(event.latLng);
  client.openOn(map);
});



 

//----Women rights - Domestic Violence---///
var domesticSource = new carto.source.SQL('SELECT * FROM womenrights_domesticviol_1');

var domesticStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 7;
  marker-fill: ramp([total_number_of_yes], ( #659EC7, #659EC7, #00FF00, #00FF00, #00FF00, #00FF00, #00FF00, #00FF00, #FFA500), (8, 7, 6, 5, 4, 3, 2, 1, 0), "=", category);
  marker-fill-opacity: 0.5;
  marker-allow-overlap: false;
  marker-line-width: 15;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}

#layer [ total_number_of_yes = 8] {
  marker-width: 20;
  marker-line-color: #0000A0;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 7] {
  marker-width: 20;
  marker-line-color: #0000A0;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 6] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 5] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 4] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 3] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 2] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 1] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 0] {
  marker-width: 20;
  marker-line-color:  orangered;
  marker-fill-opacity: 0.3;
  marker-line-width: 4;

}
`);
// Add style to the data
var domesticlayer = new carto.layer.Layer(domesticSource, domesticStyle, {

 featureClickColumns: ['cartodb_id', 'countryname', 'is_there_domestic_violence_legislation', 'vdoes_domestic_violence_legislation_cover_physical_violence', 
                       'odoes_domestic_violence_legislation_protect_unmarried_intimate', 'are_there_clear_criminal_penalties_for_domestic_violence', 
                      'lldoes_domestic_violence_legislation_cover_sexual_violence', 'nndoes_domestic_violence_legislation_cover_emotional_violence', 
                      'nndoes_domestic_violence_legislation_protect_unmarried_intimate']
});
domesticlayer.hide();
var overlay = document.querySelector('.overlay');
var overlayContent = document.querySelector('.overlay-content');
// Add the data to the map as a layer
// var overlay = document.querySelector('.overlay');
// overlay.style.display = 'block';
domesticlayer.on('featureClicked', function (event) {
  overlay.style.display = 'block';
 console.log(event); 
  var content = '<h4>' + event.data['countryname'] + '</h4>'
  
  content +=  '<div> Is there domestic violence legislation? ' + event.data['is_there_domestic_violence_legislation'] + '</div>'; 
  
  content +=  '<div> Does domestic violence legislation cover physical violence? ' +  event.data['vdoes_domestic_violence_legislation_cover_physical_violence'] + '</div>'; 
  
  content +=  '<div> Does domestic violence legislation protect unmarried intimate? ' + event.data['odoes_domestic_violence_legislation_protect_unmarried_intimate'] + '</div>'; 
  
  content +=  '<div> Are there clear criminal penalties for domestic violence? ' + event.data['are_there_clear_criminal_penalties_for_domestic_violence'] + '</div>'; 
  
  content +=  '<div> Does domestic violence legislation cover sexual violence? ' + event.data['lldoes_domestic_violence_legislation_cover_sexual_violence'] + '</div>'; 
  
  content +=  '<div> Does domestic violence legislation cover emotional violence? ' + event.data['nndoes_domestic_violence_legislation_cover_emotional_violence'] + '</div>'; 
  
  content +=  '<div> Does domestic violence legislation protect unmarried intimate? ' + event.data['nndoes_domestic_violence_legislation_protect_unmarried_intimate'] + '</div>'; 
  
  
  
  overlayContent.innerHTML = content;
  client.setLatLng(event.latLng);
  client.openOn(map);
});




//----Women rights - Sexual Sexual Harassment---///
var sexualSource = new carto.source.SQL('SELECT * FROM womenrights_sexualharrs');
var sexualStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 7;
  marker-fill: ramp([total_number_of_yes], ( #659EC7, #00FF00, #00FF00, #00FF00, #00FF00, #00FF00, #FFA500), (6, 5, 4, 3, 2, 1, 0), "=", category);
  marker-fill-opacity: 0.5;
  marker-allow-overlap: false;
  marker-line-width: 15;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}


#layer [ total_number_of_yes = 6] {
  marker-width: 20;
  marker-line-color:  #0000A0;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 5] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 4] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 3] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 2] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 1] {
  marker-width: 20;
  marker-line-color: #05AF00;
  marker-line-width: 4;

}

#layer [ total_number_of_yes = 0] {
  marker-width: 20;
  marker-line-color:  orangered;
  marker-fill-opacity: 0.3;
  marker-line-width: 4;

}



`);
// Add style to the data

var sexuallayer = new carto.layer.Layer(sexualSource, sexualStyle, {

 featureClickColumns: ['cartodb_id', 'countryname', 'is_there_legislation_that_specifically_addresses_sexual_harassm', 'is_there_legislation_on_sexual_harassment_in_employment',
                      'are_there_civil_remedies_for_sexual_harassment_in_employment','are_there_criminal_penalties_for_sexual_harassment_in_employmen', 
                       'is_there_legislation_on_sexual_harassment_in_education', 'is_there_legislation_on_sexual_harassment_in_public_places']
});
sexuallayer.hide();
var overlay = document.querySelector('.overlay');
var overlayContent = document.querySelector('.overlay-content');
// Add the data to the map as a layer
// var overlay = document.querySelector('.overlay');
// overlay.style.display = 'block';
sexuallayer.on('featureClicked', function (event) {
  overlay.style.display = 'block'; 
 console.log(event); 
// Create the HTML that will go in the sidebar. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.

  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h4>' + event.data['countryname'] + '</h4>'
  content +=  '<div> Is there legislation that specifically addresses sexual harassment? ' + event.data['is_there_legislation_that_specifically_addresses_sexual_harassm'] + '</div>'; 
  
  content +=  '<div> Is there legislation on sexual harassment in employment? ' + event.data['is_there_legislation_on_sexual_harassment_in_employment'] + '</div>'; 
  
  content +=  '<div> Are there civil remedies for sexual harassment in employment? ' + event.data['are_there_civil_remedies_for_sexual_harassment_in_employment'] + '</div>' ; 
  
  content +=  '<div> Are there criminal penalties for sexual harassment in employment? ' + event.data['are_there_criminal_penalties_for_sexual_harassment_in_employmen'] + '</div>'; 
  
  content +=  '<div> Is there legislation on sexual harassment in education? ' + event.data['is_there_legislation_on_sexual_harassment_in_education'] + '</div>'; 
  
  content +=  '<div> Is there legislation on sexual harassment in public places? ' + event.data['is_there_legislation_on_sexual_harassment_in_public_places'] + '</div>'; 
  
  overlayContent.innerHTML = content;
  client.setLatLng(event.latLng);
  client.openOn(map);
});



//----Women rights - No Data layer---///
var nodataSource = new carto.source.SQL('SELECT * FROM nodataissues');
var nodataStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 7;
  marker-fill: ramp([total_number_of_yes], ( #a9a8a9), ("No Data"), "=", category);
  marker-fill-opacity: 0.5;
  marker-allow-overlap: false;
  marker-line-width: 15;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}

#layer [ total_number_of_yes = 'No Data'] {
  marker-width: 20;
  marker-line-color:  gray;
  marker-fill-opacity: 0.4;
  marker-line-width: 4;

}

`);
// Add style to the data

var nodatalayer = new carto.layer.Layer(nodataSource, nodataStyle, {

 featureClickColumns: ['cartodb_id', 'countryname', 'total_number_of_yes']
});
nodatalayer.hide();
var overlay = document.querySelector('.overlay');
var overlayContent = document.querySelector('.overlay-content');
// Add the data to the map as a layer
// var overlay = document.querySelector('.overlay');
// overlay.style.display = 'block';
nodatalayer.on('featureClicked', function (event) {
  overlay.style.display = 'block'; 
 console.log(event); 
// Create the HTML that will go in the sidebar. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.

  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h4>' + event.data['countryname'] + '</h4>'
  content +=  '<div> Data Not Available/Data not disclosed</div>'; 
  
  
  overlayContent.innerHTML = content;
  client.setLatLng(event.latLng);
  client.openOn(map);
});

function closeOverlay () {
 var closebtn = document.getElementById('thisover'); 
   if (overlay.style.display = "block") {
       overlay.style.display = "none";
       } else {
       overlay.style.display = "block";
       }
  }


// Add the data to the map as a layer
client.addLayer(sexuallayer);
client.addLayer(domesticlayer);
client.addLayer(propertylayer);
client.addLayer(worklayer);
client.addLayer(constitutionlayer);
client.addLayer(nodatalayer);
client.getLeafletLayer().addTo(map);


/*
 * Listen for changes on issue radios
 */

var propertyRadio = document.querySelector('.property-radio');
propertyRadio.addEventListener('change', function () {
  handleIssueRadioChange();
});
var constitutionRadio = document.querySelector('.constitution-radio');
constitutionRadio.addEventListener('change', function () {
  handleIssueRadioChange();
});
var domesticRadio = document.querySelector('.domestic-radio');
domesticRadio.addEventListener('change', function () {
  handleIssueRadioChange();
});
var sexualRadio = document.querySelector('.sexual-radio');
sexualRadio.addEventListener('change', function () {
  handleIssueRadioChange();
});

var workRadio = document.querySelector('.work-radio');
workRadio.addEventListener('change', function () {
  handleIssueRadioChange();
});

var nodataRadio = document.querySelector('.nodata-radio');
nodataRadio.addEventListener('change', function () {
  handleIssueRadioChange();
});

var reset4Radio = document.querySelector('.reset4-radio');
reset4Radio.addEventListener('change', function () {
  handleIssueRadioChange();
});


function handleIssueRadioChange() {
  if (constitutionRadio.checked) {
    constitutionlayer.show();
  }
  else {
    constitutionlayer.hide();
  }
  
  if (domesticRadio.checked) {
    domesticlayer.show();
  }
  else {
    domesticlayer.hide();
  }
  
  if (propertyRadio.checked) {
    propertylayer.show();
  }
  else {
    propertylayer.hide();
  }
  
  if (sexualRadio.checked) {
    sexuallayer.show();
  }
  else {
    sexuallayer.hide();
  }
  
  if (workRadio.checked) {
    worklayer.show();
  }
  else {
    worklayer.hide();
  }
  
   if (nodataRadio.checked) {
    nodatalayer.show();
  }
  else {
    nodatalayer.hide();
  }
  
}


