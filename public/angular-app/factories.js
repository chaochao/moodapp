console.log("factories");
moodApp.factory('AuthFactory', function() {
  return {
    username: '',
    isLoggedIn: false
  };
});



moodApp.factory('AuthInterceptor', AuthInterceptor)

function AuthInterceptor($location, $q, $window, AuthFactory) {
  return {
    request: request,
    response: response,
    responseError: responseError
  };
  
  function request(config) {
    config.headers = config.headers || {};
    if ($window.sessionStorage.token) {
      config.headers.Authorization = $window.sessionStorage.token;
    }
    return config;
  }

  function response(response) {
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      if ($window.sessionStorage.token && !AuthFactory.isLoggedIn) {
        AuthFactory.isLoggedIn = true
        AuthFactory.username = $window.sessionStorage.username;
      }
    }
    if (response.status === 401) {
      AuthFactory.isLoggedIn = false;
      AuthFactory.username = '';
    }
    return response || $q.when(response);
  }

  function responseError(rejection) {
    if (rejection.status === 401 || rejection.status === 403) {
      delete $window.sessionStorage.token;
      AuthFactory.isLoggedIn = false;
      $location.path('/');
    }
    return $q.reject(rejection);
  }
}
