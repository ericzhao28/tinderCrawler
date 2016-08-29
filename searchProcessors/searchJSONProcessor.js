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
        cb(err, JSON.parse(data));
      });
    },
    function(rawJSONdata, cb){
      fs.readFile("masterID.json", 'utf8', function (err, data) {
        cb(err, rawJSONdata, JSON.parse(data));
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

function getFreeMasterFile(rawJSONdata, idLibraryData, cb){
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
      freeFileName = "../results/master/" + coordinates[0].toString() + "-" + coordinates[1].toString() + "_v=" + count.toString() + ".json";
      fs.lstatSync(freeFileName);
      whilstCB(null, freeFileName);
    },
    function(err, freeFileName){
      fs.writeFile(freeFileName, "", function (err) {
        cb(err, rawJSONdata, idLibraryData, freeFileName);
      });
    }
  );
}

function saveTempDataToMasterFile(rawJSONdata, idLibraryData, freeFileName, cb){
  console.log("Master name reserved :" + freeFileName);
  console.log("Writing to MasterFile");
  console.log("New Master JSON file created at :" + freeFileName);
  async.forEachOfSeries(rawJSONdata.results, function(result, index, next){
    var userID = result._id;
    helpers.checkExistingDictionary(idLibraryData, userID, function(unique){
      if (unique){
        verifiedIDs.push(userID);
        idLibraryData.IDs.push({
          "id" : userID,
          "lat" : coordinates[0],
          "long" : coordinates[1]
        });
        (index===0) ? fs.appendFileSync(freeFileName, JSON.stringify(result),encoding='utf8') : fs.appendFileSync(freeFileName, "," + JSON.stringify(result),encoding='utf8');
      } else {
        console.log("Duplicate");
      }
    });
  }, function(err){
    setTimeout(function(){
      cb(null, rawJSONdata, idLibraryData, freeFileName);
    }, 1000);
  });
}

function finishProcessingMasterFiles(rawJSONdata, idLibraryData, freeFileName, cb){
  fs.unlink(jsFileName, function(err){
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log("File deleted: " + jsFileName);
    }
  });
  fs.writeFile("masterID.json", JSON.stringify(idLibrary), function(err){
    if (err){ console.log("Error: " +err); }
    botCB();
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
