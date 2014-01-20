function SubmissionCtrl($scope, $routeParams, $http) {
  $scope.round;
  $scope.show_submission_index = 0;
  $scope.get_round = function(round_id) {
    $http.get("/api/round/" + round_id).then(function(response) {
      $scope.round = response.data;
    });
  }

  $scope.key_pressed = function(event) {
    console.log("Key pressed", event);
    if (event.keyCode == 37 && $scope.show_submission_index != 0) {
      $scope.show_submission_index = $scope.show_submission_index - 1;
    } else if (event.keyCode == 39 && $scope.show_submission_index != $scope.round.submissions.length - 1) {
      $scope.show_submission_index = $scope.show_submission_index + 1;
    }
  }

  angular.element(document).ready(function () {
    $scope.get_round($routeParams.roundId);
  });
}
