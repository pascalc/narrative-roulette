var getRandomPerspective,
    getPerspective;
function WriteCtrl($scope, $routeParams, $http) {
  $scope.perspective;

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

  getRandomPerspective = $scope.get_random_perspective;
  getPerspective = $scope.get_perspective;
}
