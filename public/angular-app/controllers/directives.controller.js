console.log("directives.controller");
moodApp.controller('NavBarController', NavBarLoginController)
function NavBarLoginController( $scope, $location, $http, AuthFactory, $window, jwtHelper, Flash){
  var self = this;
  self.title = "NavBarLoginController";
  $scope.loggedInUser = AuthFactory.username;
  $scope.isLoggedIn = function(){
    return AuthFactory.isLoggedIn;
  }
  $scope.logout = function(){
    console.log('logout');
    var message = 'See you '+ AuthFactory.username +'!';
    Flash.create('danger', message, 2000, {container: "login-flash"});
    AuthFactory.isLoggedIn = false;
    AuthFactory.username = '';
    AuthFactory.currentUserId = '';
    delete $window.sessionStorage.token;
    delete $window.sessionStorage.username;
    delete $window.sessionStorage.currentUserId;
    $window.location.reload();
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
          $location.path('/');
          $window.location.reload();
          var message = 'Welcom back '+ AuthFactory.username +' Logged In !';
          Flash.create('success', message, 2000, {container: "login-flash"});
        }
      })
      .catch(function(err){
        console.log(err);
        $scope.username = ''
          $scope.password = ''
        var message = 'Sorry, wrong username or password.';
        Flash.create('danger', message, 2000, {container: "login-flash"});
      });  
    } else {
      console.log("no enough info");
      var message = 'Please provide username and password';
      Flash.create('warning', message, 2000, {container: "login-flash"});
    }
  }
  $scope.success = function() {
    console.log('success')
    var message = '<strong>Well done!</strong> You successfully read this important alert message.';
    Flash.create('success', message, 2000, {container: "login-flash"});
  };
}
