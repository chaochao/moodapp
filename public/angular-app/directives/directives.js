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