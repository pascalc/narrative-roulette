function SubmissionsCtrl($scope, $http) {
  $scope.rounds;
  $scope.get_rounds = function() {
    $http.get("/api/round?results_per_page=100").then(function(response) {
      $scope.rounds = response.data.objects;
      $scope.rounds.reverse();
    });
  }
  angular.element(document).ready(function () {
    $scope.get_rounds();
  });
}
