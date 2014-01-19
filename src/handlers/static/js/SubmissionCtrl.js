function SubmissionCtrl($scope, $routeParams, $http) {
  $scope.round;
  $scope.show_submission_index = 0;
  $scope.get_round = function(round_id) {
    $http.get("/api/round/" + round_id).then(function(response) {
      $scope.round = response.data;
    });
  }

  angular.element(document).ready(function () {
    $scope.get_round($routeParams.roundId);
  });
}
