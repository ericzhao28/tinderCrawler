module.exports.checkJSONValid = function (json){
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
};
module.exports = function checkExistingDictionary (idLibrary,userID, cb){
  cb((JSON.stringify(idLibrary)).indexOf("\"username\":\""+userID+"\"") == -1);
};
