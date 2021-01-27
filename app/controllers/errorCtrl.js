
app.controller('errorController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	function($scope, $http, CONFIG, StringFormatService)
	{
		$scope.sdate = '';
		$scope.edate = '';
		$scope.data = [];

		$scope.getChartSending = function(e) {
			if(e) e.preventDefault();

			let startDate = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');
			let endDate = ($('#edate').val() !== '') 
							? StringFormatService.convToDbDate($scope.edate) 
							: moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/error/chart-send/${startDate}/${endDate}`)
			.then(res => {
				console.log(res);
				$scope.data = res.data.chartSend
			}, err => {
				console.log(err);
			})
		};
	}
]);