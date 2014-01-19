var getRandomPerspective,
    getPerspective,
    postSubmission;
function WriteCtrl($scope, $routeParams, $http, $interval) {
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

  $scope.post_submission = function(submission) {
    submission.perspective_id = $scope.perspective.id;
    console.log("Submission:", submission);
    $http.post("/api/submission", submission).then(function(response) {
      console.log(response);
    });
  }

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
    document.querySelectorAll("div.write div.submission")[0].focus();
    var perspective_id = $routeParams.perspectiveId;
    if (perspective_id) {
      $scope.get_perspective(perspective_id);
    } else {
      $scope.get_latest_round().then(function(response) {      
        $scope.get_perspective($scope.latest_round.perspective.id);
        $interval($scope.update_elapsed_time, 1000);
      });
    }
  });

  getRandomPerspective = $scope.get_random_perspective;
  getPerspective = $scope.get_perspective;
  postSubmission = $scope.post_submission;
}
