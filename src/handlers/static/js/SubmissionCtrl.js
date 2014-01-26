function SubmissionCtrl($scope, $http, $routeParams, $timeout) {
  $scope.submission_id = $routeParams.submissionId;
  $scope.submission;
  $scope.get_submission = function(submission_id) {
    $http.get("/api/submission/" + submission_id).then(function(response) {
      $scope.submission = response.data;
      $timeout(FB.XFBML.parse, 100);
      return response;
    });
  }
  $scope.get_submission($scope.submission_id);

  angular.element(document).ready(function () {
    if (typeof FB !== 'undefined') {
      FB.XFBML.parse();  
    }
  });
}
