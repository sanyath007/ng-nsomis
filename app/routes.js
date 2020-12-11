
app.config([
	'$routeProvider',
	'$locationProvider',
	'$httpProvider',
	function($routeProvider, $locationProvider, $httpProvider)
	{
		$locationProvider.html5Mode(true).hashPrefix('!');

		$httpProvider.interceptors.push([
			'$rootScope',
			'$q',
			'$location',
			'$localStorage',
			function($rootScope, $q, $location, $localStorage)
			{
				return {
					'request': function(config) {
						console.log(`This is on request process !!`);

						config.headers = config.headers || {};
						if($localStorage.currentUser) {
							config.headers.Authorization = `Bearer ${$localStorage.currentUser.token}`;
						}

						return config;
					},
					'responseError': function(res) {
						if(res.status === 401 || res.status === 403) {
							console.log(`Response Status is ${res.status}`);
							
							$rootScope.clearAuthToken();

							$location.path('/');
						}

						return $q.reject(res);
					}
				}
			}
		]);
		
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
		.when('/or/num-day', {
			templateUrl: 'templates/or/num-day.html',
			controller: 'orController'
		})
		.otherwise({
			redirectTo: '/'
		});
	}
]);
