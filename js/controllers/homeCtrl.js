
app.controller('homeController', function($scope, $http, CONFIG, ReportService) {
    $scope.cboYear = '';
    $scope.pieOptions = {};
    $scope.barOptions = {};
    $scope.cardData = {};
    $scope.toDay = new Date();

    $scope.getCardData = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();

        $scope.loading = true;

        $http.get(`${CONFIG.baseUrl}/dashboard/card-data`)
        .then(function(res) {
            console.log(res);
            $scope.cardData = res.data[0];

            $scope.loading = false;
        }, function(err) {
            console.log(err);
            $scope.loading = false;
        });
    }

    $scope.getOpVisitMonthData = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);

        ReportService.getSeriesData('op/visit/', year)
        .then(function(res) {
            var visitSeries = [];

            res.data.opvisit.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                visitSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("opVisitBarContainer", "ยอดผู้ป่วยนอกรายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'op visit',
                data: visitSeries,
                color: '#e41749',
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getOpVisitTypeData = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);

        ReportService.getSeriesData('/op/visit-type/', year)
        .then(function(res) {
            var dataSeries = [];

            $scope.pieOptions = ReportService.initPieChart("opVisitTypePieContainer", "สัดส่วนผู้ป่วยนอก ตามประเภทการมา", "", "สัดส่วนตามประเภทการมา");

            res.data.opVisitType.forEach((value, key) => {
                $scope.pieOptions.series[0].data.push({name: value.type, y: parseInt(value.num_pt)});
            });

            var chart = new Highcharts.Chart($scope.pieOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getIpVisitMonthData = function(e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ReportService.getSeriesData('ip/visit/', year)
        .then(function(res) {
            var visitSeries = [];

            res.data.ipvisit.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                visitSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("ipVisitBarContainer", "ยอดผู้ป่วยในรายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'ip visit',
                data: visitSeries,
                color: '#1f640a',
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };
    
    $scope.getIpClassificationData = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ReportService.getSeriesData('/ip/classification/', year)
        .then(function(res) {
            var dataSeries = [];

            $scope.pieOptions = ReportService.initPieChart("ipClassificationPieContainer", "สัดส่วนผู้ป่วยใน ตามประเภทผู้ป่วย", "", "สัดส่วนตามประเภทผู้ป่วย");

            res.data.class.forEach((value, key) => {
                Object.keys(value).forEach(name => {
                    $scope.pieOptions.series[0].data.push({name: name, y: parseInt(value[name])});
                });
            });

            var chart = new Highcharts.Chart($scope.pieOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.referInBarContainer = function(e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ReportService.getSeriesData('op/referin/', year)
        .then(function(res) {
            var referinSeries = [];

            res.data.referin.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                referinSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("referInBarContainer", "Refer In รายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'referin',
                data: referinSeries,
                color: '#8134af',
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    }
    
    $scope.referOutBarContainer = function(e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ReportService.getSeriesData('op/referout/', year)
        .then(function(res) {
            var referoutSeries = [];

            res.data.referout.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                referoutSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("referOutBarContainer", "Refer Out รายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'referout',
                data: referoutSeries,
                color: '#41b6e6',
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    }

    $scope.getSumYearData = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ReportService.getSeriesData('/dashboard/sum-year-chart/', year)
        .then(function(res) {
            console.log(res);
            var debtSeries = [];
            var paidSeries = [];
            var setzeroSeries = [];
            var categories = [];

            angular.forEach(res.data, function(value, key) {
                let debt = (value.debt) ? parseFloat(value.debt.toFixed(2)) : 0;
                let paid = (value.paid) ? parseFloat(value.paid.toFixed(2)) : 0;
                let setzero = (value.setzero) ? parseFloat(value.setzero.toFixed(2)) : 0;

                categories.push(parseInt(value.yyyy) + 543);
                debtSeries.push(debt);
                paidSeries.push(paid);
                setzeroSeries.push(setzero);
            });

            $scope.barOptions = ReportService.initBarChart("barContainer2", "รายงานยอดหนี้สามปีย้อนหลัง", categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'หนี้คงเหลือ',
                data: debtSeries
            }, {
                name: 'ชำระแล้ว',
                data: paidSeries
            }, {
                name: 'ลดหนี้ศูนย์',
                data: setzeroSeries
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getPeriodData = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);

        ReportService.getSeriesData('/report/period-chart/', year)
        .then(function(res) {
            console.log(res);
            
            var categories = [];
            var nSeries = [];
            var mSeries = [];
            var aSeries = [];
            var eSeries = [];

            angular.forEach(res.data, function(value, key) {
                categories.push(value.d);
                nSeries.push(value.n);
                mSeries.push(value.m);
                aSeries.push(value.a);
                eSeries.push(value.e);
            });

            $scope.barOptions = ReportService.initStackChart("barContainer", "รายงานการให้บริการ ตามช่วงเวลา", categories, 'จำนวนการให้บริการ');
            $scope.barOptions.series.push({
                name: '00.00-08.00น.',
                data: nSeries
            }, {
                name: '08.00-12.00น.',
                data: mSeries
            }, {
                name: '12.00-16.00น.',
                data: aSeries
            }, {
                name: '16.00-00.00น.',
                data: eSeries
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getErVisitData = function(e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ReportService.getSeriesData('er/visit/', year)
        .then(function(res) {
            let emergencyData = [];
            let ugencyData = [];
            let semiData = [];
            let nonData = [];
            let resusData = [];

            res.data.visit.forEach((value, key) => {
                let emergency = value.emergency ? parseInt(value.emergency) : 0;
                let ugency = value.ugency ? parseInt(value.ugency) : 0;
                let semi = value.semi ? parseInt(value.semi) : 0;
                let non = value.non ? parseInt(value.non) : 0;
                let resuscitation = value.resuscitation ? parseInt(value.resuscitation) : 0;

                emergencyData.push(emergency);
                ugencyData.push(ugency);
                semiData.push(semi);
                nonData.push(non);
                resusData.push(resuscitation);

            });

            let series = [{
                name: 'Emergency',
                data: emergencyData,
                color: '#e41749',
            }, {
                name: 'Ugency',
                data: ugencyData,
                color: '#f29c2b',
            }, {
                name: 'Semi-ugency',
                data: semiData,
                color: '#57D1C9',
            }, {
                name: 'Non-ugency',
                data: nonData,
                color: '#8bc24c',
            }, {
                name: 'Resuscitation',
                data: resusData,
                color: '#200A3E',
            }];

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("erVisitBarContainer", "ยอดผู้รับบริการรายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series = series;

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getErEmergencyData = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ReportService.getSeriesData('/er/emergency/', year)
        .then(function(res) {
            var dataSeries = [];

            $scope.pieOptions = ReportService.initPieChart("erEmergencyPieContainer", "สัดส่วนการบริการ ตามประเภทความเร่งด่วน", "", "สัดส่วนตามประเภทความเร่งด่วน");

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
    
    $scope.getOrVisitData = function(e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ReportService.getSeriesData('or/visit/', year)
        .then(function(res) {
            let smallData = [];
            let largeData = [];
            let otherData = [];

            res.data.visit.forEach((value, key) => {
                let small = value.small ? parseInt(value.small) : 0;
                let large = value.large ? parseInt(value.large) : 0;
                let other = value.other ? parseInt(value.other) : 0;

                smallData.push(small);
                largeData.push(large);
                otherData.push(other);
            });

            let series = [{
                name: 'ผ่าตัดเล็ก',
                data: smallData,
                color: '#e41749',
            }, {
                name: 'ผ่าตัดใหญ่',
                data: largeData,
                color: '#f29c2b',
            }, {
                name: 'อื่นๆ',
                data: otherData,
                color: '#57D1C9',
            }];

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("orVisitBarContainer", "ยอดผู้รับบริการรายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series = series;

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getOrTypeData = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ReportService.getSeriesData('/or/or-type/', year)
        .then(function(res) {
            var dataSeries = [];

            $scope.pieOptions = ReportService.initPieChart("orTypePieContainer", "สัดส่วนผู้รับบริการผ่าตัด ตามประเภทการผ่าตัด", "", "สัดส่วนตามประเภทการผ่าตัด");

            res.data.ortype.forEach((value, key) => {
                Object.keys(value).forEach(name => {
                    $scope.pieOptions.series[0].data.push({name: name, y: parseInt(value[name])});
                });
            });

            var chart = new Highcharts.Chart($scope.pieOptions);
        }, function(err) {
            console.log(err);
        });
    };
});
