
app.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');

	$routeProvider
	.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'homeController'
	})
	.when('/dash-month', {
		templateUrl: 'templates/dashboard/dash-month.html',
		controller: 'dashController'
	})
	.when('/dash-day', {
		templateUrl: 'templates/dashboard/dash-day.html',
		controller: 'dashController'
	})
	.when('/ornum', {
		templateUrl: 'templates/user/list.html',
		controller: 'userController'
	})
	.when('/admdate', {
		templateUrl: 'templates/ip/admdate.html',
		controller: 'ipController'
	})
	.otherwise({
		redirectTo: '/'
	});
});