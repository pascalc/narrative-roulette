function SubmissionListCtrl($scope, $routeParams, $http, $facebook, $timeout) {
  $scope.round;
  $scope.show_submission_index = 0;
  $scope.get_round = function(round_id) {
    $http.get("/api/round/" + round_id).then(function(response) {
      $scope.round = response.data;
      $timeout(FB.XFBML.parse, 100);
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
    var round_id;
    if ($routeParams.roundId) {
      round_id = $routeParams.roundId;
      $scope.get_round(round_id);
    } else {
      // $http.get("/api/round/latest").then(function(response) {
      //   $scope.round = response.data;
      //   $timeout(FB.XFBML.parse, 100);
      // });
      $scope.round = $("#latest-round-data").data("latest-round");
    }
    if (typeof FB !== 'undefined') {
      FB.XFBML.parse();  
    }
  });
}
