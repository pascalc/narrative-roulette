var app = angular.module('NarrativeRoulette', [
  'ngRoute',
  'contenteditable',
  'LocalStorageModule',
  'ngProgress',
  'ngFacebook',
]);
 
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/write', {
        templateUrl: 'partials/write.html',
        controller: 'WriteCtrl'
      }).
      when('/write/:perspectiveId', {
        templateUrl: 'partials/write.html',
        controller: 'WriteCtrl'
      }).
      when('/display', {
        templateUrl: 'partials/display.html',
        controller: 'DisplayCtrl'
      }).
      when('/round/:roundId', {
        templateUrl: 'partials/submissionList.html',
        controller: 'SubmissionListCtrl'
      }).
      when('/read', {
        templateUrl: 'partials/submissionList.html',
        controller: 'SubmissionListCtrl'
      }).
      when('/submissions', {
        templateUrl: 'partials/submissions.html',
        controller: 'SubmissionsCtrl'
      }).
      when('/submission/:submissionId', {
        templateUrl: 'partials/submission.html',
        controller: 'SubmissionCtrl'
      }).
      otherwise({
        redirectTo: '/write'
      });
  }])
  .config(['localStorageServiceProvider', 
    function(localStorageServiceProvider) {
      localStorageServiceProvider.setPrefix('narrativeRoulette');
    }]
  )
  .config( function( $facebookProvider ) {
    $facebookProvider.setAppId('629563240412158');
    console.log("Set Facebook AppID");
  });

app.run( function( $rootScope ) {
  // Cut and paste the "Load the SDK" code from the facebook javascript sdk page.
  (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1&appId=629563240412158";
  fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  
  console.log("Loaded Facebook JS SDK");
});

app.factory('interceptorNgProgress', function ($injector) {
  var complete_progress, getNgProgress, ng_progress, working;
  ng_progress = null;
  working = false;

  getNgProgress = function() {
    ng_progress = ng_progress || $injector.get("ngProgress");
    ng_progress.color("rgb(207,181,150)");
    return ng_progress;
  };

  complete_progress = function() {
    var ngProgress;
    if (working) {
      ngProgress = getNgProgress();
      ngProgress.complete();
      return working = false;
    }
  };

  return {
    request: function(request) {
      var ngProgress;
      ngProgress = getNgProgress();
      if (request.url.indexOf('.html') > 0) {
        return request;
      }
      if (!working) {
        ngProgress.reset();
        ngProgress.start();
        working = true;
      }
      return request;
    },
    requestError: function(request) {
      complete_progress();
      return request;
    },
    response: function(response) {
      complete_progress();
      return response;
    },
    responseError: function(response) {
      complete_progress();
      return response;
    }
  }
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('interceptorNgProgress');
});
