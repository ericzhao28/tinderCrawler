// Default network values

exports.defaultHeaders = function(token){
return ({
  'Content-Type': 'application/json',
  'platform': 'ios',
  'app_version': '3',
  'X-Auth-Token': token
});
}
// Default network options
exports.defaultPortInfo = {
  host: 'api.gotinder.com',
  port: 443,
}