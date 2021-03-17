app.controller('productivityController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	function($scope, $http, CONFIG, StringFormatService) 
	{
		$scope.sdate = '';
		$scope.ward = '';
		$scope.data = [];

		$scope.getProductWard = (e) => {
			if (e) e.preventDefault();

			let date = $scope.sdate !== ''
						? StringFormatService.convToDbDate($scope.sdate) 
						: moment().format('YYYY-MM-DD');
			let ward = $scope.ward === '' ? '00' : $scope.ward;

            $http.get(`${CONFIG.apiUrl}/ip/product-ward/${date}/${ward}`)
            .then(res => {
				console.log(res);

				$scope.data = res.data;
			}, err => {
				console.log(err)
			});
		};
	}
]);