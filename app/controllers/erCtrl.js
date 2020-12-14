
app.controller('erController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	function($scope, $http, CONFIG, StringFormatService)
	{
		$scope.sdate = '';
		$scope.edate = '';
		$scope.data = [];

		$scope.getSumPeriodData = function(e) {
			if(e) e.preventDefault();

			// $scope.totalData = initTotalData();

			let startDate = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');
			let endDate = ($('#edate').val() !== '') 
							? StringFormatService.convToDbDate($scope.edate) 
							: moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/er/sum-period/${startDate}/${endDate}`)
			.then(res => {
				console.log(res);

				$scope.data = res.data;
			}, err => {
				console.log(err);
			})
		};
	}
]);