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

function RealtimeCtrl($scope, $rootScope) {
  $rootScope.$on('$locationChangeSuccess', function(event, new_loc, old_loc) {
    console.log("location changed:", old_loc, "->", new_loc);
  });
}
