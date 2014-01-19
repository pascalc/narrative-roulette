var getRandomPerspective,
    getPerspective,
    postSubmission;
function WriteCtrl($scope, $routeParams, $http, $location) {
  $scope.perspective;
  $scope.submission;

  function renderPerspective(response) {
    $scope.perspective = response.data;
    console.log($scope.perspective);
  }

  $scope.get_random_perspective = function() {
    $http.get("/api/perspective/random").then(renderPerspective);
  }

  $scope.get_perspective = function(id) {
    $http.get("/api/perspective/" + id).then(renderPerspective);
  }

  angular.element(document).ready(function () {
    var perspective_id = $routeParams.perspectiveId;
    if (perspective_id) {
      $scope.get_perspective(perspective_id);
    } else {
      $scope.get_random_perspective()  
    }
  });

  $scope.post_submission = function(submission) {
    submission.perspective_id = $scope.perspective.id;
    console.log("Submission:", submission);
    $http.post("/api/submission", submission).then(function(response) {
      console.log(response);
    });
  }

  getRandomPerspective = $scope.get_random_perspective;
  getPerspective = $scope.get_perspective;
  postSubmission = $scope.post_submission;
}
