
app.controller('covidController', [
	'$scope',
	'$http',
	'$routeParams',
	'CONFIG',
	'StringFormatService',
	function($scope, $http, $routeParams, CONFIG, StringFormatService)
	{
		$scope.cboDate = '';
		$scope.data = [];
		$scope.totalData = {};
		$scope.tambon = {};

		const initTotalData = function() {
			return {
				total: 0,
			}
		};
		$scope.getNumTambon = function(e) {
			if(e) e.preventDefault();

			$scope.totalData = initTotalData();

			$scope.loading = true;
            let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/covid/num-tambon/${date}`)
			.then(res => {
				$scope.data = res.data;

				$scope.totalData.total = $scope.data.reduce((sum, tam) => {
					return sum + parseInt(tam.num_pt);
				}, 0);
			}, err => {
				console.log(err);
			});
		};

		$scope.getPatientsTambon = function(e) {
			if(e) e.preventDefault();

			const tambon = $routeParams.tambon;

			$scope.loading = true;
			$http.get(`${CONFIG.apiUrl}/covid/${tambon}/tambon`)
			.then(res => {
				$scope.data = res.data.patients;
				$scope.tambon = res.data.tambon;
			}, err => {
				console.log(err);
			});
		};
	}
]);