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
	.when('/ip/chart-sending', {
		templateUrl: 'templates/ip/chart-sending.html',
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
	.when('/or/emergency-year', {
		templateUrl: 'templates/or/emergency-year.html',
		controller: 'orController'
	})
	.when('/or/expenses', {
		templateUrl: 'templates/or/expenses.html',
		controller: 'orController'
	})
	.when('/or/expenses-detail/:income/:sdate/:edate', {
		templateUrl: 'templates/or/expenses-detail.html',
		controller: 'orController'
	})
	.when('/pharma/ip', {
		templateUrl: 'templates/pharma/ip.html',
		controller: 'pharmaController'
	})
	.when('/pharma/op', {
		templateUrl: 'templates/pharma/op.html',
		controller: 'pharmaController'
	})
	.when('/pharma/new-druglists', {
		templateUrl: 'templates/pharma/drug-list-form.html',
		controller: 'pharmaController'
	})
	.when('/pharma/user-druglists', {
		templateUrl: 'templates/pharma/user-drug-list.html',
		controller: 'pharmaController'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);
