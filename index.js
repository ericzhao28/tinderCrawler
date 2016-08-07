var request = require("./request.js");
var prompt = require('prompt');
var fs = require('fs');
var authenticateFB = require('./authenticate.js');


console.log("Enter data");

// Get lat/long
prompt.start();
var coordinates;

prompt.get(['latitude', 'longitude'], function (err, result) {
  coordinates = [result.latitude, result.longitude];
  
  // Get # of rounds and initiate bot
  prompt.get(['rounds', 'facebookToken'], function (err, result) {
    facebookToken = result.facebookToken.replace(/https:.*access_token=(.*)&expires_in.*/g, '$1');
    console.log(facebookToken);
    authenticateFB(facebookToken, function(token){
      initiateBots(result.rounds, coordinates, token);
    });
  });

});
 
// Call to initiate bot 
function initiateBots(runCount, coordinates, token){ 
  // Location updates
  console.log("Begin master script");
  request.initiateLocationUpdateBot(coordinates, token, function(){
    // Delay before initiating search bot   
    console.log("Location update complete");
    setTimeout(function(){ 
      var increment = 0;
      (function f() {
        // Call for likebot CB
        request.initiateSearchBot(coordinates, token, function(){
          console.log("Searchbot round " + (increment+1).toString() + " complete");
        });
        increment++;
        // Repeat function as part of delayed sync loop
        if( increment < runCount ){
          // Repeat delay of 25000 ms
          setTimeout(function(){ f();}, 2500 );
        } 
      })();
      // Post location update delay of 5000 ms
    }, 5000);
  });
}


