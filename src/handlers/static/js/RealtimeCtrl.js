function contains(str, substr) {
  return str.indexOf(substr) != -1;  
}

var redis_key = "kg-narrative-roulette";
function prefix(s) {
  return redis_key + ":" + s;
}

var submission_channel = "submissions";
function publish(channel, obj) {
  var body = "PUBLISH/" + prefix(channel) + "/" + encodeURIComponent(JSON.stringify(obj));
  return $.post("http://narrativeroulette.com:7379/", body); 
}
function subscribe(channel) {
  var socket = new WebSocket("ws://narrativeroulette.com:7379/.json");
  socket.onopen = function() {
      socket.send(JSON.stringify(["SUBSCRIBE", prefix(channel)]));
      console.log(channel, "opened");
  };
  return socket;
}

function apply_realtime() {
  angular.element($(".realtime-info")).scope().$apply();
}

var submissions = [];
function RealtimeCtrl($scope, $rootScope) {
  $scope.num_submissions = function() {
    return submissions.length;
  }
}

$(document).ready(function() {
  var socket = subscribe(submission_channel);
  socket.onmessage = function(msg) {
    var data = JSON.parse(msg.data);
    console.log(submission_channel, "received:", data);
    if (data.SUBSCRIBE[0] == 'message') {
      var sub = JSON.parse(data.SUBSCRIBE[2]);
      console.log("new sub:", sub);
      submissions.push(sub);
      apply_realtime();
      apply_submission_list();
    }
  }
  submissions = latest_round.submissions;
  apply_realtime();
});
