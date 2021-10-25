
app.controller('ipController', [
	'$rootScope',
	'$scope',
	'$http',
	'$routeParams',
	'CONFIG',
	'DatetimeService',
	'StringFormatService',
	function($rootScope, $scope, $http, $routeParams, CONFIG, DatetimeService, StringFormatService)
	{
		$scope.cboDate = '';
		$scope.cboYear = '';
		$scope.sdate = '';
		$scope.edate = '';

		$scope.data = [];
		$scope.ipLists = [];
		$scope.pager = null;
		$scope.totalData = {};
		$scope.toDay = new Date();

		$scope.totalAdmdate = 0;
		$scope.ward = null;
		const wardBed = [
			{ ward: '06', bed: 8, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 1 }, sortBy: 1 }, // พิเศษ 1 ชั้น 1
			{ ward: '11', bed: 12, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 2 }, sortBy: 2 }, // พิเศษ 2 ชั้น 2
			{ ward: '12', bed: 16, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 3 }, sortBy: 3 }, // พิเศษ 3 ชั้น 3
			{ ward: '02', bed: 30, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 4 }, sortBy: 4 }, // อายุรกรรมหญิง ชั้น 4
			{ ward: '01', bed: 26, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 5 }, sortBy: 5 }, // อายุรกรรมชาย ชั้น 5
			{ ward: '14', bed: 8, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 5 }, sortBy: 5 }, // Stroke Unit ชั้น 5
			{ ward: '18', bed: 24, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 6 }, sortBy: 7 }, // Cohort ตึกอายุรกรรม ชั้น 6
			{ ward: '17', bed: 0, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 6 }, sortBy: 8 }, // IntermediateCare ชั้น 6
			{ ward: '08', bed: 30, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 7 }, sortBy: 9 }, // กุมารเวชกรรม ชั้น 7
			{ ward: '15', bed: 2, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 7 }, sortBy: 10 }, // ทารกแรกเกิดวิกฤต (NICU) ชั้น 7
			{ ward: '13', bed: 10, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 7 }, sortBy: 11 }, // ทารกแรกเกิดป่วย ชั้น 7
			{ ward: '07', bed: 30, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 8 }, sortBy: 12 }, // ศัลยกรรมหญิง ชั้น 8
			{ ward: '10', bed: 30, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 9 }, sortBy: 13 }, // ศัลกรรมชาย ชั้น 9
			{ ward: '00', bed: 24, building: { no: 4, name: 'ตึก 10 ชั้น', floor: 10 }, sortBy: 14 }, // จักษุ โสต ศอ นาสิก ชั้น 10
			{ ward: '19', bed: 24, building: { no: 6, name: 'ตึกสิรินคร', floor: 3 }, sortBy: 15 }, // Trauma ตึกสิรินคร ชั้น 3
			{ ward: '09', bed: 30, building: { no: 6, name: 'ตึกสิรินคร', floor: 4 }, sortBy: 16 }, // สูติ-นรีเวชกรรม ตึกสิรินคร ชั้น 4
			{ ward: '20', bed: 24, building: { no: 6, name: 'ตึกสิรินคร', floor: 4 }, sortBy: 17 }, // เด็กวิกฤต (PICU) ตึกสิรินคร ชั้น 4
			{ ward: '04', bed: 8, building: { no: 6, name: 'ตึกสิรินคร', floor: 4 }, sortBy: 18 }, // ห้องคลอด ตึกสิรินคร
			{ ward: '05', bed: 8, building: { no: 6, name: 'ตึกสิรินคร', floor: 2 }, sortBy: 19 }, // วิกฤต ตึกสิรินคร
			{ ward: '16', bed: 0, building: { no: 5, name: 'เทศบาลฯ', floor: 0 }, sortBy: 20 }, // ตึก HICI ปฐมภูมิ
			{ ward: '21', bed: 50, building: { no: 99, name: 'เทศบาลฯ', floor: 0 }, sortBy: 21 }, // Cohort Ward เทศบาลฯ
		];

		const initTotalClass = () => ({
			type1: 0,
			type2: 0,
			type3: 0,
			type4: 0,
			type5: 0,
			unknown: 0,
			all: 0,
		});

		const initTotalBedEmpty = () => ({
			bedTotal: 0,
			ptAmount: 0,
			bedEmpty: 0,
		});

		const initTotalBedOccYear = () => ({
			bedTotal: 0,
			adjRwTotal: 0,
			ptTotal: 0,
			admDateTotal: 0,
			bedOccTotal: 0,
			activeBedTotal: 0,
		});

		$scope.getAdmdateMonth = function(e) {
			if(e) e.preventDefault();

			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

			$http.get(`${CONFIG.apiUrl}/ip/admdate-month/${month}`)
			.then(res => {
				let admdate = res.data.admdate
				let wardStat = res.data.wardStat

				admdate.forEach(d => {
					d.stat = wardStat.filter(st => d.ward === st.ward);
					// Get bed amount of each ward
					d.bed = wardBed.find(wb => d.ward===wb.ward);
				});
				
				// Get end date of month from startDate
				endDateOfMonth = moment(month).endOf("month").format('DD')
				// Create data by calling sumAdmdate function
				$scope.data = sumAdmdate(admdate, endDateOfMonth);
			}, err => {
				console.log(err)
			});
		}

		$scope.getAdmDcDay = function(e) {
			if(e) e.preventDefault();

			let date = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/ip/admdc-day/${date}`)
			.then(res => {
				let lastDate = moment(date).endOf('month').date();
				let { ipStat, moveStat } = res.data;
				$scope.data = ipStat;

				$scope.data.forEach(d => {
					// Get bed amount of each ward
					d.bed = wardBed.find(wb => d.ward===wb.ward);
					d.adm_avg = parseFloat(parseInt(d.adm_num) / lastDate);
					d.dc_avg = parseFloat(parseInt(d.dc_num) / lastDate);

					d.moveout = moveStat.filter(move => d.ward === move.oward && move.nward !== move.oward);
					d.movein = moveStat.filter(move => d.ward === move.nward && move.nward !== move.oward);
				})
				
				$scope.data.sort((a, b) => a.bed.sortBy - b.bed.sortBy);
			}, err => {
				console.log(err)
			});
		}

		$scope.getAdmDcMonth = function(e) {
			if(e) e.preventDefault();

			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

			$http.get(`${CONFIG.apiUrl}/ip/admdc-month/${month}`)
			.then(res => {
				let lastDate = moment(month).endOf('month').date();
				let { ipStat, moveStat } = res.data;
				$scope.data = ipStat;

				$scope.data.forEach(d => {
					// Get bed amount of each ward
					d.bed = wardBed.find(wb => d.ward===wb.ward);
					d.adm_avg = parseFloat(parseInt(d.adm_num) / lastDate);
					d.dc_avg = parseFloat(parseInt(d.dc_num) / lastDate);

					d.moveout = moveStat.filter(move => d.ward === move.oward && move.nward !== move.oward);
					d.movein = moveStat.filter(move => d.ward === move.nward && move.nward !== move.oward);
				});

				$scope.data.sort((a, b) => a.bed.sortBy - b.bed.sortBy);
			}, err => {
				console.log(err)
			});
		}

		$scope.getBedOccYear = function(e) {
			if(e) e.preventDefault();

			let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
			
			$http.get(`${CONFIG.apiUrl}/ip/bedocc-year/${year}`)
			.then(res => {
				let admdate = res.data.admdate
				let wardStat = res.data.wardStat

				$scope.totalData = initTotalBedOccYear();

				admdate.forEach(d => {
					d.stat = wardStat.filter(st => d.ward === st.ward);
					// Get bed amount of each ward
					d.bed = wardBed.find(wb => d.ward===wb.ward);
				});
				
				// Get total days of the year
				daysOfYear = (moment().year(year).month(1).endOf("month").format('DD') == 28) ? 365 : 366;
				// Create data by calling sumAdmdate function
				$scope.data = sumAdmdate(admdate, daysOfYear);

				$scope.data.forEach(d => {
					$scope.totalData.adjRwTotal += parseFloat(d.rw);
					$scope.totalData.ptTotal += parseInt(d.dc_num);
					$scope.totalData.admDateTotal += parseInt(d.admdate);
				});

				$scope.totalData.bedTotal = 200; //คิด
				$scope.totalData.bedOccTotal = ($scope.totalData.admDateTotal) * 100/($scope.totalData.bedTotal * daysOfYear)
				$scope.totalData.activeBedTotal = ($scope.totalData.bedOccTotal * 200)/100;
			}, err => {
				console.log(err)
			});
		}

		const sumAdmdate = function(data, totalDate) {
			data.forEach(d => {
				d.sumBedOcc1 = calculateBedOcc(d.admdate, d.bed.bed, totalDate);

				d.activeBed1 = calculateActiveBed(d.sumBedOcc1, d.bed.bed);

				d.sumAdm = d.stat.reduce((sum, st) => {
					return sum + parseInt(st.admdate);
				}, 0);

				d.sumHr = d.stat.reduce((sum, st) => {
					return sum + parseInt(st.admit_hour);
				}, 0);
				
				d.sumPt = d.stat.length;

				d.sumBedOcc2 = calculateBedOcc(d.sumAdm, d.bed.bed, totalDate);

				d.activeBed2 = calculateActiveBed(d.sumBedOcc2, d.bed.bed);
			});
			
			return data;
		}

		const calculateBedOcc = function(sumAdmdate, totalBed, totalDate) {
			return (sumAdmdate*100)/(totalBed*totalDate);
		}
		
		const calculateActiveBed = function(bedOcc, totalBed) {
			return (bedOcc*totalBed)/100;
		}

		$scope.showIpLists = (e, ward) => {
			e.preventDefault();
            
			let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

            $http.get(`${CONFIG.apiUrl}/ip/ip-lists/${date}/${ward}`)
            .then(res => {
				console.log(res);
                $scope.ipLists = res.data.items;
                $scope.pager = res.data.pager;

				$scope.ipLists.forEach(u => {
					u.ageY = DatetimeService.calcAge(u.birthday, 'years');
				});
				
                $('#ipLists').modal('show');
			}, err => {
                console.log(err)
            });
		};

		$scope.onPaginateLinkClick = (e, link) => {
            e.preventDefault();
            
            $http.get(link)
            .then(res => {
                $scope.ipLists = res.data.items;
                $scope.pager = res.data.pager;

				$scope.ipLists.forEach(u => {
					u.ageY = DatetimeService.calcAge(u.birthday, 'years');
				});
            }, err => {
                console.log(err)
            });
        };

		$scope.getBedEmptyDay = function(e) {
			if(e) e.preventDefault();

			$scope.totalData = initTotalBedEmpty();

			let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');
			
			$http.get(`${CONFIG.apiUrl}/ip/bedempty-day/${date}`)
			.then(res => {
				$scope.data = res.data

				/** Get bed amount of each ward */
				$scope.data.forEach(d => {
					d.bed = wardBed.find(wb => d.ward===wb.ward);
				});

				$scope.data.forEach(d => {
					d.bedEmpty = parseInt(d.bed.bed) - parseInt(d.num_pt);
					d.bedUsePercent = (d.num_pt * 100) / d.bed.bed;
					d.bedEmptyPercent = (d.bedEmpty * 100) / d.bed.bed;
				});

				$scope.data.forEach((val, key) => {
					$scope.totalData.bedTotal += parseInt(val.bed.bed);
					$scope.totalData.ptAmount += parseInt(val.num_pt);
					$scope.totalData.bedEmpty += parseInt(val.bed.bed) - parseInt(val.num_pt);
				});

				$scope.data.sort((a, b) => a.bed.sortBy - b.bed.sortBy);

				$scope.totalData.bedUsePercent = ($scope.totalData.ptAmount * 100) / $scope.totalData.bedTotal;
				$scope.totalData.bedEmptyPercent = ($scope.totalData.bedEmpty * 100) / $scope.totalData.bedTotal;
			}, err => {
				console.log(err)
			});
		}

		$scope.getIpClassData = function(e) {
			if(e) e.preventDefault();

			$scope.totalData = initTotalClass();

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
					$scope.totalData.type1 += parseInt(val.type1);
					$scope.totalData.type2 += parseInt(val.type2);
					$scope.totalData.type3 += parseInt(val.type3);
					$scope.totalData.type4 += parseInt(val.type4);
					$scope.totalData.type5 += parseInt(val.type5);
					$scope.totalData.unknown += parseInt(val.unknown);
					$scope.totalData.all += parseInt(val.all);
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