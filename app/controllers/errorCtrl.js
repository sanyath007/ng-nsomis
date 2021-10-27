
app.controller('errorController', [
	'$rootScope',
	'$scope',
	'$http',
	'$routeParams',
	'CONFIG',
	'StringFormatService',
	function($rootScope, $scope, $http, $routeParams, CONFIG, StringFormatService)
	{
		$scope.sdate = '';
		$scope.edate = '';
		$scope.data = [];
		$scope.ward = '';
		$scope.status = '';

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
				$scope.data = res.data.chartSend

				// Get bed amount of each ward
				$scope.data.forEach(d => {
					d.desc = $rootScope.wardBed().find(wb => d.ward===wb.ward);
				});

				// Sort ward data
				$scope.data.sort((wa, wb) => wa.desc.sortBy - wb.desc.sortBy);
			}, err => {
				console.log(err);
			})
		};

		$scope.getChartSentList = function(e) {
			let sdate = $routeParams.sdate;
			let edate = $routeParams.edate;
			let status = $routeParams.status;
			let ward = $routeParams.ward;

			$http.get(`${CONFIG.apiUrl}/error/chart-sent-list/${sdate}/${edate}/${status}/${ward}`)
			.then(res => {
				$scope.data = res.data.data;
				$scope.ward = res.data.ward;
				$scope.status = res.data.status;
			}, err => {
				console.log(err);
			})
		};
	}
]);