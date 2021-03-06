var fs = require('fs');
var async = require('async');
var helpers = require('../helpers');
var likebot = require('../bots/likebot');

module.exports = function(tempFileName, coordinates, token, cb){
  console.log("Processing pre-delay complete");
  console.log("Temp filename: " + tempFileName.toString());
  async.waterfall([
    function(cb){
      fs.readFile(tempFileName, 'utf8', function (err, data) {
        cb(err, JSON.parse("[" + data + "]"));
      });
    },
    function(rawJSONdata, cb){
      fs.readFile("masterID.json", 'utf8', function (err, data) {
        cb(err, rawJSONdata, JSON.parse(data), coordinates, tempFileName);
      });
    },
    getFreeMasterFile,
    saveTempDataToMasterFile,
    finishProcessingMasterFiles
    /*, likebottingIDs
    */
  ], function (err, result){
    cb(err);
  });
};

function getFreeMasterFile(rawJSONdata, idLibraryData, coordinates, tempFileName, cb){
  var count = 1;
  coordinates[0] = coordinates[0].toString();
  coordinates[1] = coordinates[1].toString();
  var freeFileName = "results/master/" + coordinates[0] + "-" + coordinates[1] + "_v=1.json";
  while ((function() { 
      try{
        if (fs.lstatSync(freeFileName));
        return true;
      } catch (err) {
        return false;
      }
  })()) {
    count++;
    freeFileName = "results/master/" + coordinates[0] + "-" + coordinates[1] + "_v=" + count.toString() + ".json";  
  }
  fs.writeFile(freeFileName, "", function (err) {
    cb(err, rawJSONdata, idLibraryData, freeFileName, tempFileName);
  });
}

function saveTempDataToMasterFile(rawJSONdata, idLibraryData, freeFileName, tempFileName, cb){
  console.log("Master name reserved :" + freeFileName);
  console.log("Writing to MasterFile");
  console.log("New Master JSON file created at :" + freeFileName);
  console.log(rawJSONdata.length);
  async.forEachOfSeries(rawJSONdata, function(result, index, next){
    var userID = result._id;
    helpers.checkExistingDictionary(idLibraryData, userID, function(unique){
      if (unique){
        idLibraryData.IDs.push({
          "id" : userID
        });
        (index===0) ? fs.appendFileSync(freeFileName, JSON.stringify(result),encoding='utf8') : fs.appendFileSync(freeFileName, "," + JSON.stringify(result),encoding='utf8');
      } else {
        console.log("Duplicate");
      }
      next();
    });
  }, function(err){
    setTimeout(function(){
      cb(null, rawJSONdata, idLibraryData, freeFileName, tempFileName);
    }, 1000);
  });
}

function finishProcessingMasterFiles(rawJSONdata, idLibraryData, freeFileName, jsFileName, cb){
  fs.unlink(jsFileName, function(err){
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log("File deleted: " + jsFileName);
    }
  });
  fs.writeFile("masterID.json", JSON.stringify(idLibraryData), function(err){
    if (err){ console.log("Error: " +err); }
    cb(null, rawJSONdata, idLibraryData, freeFileName);
  }); 
}

function likebottingIDs (rawJSONdata, idLibraryData, freeFileName, cb){
  async.forEachOfSeries(verifiedIDs, function(id, next){
    likebot(id, token);
    setTimeout(next, 500 );
  }, function(err){
    cb(err);
  });
}
