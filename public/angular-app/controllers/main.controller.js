console.log("main.controller");
moodApp.controller('MainController', MainController)
function MainController($scope){
  var self = this;
  $scope.title ="scope main"
  this.title =" self main"
}

moodApp.controller('OwnMoodController', OwnMoodController)
function OwnMoodController($scope){
  var self = this;
  $scope.title ="scope own"
  this.title =" self own"
}

moodApp.controller('OtherMoodsController', OtherMoodsController)
function OtherMoodsController($scope){
  var self = this;
  $scope.title ="scope other"
  this.title =" self other"
}