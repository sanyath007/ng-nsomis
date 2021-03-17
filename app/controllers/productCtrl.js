app.controller('productivityController', [
	'$scope',
	'$http',
	'CONFIG',
	function($scope, $http, CONFIG) 
	{
		$scope.sdate = '';
		$scope.ward = '';
		$scope.data = [];

		$scope.getProductWard = (e) => {
			if (e) e.preventDefault();

			let date = $scope.sdate === '' ? moment().format('YYYY-MM-DD') : $scope.sdate;
			let ward = $scope.ward === '' ? '00' : $scope.ward;

            $http.get(`${CONFIG.apiUrl}/ip/product-ward/${date}/${ward}`)
            .then(res => {
				console.log(res);

				// $scope.data = res.data;
			}, err => {
				console.log(err)
			});
		};
	}
]);