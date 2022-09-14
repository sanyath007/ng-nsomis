
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
		$scope.cboMonth = '';
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
					d.bed = $rootScope.wardBed().find(wb => d.ward===wb.ward);
				});

				// Get end date of month from startDate
				endDateOfMonth = moment(month).endOf("month").format('DD')
				// Create data by calling sumAdmdate function
				$scope.data = $rootScope.sumAdmdate(admdate, endDateOfMonth);
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
					d.bed = $rootScope.wardBed().find(wb => d.ward===wb.ward);
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
					d.bed = $rootScope.wardBed().find(wb => d.ward===wb.ward);
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

		$scope.getAdmDcYear = function(e) {
			if(e) e.preventDefault();

			let year = ($scope.cboYear !== '') 
                        ? $scope.cboYear
                        : moment().format('YYYY');

			$http.get(`${CONFIG.apiUrl}/ip/admdc-year/${year}`)
			.then(res => {
				console.log(res);
				// let lastDate = moment(year).endOf('year').date();
				let { ipStat, moveStat } = res.data;
				$scope.data = ipStat;

				$scope.data.forEach(d => {
					// Get bed amount of each ward
					d.bed = $rootScope.wardBed().find(wb => d.ward===wb.ward);
					// d.adm_avg = parseFloat(parseInt(d.adm_num) / lastDate);
					// d.dc_avg = parseFloat(parseInt(d.dc_num) / lastDate);

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
					d.bed = $rootScope.wardBed().find(wb => d.ward===wb.ward);
				});

				// Get total days of the year
				daysOfYear = (moment().year(year).month(1).endOf("month").format('DD') == 28) ? 365 : 366;
				// Create data by calling sumAdmdate function
				$scope.data = $rootScope.sumAdmdate(admdate, daysOfYear);
				$scope.data.sort((wa, wb) => wa.bed.sortBy - wb.bed.sortBy);

				$scope.data.forEach(d => {
					$scope.totalData.adjRwTotal += parseFloat(d.rw);
					$scope.totalData.ptTotal += parseInt(d.dc_num);
					$scope.totalData.admDateTotal += parseInt(d.admdate);
				});

				$scope.totalData.bedTotal = 200; //คิดตามกระทรวง
				$scope.totalData.bedOccTotal = ($scope.totalData.admDateTotal) * 100/($scope.totalData.bedTotal * daysOfYear)
				$scope.totalData.activeBedTotal = ($scope.totalData.bedOccTotal * 200)/100;
			}, err => {
				console.log(err)
			});
		}

		$scope.getBedOccMonth = function(e) {
			if(e) e.preventDefault();

			$scope.data = [];
			$scope.pager = null;
			$scope.totalData = {};

			let month = ($scope.cboMonth !== '') 
						? DatetimeService.fotmatYearMonth($scope.cboMonth)
						: moment().format('YYYY-MM');

			// Get total days of the year
			daysOfMonth = moment(month).endOf("month").format('DD');
			$scope.sdate = moment(month).format('YYYY-MM')+ '-01';
			$scope.edate = moment(month).format('YYYY-MM')+ '-' +daysOfMonth;

			$http.get(`${CONFIG.apiUrl}/ip/bedocc-month/${month}`)
			.then(res => {
				$scope.totalData = initTotalBedOccYear();

				let wards = res.data.wards.map(w => {
					let ward = null;
					/** Get discharge data of each ward */
					let admit = res.data.admdate.find(ad => ad.ward === w.ward);
					/** Get ward stat of each ward */
					let stat = res.data.wardStat.filter(st => w.ward === st.ward);
					/** Get bed amount of each ward */
					let bed = $rootScope.wardBed().find(wb => w.ward===wb.ward);

					if (admit && admit.ward === w.ward) {
						ward = { ...w, ...admit, stat, bed };
					} else {
						ward = { ...w, rw: 0.0, dc_num: 0, admdate: 0, stat, bed };
					}

					return ward;
				});

				/** Create data by calling sumAdmdate function */
				$scope.data = $rootScope.sumAdmdate(wards, daysOfMonth);
				$scope.data.sort((wa, wb) => wa.bed.sortBy - wb.bed.sortBy);

				$scope.data.forEach(d => {
					$scope.totalData.adjRwTotal += parseFloat(d.rw);
					$scope.totalData.ptTotal += parseInt(d.dc_num);
					$scope.totalData.admDateTotal += parseInt(d.admdate);
				});

				$scope.totalData.bedTotal = 200; //คิดตามกระทรวง
				$scope.totalData.bedOccTotal = ($scope.totalData.admDateTotal) * 100/($scope.totalData.bedTotal * daysOfMonth)
				$scope.totalData.activeBedTotal = ($scope.totalData.bedOccTotal * 200)/100;
			}, err => {
				console.log(err)
			});
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
					d.bed = $rootScope.wardBed().find(wb => d.ward===wb.ward);
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

		$scope.getIpClassDay = function(e) {
			if(e) e.preventDefault();

			$scope.totalData = initTotalClass();

			let date = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/ip/class/${date}`)
			.then(res => {
				$scope.data = res.data.classes;

				$scope.data.forEach((val, key) => {
					console.log(key);
					$scope.totalData.type1 += parseInt(val.type1);
					$scope.totalData.type2 += parseInt(val.type2);
					$scope.totalData.type3 += parseInt(val.type3);
					$scope.totalData.type4 += parseInt(val.type4);
					$scope.totalData.type5 += parseInt(val.type5);
					$scope.totalData.unknown += parseInt(val.unknown);
					$scope.totalData.all += parseInt(val.all);

					/** Get bed amount of each ward */
					val.desc = $rootScope.wardBed().find(wb => val.ward===wb.ward);
				});

				$scope.data.sort((a, b) => a.desc.sortBy - b.desc.sortBy);
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