console.log("factories");
moodApp.factory('AuthFactory', function() {
  return {
    username: '',
    isLoggedIn: false,
    currentUserId: ''
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
      config.headers.authorization = $window.sessionStorage.token;
    }
    return config;
  }

  function response(response) {
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      if ($window.sessionStorage.token && !AuthFactory.isLoggedIn) {
        AuthFactory.isLoggedIn = true
        AuthFactory.username = $window.sessionStorage.username;
        AuthFactory.currentUserId = $window.sessionStorage.currentUserId;
      }
    }
    if (response.status === 401) {
      AuthFactory.isLoggedIn = false;
      AuthFactory.username = '';
      AuthFactory.currentUserId = '';
    }
    return response || $q.when(response);
  }

  function responseError(rejection) {
    if (rejection.status === 401 || rejection.status === 403) {
      delete $window.sessionStorage.token;
      AuthFactory.isLoggedIn = false;
      AuthFactory.username = '';
      AuthFactory.currentUserId = '';
      $location.path('/');
    }
    return $q.reject(rejection);
  }
}
