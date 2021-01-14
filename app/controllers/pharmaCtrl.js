app.controller('pharmaController', [
    '$rootScope',
    '$scope',
    '$http',
    'CONFIG',
    '$localStorage',
    'StringFormatService',
    'toaster',
    function($rootScope, $scope, $http, CONFIG, $localStorage, StringFormatService, toaster)
    {
        $scope.data = [];
        $scope.drugLists = [];
        $scope.drugItems = [];
        $scope.cboDrugItems = '';
        $scope.userDrugLists = {
            user_id: '',
            name: '',
            type: '',
            icodes: ''
        };

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

        const createDrugListsToDB = function () {
            let icodes = "";

            for(let i = 0; i < $scope.drugLists.length; i++) {
                if(i !== $scope.drugLists.length - 1) {
                    icodes += "'" +$scope.drugLists[i].icode+ "', "
                } else {
                    icodes += "'" +$scope.drugLists[i].icode+ "'"
                }
            }

            return icodes;
        };
        
        $scope.storeDrugList = function(e) {
            if (e) e.preventDefault();
            if ($scope.drugLists.length === 0) {
                alert('ไม่พบรายการยาของคุณ!!');
                return false;
            }

            if ($localStorage.currentUser) {
                const { username } = $localStorage.currentUser;

                let data = {
                    user_id: username,
                    name: $scope.userDrugLists.name,
                    type: $scope.userDrugLists.type,
                    icodes: createDrugListsToDB()
                };
    
                $http.post(`${CONFIG.apiUrl}/pharma/store-drug-list`, data)
                .then(res => {
                    console.log(res);
                }, err => {
                    console.log(err)
                });
            } else {
                alert('คุณไม่สามารถบันทึกข้อมูลได้ กรุณา Log in เข้าสู่ระบบก่อน!!');
                return false;
            }
        };

        $scope.addDrugToDrugList = function(e) {
            if (e) e.preventDefault();

            const dl = $scope.drugItems.find(drug => drug.icode === $scope.cboDrugItems);
            const { icode, name, strength, units, unitprice } = dl;

            $scope.drugLists.push({ icode, name, strength, units, unitprice });
        };

        $scope.removeItemFromDrugList = function(icode) {
            console.log(icode);
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
        };
        
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
