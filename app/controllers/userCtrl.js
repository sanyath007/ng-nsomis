
app.controller('userController', ['$scope', '$http', 'CONFIG', function($scope, $http, CONFIG) {
	$scope.users = [];
	
	$scope.getUsers = function() {
		$http.get(`${CONFIG.apiUrl}/users`)
		.then(res => {
			console.log(res)
			$scope.users = res.data;
		}, err => {
			console.log(err)
		});
	};
}]);
