var https = require('https');
var fs = require("fs");
var networkOptions = require('./networkOptions');

module.exports = function (requestedPath, coordinates, payload, token, botCompletionCB, requestCompletionCB){
  console.log("Initiating network options request");
  var options = networkOptions(requestedPath, payload, token); 
  console.log("Network options request complete. Payload: "+ payload + "; Requested path: " + requestedPath + "; Resulting options: " +JSON.stringify(options));

  var req = https.request(options, function(res) {
    console.log("Request response code: " + res.statusCode.toString());
    requestCompletionCB(null, req, res);
  });
  botCompletionCB(null, req);
};
