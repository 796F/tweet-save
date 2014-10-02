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
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        plotOptions : {
          series : {
            cursor : 'pointer',
            events : {
              click: function(ev){
                
              }
            },
            pointStart: data.start_time*1000 - 203760*1000, //ms of the date.  
            pointInterval: 3600 * 1000    //hourly interval
          }
        },
        series: series
    });
  });
}

$(MAIN.init);
