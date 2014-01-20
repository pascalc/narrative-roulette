var getRandomPerspective,
    getPerspective,
    postSubmission;
function WriteCtrl($scope, $routeParams, $http, $interval, localStorageService, $timeout, $location) {
  $scope.perspective;
  $scope.submission = {
    'text' : undefined
  };
  $scope.submit_count = 0;

  function renderPerspective(response) {
    $scope.perspective = response.data;
    console.log($scope.perspective);
  }

  $scope.get_random_perspective = function() {
    return $http.get("/api/perspective/random").then(renderPerspective);
  }

  $scope.get_perspective = function(id) {
    return $http.get("/api/perspective/" + id).then(renderPerspective);
  }

  $scope.post_submission = function(submission) {
    submission.perspective_id = $scope.perspective.id;
    console.log("Submission:", submission);
    $http.post("/api/submission", submission)
      .then(function(response) {
        console.log(response);
        $location.path("/round/" + response.data.round_id);
      });
  }

  $scope.submit_clicked = function(submit_count) {
    $scope.submit_count = $scope.submit_count + 1;
    if ($scope.submit_count == 2) {
      $scope.post_submission($scope.submission);
    }
  }

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

  angular.element(document).ready(function () {
    var perspective_id = $routeParams.perspectiveId;
    if (perspective_id) {
      $scope.get_perspective(perspective_id)
        .then(loadSavedText);
    } else {
      $scope.get_latest_round().then(function(response) {      
        $scope.get_perspective($scope.latest_round.perspective.id)
          .then(loadSavedText);
        $interval($scope.update_elapsed_time, 1000);
      });
    }
  });

  $scope.$watch("submission.text",
    function(newValue, oldValue) {
      if (!angular.isUndefined(newValue) && $scope.perspective) {
        var key = $scope.perspective.id;
        // console.log("Saving", newValue, "under key", key);
        $scope.submit_count = 0;
        localStorageService.remove(key);
        localStorageService.add(key, newValue);  
      }
    }, 
    true
  );

  function loadSavedText() {
    var key = $scope.perspective.id;
    var savedText = localStorageService.get(key)
    if (!angular.isUndefined(savedText) && savedText != null) {
      console.log("Loaded", savedText, "with key", key);
      $scope.submission.text = savedText;      
    }
    $timeout(function() {
        document.querySelectorAll("div.write div.submission")[0].focus();
      }, 500
    );
  }

  getRandomPerspective = $scope.get_random_perspective;
  getPerspective = $scope.get_perspective;
  postSubmission = $scope.post_submission;
}
