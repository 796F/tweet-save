var MAIN = {}

MAIN.toggleAllSeries = function(button) {
  var chart = $('#chart').highcharts();
  if(chart.seriesHidden) {
    button.text('Hide All Series');
    chart.seriesHidden = false;
    for(var i in chart.series){
      chart.series[i].show();
    }
  }else{
    button.text('Show All Series');
    chart.seriesHidden = true;
    for(var i in chart.series){
      chart.series[i].hide();
    }  
  }
}

MAIN.post = function (period) {
  $.post("tweetVolume", { period : period }, function(data) {
    _makeChart(data);
  });
}

MAIN.init = function() {
    //initiate
    
  $('#hide_series_button').click(function () {
    MAIN.toggleAllSeries($(this));
  });

  $('button.granularity_button').click(function() {
    var period;
    switch($(this).text()){
      case 'Hour':
        period = 1;
        break;
      case 'Day':
        period = 24;
        break;
      case 'Week':
        period = 24 * 7;
        break;
      case 'Month':
        period = 24 * 30;
        break;
      default:
        return;
    }
    MAIN.post(period);
  });

  $.post("tweetVolume", { period : 1 }, function(data) {
      _makeChart(data);
      _adjustSize();
  });
}

/* INIT RUN */

$(MAIN.init);

$(window).resize(function() {
  _adjustSize();
});

/* PRIVATE */

function _makeChart(data) {
  $('#chart').highcharts({
    chart: {
      type: 'spline',
      zoomType: 'x',
    },
    title: {
      text: 'Tweet Volume'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Time'
        }
    },
    yAxis: [{ 
      min: 0
    }],
    tooltip: {
      crosshairs: true,
      shared: true
    },
    plotOptions : {
      series : {
        pointStart: data.start_time*1000 - 203760*1000, //ms of the date.  
        pointInterval: 3600 * 1000 //hourly interval
      }
    },
    series: _convertData(data)
  });
}

function _adjustSize(){
  height = $(window).height() * 0.75;
  width = $(window).width();
  var chart = $('#chart').highcharts();
  chart.setSize(width, height, doAnimation = true);
}

function _convertData(data){
  var series = [];
  for(var target_name in data) {
    if(target_name == 'UNWANTED' || target_name == 'start_time'){
      continue;
    }
    series.push({
      name: target_name,
      data: data[target_name],
      lineWidth : 1,
      marker : {
          enabled : false
      }
    });
  }
  return series;
}
