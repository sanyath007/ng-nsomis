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
        $scope.drugLists = [];
        $scope.drugItems = [];
        $scope.cboDrugItems = '';

        $scope.getDrugItems = function(e) {
            if (e) e.preventDefault();

            $http.get(`${CONFIG.apiUrl}/drug-items`)
            .then(res => {
                console.log(res);
				$scope.drugItems = res.data.drugItems;
			}, err => {
				console.log(err)
			});
        };

        $scope.storeDrugList = function(e) {
            if (e) e.preventDefault();
            if ($scope.drugLists.length === 0) {
                alert('ไม่พบรายการยาของคุณ!!');
                return false;
            }

            $http.post(`${CONFIG.apiUrl}/drug-items`, $scope.drugLists)
            .then(res => {
                console.log(res);
			}, err => {
				console.log(err)
			});
        };

        $scope.addDrugToDrugList = function(e) {
            if (e) e.preventDefault();

            const dl = $scope.drugItems.find(drug => drug.icode === $scope.cboDrugItems);
            const { icode, name, strength, units, unitprice } = dl;

            $scope.drugLists.push({ icode, name, strength, units, unitprice });
        };

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
