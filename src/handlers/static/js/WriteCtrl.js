var getRandomPerspective,
    getPerspective,
    postSubmission,
    showFbModal;
function WriteCtrl($scope, $routeParams, $http, $interval, localStorageService, $timeout, $location, $facebook) {
  $scope.perspective;
  $scope.submission = {
    'text' : undefined
  };
  $scope.submit_count = 0;
  $scope.submission_response;

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
        mixpanel.track("Published");
        // $scope.show_fb_post_modal(response.data.fb_post_id); 
        // $scope.submission_response = response.data;
        publish(submission_channel, response.data);
        if (response.data.round_id) {
          if (response.data.round_id == latest_round.id) {
            $location.path("/read");  
          } else {
            $location.path("/round/" + response.data.round_id);  
          }
        } else {
          $location.path("/submission/" + response.data.id);
        }
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
    // return $http.get("/api/round/latest").then(function(response) {
    //   $scope.latest_round = response.data;
    // });
    $scope.latest_round = $("#latest-round-data").data("latest-round");
  }

  $scope.elapsed_time;
  $scope.update_elapsed_time = function() {
    $scope.elapsed_time = moment.utc($scope.latest_round.start_time).tz("Europe/Stockholm").fromNow();
  }

  angular.element(document).ready(function () {
    var perspective_id = $routeParams.perspectiveId;
    if (perspective_id) {
      $scope.get_perspective(perspective_id)
        .then(loadSavedText);
    } else {
        $scope.get_latest_round()
        $scope.perspective = $scope.latest_round.perspective;
        loadSavedText();
        $interval($scope.update_elapsed_time, 1000);
    }
    if (typeof FB !== 'undefined') {
      FB.XFBML.parse();  
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

  $scope.show_fb_post_modal = function(fb_post_id) {
    var fb_embed_post_id = fb_post_id.split("_")[1];
    $("#fb-post-modal .modal-body")
      .html('<fb:post href="https://www.facebook.com/narrativeroulette/posts/' + fb_embed_post_id + '" width="558"></fb:post>');
    FB.XFBML.parse();
    $('#fb-post-modal').modal()
    $('#fb-post-modal').on('hidden.bs.modal', function (e) {
      $scope.$apply(function() {
        if ($scope.submission_response.round_id) {
          $location.path("/round/" + $scope.submission_response.round_id);
        } else {
          $location.path("/submission/" + $scope.submission_response.id);
        }
      });
    });
  }

  getRandomPerspective = $scope.get_random_perspective;
  getPerspective = $scope.get_perspective;
  postSubmission = $scope.post_submission;
  showFbModal = $scope.show_fb_post_modal;
}
