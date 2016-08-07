// Returns network options
var config = require('./config');
var uu = require('underscore');
module.exports  = function (requestedPath, payload, token){
  // Compile default options from config with requested path and generated headers
  var options = uu.extend({}, config.defaultPortInfo, {
    path: requestedPath,
    headers: generateHeaders(token),
  });
  if (payload == null) {
  // GET without payload
    uu.extend(options, {
      method: "GET"
    });

  } else {
  // Post with payload
    uu.extend(options, {
     method: "POST"
    });
  }
  return options; 
}


// Establish headers to insert into options 
function generateHeaders(token){

  // Default headers from config
  console.log("Default headers retrieved");
  var headers = config.defaultHeaders;

  headers = uu.extend(headers, {
    "X-Auth-Token": token
  });
  // Account for addition of Content-Length with post requests
  return headers;

}