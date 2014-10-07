var Data = require('./Data.js');
var Aggregator = require('./Aggregator.js');

API = {}

API.test = function (req, res , next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.send(200, 'hello world');
  return next();
}

API.tweetVolume = function (req, res , next){
  var period = req.params.period
  Data.getAllTweets()
  .then(function(tweets){ 
    var plottable_data = Aggregator.tweetFrequency(tweets, period);
    res.send(200, plottable_data);
    return next();
  });
}

module.exports = API;
