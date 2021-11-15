
app.controller('dashmonthController', [
    '$rootScope',
    '$scope',
    '$http',
    'CONFIG',
    'ChartService',
    'DatetimeService',
    'StringFormatService',
    function($rootScope, $scope, $http, CONFIG, ChartService, DatetimeService, StringFormatService)
    {
        $scope.cardData = {};
        $scope.barOptions = {};
        $scope.pieOptions = {};
        $scope.cboMonth = '';
        $scope.cboWeek = '';
        $scope.epidWeeks = [];

        $scope.getOpVisit = function (e) {
            if(e) e.preventDefault();

            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

            ChartService.getSeriesData('/dashboard/op-visit-month/', month)
            .then(function(res) {
                let {dataSeries, categories} = ChartService.createDataSeries(
                    res.data,
                    { name: 'd', value: 'num_pt'},
                    { name: 'm', value: month }
                );

                $scope.barOptions = ChartService.initBarChart("opVisitBarContainer", "ยอดผู้ป่วยนอก รายวัน", categories, 'จำนวน');
                $scope.barOptions.series.push({
                    name: 'op visit',
                    data: dataSeries,
                    color: '#e41749',
                });

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.getOpVisitType = function (e) {
            if(e) e.preventDefault();
            
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

            ChartService.getSeriesData('/dashboard/op-visit-type-month/', month)
            .then(function(res) {
                $scope.pieOptions = ChartService.initPieChart("opVisitTypePieContainer", "สัดส่วนผู้ป่วยนอก ตามประเภทการมา", "", "สัดส่วนตามประเภทการมา");

                res.data.forEach((value, key) => {
                    $scope.pieOptions.series[0].data.push({name: value.type, y: parseInt(value.num_pt)});
                });

                var chart = new Highcharts.Chart($scope.pieOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.getIpVisit = function(e) {
            if(e) e.preventDefault();
            
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

            ChartService.getSeriesData('/dashboard/ip-visit-month/', month)
            .then(function(res) {
                let {dataSeries, categories} = ChartService.createDataSeries(
                    res.data,
                    { name: 'd', value: 'num_pt'},
                    { name: 'm', value: month }
                );

                $scope.barOptions = ChartService.initBarChart("ipVisitBarContainer", "ยอดผู้ป่วยใน รายวัน", categories, 'จำนวน');
                $scope.barOptions.series.push({
                    name: 'ip visit',
                    data: dataSeries,
                    color: '#1f640a',
                });

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.getIpClass = function (e) {
            if(e) e.preventDefault();
            
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

            ChartService.getSeriesData('/dashboard/ip-class-month/', month)
            .then(function(res) {
                $scope.pieOptions = ChartService.initPieChart("ipClassPieContainer", "สัดส่วนผู้ป่วยใน ตามประเภทผู้ป่วย", "", "สัดส่วนตามประเภทผู้ป่วย");

                res.data.forEach((value, key) => {
                    Object.keys(value).forEach(name => {
                        $scope.pieOptions.series[0].data.push({name: name, y: parseInt(value[name])});
                    });
                });

                var chart = new Highcharts.Chart($scope.pieOptions);
            }, function(err) {
                console.log(err);
            });
        };

		const initTotalBedOccYear = () => ({
			bedTotal: 0,
			adjRwTotal: 0,
			ptTotal: 0,
			admDateTotal: 0,
			bedOccTotal: 0,
			activeBedTotal: 0,
		});

        $scope.getBedOccMonth = function(e) {
			if(e) e.preventDefault();

			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

			$http.get(`${CONFIG.apiUrl}/ip/bedocc-month/${month}`)
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
				daysOfMonth = moment(month).endOf("month").format('DD');
				// Create data by calling sumAdmdate function
				$scope.data = $rootScope.sumAdmdate(admdate, daysOfMonth);
				$scope.data.sort((wa, wb) => wa.bed.sortBy - wb.bed.sortBy);

                /** Calculate summary */
				// $scope.data.forEach(d => {
				// 	$scope.totalData.adjRwTotal += parseFloat(d.rw);
				// 	$scope.totalData.ptTotal += parseInt(d.dc_num);
				// 	$scope.totalData.admDateTotal += parseInt(d.admdate);
				// });

				// $scope.totalData.bedTotal = 200; //คิดตามกระทรวง
				// $scope.totalData.bedOccTotal = ($scope.totalData.admDateTotal) * 100/($scope.totalData.bedTotal * daysOfYear)
				// $scope.totalData.activeBedTotal = ($scope.totalData.bedOccTotal * 200)/100;

                /** อัตราครองเตียง */
                const dataSeries1 = $scope.data.map(ward => {
                    return {
                        name: ward.name,
                        y: parseFloat(ward.sumBedOcc2.toFixed(2))
                    };
                });

                $scope.chartOptions = ChartService.initColumnChart("ipBedoccBarContainer", "อัตราครองเตียง", '%', '{point.y:.0f}');
                $scope.chartOptions.series = [{
                    name: 'อัตราครองเตียง',
                    colorByPoint: true,
                    data: dataSeries1,
                    dataLabels: {
                        enabled: true
                    }
                }];

                let chart = new Highcharts.Chart($scope.chartOptions);

                /** Active Bed */
                const dataSeries2 = $scope.data.map(ward => {
                    return {
                        name: ward.name,
                        y: parseFloat(ward.activeBed2.toFixed(2))
                    };
                });

                $scope.chartOptions = ChartService.initColumnChart("ipActiveBedBarContainer", "Active Bed", 'เตียง', '{point.y:.0f}');
                $scope.chartOptions.series = [{
                    name: 'Active Bed',
                    colorByPoint: true,
                    data: dataSeries2,
                    dataLabels: {
                        enabled: true
                    }
                }];

                let chart2 = new Highcharts.Chart($scope.chartOptions);

                /** อัตราการใช้เตียง (Turn Over Rate) */
                const dataSeries3 = $scope.data.map(ward => {
                    return {
                        name: ward.name,
                        y: parseFloat((ward.sumPt/ward.bed.bed).toFixed(2))
                    };
                });

                $scope.chartOptions = ChartService.initColumnChart("ipTurnOverRateBarContainer", "อัตราการใช้เตียง (Turn Over Rate)", 'ราย/เตียง', '{point.y:.1f}');
                $scope.chartOptions.series = [{
                    name: 'Turn Over Rate',
                    colorByPoint: true,
                    data: dataSeries3,
                    dataLabels: {
                        enabled: true
                    }
                }];

                let chart3 = new Highcharts.Chart($scope.chartOptions);
                
                /** วิเคราะห์ศักยภาพการจัดบริการผู้ป่วยใน (CMI) */
                const dataSeries4 = $scope.data.map(ward => {
                    return {
                        name: ward.name,
                        y: parseFloat((ward.rw/ward.sumPt).toFixed(2))
                    };
                });

                $scope.chartOptions = ChartService.initColumnChart("ipCMIBarContainer", "CMI", '', '{point.y:.1f}');
                $scope.chartOptions.series = [{
                    name: 'CMI',
                    colorByPoint: true,
                    data: dataSeries4,
                    dataLabels: {
                        enabled: true
                    }
                }];

                let chart4 = new Highcharts.Chart($scope.chartOptions);
			}, err => {
				console.log(err)
			});
		}

        $scope.getCovidRegMonth = function(e) {
			if(e) e.preventDefault();

			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

			$http.get(`${CONFIG.apiUrl}/covid/register/${month}/month`)
			.then(res => {
                /** Generate series data of pie chart */
                let { series, categories } = ChartService.createStackedDataSeries(
                    [ 
                        { name: 'ชาย', prop: 'm' },
                        { name: 'หญิง', prop: 'w' },
                    ],
                    res.data,
                    { name: 'd' },
                    { name: 'm', value: month }
                );

                $scope.chartOptions = ChartService.initStackChart("covidTotalBarContainer", "ยอด Admit ผู้ป่วยโควิด", categories, 'จำนวน');
                $scope.chartOptions.series = series;
                let chart1 = new Highcharts.Chart($scope.chartOptions);

                $scope.pieOptions = ChartService.initPieChart("covidTotalPieContainer", "สัดส่วนตามเพศ", "", "สัดส่วนผู้ป่วย COVID-19");
                /** Generate series data of pie chart */
                const men = res.data.reduce((sum, curVal) => {
                    return sum += parseInt(curVal.m);
                }, 0);
                const women = res.data.reduce((sum, curVal) => {
                    return sum += parseInt(curVal.w);
                }, 0);
                let dataSeries = [];
                [ 
                    { name: 'ชาย', value: men },
                    { name: 'หญิง', value: women },
                ].forEach(data => {
                    dataSeries.push({ name: data.name, y: parseInt(data.value) });
                });

                $scope.pieOptions.series[0].data = dataSeries;

                /** Render chart */
                var chart2 = new Highcharts.Chart($scope.pieOptions);
			}, err => {
				console.log(err)
			});
		};

        $scope.getCovidRegWardMonth = function(e) {
			if(e) e.preventDefault();

			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

			$http.get(`${CONFIG.apiUrl}/covid/register/ward/${month}/month`)
			.then(res => {
                let wards = [ 
                    { name: 'ชั้น1', prop: 'fl1', value: 0 },
                    { name: 'ชั้น2', prop: 'fl2', value: 0 },
                    { name: 'ชั้น3', prop: 'fl3', value: 0 },
                    { name: 'ชั้น6', prop: 'fl6', value: 0 },
                    { name: 'ชั้น9', prop: 'fl9', value: 0 },
                    { name: 'ชั้น10', prop: 'fl10', value: 0 },
                    { name: 'วอร์ด11', prop: 'w11', value: 0 }
                ];
                let { series, categories } = ChartService.createStackedDataSeries(
                    wards,
                    res.data,
                    { name: 'd'},
                    { name: 'm', value: month }
                );

                $scope.chartOptions = ChartService.initLineChart("covidWardBarContainer", "ยอด Admit ผู้ป่วยโควิด", categories, 'จำนวน');
                $scope.chartOptions.series = series;

                let chart1 = new Highcharts.Chart($scope.chartOptions);

                wards.forEach(w => {
                    w.value = res.data.reduce((sum, curval) => {
                        return sum += parseInt(curval[w.prop]);
                    }, 0)
                });

                const dataSeries = wards.map(fl => {
                    return {
                        name: fl.name,
                        y: fl.value
                    }
                });

                $scope.chartOptions = ChartService.initColumnChart("covidWardTotalBarContainer", "ยอด Admit รายวอร์ด", 'จำนวน (ราย)', '{point.y:.0f}');
                $scope.chartOptions.series = [
                    {
                        name: 'Covid Total',
                        colorByPoint: true,
                        data: dataSeries
                    }
                ];

                let chart2 = new Highcharts.Chart($scope.chartOptions);
			}, err => {
				console.log(err)
			});
		};

        $scope.getCovidRegWeek = function(e) {
			if(e) e.preventDefault();

			let week = 46;

			$http.get(`${CONFIG.apiUrl}/covid/register/${week}/epi-week`)
			.then(res => {
                let categories = Object.keys(res.data);
                let dataSeries = Object.values(res.data).map(d => parseInt(d));

                $scope.chartOptions = ChartService.initAreaChart("covidWeekBarContainer", "ยอด Admit ผู้ป่วยโควิด ตามสัปดาห์ระบาดวิทยา ปี 2564", categories, 'จำนวน');
                $scope.chartOptions.series.push({
                    name: 'Covid Total',
                    data: dataSeries,
                    color: '#FD7013',
                });

                let chart = new Highcharts.Chart($scope.chartOptions);
			}, err => {
				console.log(err)
			});
		};
        
        $scope.getBedOccWeek = function(e) {
			if(e) e.preventDefault();

			let week = 45;

			$http.get(`${CONFIG.apiUrl}/ip/bedocc-week/${week}`)
			.then(res => {
				let admdate = res.data.admdate
				let wardStat = res.data.wardStat

				admdate.forEach(d => {
					d.stat = wardStat.filter(st => d.ward === st.ward);
					// Get bed amount of each ward
					d.bed = $rootScope.covidBed().find(wb => d.ward===wb.ward);
				});

				// Create data by calling sumAdmdate function
				$scope.data = $rootScope.sumAdmdate2(admdate, 7);
				$scope.data.sort((wa, wb) => wa.bed.sortBy - wb.bed.sortBy);

                /** อัตราครองเตียง */
                const dataSeries1 = $scope.data.map(ward => {
                    return {
                        name: ward.name,
                        y: parseFloat(ward.sumBedOcc2.toFixed(2))
                    };
                });

                $scope.chartOptions = ChartService.initColumnChart("covidBedOccBarContainer", "อัตราครองเตียง สัปดาห์ที่ 45 (ตามสัปดาห์ระบาดวิทยา ปี 2564)", '%', '{point.y:.0f}');
                $scope.chartOptions.series = [{
                    name: 'อัตราครองเตียง',
                    colorByPoint: true,
                    data: dataSeries1,
                    dataLabels: {
                        enabled: true
                    }
                }];

                let chart = new Highcharts.Chart($scope.chartOptions);

                /** Active Bed */
                // const dataSeries2 = $scope.data.map(ward => {
                //     return {
                //         name: ward.name,
                //         y: parseFloat(ward.activeBed2.toFixed(2))
                //     };
                // });

                // $scope.chartOptions = ChartService.initColumnChart("ipActiveBedBarContainer", "Active Bed", 'เตียง', '{point.y:.0f}');
                // $scope.chartOptions.series = [{
                //     name: 'Active Bed',
                //     colorByPoint: true,
                //     data: dataSeries2,
                //     dataLabels: {
                //         enabled: true
                //     }
                // }];

                // let chart2 = new Highcharts.Chart($scope.chartOptions);

                /** อัตราการใช้เตียง (Turn Over Rate) */
                // const dataSeries3 = $scope.data.map(ward => {
                //     return {
                //         name: ward.name,
                //         y: parseFloat((ward.sumPt/ward.bed.bed).toFixed(2))
                //     };
                // });

                // $scope.chartOptions = ChartService.initColumnChart("ipTurnOverRateBarContainer", "อัตราการใช้เตียง (Turn Over Rate)", 'ราย/เตียง', '{point.y:.1f}');
                // $scope.chartOptions.series = [{
                //     name: 'Turn Over Rate',
                //     colorByPoint: true,
                //     data: dataSeries3,
                //     dataLabels: {
                //         enabled: true
                //     }
                // }];

                // let chart3 = new Highcharts.Chart($scope.chartOptions);
                
                /** วิเคราะห์ศักยภาพการจัดบริการผู้ป่วยใน (CMI) */
                // const dataSeries4 = $scope.data.map(ward => {
                //     return {
                //         name: ward.name,
                //         y: parseFloat((ward.rw/ward.sumPt).toFixed(2))
                //     };
                // });

                // $scope.chartOptions = ChartService.initColumnChart("ipCMIBarContainer", "CMI", '', '{point.y:.1f}');
                // $scope.chartOptions.series = [{
                //     name: 'CMI',
                //     colorByPoint: true,
                //     data: dataSeries4,
                //     dataLabels: {
                //         enabled: true
                //     }
                // }];

                // let chart4 = new Highcharts.Chart($scope.chartOptions);
			}, err => {
				console.log(err)
			});
		};

        $scope.getReferIn = function(e) {
            if(e) e.preventDefault();
            
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');
            
            ChartService.getSeriesData('/refer/referin-month/', month)
            .then(function(res) {
                let {series, categories} = ChartService.createStackedDataSeries(
                    [ 
                        { name: 'ER', prop: 'ER' },
                        { name: 'OPD', prop: 'OPD' },
                        { name: 'IPD', prop: 'IPD' }
                    ],
                    res.data,
                    { name: 'd'},
                    { name: 'm', value: month }
                );
                
                $scope.barOptions = ChartService.initStackChart("referInBarContainer", "Refer In รายวัน", categories, 'จำนวน');
                $scope.barOptions.series = series;

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.getReferOut = function(e) {
            if(e) e.preventDefault();
            
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');
            
            ChartService.getSeriesData('/refer/referout-month/', month)
            .then(function(res) {
                let {series, categories} = ChartService.createStackedDataSeries(                    
                    [
                        { name: 'ER', prop: 'ER' },
                        { name: 'OPD', prop: 'OPD' },
                        { name: 'IPD', prop: 'IPD' }
                    ],
                    res.data,
                    { name: 'd'},
                    { name: 'm', value: month }
                );

                $scope.barOptions = ChartService.initStackChart("referOutBarContainer", "Refer Out รายวัน", categories, 'จำนวน');
                $scope.barOptions.series = series;

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };
        
        $scope.getErVisit = function() {
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

            ChartService.getSeriesData2(`/er/visit/${month}/month`)
            .then(function(res) {
                let {series, categories} = ChartService.createStackedDataSeries(                    
                    [
                        { name: 'Emergency', prop: 'emergency' },
                        { name: 'Ugency', prop: 'ugency' },
                        { name: 'Semi-ugency', prop: 'semi' },
                        { name: 'Non-ugency', prop: 'non' },
                        { name: 'Resuscitation', prop: 'resuscitation' }
                    ],
                    res.data,
                    { name: 'd'},
                    { name: 'm', value: month }
                );

                $scope.barOptions = ChartService.initStackChart("erVisitBarContainer", "ยอดผู้รับบริการ รายวัน", categories, 'จำนวน');
                $scope.barOptions.series = series;

                var chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.getErEmergency = function () {
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

            ChartService.getSeriesData2(`/er/emergency/${month}/month`)
            .then(function(res) {
                var dataSeries = [];

                $scope.pieOptions = ChartService.initPieChart("erEmergencyPieContainer", "สัดส่วนการบริการ ตามประเภทความเร่งด่วน", "", "สัดส่วนตามประเภทความเร่งด่วน");

                res.data.emergency.forEach((value, key) => {
                    Object.keys(value).forEach(name => {
                        $scope.pieOptions.series[0].data.push({name: name, y: parseInt(value[name])});
                    });
                });

                var chart = new Highcharts.Chart($scope.pieOptions);
            }, function(err) {
                console.log(err);
            });
        };
        
        $scope.getOrVisit = function(e) {
            if(e) e.preventDefault();
            
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

            ChartService.getSeriesData('/dashboard/or-visit/', month)
            .then(function(res) {
                let {series, categories} = ChartService.createStackedDataSeries(
                    [
                        { name: 'Minor', prop: 'minor', color: '#8134af' }, 
                        { name: 'Major', prop: 'major', color: '#e41749' },
                        { name: 'อื่นๆ', prop: 'other', color: '#57D1C9' }
                    ],
                    res.data,
                    { name: 'd'},
                    { name: 'm', value: month }
                );

                $scope.barOptions = ChartService.initStackChart("orVisitBarContainer", "ยอดผู้รับบริการ รายวัน", categories, 'จำนวน');
                $scope.barOptions.series = series;

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };
        
        $scope.getOrType = function (e) {
            if(e) e.preventDefault();
            
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

            ChartService.getSeriesData('/dashboard/or-type/', month)
            .then(function(res) {
                $scope.pieOptions = ChartService.initPieChart("orTypePieContainer", "สัดส่วนผู้รับบริการผ่าตัด ตามประเภทการผ่าตัด", "", "สัดส่วนตามประเภทการผ่าตัด");

                res.data.forEach((value, key) => {
                    Object.keys(value).forEach(name => {
                        $scope.pieOptions.series[0].data.push({name: name, y: parseInt(value[name])});
                    });
                });

                var chart = new Highcharts.Chart($scope.pieOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.getErrorOp = function(e) {
            if(e) e.preventDefault();
            
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');
            let displayDate = StringFormatService.convFromDbDate((moment().format('YYYY-MM') == month)
                                ? (moment().format('D') > 1) 
                                    ? moment().add(-1, 'days').format('YYYY-MM-DD')
                                    : moment().startOf('month').format('YYYY-MM-DD')
                                : moment(month).endOf('month').format('YYYY-MM-DD'));

            ChartService.getSeriesData('/dashboard/error-op-month/', month)
            .then(function(res) {
                let {series, categories} = ChartService.createStackedDataSeries(
                    [
                        { name: 'ไม่มี Diag', prop: 'nodx', color: '#6abe83' }, 
                        { name: 'ไม่มีซักประวัติ', prop: 'noscreen', color: '#13334c' },
                        { name: 'ซักประวัติไม่ครบ', prop: 'inc_screen', color: '#de4307' }
                    ],
                    res.data,
                    { name: 'id'},
                    { name: 'o' }
                );

                $scope.barOptions = ChartService.initStackChart("errorOPBarContainer", `สรุปข้อมูล Error ผู้ป่วยนอก (ข้อมูล ณ วันที่ ${displayDate})`, categories, 'จำนวน (Records)');
                $scope.barOptions.series = series;

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };
        
        $scope.getErrorIp = function(e) {
            if(e) e.preventDefault();
            
            let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');
            let displayDate = StringFormatService.convFromDbDate((moment().format('YYYY-MM') == month)
                        ? (moment().format('D') > 1) 
                            ? moment().add(-1, 'days').format('YYYY-MM-DD')
                            : moment().startOf('month').format('YYYY-MM-DD')
                        : moment(month).endOf('month').format('YYYY-MM-DD'));

            ChartService.getSeriesData('/dashboard/error-ip-month/', month)
            .then(function(res) {
                let {series, categories} = ChartService.createStackedDataSeries(
                    [
                        { name: 'ส่งแล้ว', prop: 'send', color: '#1f640a' }, 
                        { name: 'ยังไม่ส่ง', prop: 'notsend', color: '#dd0a35' },
                    ],
                    res.data,
                    { name: 'ward'},
                    { name: 'o' }
                );

                $scope.barOptions = ChartService.initStackChart("errorIPBarContainer", `สรุปการส่งชาร์ตผู้ป่วยใน รายวอร์ด (D/C ถึงวันที่ ${displayDate})`, categories, 'จำนวน (ชาร์ต)');
                $scope.barOptions.series = series;

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.showEpidWeekList = function(e) {
            e.preventDefault();

            $http.get(`${CONFIG.apiUrl}/epid-weeks`)
			.then(res => {
				console.log(res.data);

				$scope.epidWeeks = res.data;

                $('#weekLists').modal('show');
			}, err => {
				console.log(err);
			});
        };
    }
]);
