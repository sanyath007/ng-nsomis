
app.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');

	$routeProvider
	.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'homeController'
	})
	.when('/ornum', {
		templateUrl: 'templates/users/user.html',
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