// Generates JSON from coordinates array
module.exports = function(coordinates){
  return {lat:coordinates[0], lon:coordinates[1]};
}
