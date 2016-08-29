var likebot = require("../bots/likebot");
var async = require('async');
var fs = require('fs');
var searchJSONProcessor = require('./searchJSONProcessor');

module.exports = function(res, coordinates, token, cb){
  console.log("Processing pre-delay complete");
  console.log("Temp filename: " + jsFileName.toString());
  async.waterfall([
    function(waterfallCB){
      waterfallCB(null, res);
    },
    getFreeTempFile,
    startWritingToTempFile,
    finishedWritingToTempFile,
    initiateTempFileProcessing
  ], function (err, freeFileName){
   async.retry({times: 15, interval: 500}, function(retryCB){
      fs.readFile(freeFileName, 'utf8', function (err, data) { 
        if (helpers.checkJSONValid(data) && JSON.parse(data).results) {
          console.log("File complete");
          searchJSONProcessor(freeFileName, coordinates, token, cb);
          retryCB();
        } else {
          retryCB("Invalid JSON");
        }
      });
    }, function(err) {
      if (err) { console.log(err); }
    });
  });
};

function getFreeTempFile(res, cb){
  var count = 0;
  var freeFileName = "";
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
      freeFileName = "../results/tmp/" + count.toString() + ".json";
      fs.lstatSync(freeFileName);
      whilstCB(null, freeFileName);
    },
    function(err, freeFileName){
      fs.writeFile(freeFileName, "", function (err) {
        cb(err, res, freeFileName);
      });
    }
  );
}

function startWritingToTempFile(res, freeFileName, cb){
  res.on('data', function(d) {
    fs.appendFile(freeFileName, d, function(err){
      console.log("Streaming to " + freeFileName);
      cb(err, res, freeFileName);
    });
  });
}

function finishedWritingToTempFile(res, freeFileName, cb){
  res.on('end', function(){
    console.log("Begin processing");
    setTimeout(function(){ 
      cb(null, freeFileName);
    }, 500);
  });
}