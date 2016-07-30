/*
 * Star Wars opening crawl from 1977
 * 
 * I freaking love Star Wars, but could not find
 * a web version of the original opening crawl from 1977.
 * So I created this one.
 *
 * I wrote an article where I explain how this works:
 * http://timpietrusky.com/star-wars-opening-crawl-from-1977
 * 
 * Watch the Start Wars opening crawl on YouTube.
 * http://www.youtube.com/watch?v=7jK-jZo6xjY
 * 
 * Stuff I used:
 * - CSS (animation, transform)
 * - HTML audio (the opening theme)
 * - SVG (the Star Wars logo from wikimedia.org)
 *   http://commons.wikimedia.org/wiki/File:Star_Wars_Logo.svg
 * - JavaScript (to sync the animation/audio)
 *
 * Thanks to Craig Buckler for his amazing article 
 * which helped me to create this remake of the Star Wars opening crawl. 
 * http://www.sitepoint.com/css3-starwars-scrolling-text/ 
 *
 * Sound copyright by The Walt Disney Company.
 * 
 *
 * 2013 by Tim Pietrusky
 * timpietrusky.com
 * 
 */
StarWars = (function() {
  
  /* 
   * Constructor
   */
  function StarWars(args) {
    // Context wrapper
    this.el = $(args.el);
    
    // Audio to play the opening crawl
    this.audio = this.el.find('audio').get(0);
    
    // Start the animation
    this.start = this.el.find('.start');
    
    // The animation wrapper
    this.animation = this.el.find('.animation');
    
    // Remove animation and shows the start screen
    this.reset();

    //debugger;

    // Start the animation on click
    this.start.bind('click', $.proxy(function() {
      this.start.hide();
      this.audio.play();
      this.el.append(this.animation);
    }, this));
    
    // Reset the animation and shows the start screen
    $(this.audio).bind('ended', $.proxy(function() {
      this.audio.currentTime = 0;
      this.reset();
      if(WE){
        initialize();
      }
    }, this));
  }
  
  /*
   * Resets the animation and shows the start screen.
   */
  StarWars.prototype.reset = function() {
    //this.start.show();
    this.cloned = this.animation.clone(true);
    this.animation.remove();
    this.animation = this.cloned;
  };

  return StarWars;
})();


new StarWars({
  el : '.starwars'
});


///


/**
 * Created by prakash on 7/30/16.
 */
var earth;
var earthSize = 3;
var startAnimate = false;
var accountMarker = {};
var accounts = [];
var accountMap = {};
var baraja=null;

var setIntervalRef=null;

function filter() {

  var filterArray = [];
  var filterValues = [];
  var searchString = document.getElementById("geocoder").value.trim();
  if( searchString != '' ) {
    filterValues = searchString.toLowerCase().split(',');
  }

  for( var name in accountMarker ) {
    earth.removeMarker( accountMarker[name] );
  }

  for( var i = 0; i < accounts.length; i++ ) {

    var account = accounts[i];
    if( filterValues && filterValues.length > 0 ) {

      for( var j = 0; j < filterValues.length; j++ ) {

        var value = filterValues[j];
        if( ( account.country && account.country.toLowerCase().indexOf( value ) != -1 ) ||
            ( account.state && account.state.toLowerCase().indexOf( value ) != -1 ) ||
            ( account.name && account.name.toLowerCase().indexOf( value ) != -1 ) ||
            ( account.city && account.city.toLowerCase().indexOf( value ) != -1 ) ||
            ( account.type && account.type.toLowerCase().indexOf( value ) != -1 ) ||
            ( account.industry && account.industry.toLowerCase().indexOf( value ) != -1 ) ) {

          filterArray.push(account);
        }
      }
    } else {
      filterArray.push(account);
    }
  }

  processAccount( filterArray );

  var markerCount = 0;
  var acc = undefined;
  for( var key in accountMarker ) {

    markerCount = markerCount + 1;
    if( !acc ) {
      acc = accountMap[key];
      if( filterValues && filterValues.length != 0 ) { accountMarker[key].openPopup(); }
    }
  }

  if( accounts.length != markerCount && markerCount > 0 ) {

    startAnimate = false;
    var range = 15;

    var latitude = earth.getPosition()[0];
    var longitude = earth.getPosition()[1];

    earth.fitBounds([[latitude - range, longitude - range], [latitude + range, longitude + range]]);
    earth.panInsideBounds([[latitude - range, longitude - range], [latitude + range, longitude + range]], {duration: 1});
    earth.panTo( [acc.latitude, acc.longitude], {duration: 1} );
  } else {
    startAnimate = true;
    earth.setView([30,-120], earthSize);
  }
}

