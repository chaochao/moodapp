console.log("route");
moodApp.config(routes);

function routes($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl:'angular-app/pages/main.html'
  })
  .otherwise({
    redirectTo: '/'
  })
}