
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');

	$routeProvider
	.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'homeController'
	})
	.when('/dash-day', {
		templateUrl: 'templates/dashboard/dash-day.html',
		controller: 'dashdayController'
	})
	.when('/dash-month', {
		templateUrl: 'templates/dashboard/dash-month.html',
		controller: 'dashmonthController'
	})
	.when('/ip/admdate', {
		templateUrl: 'templates/ip/admdate.html',
		controller: 'ipController'
	})
	.when('/ip/class', {
		templateUrl: 'templates/ip/ipclass.html',
		controller: 'ipController'
	})
	.when('/or/num-day', {
		templateUrl: 'templates/or/num-day.html',
		controller: 'orController'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);
