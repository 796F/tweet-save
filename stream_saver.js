var Streamer = require('./Streamer.js');
var Data = require('./Data.js');

var TRACK_TERMS = {
  angular: ['angularjs', 'angular.js', '#angularjs', 'angular JS'],
  bootstrap: ['Twitter Bootstrap', 'twbootstrap', '#bootstrap'],
  famous: ['befamous', 'famo.us', 'famo-us'],
  famous_angular: ['famous-angular'],
  ionic: ['ionic framework', 'ionic js', 'ionicjs', 'ionic.js', 'ionicframework', '#ionicjs'],
  meteor: ['meteorjs', 'Meteor JS', 'meteor.js', '@meteorjs']
}

var FILTER_TERMS = {
  ionic: ['hindawi', 'plos', 'legal'],
  meteor: ['meteorological', 'hanged man\'s rose', 'kreyos', 'dee open source', 'mugenguild']
}

var classifier = require('./Filter.js').classifier(TRACK_TERMS, FILTER_TERMS);

Streamer.run(TRACK_TERMS)
.then(_handleResolve, _handleError, _handleTweet);

function _handleTweet(tweet){
  tweet.flag = classifier(tweet);
  //save the tweet with the associated flag.
  Data.saveUser(tweet).then(function() {
    Data.saveTweet(tweet);
  });
}

function _handleResolve(value){
  //should never be called.  
}

function _handleError(err){
  console.log(err);
}

/*

NOT ( OR "meteor society" OR "" OR kreyos OR "dee open source" OR mugenguild)

*/
