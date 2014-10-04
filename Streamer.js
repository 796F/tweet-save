var Twitter = require('node-tweet-stream');
var Q = require('q');

var twit = new Twitter({
  consumer_key: 'yGRbE672HgPJUdkNHcFEYfy83',
  consumer_secret: 'AammKw36WGzDFKSFQU5XRr87LkAL0XqtXk6V8kEdz9XEpNcC4I',
  token: '395097148-ssarpIgUjGsn9ylzsPapkzqyatPXpESRKMype0ZB',
  token_secret: 'hmrPFguIGXl4u9UMuk2m8xE6WZUeHpkKPnOV1K7G9wBbx'
});

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
