//takes data, aggregates it based on options, spits it out in a specific format.  

Aggregator = {};

var S_PER_HOUR = 3600;



Aggregator.tweetFrequency = function (all_tweets, T) {
  //given collection of time-stamp streams, return frequency over period T days
  var results = {};
  for(var key in all_tweets){
    var data = all_tweets[key].sort();

    var T_IN_S = T * S_PER_HOUR;
    var start_time = undefined;
    var counter = 0;
    for(var i in data){
      if(start_time == undefined){
        //first object, set this as our starting window.  
        start_time = data[i];
        results.start_time = start_time;
      }else if(data[i] > start_time + T_IN_S){
        start_time = start_time + T_IN_S;
        if(results[key] == undefined) {
          results[key] = [];
        }
        results[key].push(counter-1);
        counter = 0;
      }
      counter++;
    }
  }
  return results;
}

module.exports = Aggregator;
