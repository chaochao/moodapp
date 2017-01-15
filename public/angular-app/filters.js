moodApp.filter('reverse', function() {
  return function(items) {
    return  items? items.slice().reverse(): items;
  };
});