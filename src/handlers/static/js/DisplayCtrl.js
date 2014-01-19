var getLatestRound,
    updateElapsedTime;
function DisplayCtrl($scope, $http, $interval) {
  $scope.latest_round;
  $scope.get_latest_round = function() {
    return $http.get("/api/round/latest").then(function(response) {
      $scope.latest_round = response.data;
    });
  }

  $scope.elapsed_time;
  $scope.update_elapsed_time = function() {
    $scope.elapsed_time = moment($scope.latest_round.start_time).fromNow();
  }

  angular.element(document).ready(function () {
    $scope.get_latest_round().then(function() {
      $interval($scope.update_elapsed_time, 1000);
    });
  });

  getLatestRound = $scope.get_latest_round;
  updateElapsedTime = $scope.update_elapsed_time;
}
