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

moodApp.directive('personcard', personcard);
function personcard(){
  return {
    restrict: 'E',
    templateUrl:'angular-app/directives/person-card.html',
    replace: true,
    scope:{
      person: '='
    }
  }
}
