var request = require('../networking/request');
var searchInitialProcessor = require('../searchProcessors/searchInitialProcessor');

module.exports = function(coordinates, token, botCompletionCB){
  console.log("Initiating search-like-bot requests");
  request("/user/recs", coordinates, null, token, function(err, req, res){
    searchInitialProcessor(req, res, coordinates, token, botCompletionCB);
  }, function(err, req){
    req.end();
    req.on('error', function(e) {
        console.error(e);
    });
  });
};