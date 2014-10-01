var MAIN = {}


MAIN.init = function() {
    $.post("tweetVolume", { period : 1 }, function(data) {
      var series = [];
      for(var target_name in data) {
        if(target_name == 'UNWANTED'){
          continue;
        }
        series.push({
          name: target_name,
          data: data[target_name]
        });
      }
      $('#chart').highcharts({
        chart: {
          type: 'spline',
          zoomType: 'x',
        },
        title: {
          text: 'hourly tweet volume'
        },
        plotOptions : {
          series : {
            cursor : 'pointer',
            events : {
              click: function(ev){
                
              }
            }
          }
        },
        series: series
    });
  });
}

$(MAIN.init);
