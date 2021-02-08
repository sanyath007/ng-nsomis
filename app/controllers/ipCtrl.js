
app.controller('ipController', [
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
		$scope.totalClass = {};
		$scope.toDay = new Date();

		$scope.totalAdmdate = 0;
		$scope.ward = null;
		const wardBed = [
			{ ward: '00', bed: 10 }, // จักษุ โสต ศอ นาสิก
			{ ward: '01', bed: 35 }, // อายุรกรรมชาย
			{ ward: '02', bed: 35 }, // อายุรกรรมหญิง
			{ ward: '04', bed: 8 }, // ห้องคลอด
			{ ward: '05', bed: 8 }, // วิกฤต
			{ ward: '06', bed: 8 }, // พิเศษ 1
			{ ward: '07', bed: 35 }, // ศัลยกรรมหญิง
			{ ward: '08', bed: 35 }, // กุมารเวชกรรม
			{ ward: '09', bed: 35 }, // สูติ-นรีเวชกรรม
			{ ward: '10', bed: 35 }, // ศัลกรรมชาย
			{ ward: '11', bed: 12 }, // พิเศษ 2
			{ ward: '12', bed: 10 }, // พิเศษ 3
			{ ward: '13', bed: 6 }, // ทารกแรกเกิดป่วย
			{ ward: '14', bed: 8 }, // Stroke Unit
			{ ward: '15', bed: 6 }, // NICU
			{ ward: '17', bed: 6 }, // IntermediateCare
		];

		const initTotalClass = function() {
			return {
				type1: 0,
				type2: 0,
				type3: 0,
				type4: 0,
				type5: 0,
				unknown: 0,
				all: 0,
			};
		}

		$scope.getAdmdateData = function(e) {
			if(e) e.preventDefault();

			let startDate = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');
			let endDate = ($('#edate').val() !== '') 
							? StringFormatService.convToDbDate($scope.edate) 
							: moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/ip/admdate/${startDate}/${endDate}`)
			.then(res => {
				let admdate = res.data.admdate
				let wardStat = res.data.wardStat

				admdate.forEach(d => {
					d.stat = wardStat.filter(st => d.ward === st.ward);
					// Get bed amount of each ward
					d.bed = wardBed.find(wb => d.ward===wb.ward);
				});
				
				// Get end date of month from startDate
				endDateOfMonth = moment(startDate).endOf("month").format('DD')
				// Create data by calling sumAdmdate function
				$scope.data = sumAdmdate(admdate, endDateOfMonth);
			}, err => {
				console.log(err)
			});
		}

		const sumAdmdate = function(data, endOfMonth) {
			data.forEach(d => {
				d.sumBedOcc1 = (d.admdate*100)/(d.bed.bed*endOfMonth);

				d.activeBed1 = (d.sumBedOcc1*d.bed.bed)/endOfMonth;

				d.sumAdm = d.stat.reduce((sum, st) => {
					return sum + parseInt(st.admdate);
				}, 0);

				d.sumHr = d.stat.reduce((sum, st) => {
					return sum + parseInt(st.admit_hour);
				}, 0);
				
				d.sumPt = d.stat.length;

				d.sumBedOcc2 = (d.sumAdm*100)/(d.bed.bed*endOfMonth);

				d.activeBed2 = (d.sumBedOcc2*d.bed.bed)/endOfMonth;
			});
			
			return data;
		}

		$scope.getIpClassData = function(e) {
			if(e) e.preventDefault();

			$scope.totalClass = initTotalClass();

			let startDate = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');
			let endDate = ($('#edate').val() !== '') 
							? StringFormatService.convToDbDate($scope.edate) 
							: moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/ip/class/${startDate}/${endDate}`)
			.then(res => {
				console.log(res)
				$scope.data = res.data.classes;

				$scope.data.forEach((val, key) => {
					$scope.totalClass.type1 += parseInt(val.type1);
					$scope.totalClass.type2 += parseInt(val.type2);
					$scope.totalClass.type3 += parseInt(val.type3);
					$scope.totalClass.type4 += parseInt(val.type4);
					$scope.totalClass.type5 += parseInt(val.type5);
					$scope.totalClass.unknown += parseInt(val.unknown);
					$scope.totalClass.all += parseInt(val.all);
				});
			}, err => {
				console.log(err)
			});
		};

		$scope.getPtDchByWard = function(e) {
			// if(!$rootScope.isLogedIn) $rootScope.showLogin();

			let sdate = $routeParams.sdate;
			let edate = $routeParams.edate;
			let ward = $routeParams.ward;

			$http.get(`${CONFIG.apiUrl}/ip/ptdchbyward/${sdate}/${edate}/${ward}`)
			.then(res => {
				$scope.data = res.data.data;
				$scope.ward = res.data.ward;

				$scope.totalAdmdate = $scope.data.reduce((sumAdmDate, curVal) => {
					return sumAdmDate + parseInt(curVal.admdate);
				}, 0);
			}, err => {
				console.log(err);
			})
		};
		
		$scope.getPtLosByCare = function(e) {
			// if(!$rootScope.isLogedIn) $rootScope.showLogin();

			let sdate = $routeParams.sdate;
			let edate = $routeParams.edate;
			let ward = $routeParams.ward;

			$http.get(`${CONFIG.apiUrl}/ip/ptlosbycare/${sdate}/${edate}/${ward}`)
			.then(res => {
				$scope.data = res.data.data;
				$scope.ward = res.data.ward;

				$scope.totalAdmdate = $scope.data.reduce((sumAdmDate, curVal) => {
					return sumAdmDate + parseInt(curVal.admdate);
				}, 0);
			}, err => {
				console.log(err);
			})
		};
	}
]);