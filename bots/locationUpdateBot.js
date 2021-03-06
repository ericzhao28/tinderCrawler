var locationUpdatePayloadGen = require('../networking/locationUpdatePayloadGen');
var request = require('../networking/request');

module.exports = function locationUpdateBot(coordinates, token, botCompletionCB){
  var payload = locationUpdatePayloadGen(coordinates);
  console.log("Initiating location-update-bot requests");
  request("/user/ping", null, payload, token, function(err, req){
    req.write(JSON.stringify(payload));
    req.end();
    req.on('error', function(e) {
      console.error(e);
    });
  }, botCompletionCB);
};




