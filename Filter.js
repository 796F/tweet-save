var Q = require('q');

Filter = {}

Filter.classifier = function(track_terms, filter_terms) {
  //create a filter which classifies a tweet based on terms
  return function(tweet) {
    var string = JSON.stringify(tweet);
    debugger;
    if(matchedTerm(string, filter_terms)){
      return 'UNWANTED';
    }else{
      return matchedTerm(string, track_terms) || 'UNWANTED';
    } 
  }
}

function matchedTerm(string, terms) {
  for(var organization in terms){
    for(var i=0; i<terms[organization].length; i++){
      var term = terms[organization][i];
      if(string.indexOf(term) > -1){
        return organization;
      }
    }
  }
  //no matches in those terms
  return undefined;
}

module.exports = Filter;
