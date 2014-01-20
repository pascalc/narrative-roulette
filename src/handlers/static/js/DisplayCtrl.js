var getLatestRound,
    updateElapsedTime,
    postNewRound;
function DisplayCtrl($scope, $http, $interval, $timeout) {
  $scope.spinning = false;

  // Latest round

  $scope.latest_round;
  $scope.get_latest_round = function() {
    return $http.get("/api/round/latest").then(function(response) {
      $scope.latest_round = response.data;
    });
  }

  $scope.elapsed_time;
  $scope.update_elapsed_time = function() {
    $scope.elapsed_time = moment($scope.latest_round.start_time).tz("Europe/Stockholm").fromNow();
  }

  // New round
  $scope.random_perspective;
  $scope.get_random_perspective = function() {
    $scope.spinning = true;
    $http.get("/api/perspective/random").then(function(response) {
      $scope.random_perspective = response.data;
      $timeout(function() { $scope.spinning = false; }, 500);
    });
  }

  $scope.post_new_round = function() {
    $http.post("/api/round", {
      'perspective_id': $scope.random_perspective.id
    }).then($scope.get_latest_round);
  };

  angular.element(document).ready(function () {
    $scope.get_latest_round().then(function() {
      $interval($scope.update_elapsed_time, 1000);
    });
    $scope.get_random_perspective();
  });

  getLatestRound = $scope.get_latest_round;
  updateElapsedTime = $scope.update_elapsed_time;
  postNewRound = $scope.post_new_round;
}
