const fs = require('fs');
const path = require("path");
const download = require("image-downloader");
const uuidv4 = require('uuid/v4');

fs.readdir("./master", function(err, list) {
  list.forEach(function(file){
    file = path.resolve("./master", file);
    var js = require(file);
    js["results"].forEach(function(element) {
      var name = element["name"];
      var bio = element["bio"].replace(/(\r\n\t|\n|\r\t)/gm,"");
      var pic = element["photos"][0]["url"];
      console.log(bio);
    });
  });
});

