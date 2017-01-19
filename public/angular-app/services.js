console.log("services");
moodApp.service('MoodServices', MoodServices);

function MoodServices() {
  this.foo = function() {
    console.log('bar');
  }

  this.genMoodPoint = function(mood) {
      var moodTime = new Date(mood.created_at);
      return [moodTime.getTime(), mood.level];
    }
    // Ugly as hell, need to change soon.
  var ColorMap = {
    '0': '#000000',
    '1': '#090023',
    '2': '#02073e',
    '3': '#091275',
    '4': '#000fbf',
    '5': '#005ebf',
    '6': '#0070bf',
    '7': '#0093bf',
    '8': '#00bf93',
    '9': '#00bf67',
    '10': '#03bf00'
  }
  this.genBackgroundColor = function(level) {
    return ColorMap[level];
  }
  this.genHighChartBasicConfig = function() {
    return {
      options: {
        chart: {
          type: 'line'
        },
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold'
          }
        }
      },
      series: [],
      title: {
        text: 'your mood'
      },
      subtitle: {
        text: 'subtitle',
        x: -20
      },
      loading: false,
      xAxis: {
        title: {
          text: 'time'
        },
        type: 'datetime'
      },
      yAxis: {
        max: 10,
        min: 0
      },
      size: {
        height: 300
      }
    };

  }
}

moodApp.service('HttpServices', HttpServices);

function HttpServices($http) {
  this.put = function(url, obj, options) {
    return $http.put(url, obj, options).catch(function(err) {
      console.log(err);
    })
  }

  this.get = function(url) {
    return $http.get(url).catch(function(err) {
      console.log(err);
    })
  }
}