var likebot = require("../bots/likebot");
var async = require('async');
var fs = require('fs');
var helpers = require('../helpers');
var searchJSONProcessor = require('./searchJSONProcessor');

module.exports = function(req, coordinates, token, cb){
  console.log("Processing pre-delay complete");
  async.waterfall([
    function(waterfallCB){
      waterfallCB(null, req);
    },
    getFreeTempFile,
    startWritingToTempFile,
    finishedWritingToTempFile
  ], function (err, freeFileName){
    console.log("API data retrieval errors: " + err);
    async.retry({times: 15, interval: 500}, function(retryCB){
      fs.readFile(freeFileName, 'utf8', function (err, data) { 
        if (helpers.checkJSONValid(data) && JSON.parse(data).results) {
          console.log("File complete");
          searchJSONProcessor(freeFileName, coordinates, token, cb);
          retryCB();
        } else {
          if (!helpers.checkJSONValid(data)) { 
            console.log("Invalid JSON response: " + err);
          }
          else if (!JSON.parse(data).results) { 
            console.log("Fail, API rejection: " + err);
          }
          retryCB("Invalid JSON");
        }
      });
    }, function(err) {
      if (err) { 
        cb(err);
      }
    });
  });
};

function getFreeTempFile(req, cb){
  var count = 0;
  var freeFileName = "results/tmp/1";
  async.whilst(
    function() { 
      try{
        if (!freeFileName.isFile());
        return true;
      } catch (err) {
        return false;
      }
    },
    function(whilstCB) {
      count++;
      freeFileName = "results/tmp/" + count.toString() + ".json";
      fs.lstatSync(freeFileName);
      whilstCB(null);
    },
    function(err){
      fs.writeFile(freeFileName, "", function (err) {
        cb(err, req, freeFileName);
      });
    }
  );
}

function startWritingToTempFile(req, freeFileName, cb){
  console.log("Writing");
  req.on('data', function(d) {
    fs.appendFile(freeFileName, d, function(err){
      console.log("Streaming to " + freeFileName);
    });
  });
  req.on('end', function(d){
    cb(null, req, freeFileName);
  });
  req.on('error', function(d) {
    fs.appendFile(freeFileName, "Ran out of recs", function(err){
      cb(err, req, freeFileName);
    });
  });
}

function finishedWritingToTempFile(req, freeFileName, cb){
//  req.on('end', function(){
    console.log("Begin processing");
    setTimeout(function(){ 
      cb(null, freeFileName);
    }, 500);
  //});
}
