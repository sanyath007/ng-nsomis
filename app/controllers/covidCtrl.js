
app.controller('covidController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	function($scope, $http, CONFIG, StringFormatService)
	{
		$scope.cboDate = '';
		$scope.data = [];
		$scope.totalData = {};

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
	}
]);