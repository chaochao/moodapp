moodApp.config(routes);

function routes($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl:'angular-app/pages/main.html',
    controller: 'MainController as vm'
  })
  .when('/ownmood', {
    templateUrl:'angular-app/pages/ownmood.html',
    controller: 'OwnMoodController as vm'
  })
  .when('/othermoods', {
    templateUrl:'angular-app/pages/othermoods.html',
    controller: 'OtherMoodsController as vm'
  })
  .otherwise({
    redirectTo: '/'
  })
}