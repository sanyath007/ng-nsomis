app.controller('pharmaController', [
    '$rootScope',
    '$scope',
    '$http',
    'CONFIG',
    'StringFormatService',
    'toaster',
    function($rootScope, $scope, $http, CONFIG, StringFormatService, toaster)
    {
        $scope.data = [];

        $scope.getOp = function(e) {
            if(e) e.preventDefault();

            let startDate = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');
			let endDate = ($('#edate').val() !== '') 
							? StringFormatService.convToDbDate($scope.edate) 
                            : moment().format('YYYY-MM-DD');
                            
            $http.get(`${CONFIG.apiUrl}/pharma/op/${startDate}/${endDate}`)
			.then(res => {
                console.log(res);
				$scope.data = res.data;
			}, err => {
				console.log(err)
			});
        }
        
        $scope.getIp = function(e) {
            if(e) e.preventDefault();

            let startDate = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');
			let endDate = ($('#edate').val() !== '') 
							? StringFormatService.convToDbDate($scope.edate) 
                            : moment().format('YYYY-MM-DD');
                            
            $http.get(`${CONFIG.apiUrl}/pharma/ip/${startDate}/${endDate}`)
			.then(res => {
                console.log(res);
				$scope.data = res.data;
			}, err => {
				console.log(err)
			});
        }
    }
]);
