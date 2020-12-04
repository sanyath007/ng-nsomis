
app.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');

	$routeProvider
	.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'homeController'
	})
	.when('/dashboard', {
		templateUrl: 'templates/dashboard/dash1.html',
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