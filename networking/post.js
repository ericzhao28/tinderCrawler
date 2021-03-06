// Unnecessary (add in later)

// Post.js generates post_data 

// Requirements include unspecified data processing module depending on POST request specifications
//var processingModule = require(moduleLink);
var fs = require('fs');
var queryString = require('queryString');

module.exports = function(moduleLink, rawFileLink, cb){

  // Initiate file reading
  fs.readFile(rawFileLink, 'utf-8', function (err, data) {
    // Check errors during read proccess
    if (err) { 
      console.log("FATAL An error occurred trying to read in the file: " + err);
      process.exit(-2);
    } 
    // Make sure there's data before we post it
    if(data) { 
      PostCode(data, cb);
    } 
    else { 
      console.log("No data to post");
      process.exit(-1);
    } 
  });

  // Process string for post protocol, is called during async file read, refers to callback after completion
  function PostCode(codestring, cbToRequest) {
    // Build the post string from an object
    var post_data = querystring.stringify({
      'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
      'output_format': 'json',
      'output_info': 'compiled_code',
      'warning_level' : 'QUIET',
      'js_code' : codestring      
    });                           
    cbToRequest(post_data);
  }

}
