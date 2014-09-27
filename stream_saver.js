var Streamer = require('./Streamer.js');
var Data = require('./Data.js');

var TRACK_TERMS = {
  angular: ['angularjs', 'angular.js', '#angularjs', 'angular JS'],
  bootstrap: ['Twitter Bootstrap', 'twbootstrap'],
  famous: ['befamous', 'famo.us', 'famo-us'],
  famous_angular: ['famous-angular'],
  ionic: ['ionic framework', 'ionic js', 'ionicjs', 'ionic.js', 'ionicframework'],
  meteor: ['meteorjs', 'Meteor JS', 'meteor.js']
}

var FILTER_TERMS = {
  ionic: ['hindawi', 'plos'],
  meteor: []
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

NOT ("plos" OR hindawi OR "framework for understanding" OR "legal framework")

at_mentions:meteorjs OR (Meteor AND ("open-source" OR "open source" OR "web app")) OR meteorjs OR raw:meteor.js OR meteorJS
NOT (meteorological OR "meteor society" OR "hanged man's rose" OR kreyos OR "dee open source" OR mugenguild)

*/
