console.log("main.controller");
moodApp.controller('MainController', MainController)

function MainController($scope) {
  var self = this;
  $scope.title = "scope main"
  this.title = " self main"
}

moodApp.controller('OwnMoodController', OwnMoodController)

function OwnMoodController($scope, $http, AuthFactory) {
  // when in this page, must logged in
  var self = this;
  $scope.title = "scope own";
  this.title = " self own";
  var moodUrl = '/api/users/' + AuthFactory.currentUserId + '/moods';
  if (AuthFactory.isLoggedIn) {
    $http.get(moodUrl)
    .then(function(moods) {
      $scope.moods = moods.data;
      $scope.moodLevelArray = [];
      $scope.moods.forEach(function(mood) {
        $scope.moodLevelArray.push(mood.level);
      });
      console.log($scope.moodLevelArray);
      $scope.chartConfig.series.push({
        data: $scope.moodLevelArray
      })
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.isLoggedIn = function(){
    return AuthFactory.isLoggedIn;
  }

  $scope.submitMoodLevel = function() {
    console.log("submit");
    console.log($scope.newLevel);
    var mood = {
      level: $scope.newLevel
    }
    $http.post(moodUrl,mood).then(function(res){
      console.log(res);
      $scope.moodLevelArray.push($scope.newLevel)
      $scope.moods.push(res.data.mood);
      $scope.newLevel = ''
    })
    .catch(function(err){
      console.log(err);
    });
  }

  $scope.addSeries = function() {
    var rnd = []
    for (var i = 0; i < 10; i++) {
      rnd.push(Math.floor(Math.random() * 20) + 1)
    }
    $scope.chartConfig.series.push({
      data: rnd
    })
  }

  $scope.chartConfig = {
    options: {
      //This is the Main Highcharts chart config. Any Highchart options are valid here.
      //will be overriden by values specified below.
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
    //The below properties are watched separately for changes.
    //Series object (optional) - a list of series using normal highcharts series options.
    series: [],
    //Title configuration (optional)
    title: {
      text: 'your mood'
    },
    //Boolean to control showng loading status on chart (optional)
    //Could be a string if you want to show specific loading text.
    loading: false,
    //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
    //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
    xAxis: {
      currentMin: 0,
      currentMax: 20,
      title: {
        text: 'values'
      }
    },
    //Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
    useHighStocks: false,
    //size (optional) if left out the chart will default to size of the div or something sensible.
    size: {
      width: 400,
      height: 300
    },
    //function (optional)
    func: function(chart) {
      //setup some logic for the chart
    }
  };



}

moodApp.controller('OtherMoodsController', OtherMoodsController)

function OtherMoodsController($scope) {
  var self = this;
  $scope.title = "scope other";
  this.title = " self other";
}