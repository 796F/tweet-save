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
  tweet: ['id', 'text', 'source', 'truncated', 'contributors', 'retweet_count',
  'favorite_count', 'entities', 'created_at', 'favorited', 'retweeted', 'filter_level', 'possibly_sensitive', 'lang', 
  'userId', 'flag']
}

var flags = ['angular','bootstrap','famous','famous_angular','ionic','meteor','backbone','bmarrionette',
'd3','ember','enyo','react','hammer','jquerymobile','jquery','kendo','knockout','polymer','sencha','threejs','titanium'];

Data.saveUser = function (tweet){
  return knex('users').insert(_pickFields(tweet.user, FIELDS_KEEP.user))
  .then(function(id){
    //object safely stored
    return id;
  }, function(error) {
    if(error.toString().indexOf('ER_DUP_ENTRY:')<0) {
      //not a duplicate entry.  
      console.log('SAVE USER ERROR', _pickFields(tweet.user, FIELDS_KEEP.user), error);
    }
  });
}

Data.saveTweet = function (tweet){
  tweet.userId = tweet.user.id;
  //convert string to timestamps
  tweet.created_at = Math.floor(tweet.timestamp_ms * 0.001);  
  tweet.entities = JSON.stringify(tweet.entities);
  
  return knex('tweets').insert(_pickFields(tweet, FIELDS_KEEP.tweet))
  .then(function(id){
    //safely stored
    return id;
  }, function(error){
    if(error.toString().indexOf('ER_DUP_ENTRY:')<0) {
      //not a duplicate entry.
      tweet.userId = tweet.user.id;
      //convert string to timestamps
      tweet.created_at = Math.floor(tweet.timestamp_ms * 0.001);  
      tweet.entities = JSON.stringify(tweet.entities);
    
      console.log('SAVE TWEET ERROR', tweet, _pickFields(tweet, FIELDS_KEEP.tweet), error);
    }
  });
}

Data.getAllTweets = function () {
  //retrieve tweets for showing.  
  return knex('tweets').select().then(function(data){
    return _formatStream(data, flags);
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

_formatStream = function (data, stream_names) {
  
  var data_streams = {};
  for(var i=0; i<data.length; i++){
    var record = data[i];
    if(data_streams[record.flag] == undefined){
      data_streams[record.flag] = [];
    }
    data_streams[record.flag].push(record.created_at);
  }
  
  return data_streams
}

module.exports = Data;
