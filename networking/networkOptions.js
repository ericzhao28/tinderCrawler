var config = require('../config');
var uu = require('underscore');
module.exports  = function (requestedPath, payload, token){
  var options = uu.extend({}, config.defaultPortInfo, {
    path: requestedPath,
    headers: generateHeaders(token),
  });
  if (payload === null) {
    uu.extend(options, {
      method: "GET"
    });

  } else {
    uu.extend(options, {
     method: "POST"
    });
  }
  return options; 
};

function generateHeaders(token){
  var headers = config.defaultHeaders(token);
  return headers;
}
