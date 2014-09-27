var Q = require('q');

Filter = {}

Filter.classifier = function(track_terms, filter_terms) {
  //create a filter which classifies a tweet based on terms
  return function(tweet) {
    debugger;
    var string = JSON.stringify(tweet);

    for(var flag in track_terms){
      var keep = track_terms[flag];
      var no_keep = filter_terms[flag];
      if(matchedTerm(string, no_keep)){
        return 'UNWANTED';
      }else{
        var match = matchedTerm(string, keep, flag);
        if(match) {
          return match;
        }
      } 
    }
    return 'UNWANTED'
  }
}

function matchedTerm(string, terms, flag) {
  if (!terms) return undefined;
  
  var re = new RegExp(terms.join('|'), 'i');
  if(string.search(re) > -1){
    return flag;
  }else{
    return undefined;    
  }
}

module.exports = Filter;
