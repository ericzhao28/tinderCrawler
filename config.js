// Default network values

exports.defaultHeaders = function(token){
return ({
  'content-type': 'application/json',
  'platform': 'ios',
  'app_version': '3',
  'host':'api.gotinder.com',
  'x-auth-token': token,
  'port':443,
  "cache-control": "no-cache"
});
}
// Default network options
exports.defaultPortInfo = {
  hostname: 'api.gotinder.com',
  port: 443,
}
