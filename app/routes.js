/**
 * ==================================================
 *  Main Routes
 * ==================================================
 */
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');
	
	$routeProvider
	.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'homeController'
	})
	.when('/users', {
		templateUrl: 'templates/user/list.html',
		controller: 'userController'
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
	.when('/ip/ptdchbyward/:sdate/:edate/:ward', {
		templateUrl: 'templates/ip/ptdchbyward.html',
		controller: 'ipController'
	})
	.when('/ip/ptlosbycare/:sdate/:edate/:ward', {
		templateUrl: 'templates/ip/ptlosbycare.html',
		controller: 'ipController'
	})
	.when('/er/sum-period', {
		templateUrl: 'templates/er/sum-period.html',
		controller: 'erController'
	})
	.when('/or/num-day', {
		templateUrl: 'templates/or/num-day.html',
		controller: 'orController'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);
