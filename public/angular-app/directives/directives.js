moodApp.directive('navBar', navBar);
function navBar(){
  return {
    restrict: 'E',
    templateUrl:'angular-app/directives/navBar.html',
    controller: 'NavBarController',
    controllerAs: 'vm',
    replace: true
  };
}

moodApp.directive('mood', mood);
function mood(){
  return {
    restrict: 'E',
    templateUrl:'angular-app/directives/mood.html',
    replace: true,
    scope:{
      mood: '=',
      deleteMood: '&'
    }
  }
}