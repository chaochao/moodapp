var moodApp = angular.module('moodApp',['ngRoute', 'angular-jwt', 'highcharts-ng', 'ngAnimate', 'ngFlash', 'angular-loading-bar']);
moodApp.config(function($httpProvider, cfpLoadingBarProvider){
  console.log("config");
  cfpLoadingBarProvider.includeBar = true;
  cfpLoadingBarProvider.includeSpinner = true;
  cfpLoadingBarProvider.latencyThreshold = 500;

  $httpProvider.interceptors.push('AuthInterceptor');
  $httpProvider.defaults.transformRequest = function(obj) {
    var str = [];
    for(var p in obj){
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
  };
  $httpProvider.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded; charset=UTF8';
});
