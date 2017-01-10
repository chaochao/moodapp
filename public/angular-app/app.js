var moodApp = angular.module('moodApp',['ngRoute', 'angular-jwt', 'highcharts-ng']);
moodApp.config(function($httpProvider){
  
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