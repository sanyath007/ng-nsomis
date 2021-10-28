
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
		$scope.ward = {};
		$scope.type = "";
		$scope.covidBed = [
			{ ward: '06', capacity: 6, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 1 }, sortBy: 1 }, //ชั้น 1
			{ ward: '11', capacity: 27, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 2 }, sortBy: 2 }, //ชั้น 2
			{ ward: '12', capacity: 27, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 3 }, sortBy: 3 }, //ชั้น 3
			{ ward: '18', capacity: 24, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 6 }, sortBy: 7 }, //ชั้น 6
			{ ward: '10', capacity: 32, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 9 }, sortBy: 11 }, //ชั้น 9
			{ ward: '00', capacity: 30, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 10 }, sortBy: 12 }, //ชั้น 10
			{ ward: '21', capacity: 50, building: { no: 99, name: 'เทศบาลฯ', floor: 0 }, sortBy: 21 }, 	//Cohort เทศบาล
		];

		$scope.cardStat = [];

		const initTotalData = function() {
			return {
				total: 0,
				discharge: 0
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

				$scope.totalData.discharge = $scope.data.reduce((sum, tam) => {
					return sum + parseInt(tam.dc_num);
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

		$scope.getDischargesTambon = function(e) {
			if(e) e.preventDefault();

			const tambon = $routeParams.tambon;

			$scope.loading = true;
			$http.get(`${CONFIG.apiUrl}/covid/discharge/${tambon}/tambon`)
			.then(res => {
				console.log(res);
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
				$scope.data.forEach(w => w.bed = $scope.covidBed.find(bed => bed.ward === w.ward));

				$scope.data.forEach(w => {
					$scope.totalData.capacity += w.bed.capacity;
					$scope.totalData.pt_num += parseInt(w.num_pt);
					$scope.totalData.empty += w.bed.capacity - parseInt(w.num_pt);
				});

				$scope.data.sort((a, b) => a.bed.sortBy - b.bed.sortBy);
			}, err => {
				console.log(err);
			});
		};

		$scope.getPatientsWard = function(e) {
			if(e) e.preventDefault();

			const ward = $routeParams.ward;

			$scope.loading = true;
			$http.get(`${CONFIG.apiUrl}/covid/${ward}/ward`)
			.then(res => {
				$scope.data = res.data.patients;
				$scope.ward = res.data.ward;
			}, err => {
				console.log(err);
			});
		};
		
		$scope.getPatientsAll = function(e) {
			if(e) e.preventDefault();

			const type = $routeParams.type;

			$scope.loading = true;
			$http.get(`${CONFIG.apiUrl}/covid/${type}/all`)
			.then(res => {
				$scope.data = res.data.patients;
				$scope.type = res.data.type;
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
					name: "ยอดยกมา",
					value: parseInt(res.data.top_case),
					unit: 'คน',
					bg: 'bg-warning',
					icon: 'ion-stats-bars',
					link: 'covid/1/all'
				},
				{
					id: 2,
					name: "ผู้ป่วยใหม่",
					value: parseInt(res.data.new_case),
					unit: 'คน',
					bg: 'bg-danger',
					icon: 'ion-person-add',
					link: 'covid/2/all'
				},
				{
					id: 3,
					name: "จำหน่าย",
					value: parseInt(res.data.discharge),
					unit: 'คน',
					bg: 'bg-success',
					icon: 'ion-ios-redo',
					link: 'covid/3/all'
				},
				{
					id: 4,
					name: "คงพยาบาล",
					value: parseInt(res.data.still),
					unit: 'คน',
					bg: 'bg-info',
					icon: 'ion-android-clipboard',
					link: 'covid/0/all'
				}];
			}, err => {
				console.log(err);
			});
		};

		$scope.getBedEmpty = function(ward) {
			if (!ward) return;

			return ward.bed.capacity - ward.num_pt;
		}

		$scope.calculatePercentage = function(val1, val2) {
			return (val1 * 100) / val2;
		};

		$scope.calculateLos = function(admitDate) {
			return moment().diff(moment(admitDate), 'days');
		};
	}
]);