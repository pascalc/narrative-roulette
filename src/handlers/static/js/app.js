var app = angular.module('NarrativeRoulette', [
  'ngRoute',
]);
 
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/write', {
        templateUrl: 'partials/write.html',
        controller: 'WriteCtrl'
      }).
      when('/display', {
        templateUrl: 'partials/display.html',
        controller: 'DisplayCtrl'
      }).
      when('/round/:roundId/submission/:submissionId', {
        templateUrl: 'partials/submission.html',
        controller: 'SubmissionCtrl'
      }).
      when('/round/:roundId', {
        templateUrl: 'partials/submission.html',
        controller: 'SubmissionCtrl'
      }).
      otherwise({
        redirectTo: '/write'
      });
  }]);
