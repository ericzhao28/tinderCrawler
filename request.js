// Require modules
var https = require('https');
var fs = require("fs");
var q = require("q");

// Require side modules
var networkOptions = require('./networkOptions');
var searchJSONProcessor = require('./searchJSONProcessor');
var locationUpdatePayloadGen = require('./locationUpdatePayloadGen');

// Export module functions
module.exports = {
  initiateSearchBot: initiateSearchBot,
  initiateLocationUpdateBot: initiateLocationUpdateBot,
  request: request,
  searchJSONProcessor: searchJSONProcessor
}

// Search-bot
function initiateSearchBot(coordinates, token, botCB){
  // Call request
  console.log("Initiating search-like-bot requests");
  request("/user/recs", coordinates, null, token, botCB, function(req){
    // Closes connection
    req.end();
    req.on('error', function(e) {
        console.error(e);
    });
  });
}

// Location-update-bot
function initiateLocationUpdateBot(coordinates, token, botCB){
  // Call request
  var payload = locationUpdatePayloadGen(coordinates);
  // Generate payload from coordinates
  console.log("Initiating location-update-bot requests");
  request("/user/ping", null, payload, token, botCB, function(req){
    // Closes connection and attach payload
    req.write(JSON.stringify(payload));
    req.end();
    req.on('error', function(e) {
      console.error(e);
    });
  });
}

// Like-bot
function initiateLikebot(userID, token){
  // CB to pass new request for profile liking
  var botCB = function(){}; 
  request("/like/" + userID.toString(), null, null, token, botCB, function(req){
    // End request Call
    req.end();
    req.on('error', function(e) {
      console.error(e);
    });
  });
}

// Initiate network request call
function request(requestedPath, coordinates, payload, token, botCB, requestCB){
  
  // Call for option generation from outside module
  console.log("Initiating network options request");
  var options = networkOptions(requestedPath, payload, token); 
  console.log("Network options request complete. Payload: "+ payload + "; Requested path: " + requestedPath + "; Resulting options: " +JSON.stringify(options));

  // Initiate request process
  var req = https.request(options, function(res) {
    // Return response code
    console.log("Request response code: " + res.statusCode.toString());
    
    // Check request type to decide return processor
    if (requestedPath == "/user/recs"){
      // If search request, call response processor
      searchReqProcessor(req, res, coordinates, token, botCB);
    } else if (requestedPath == "/user/ping") {
        // If location update request
        botCB();
    } else {
        // If like bot request
        botCB();
    }

  });

  requestCB(req);
}

// Response processor for search request
function searchReqProcessor(req, res, coordinates, token, botCB){
  // Find open temp file position and use for streaming data
  for (var i = 0; i < 100; i++) {
    try {
      var stats = fs.lstatSync("./tmp/" + i.toString() + ".json");
      if (!stats.isFile()) {
        break; 
      } 
    } catch (err) {

      // Lock in temp file name, and begin writing to file
      var jsFileName = "./tmp/" + i.toString() + ".json";
      console.log(jsFileName);
      // First write a blank file, with a callback specifying later additions as data flows in
      fs.writeFile(jsFileName, "", function(err){
        if (err){
          console.log("Error: "+err);
        } else {
          console.log("New tmp file opened at: " + jsFileName);
          // Initiate data streaming to tmp file 
          res.on('data', function(d) {
            fs.appendFile(jsFileName, d, function(err){
              if (err){
                 console.log("Error: " + err);
              } else {
                console.log("Streaming to " + jsFileName);
              }
            })
          })
          
          // Initiate JSON processing after completion of data stream
          res.on('end', function(){
            console.log("Begin processing");
            setTimeout(function(){ 
              console.log("Processing temp file: " + jsFileName); 
              // Call outside module to process JSON search result
              // But first test to see if JSON is ready
              var numberOfRetrials = 0;
              (function task() {
                fs.readFile(jsFileName, 'utf8', function (err, data) { 
                  if (checkJSONValid(data)) {
                    console.log("File complete");
                    searchJSONProcessor(jsFileName, coordinates, token, botCB, initiateLikebot);
                  } else if (numberOfRetrials++ < 15) {
                    console.log("File not complete yet");
                    setTimeout(function(){task()}, 500);
                  } else {
                    console.log("Cancelled");
                    botCB();
                  }
                });
              })();
            }, 500);
          });
        }
      });
      break; 
    }
  }
}

// Check JSON valid func
function checkJSONValid(json){

  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;

}
