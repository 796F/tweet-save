var Twitter = require('node-tweet-stream');
var Q = require('q');
var config = require('./config');
var twit = new Twitter(config.twitter);

var Streamer = {};

//initialize a streamer with tracking terms and filter out terms ...
Streamer.run = function(terms) {
  return Q.Promise(function(resolve, reject, notify){
    
    for(var framework in terms){
      for(var termKey in terms[framework]){
        twit.track(terms[framework][termKey]);
      }
    }

    twit.on('tweet', function (tweet) {
      //notify whenever tweet received
      console.log('received tweet at', new Date());
      notify(tweet);
    });

    twit.on('error', function (err) {
      console.log('streamer error at', new Date());
      reject(err);
    });

  });
}

module.exports = Streamer;
