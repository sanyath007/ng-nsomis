
app.controller('userController', function($scope, $http) {
	$scope.users = [];
	
	// $http.get('http://localhost/public_html/slim3-nsomis-api/public/users')
	// .then(res => {
	// 	console.log(res)
	// 	$scope.users = res.data.users;
	// }, err => {
	// 	console.log(err)
	// });
});