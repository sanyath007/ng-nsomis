var app = angular.module('App', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');

	$routeProvider
	.when('/', {
	    templateUrl: 'templates/home.html',
	    controller: 'homeController'
	})
	.when('/page1', {
	    templateUrl: 'templates/page1.html',
	    controller: 'page1Controller'
	})
	.when('/page2', {
	    templateUrl: 'templates/page2.html',
	    controller: 'page2Controller'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.controller('homeController', ['$scope', function($scope) {
	$scope.message = 'Message on home page';
}]);

app.controller('page1Controller', ['$scope', function($scope) {
	$scope.message = 'Message on page 1';
}]);

app.controller('page2Controller', ['$scope', function($scope) {
	$scope.message = 'Message on page 2';
}]);

/**
 * ==================================================
 *  Intercept every request to templates directory
 * ==================================================
 */
app.service('preventTemplateCache', [function() {
    var service = this;
    service.request = function(config) {
      	if (config.url.indexOf('templates') !== -1) {
        	config.url = config.url + '?t=___REPLACE_IN_GULP___'
      	}
      	return config;
    };
}]);

app.config(['$httpProvider',function ($httpProvider) {
    $httpProvider.interceptors.push('preventTemplateCache');
}]);