function moveCards(barajaRef){

  barajaRef.next();

}

var moveCardsRef=null;

function onEarthClick() {
  startAnimate = (startAnimate == true ) ? false : true;
  for( var name in accountMarker ) {
    accountMarker[name].closePopup();
  }

  var cardsContainer = $("#cards-container").css( {display:'none'});

  if(setIntervalRef){
    clearInterval(setIntervalRef);
  }
  //var cardsContainer = $("#cards-container").css("display","none");

}


function onMarkerClick(event,account) {

  startAnimate = false;
  for( var name in accountMarker ) {
    accountMarker[name].closePopup();
  }

  //earth.setView
  //event.target.openPopup();
  var x = event.clientX;     // Get the horizontal coordinate
  var y = event.clientY;

  var cardsContainer = $("#cards-container").css( {display:'block',position:"absolute", top:x, left: x});;


  //earth.panTo( [account.latitude, account.longitude], {duration: 1} );

  // var barajaEl = $('#baraja-el');
  //barajaEl.show();
  //var baraja = barajaEl.baraja();

  if(baraja){

   baraja.fan({
      speed:500,
      easing:'ease-out',
      range:80,
      direction:'right',
      origin:{x:x,y:y},
      center:true
    });


    /* baraja.fan( {
     speed : 500,
     easing : 'ease-out',
     range : 130,
     direction : 'bottom',
     origin : { x : 25, y : 100 },
     center : false
     } );
     */

    //setIntervalRef=setInterval(moveCards.bind(this,baraja),3000)

  }




  console.log("account",account);
}

function initialize() {

  // return;

  earth = new WE.map('earth_div', {sky: true});
  earth.setView([30,-120], earthSize);
  earth.on('click', onEarthClick);

  var natural = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
    tileSize: 256,
    tms: true
  });
  natural.addTo(earth);

  var toner = WE.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
    attribution: 'Servicemax Impact',
    opacity: 0.5
  });
  toner.addTo(earth);

  var before = null;
  requestAnimationFrame(function animate(now) {

    var c = earth.getPosition();
    var elapsed = before? now - before: 0;
    before = now;
    if( startAnimate === true ) {
      earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
    }
    requestAnimationFrame(animate);
  });

  function getContextPath() {
    return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
  }

  var xmlhttp = new XMLHttpRequest();
  var accountUrl = getContextPath() + "/data/account.json";

  xmlhttp.onreadystatechange = function() {

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      accounts = JSON.parse(xmlhttp.responseText);
      processAccount(accounts);
    }
  };
  xmlhttp.open("GET", accountUrl, true);
  xmlhttp.send();
}


function getMarkerClickDelegate(a, b) {
  return function(){
    onMarkerClick(a, b)
  }
}

function processAccount(accs) {

  accountMarker = {};
  for( var i = 0; i < accs.length; i++ ) {

    var acc = accs[i];
    var marker = WE.marker([acc.latitude, acc.longitude], 'resources/images/map-of-orange-pin-icon-5081.png', 24, 24).addTo(earth);

    marker.on('click', getMarkerClickDelegate(event,acc));


    accountMarker[acc.name] = marker;
    accountMap[acc.name] = acc;

    /*
    var htmlContent = "<div onmouseover='mouseOver();' onmouseout='mouseOut();'>";
    if( acc.logo && acc.logo != "" ) {
      htmlContent = htmlContent + "<b><img src='" + acc.logo + "'/>" + acc.name + "</b>";
    } else {
      htmlContent = htmlContent + "<b>" + acc.name + "</b>";
    }

    if( acc.description && acc.description != "" ) {
      htmlContent = htmlContent + "<br>" + acc.description;
    }

    htmlContent = htmlContent + "<br>"+acc.street+"<br>"+acc.city+"<br>"+acc.state + ", " + acc.zip +"</div>";

    marker.bindPopup(htmlContent, {maxWidth: 180, closeButton: false});
    */

  }
}


$(function(){

  var $el = $('#baraja-el');
  baraja = $el.baraja();


  //earth = new WE.map('earth_div', {sky: true});


  /*
   // navigation
   $('#nav-prev').on('click',function(event){

   baraja.previous();

   });

   $( '#nav-next' ).on( 'click', function( event ) {

   baraja.next();

   } );

   $( '#close' ).on( 'click', function( event ) {

   baraja.close();

   } );*/

});

