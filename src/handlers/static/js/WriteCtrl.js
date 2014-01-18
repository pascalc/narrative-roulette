var getRandomPerspective;
function WriteCtrl($scope, $http) {
  $scope.perspective;
  $scope.get_random_perspective = function() {
    $http.get("/api/perspective/random").then(function(response) {
      $scope.perspective = response.data;
      console.log($scope.perspective);
    });
  }

  angular.element(document).ready(function () {
    $scope.get_random_perspective()
  });

  getRandomPerspective = $scope.get_random_perspective;
}
