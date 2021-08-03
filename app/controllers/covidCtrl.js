
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
		$scope.covidBed = [
			{ ward: '00', capacity: 30 }, 	//ชั้น 10
			{ ward: '06', capacity: 8 }, 	//ชั้น 1
			{ ward: '10', capacity: 30 }, 	//ชั้น 9
			{ ward: '11', capacity: 24 }, 	//ชั้น 2
			{ ward: '12', capacity: 5 }, 	//ชั้น 3
		];

		$scope.cardStat = [];

		const initTotalData = function() {
			return {
				total: 0,
			}
		};
		
		const initTotalBed = function() {
			return {
				capacity: 0,
				pt_num: 0,
				empty: 0,
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

		$scope.getNumBed = function(e) {
			if(e) e.preventDefault();

			$scope.totalData = initTotalBed();

			$scope.loading = true;
			$http.get(`${CONFIG.apiUrl}/covid/num-bed`)
			.then(res => {
				$scope.data = res.data;

				/** Set bed amount of covid */
				$scope.data.forEach(w => {
					const bed = $scope.covidBed.find(bed => bed.ward === w.ward);
					w.capacity = bed.capacity;
				});

				$scope.data.forEach(w => {
					$scope.totalData.capacity += w.capacity;
					$scope.totalData.pt_num += parseInt(w.num_pt);
					$scope.totalData.empty += w.capacity - parseInt(w.num_pt);
				});
			}, err => {
				console.log(err);
			});
		};

		$scope.getCardStat = function(e) {
			if(e) e.preventDefault();

			$scope.totalData = initTotalBed();

			$scope.loading = true;
			$http.get(`${CONFIG.apiUrl}/covid/card-stat`)
			.then(res => {
				/** Set card statistics of small box */
				$scope.cardStat = [{
					id: 1,
					name: "ผู้ป่วยใหม่",
					value: parseInt(res.data.new_case),
					unit: 'คน',
					bg: 'bg-danger',
					icon: 'ion-person-add',
					lnk: ''
				},
				{
					id: 2,
					name: "ยอดยกมา",
					value: parseInt(res.data.top_case),
					unit: 'คน',
					bg: 'bg-warning',
					icon: 'ion-stats-bars',
					lnk: ''
				},
				{
					id: 3,
					name: "จำหน่าย",
					value: parseInt(res.data.discharge),
					unit: 'คน',
					bg: 'bg-success',
					icon: 'ion-ios-redo',
					lnk: ''
				},
				{
					id: 4,
					name: "คงพยาบาล",
					value: parseInt(res.data.still),
					unit: 'คน',
					bg: 'bg-info',
					icon: 'ion-android-clipboard',
					lnk: ''
				}];
			}, err => {
				console.log(err);
			});
		};

		$scope.getBedEmpty = function(ward) {
			if (!ward) return;

			return ward.capacity - ward.num_pt;
		}
	}
]);