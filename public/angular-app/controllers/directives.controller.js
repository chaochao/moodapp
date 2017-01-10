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
    delete $window.sessionStorage.token;
    delete $window.sessionStorage.username;
    $location.path('/');
  }

  $scope.login= function(){
    console.log("hi");
    console.log($scope.username);
    console.log($scope.password);
    if($scope.username && $scope.password){
      var loginUser = {
      username: $scope.username,
      password: $scope.password
      }
      //TODO: create a service
      $http.post('/api/login',loginUser)
      .then(function(res){
        if(res.data.success){
          console.log(jwtHelper);

          var decrptToken = jwtHelper.decodeToken(res.data.token);
          
          AuthFactory.isLoggedIn = true;
          AuthFactory.username = decrptToken.username;
          
          $window.sessionStorage.username = decrptToken.username;
          $window.sessionStorage.token = res.data.token;
          $scope.username = ''
          $scope.password = ''
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