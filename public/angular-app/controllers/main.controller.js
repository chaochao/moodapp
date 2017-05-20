console.log('main.controller');
moodApp.controller('MainController', MainController)

function MainController($scope, AuthFactory) {
  var self = this;
  $scope.title = 'scope main'
  this.title = ' self main'
  $scope.isLoggedIn = function() {
    return AuthFactory.isLoggedIn;
  }
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

  $scope.mousehover = function(attr) {
    // $scope.showEdit = !$scope.showEdit;
    $scope[attr] = !$scope[attr];
  }

  HttpServices.get(userUrl).then(function(res) {
    $scope.user = res.data;
    console.log($scope.user);
    $scope.gender = $scope.user.gender;
    $scope.description = $scope.user.description;
  })

  // may create a service
  $scope.changeGender = function() {
    if ($scope.gender !== $scope.user.gender) {
      HttpServices.put(userUrl, {
          gender: $scope.gender
        })
        .then(function(res) {
          $scope.user.gender = res.data.gender;
        });
    }
    $scope.showGender = !$scope.showGender;
  }

  $scope.changeDesc = function() {
    console.log($scope.description);
    if ($scope.description !== $scope.user.description) {
      HttpServices.put(userUrl, {
          description: $scope.description
        })
        .then(function(res) {
          $scope.user.description = res.data.description;
        });
    }
    $scope.showDesc = !$scope.showDesc;
  }
}

moodApp.controller('OwnMoodController', OwnMoodController)

function OwnMoodController($window, $scope, $http, AuthFactory, MoodChartServices) {
  // when in this page, must logged in
  var self = this;
  $scope.chartConfig = MoodChartServices.genHighChartBasicConfig();
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
          var moodPoint = MoodChartServices.genMoodPoint(mood);
          moodLevelArray.push(moodPoint);
          mood.backgroundColor = MoodChartServices.genBackgroundColor(mood.level);
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
      res.data.mood.backgroundColor = MoodChartServices.genBackgroundColor(res.data.mood.level)
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

function OtherMoodsController(HttpServices, $scope, AuthFactory, MoodChartServices) {
  $scope.followsCheckList = {};
  $scope.loadingCompleted = false;
  $scope.otherMoods = [];
  $scope.currentUser = {};
  // var originalMoodsArray = [];
  var userUrl = '/api/users/';
  var followUrl = userUrl + AuthFactory.currentUserId + '/follows';
  $scope.isLoggedIn = function() {
    return AuthFactory.isLoggedIn;
  }
  var genMoodConfig = function(user) {
    var chartConfig = MoodChartServices.genHighChartBasicConfig();
    var moodDataPoints = [];
    user.moods.forEach(function(mood) {
      moodDataPoints.push(MoodChartServices.genMoodPoint(mood));
    });
    // set up config
    chartConfig.series.push({
      data: moodDataPoints
    })
    chartConfig.title.text = user.username;
    var moodObj = {
      user: user,
      config: chartConfig
    };
    return moodObj;
  }

  $scope.follow = function(followId) {
    console.log('follow ' + followId);
    HttpServices.post(followUrl, {
        follows: followId
      })
      .then(function(res) {
        console.log(res);
        $scope.followsCheckList[followId] = true;
      })
  };
  $scope.unfollow = function(unfollowId) {
    var unfollowUrl = followUrl + '/' + unfollowId;
    console.log('unfollow ' + unfollowUrl);
    HttpServices.delete(unfollowUrl)
      .then(function(res) {
        console.log(res);
        $scope.followsCheckList[unfollowId] = false;
      })
  };

  HttpServices.get(userUrl).then(function(response) {
    var users = response.data;
    users.forEach(function(user) {
      if (AuthFactory.isLoggedIn) {
        if (user._id !== AuthFactory.currentUserId) {
          $scope.otherMoods.push(genMoodConfig(user));
        } else {
          $scope.currentUser = user;
        }
      } else {
        $scope.otherMoods.push(genMoodConfig(user));
      }
    })
    $scope.loadingCompleted = true;
  }).then(function(response) {
    $scope.otherMoods.forEach(function(mood) {
      $scope.followsCheckList[mood.user._id] = ($scope.currentUser.follows.indexOf(mood.user._id) > -1);
    })
  });
}

moodApp.controller('FollowerController',FollowerController)

function FollowerController(HttpServices, $scope, AuthFactory){
  $scope.followerList = [];
  var currentUserId = AuthFactory.currentUserId;
  var followersUrl = '/api/users/'+currentUserId+'/followers';
  HttpServices.get(followersUrl).then(function(res){
    $scope.followerList = res.data;
  })
}

moodApp.controller('FollowingController',FollowingController)

function FollowingController(HttpServices, $scope, AuthFactory){
  var currentUserId = AuthFactory.currentUserId;
  var followingUrl = '/api/users/'+currentUserId+'/follows';
  $scope.followList =[];
  //get following info
  HttpServices.get(followingUrl).then(function(res){
    $scope.followList = res.data;
  })
}

