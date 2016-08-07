// Module contributes to ID dictionary, references dictionary to prevent double entries in master JSON file, calls for likebot of specified IDs, and updates all master files whilst deleting temp file
var fs = require('fs');

module.exports = function(jsFileName, coordinates, token, botCB, likeCB){

  // Begin loading in raw JSON from tmp file, also parses
  console.log("Processing pre-delay complete");
  console.log("Temp filename: " + jsFileName.toString());
  fs.readFile(jsFileName, 'utf8', function (err, data) {
    if (err) throw err;
    var rawJSONObj = JSON.parse(data);

    // Local verified id library
    var verifiedIDs = [];

    // Loading in ID Library of unique IDs already existing in Master JSON  
    fs.readFile("masterID.json", 'utf8', function (err, data) {
      if (err) throw err;
      var idLibrary = JSON.parse(data);
      // Initiate search for available based on location masterFileName
      for(var n=0; true; n++){
        try{
          // Fileslot taken
          var stats = fs.lstatSync("./master/" + coordinates[0].toString() + "-" + coordinates[1].toString() + "_v=" + n.toString() + ".json");
          if (!stats.isFile()){
          }
        } catch (err) {
          // Unique masterfilename detected, lock in unique masterFileName
          var masterFileName = "./master/" + coordinates[0].toString() + "-" + coordinates[1].toString() + "_v=" + n.toString() + ".json";
          console.log("Master name reserved :" + masterFileName);
          
          // Start blank template for masterfile
          fs.writeFile(masterFileName, "", function (err) {
            console.log("Writing to MasterFile");
            if (err) {
              console.log("Error :" + err);
            } else 
            {
              console.log("New Master JSON file created at :" + masterFileName);
         
              // Begin processing rawJSON 
              // Check for ID uniqueness
              for (var i = 0; i < rawJSONObj.results.length; i++){
                var userID = rawJSONObj.results[i]._id;
               
                // Check for ID existance and enact appropriate calls
                checkExistingDictionary(idLibrary, userID, function(unique){

                  if (unique){

                    // Push to verified array and master library
                    verifiedIDs.push(userID);
                    idLibrary.IDs.push({
                      "id" : userID,
                      "lat" : coordinates[0],
                      "long" : coordinates[1]
                    });
                 
                    // Add rawJSONObj.results[i] to master JSON, add commas depending on increment variable
                    (i==0) ? fs.appendFileSync(masterFileName, JSON.stringify(rawJSONObj.results[i]),encoding='utf8') : fs.appendFileSync(masterFileName, "," + JSON.stringify(rawJSONObj.results[i]),encoding='utf8')
                  
                  } else {
                    
                    // Console notification of duplicates
                    console.log("DUPLICATE");

                  }
                });
              }
              
              // Assuming file cleaning complete
              setTimeout(function(){
                // Wipe temp file
                fs.unlink(jsFileName, function(err){
                  if (err) {
                    console.log("Error: " + err);
                  } else {
                    console.log("File deleted: " + jsFileName);
                  }
                });
                // Update MasterID file
                fs.writeFile("masterID.json", JSON.stringify(idLibrary), function(err){
                  if (err){
                    console.log("Error: " +err);
                  }
                  botCB();
                });
                /*
                // Initiate likebot
                // Delayed loop synchronous
                var increment = 0;
                (function f(howManyTimes) {
                  // Call for likebot CB
                  likeCB(verifiedIDs[increment], token);
                  increment++;
                  if( increment < howManyTimes ){
                    setTimeout(function(){ f(verifiedIDs.length)}, 500 );
                  }
                })(verifiedIDs.length);
                */
              }, 1000);
            }
          });
          break; 
        }
      }
    });
  });
}

// Detect redundant IDs
function checkExistingDictionary(idLibrary,userID, CB){
     CB((JSON.stringify(idLibrary)).indexOf("\"username\":\""+userID+"\"") == -1);
}