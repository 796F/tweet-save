var config = require('./config.js');
var knex = require('knex')({
  dialect: 'mysql',
  connection: config.mysql,
  debug: false
});

Data = {}

FIELDS_KEEP = {
  user: ['id', 'name', 'screen_name', 'location', 'url', 'description', 'protected', 'verified', 'followers_count', 
  'listed_count', 'favourites_count', 'statuses_count', 'utc_offset', 'time_zone', 'geo_enabled', 'lang',
  'contributors_enabled', 'is_translator', 'default_profile', 'friends_count'],
  tweet: ['id', 'text', 'source', 'truncated', 'geo', 'coordinates', 'place', 'contributors', 'retweet_count', 
  'favorite_count', 'entities', 'created_at', 'favorited', 'retweeted', 'filter_level', 'possibly_sensitive', 'lang', 
  'userId', 'flag']
}

Data.saveUser = function (tweet){
  return knex('users').insert(_pickFields(tweet.user, FIELDS_KEEP.user))
  .then(function(id){
    //object safely stored
  }, function(error) {
    //error occured, duplicate entry?  
  });
}

Data.saveTweet = function (tweet){
  tweet.userId = tweet.user.id;
  //convert string to timestamps
  tweet.created_at = Date.parse(tweet.created_at) * 0.001;
  tweet.entities = tweet.entities.toString();

  var new_tweet = _pickFields(tweet, FIELDS_KEEP.tweet);
  debugger;
  return knex('tweets').insert(new_tweet).then(function(data){
    debugger;
  });
}

_pickFields = function (object, whitelist) {
  var newObj = {};
  for(var key in whitelist) {
    var fieldName = whitelist[key];
    newObj[fieldName] = object[fieldName];
  }
  return newObj;
}

module.exports = Data;
