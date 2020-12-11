
app.controller('userController', [
	'$rootScope',
	'$scope',
	'$http',
	'CONFIG',
	function($rootScope, $scope, $http, CONFIG)
	{
		$scope.users = [];
		
		$scope.getUsers = function() {
			if(!$rootScope.isLogedIn) $rootScope.showLogin();
			
			$http.get(`${CONFIG.apiUrl}/api/users`)
			.then(res => {
				console.log(res)
				$scope.users = res.data;
			}, err => {
				console.log(err)
			});
		};
	}
]);
