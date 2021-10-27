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
	.when('/ip/admdate-month', {
		templateUrl: 'templates/ip/admdate-month.html',
		controller: 'ipController'
	})
	.when('/ip/admdc-day', {
		templateUrl: 'templates/ip/admdc-day.html',
		controller: 'ipController'
	})
	.when('/ip/admdc-month', {
		templateUrl: 'templates/ip/admdc-month.html',
		controller: 'ipController'
	})
	.when('/ip/bedocc-year', {
		templateUrl: 'templates/ip/bedocc-year.html',
		controller: 'ipController'
	})
	.when('/ip/bedempty-day', {
		templateUrl: 'templates/ip/bedempty-day.html',
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
	.when('/ip/product-sum', {
		templateUrl: 'templates/ip/product-sum.html',
		controller: 'productController'
	})
	.when('/ip/product-ward', {
		templateUrl: 'templates/ip/product-ward.html',
		controller: 'productController'
	})
	.when('/ip/product-add', {
		templateUrl: 'templates/ip/product-add.html',
		controller: 'productController'
	})
	.when('/ip/chart-sending', {
		templateUrl: 'templates/error/chart-sending.html',
		controller: 'errorController'
	})
	.when('/er/sum-period', {
		templateUrl: 'templates/er/sum-period.html',
		controller: 'erController'
	})
	.when('/or/sum-year', {
		templateUrl: 'templates/or/sum-year.html',
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
	.when('/or/cataract', {
		templateUrl: 'templates/or/cataract-list.html',
		controller: 'orController'
	})
	.when('/scope/sum-year', {
		templateUrl: 'templates/scope/sum-year.html',
		controller: 'scopeController'
	})
	.when('/eye/vision2020', {
		templateUrl: 'templates/eye/vision2020.html',
		controller: 'eyeController'
	})
	.when('/nurses/gen-list', {
		templateUrl: 'templates/nurses/gen-list.html',
		controller: 'nurseController'
	})
	.when('/nurses/list', {
		templateUrl: 'templates/nurses/list.html',
		controller: 'nurseController'
	})
	.when('/nurses/add', {
		templateUrl: 'templates/nurses/add.html',
		controller: 'nurseController'
	})
	.when('/nurses/:id/profile', {
		templateUrl: 'templates/nurses/profile.html',
		controller: 'nurseController'
	})
	.when('/nurses/stat', {
		templateUrl: 'templates/nurses/stat.html',
		controller: 'nurseController'
	})
	.when('/supports/list', {
		templateUrl: 'templates/supports/list.html',
		controller: 'supportController'
	})
	.when('/supports/:id/profile', {
		templateUrl: 'templates/supports/profile.html',
		controller: 'supportController'
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
	.when('/covid/num-tambon', {
		templateUrl: 'templates/covid/num-tambon.html',
		controller: 'covidController'
	})
	.when('/covid/:tambon/tambon', {
		templateUrl: 'templates/covid/patient-by-tambon.html',
		controller: 'covidController'
	})
	.when('/covid/discharge/:tambon/tambon', {
		templateUrl: 'templates/covid/discharge-by-tambon.html',
		controller: 'covidController'
	})
	.when('/covid/num-bed', {
		templateUrl: 'templates/covid/num-bed.html',
		controller: 'covidController'
	})
	.when('/covid/:ward/ward', {
		templateUrl: 'templates/covid/patient-by-ward.html',
		controller: 'covidController'
	})
	.when('/covid/:type/all', {
		templateUrl: 'templates/covid/patient-all.html',
		controller: 'covidController'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);
