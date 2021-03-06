var request = require('../networking/request');
var searchInitialProcessor = require('../searchProcessors/searchInitialProcessor');

module.exports = function(coordinates, token, botCompletionCB){
  console.log("Initiating search-like-bot requests");
  request("/user/recs", coordinates, null, token, function(err, req){
    req.end();
    req.on('error', function(e) {
        console.error(e);
    });
  }, function(err, req, res){
    searchInitialProcessor(res, coordinates, token, botCompletionCB);
  });
};
