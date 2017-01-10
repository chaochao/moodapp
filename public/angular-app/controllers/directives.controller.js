console.log("directives.controller");
moodApp.controller('NavBarController', NavBarLoginController)
function NavBarLoginController( $scope, $location, $http, AuthFactory, $window, jwtHelper){
  var self = this;
  self.title = "NavBarLoginController";
  $scope.isLoggedIn = function(){
    return AuthFactory.isLoggedIn;
  }
  $scope.logout = function(){
    console.log('logout');
    AuthFactory.isLoggedIn = false;
    AuthFactory.username = '';
    AuthFactory.currentUserId = '';
    delete $window.sessionStorage.token;
    delete $window.sessionStorage.username;
    delete $window.sessionStorage.currentUserId;
    $location.path('/');
  }

  $scope.login= function(){
    if($scope.username && $scope.password){
      var loginUser = {
      username: $scope.username,
      password: $scope.password
      }
      //TODO: create a service
      $http.post('/api/login',loginUser)
      .then(function(res){
        if(res.data.success){
          var decrptToken = jwtHelper.decodeToken(res.data.token);
          AuthFactory.isLoggedIn = true;
          AuthFactory.username = decrptToken.username;
          AuthFactory.currentUserId = decrptToken.id;
          $window.sessionStorage.username = decrptToken.username;
          $window.sessionStorage.token = res.data.token;
          $window.sessionStorage.currentUserId = decrptToken.id;
          $scope.username = ''
          $scope.password = ''
          $window.location.reload();
        }else {
          //show error message
         
        }
      })
      .catch(function(err){
        console.log(err);
        //show error message
        //windows flash
      });  
    } else {
      
    }
  }
}