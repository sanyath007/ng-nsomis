
app.controller('userController', ['$scope', '$http', 'CONFIG', function($scope, $http, CONFIG) {
	$scope.users = [];
	
	$scope.getUsers = function() {
		$http.get(`${CONFIG.apiUrl}/api/users`)
		.then(res => {
			console.log(res)
			$scope.users = res.data;
		}, err => {
			console.log(err)
		});
	};
}]);
