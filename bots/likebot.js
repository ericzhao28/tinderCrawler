var request = require('../networking/request');

module.exports = function(userID, token){
  request("/like/" + userID.toString(), null, null, token, function(){}, function(err, req){
    req.end();
    req.on('error', function(e) {
      console.error(e);
    });
  });
};
