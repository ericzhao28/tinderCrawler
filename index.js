var request = require("./networking/request.js");
var prompt = require('prompt');
var fs = require('fs');
var authenticateFB = require('./networking/authenticate.js');
var locationUpdateBot = require('./bots/locationUpdateBot.js');
var searchbot = require('./bots/searchbot.js');
var async = require('async');

primary();

function primary(){
  var primaryPrompts = {
    properties: {
      latitude: {
        required: true
      },
      longitude: {
        required: true
      }
    }
  };
  var secondaryPrompts = {
    properties: {
      rounds: {
        pattern: /^[0-9]*$/,
        message: 'Numbers only',
        required: true
      },
      facebookToken: {
        required: true
      }
    }
  };
  console.log("Enter data:");
  var coordinates;
  prompt.start({noHandleSIGINT: true});
  prompt.get(primaryPrompts, function (err, result) {
    coordinates = [result.latitude, result.longitude];
    prompt.get(secondaryPrompts, function (err, result) {
      facebookToken = result.facebookToken;
      authenticateFB(facebookToken, function(token){
        if (token){
          initiateBots(result.rounds, coordinates, token);
        } else {
          console.log("\n\n#####################\nIncorrect credentials\n");
          primary();
        }
      });
    });
  });
}

function initiateBots(runCount, coordinates, token){ 
  console.log("Begin master script");
  async.series([
    function(cb){
      locationUpdateBot(coordinates, token, function(){
        console.log("Location update complete");
        setTimeout(function(){ cb() }, 5000);
      });
    },
    function(cb){
      var increment = 0;
      (function f() {
        searchbot(coordinates, token, function(){
          console.log("Searchbot round " + (increment+1).toString() + " complete");
          increment++;
          if( increment < runCount ){
            setTimeout(function(){ f();}, 2500 );
          } 
        });
      })();
    }
  ]);
}

process.on('SIGINT', function() {
  console.log("\n\nBye <3");
  process.exit();
});
