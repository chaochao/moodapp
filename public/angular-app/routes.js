moodApp.config(routes);

function routes($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl:'angular-app/pages/main.html',
    controller: 'MainController as vm'
  })
  .when('/ownmood', {
    templateUrl:'angular-app/pages/onemood.html',
    controller: 'OwnMoodController as vm'
  })
  .when('/othermoods', {
    templateUrl:'angular-app/pages/othermoods.html',
    controller: 'OtherMoodsController as vm'
  })
  .when('/profile',{
    templateUrl: 'angular-app/pages/profile.html',
    controller: 'ProfileController as vm'
  })
  .when('/followings',{
    templateUrl: 'angular-app/pages/followings.html',
    controller: 'FollowingController as vm'
  })
  .when('/followers',{
    templateUrl: 'angular-app/pages/followers.html',
    controller: 'FollowerController as vm'
  }) // need to add visitor page for next step
  .otherwise({
    redirectTo: '/'
  })
}