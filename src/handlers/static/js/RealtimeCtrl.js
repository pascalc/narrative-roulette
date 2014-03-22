function contains(str, substr) {
  return str.indexOf(substr) != -1;  
}

var redis_prefix = "kg-narrative-roulette";

function prefix(str) {
  return redis_prefix + str;
}

var event_channel = "events"
function publish(channel, obj) {
 return $.get("localhost:7379/PUBLISH/" + prefix(channel) + "/" + JSON.stringify(obj)); 
}
function subscribe(channel) {
  var socket = new WebSocket("ws://localhost:7379/.json");
  socket.onopen = function() {
      socket.send(JSON.stringify(["SUBSCRIBE", prefix(channel)]));
      console.log(channel, "opened");
  };
  return socket;
}

var readers_key = "readers";
var writers_key = "writers";
var realtime_info = {
  readers: undefined,
  writers: undefined
};
function increment(key) {
  return $.get("localhost:7379/INCR/" + prefix(key)).then(function(resp) {
    publish(event_channel, {event: key, value: resp.INCR});
    realtime_info[key] = resp.INCR;
  });
}
function decrement(key) {
  return $.get("localhost:7379/DECR/" + prefix(key)).then(function(resp) {
    publish(event_channel, {event: key, value: resp.DECR});
    realtime_info[key] = resp.DECR;
  });
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
  $scope.realtime_info = realtime_info;
  $rootScope.$on('$locationChangeSuccess', function(event, new_loc, old_loc) {
    console.log("location changed:", old_loc, "->", new_loc);
    location_dispatch(old_loc, new_loc);
  });
}

window.onbeforeunload = function (e) {
  location_dispatch(window.location.hash, null);
}

$(document).ready(function() {
  var socket = subscribe(event_channel);
  socket.onmessage = function(msg) {
    console.log(event_channel, "received:", msg);
  }
});
