function SubmissionCtrl($scope, $http, $routeParams) {
  $scope.submission_id = $routeParams.submissionId;
  $scope.submission;
  $scope.get_submission = function(submission_id) {
    $http.get("/api/submission/" + submission_id).then(function(response) {
      $scope.submission = response.data;
      return response;
    });
  }
  $scope.get_submission($scope.submission_id);
}
