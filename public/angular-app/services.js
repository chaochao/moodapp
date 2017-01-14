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