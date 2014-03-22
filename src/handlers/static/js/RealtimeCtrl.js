function contains(str, substr) {
  return str.indexOf(substr) != -1;  
}

var redis_prefix = "kg-narrative-roulette";

function prefix(str) {
  return redis_prefix + str;
}

var readers_key = "readers";
var writers_key = "writers";
function increment(key) {
  return $.get("localhost:7379/INCR/" + prefix(key));
}
function decrement(key) {
  return $.get("localhost:7379/DECR/" + prefix(key));
}

function publish(channel, obj) {
 return $.get("localhost:7379/PUBLISH/" + prefix(channel) + "/" + JSON.stringify(obj)); 
}
function subscribe(channel) {
  var socket = new WebSocket("ws://localhost:7379/.json");
  socket.onopen = function() {
      socket.send(JSON.stringify(["SUBSCRIBE", prefix(channel)]));
  };
  return socket;
}

function location_dispatch(old_loc, new_loc) {
  if (contains(old_loc, "write")) {
    decrement(writers_key);
  }
  if (contains(new_loc, "write")) {
    increment(writers_key);
  }
  if (contains(old_loc, "read")) {
    decrement(readers_key);
  }
  if (contains(new_loc, "read")) {
    increment(readers_key);
  }
}

function RealtimeCtrl($scope, $rootScope) {
  $rootScope.$on('$locationChangeSuccess', function(event, new_loc, old_loc) {
    console.log("location changed:", old_loc, "->", new_loc);
    $scope.location_dispatch(old_loc, new_loc);
  });
}

window.onbeforeunload = function (e) {
  location_dispatch(window.location.hash, null);
}
