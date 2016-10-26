var http = require("https");

var options = {
  "method": "POST",
  "hostname": "api.gotinder.com",
  "port": null,
  "path": "/user/ping",
  "headers": {
    "content-type": "application/json",
    "platform": "ios",
    "app_version": "3",
    "host": "api.gotinder.com",
    "x-auth-token": "39303555-08c9-4e4b-a740-e27585a69ae5",
    "port": "443",
    "cache-control": "no-cache",
    "postman-token": "65a71e97-cc63-376e-9a21-17c197623cbd"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write("{ \"lat\": \"30\", \"lon\": \"30\" }");
req.end();