console.log("main.controller");
moodApp.controller('MainController', MainController)

function MainController($scope) {
  var self = this;
  $scope.title = "scope main"
  this.title = " self main"
}

moodApp.controller('OwnMoodController', OwnMoodController)

function OwnMoodController($window, $scope, $http, AuthFactory) {
  // when in this page, must logged in
  var self = this;
  var moodUrl = '/api/users/' + AuthFactory.currentUserId + '/moods';

  $scope.isLoggedIn = function() {
    return AuthFactory.isLoggedIn;
  }

  genMoodPoint = function(mood) {
    var moodTime = new Date(mood.created_at);
    return [moodTime.getTime(), mood.level];
  }

  if (AuthFactory.isLoggedIn) {
    $http.get(moodUrl)
      .then(function(respond) {
        var moodLevelArray = [];
        respond.data.forEach(function(mood) {
          var moodPoint = genMoodPoint(mood);
          moodLevelArray.push(moodPoint);
        });
        $scope.chartConfig.series.push({
          name: 'mood',
          data: moodLevelArray
        })
      })
      .catch(function(err) {
        console.log(err);
      })
  }

  $scope.submitMoodLevel = function() {
    console.log("submit");
    console.log($scope.newLevel);

    var timestamp = Date.now();
    var moodPoint = [timestamp, $scope.newLevel];
    // $scope.chartConfig.series[0].data.push(moodPoint);

    var newMood = {
      level: $scope.newLevel,
      created_at: timestamp
    }
    $http.post(moodUrl, newMood).then(function(res) {
        console.log(res);
        // var moodPoint = mood
        // $scope.moodLevelArray.push(moodPoint)
        // $scope.moods.push(res.data.mood);
        $scope.chartConfig.series[0].data.push(moodPoint);
        // $window.location.reload();
        $scope.newLevel = '';
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  $scope.chartConfig = {
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
      width: 400,
      height: 300
    }
  };



}

moodApp.controller('OtherMoodsController', OtherMoodsController)

function OtherMoodsController($scope) {
  var self = this;
  $scope.title = "scope other";
  this.title = " self other";
}