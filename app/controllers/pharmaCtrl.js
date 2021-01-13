app.controller('pharmaController', [
    '$rootScope',
    '$scope',
    '$http',
    'CONFIG',
    'toaster',
    function($rootScope, $scope, $http, CONFIG, toaster)
    {
        $scope.getIp = function(e) {
            $http.get(`${CONFIG.apiUrl}/pharma/ip/${startDate}/${endDate}`)
			.then(res => {
				$scope.data = res.data;

				$scope.data.forEach((val, key) => {
					$scope.totalData.qty += parseInt(val.sum_qty);
					$scope.totalData.price += parseInt(val.sum_total);
				});
			}, err => {
				console.log(err)
			});
        }
        
        $scope.getOp = function(e) {
            $http.get(`${CONFIG.apiUrl}/pharma/op/${startDate}/${endDate}`)
			.then(res => {
				$scope.data = res.data;

				$scope.data.forEach((val, key) => {
					$scope.totalData.qty += parseInt(val.sum_qty);
					$scope.totalData.price += parseInt(val.sum_total);
				});
			}, err => {
				console.log(err)
			});
        }
    }
]);
