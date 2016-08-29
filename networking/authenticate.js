var http = require("https");
var request = require("request");

module.exports = function(secretTok, cb){
  var options = { 
  method: 'POST',
  url: 'https://api.gotinder.com/auth',
  headers: 
    { 'postman-token': 'dd3d2dfb-ad91-4517-6e82-2f43aa574a8e',
   'cache-control': 'no-cache',
    'content-type': 'application/json' },
  body: 
    { facebook_token: secretTok,
      facebook_id: '100012559392664' },
  json: true 
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    cb(body.token);
  }); 
};
