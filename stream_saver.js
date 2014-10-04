var Streamer = require('./Streamer.js');
var Data = require('./Data.js');

var TRACK_TERMS = {
  angular: ['angularjs', 'angular.js', '#angularjs', 'angular JS'],
  bootstrap: ['Twitter Bootstrap', 'twbootstrap', '#bootstrap'],
  famous: ['befamous', 'famo.us', 'famo-us'],
  famous_angular: ['famous-angular'],
  ionic: ['ionic framework', 'ionic js', 'ionicjs', 'ionic.js', 'ionicframework', '#ionicjs', '@ionicframework', 'ionic'],
  meteor: ['meteorjs', 'Meteor JS', 'meteor.js', '@meteorjs'],
  backbone: ['Backbone.js', 'backbone js', '@backbone_js', 'backbonejs'],
  bmarrionette: ['backbone marionette', 'backbone.marionette', '@marionettejs'],
  d3: ['D3.js', '@mbostock'],
  ember: ['ember.js', 'ember js', '@emberjs'],
  enyo: ['enyojs', 'enyo.js', '@enyojs'],
  react: ['facebook react', 'react.js', 'react js', '@reactjs'],
  hammer: ['hammer.js'],
  jquerymobile: ['jQuery Mobile', '@jquerymobile'],
  jquery : ['@jquery', '#jquery'],
  kendo: ['kendo ui', '@kendoui'],
  knockout: ['knockoutjs', 'knockout js', 'knockout.js', '@knockout_js'],
  polymer: ['polymerjs', '@polymer'],
  sencha: ['sencha', '@sencha'],
  threejs: ['Three.js', 'threejs', 'Three JS', '@Learningthreejs'],
  titanium: ['@appcel_titans', 'titaniumjs', 'titanium js', 'appcelerator']
}

var FILTER_TERMS = {
  ionic: ['hindawi', 'plos', 'legal'],
  meteor: ['meteorological', 'hanged man\'s rose', 'kreyos', 'dee open source', 'mugenguild'],
  backbone: ['backbone media'],
  d3: ['D3 Technologies'],
  jquery: TRACK_TERMS.jquerymobile,
  titanium: ['neurosurgeon', 'neurosurgery']
}

var classifier = require('./Filter.js').classifier(TRACK_TERMS, FILTER_TERMS);

Streamer.run(TRACK_TERMS)
.then(_handleResolve, _handleError, _handleTweet);

function _handleTweet(tweet){
  console.log('notify of tweet at', new Date());
  
  //save the tweet with the associated flag.
  try{
    tweet.flag = classifier(tweet);
    Data.saveUser(tweet).then(function() {
      Data.saveTweet(tweet);
    });
  }catch(err){
    console.log('error in classifying and saving the tweet.')
  }
  
}

function _handleResolve(value){
  //should never be called.  
  console.log('weird, the promise resolved.', value);
}

function _handleError(err){
  console.log('error from promise, something in streamer rejected', err);
}

/*

NOT ( OR "meteor society" OR "" OR kreyos OR "dee open source" OR mugenguild)

*/

