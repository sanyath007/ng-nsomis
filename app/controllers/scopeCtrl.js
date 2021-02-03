app.controller('scopeController', [
	'$scope',
	'$http',
	'CONFIG',
	function($scope, $http, CONFIG) 
	{
		$scope.cboYear = '';
		$scope.sdate = '';
		$scope.edate = '';
		$scope.data = [];
		$scope.totalData = {};
		$scope.toDay = new Date();

		const initTotalSumYear = function() {
			return {
				men: 0,
				women: 0,
				app: 0,
				notapp: 0,
				total: 0,
			}
		};

		$scope.getSumYear = function(e) {
			if(e) e.preventDefault();

			$scope.totalData = initTotalSumYear();

			let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();

			$http.get(`${CONFIG.apiUrl}/scope/sum-year/${year}`)
			.then(res => {
				$scope.data = res.data;

				$scope.data.forEach((val, key) => {
					$scope.totalData.men += parseInt(val.men);
					$scope.totalData.women += parseInt(val.women);
					$scope.totalData.app += parseInt(val.app);
					$scope.totalData.notapp += parseInt(val.notapp);
					$scope.totalData.total += parseInt(val.total);
				});
			}, err => {
				console.log(err)
			});
		};
	}
]);