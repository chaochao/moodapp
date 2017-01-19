console.log("main.controller");
moodApp.controller('MainController', MainController)

function MainController($scope) {
  var self = this;
  $scope.title = "scope main"
  this.title = " self main"
}

moodApp.controller('ProfileController', ProfileController)

function ProfileController(HttpServices, $scope, AuthFactory) {
  var self = this;
  var userUrl = '/api/users/' + AuthFactory.currentUserId;
  //need to make it easier... maybe a loop
  $scope.showGender = true;
  $scope.showDesc = true;
  $scope.showEditGen = false;
  $scope.showEditDesc = false;

  $scope.mousehover = function (attr) {
    // $scope.showEdit = !$scope.showEdit;
    $scope[attr] = !$scope[attr];
  }

  HttpServices.get(userUrl).then(function(res){
      $scope.user = res.data;
      console.log($scope.user);
      $scope.gender = $scope.user.gender;
      $scope.description = $scope.user.description;
  })

  // may create a service
  $scope.changeGender = function(){
    if($scope.gender !== $scope.user.gender){
      HttpServices.put(userUrl, {gender: $scope.gender})
      .then(function(res){
        $scope.user.gender = res.data.gender;
      });
    }
    $scope.showGender = !$scope.showGender;
  }

  $scope.changeDesc = function(){
    console.log($scope.description);
    if($scope.description !== $scope.user.description){
      HttpServices.put(userUrl,{description: $scope.description})
      .then(function(res){
        $scope.user.description = res.data.description;
      });
    }
   $scope.showDesc = !$scope.showDesc;
  }
}

moodApp.controller('OwnMoodController', OwnMoodController)

function OwnMoodController($window, $scope, $http, AuthFactory, MoodServices) {
  // when in this page, must logged in
  var self = this;
  $scope.chartConfig = MoodServices.genHighChartBasicConfig();
  $scope.chartId = 'ownchart';
  $scope.currentUser = {};
  $scope.loadingCompleted = false;
  var moodUrl = '/api/users/' + AuthFactory.currentUserId + '/moods';
  var userUrl = '/api/users/' + AuthFactory.currentUserId;
  $scope.isLoggedIn = function() {
    return AuthFactory.isLoggedIn;
  }
  if (AuthFactory.isLoggedIn) {
    $http.get(userUrl)
    .then(function(response) {
      $scope.moods = response.data.moods;
      $scope.currentUser = response.data;
      var moodLevelArray = [];
      $scope.moods.forEach(function(mood) {
        var moodPoint = MoodServices.genMoodPoint(mood);
        moodLevelArray.push(moodPoint);
        mood.backgroundColor = MoodServices.genBackgroundColor(mood.level);
      });
      $scope.chartConfig.series.push({
        name: 'mood',
        data: moodLevelArray
      });
      $scope.loadingCompleted = true;
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.submitMoodLevel = function() {
    var timestamp = Date.now();
    var moodPoint = [timestamp, $scope.newLevel];
    var newMood = {
      level: $scope.newLevel,
      description: $scope.description,
      created_at: timestamp
    }
    $http.post(moodUrl, newMood).then(function(res) {
      // For display
      res.data.mood.backgroundColor = MoodServices.genBackgroundColor(res.data.mood.level)
      $scope.moods.push(res.data.mood);
      $scope.chartConfig.series[0].data.push(moodPoint);
      $scope.newLevel = '';
      $scope.description = '';
    })
    .catch(function(err) {
      console.log(err);
    });
  }
}

moodApp.controller('OtherMoodsController', OtherMoodsController)

function OtherMoodsController($http, $scope, AuthFactory, MoodServices) {
  var self = this;
  $scope.title = "scope other";
  this.title = " self other";
  $scope.loadingCompleted = false;
  $scope.chartConfigs = []
  $scope.moodPointsArray = [];
  var originalMoodsArray = [];
  userUrl = '/api/users';
  $http.get(userUrl).then(function(response) {
      response.data.forEach(function(user) {
        if (AuthFactory.isLoggedIn) {
          if (user._id !== AuthFactory.currentUserId) {
            originalMoodsArray.push(user.moods);
          }
        } else {
          originalMoodsArray.push(user.moods);
        }
      });
      console.log(originalMoodsArray);
      originalMoodsArray.forEach(function(moodsForOneUser, index) {
        var moodPoints = []
        moodsForOneUser.forEach(function(mood) {
          moodPoints.push(MoodServices.genMoodPoint(mood));
        })
        $scope.moodPointsArray.push(moodPoints);
        var newChartConfig = MoodServices.genHighChartBasicConfig();
        newChartConfig.series.push({
          data: moodPoints
        });
        $scope.chartConfigs.push({
          id: "chart" + index,
          config: newChartConfig
        });
      });
      $scope.loadingCompleted = true;
    })
    .catch(function(err) {
      console.log(err);
    });
  // create each config


}