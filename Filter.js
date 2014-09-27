var Q = require('q');

Filter = {}

Filter.classifier = function(track_terms, filter_terms) {
  //create a filter which classifies a tweet based on terms
  return function(tweet) {
    var string = JSON.stringify(tweet);

    for(var flag in track_terms){
      var keep = track_terms[flag];
      var no_keep = filter_terms[flag];
      if(matchedTerm(string, no_keep)){
        return 'UNWANTED';
      }else{
        return matchedTerm(string, keep, flag) || 'UNWANTED';
      } 

    }
  }
}

function matchedTerm(string, terms, flag) {
  if (!terms) return undefined;
  debugger;

  for(var i=0; i<terms.length; i++){
    var term = terms[i];
    if(string.indexOf(term) > -1){
      return flag;
    }
  }
  //no matches in those terms
  return undefined;
}

module.exports = Filter;
