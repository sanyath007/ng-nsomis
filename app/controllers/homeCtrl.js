
app.controller('homeController', ['$scope', '$http', 'CONFIG', 'ChartService', function($scope, $http, CONFIG, ChartService) {
    $scope.cboYear = '';
    $scope.pieOptions = {};
    $scope.barOptions = {};
    $scope.toDay = new Date();
    $scope.cardData = [
        {
            id: 1,
            name: "ผู้ป่วยใหม่",
            value: 150,
            unit: 'คน',
            bg: 'bg-info',
            icon: 'ion-bag',
            lnk: ''
        },
        {
            id: 2,
            name: "ประชากร",
            value: '150,000',
            unit: 'คน',
            bg: 'bg-success',
            icon: 'ion-stats-bars',
            lnk: ''
        },
        {
            id: 3,
            name: "บุคลากร",
            value: 650,
            unit: 'คน',
            bg: 'bg-warning',
            icon: 'ion-person-add',
            lnk: ''
        },
        {
            id: 4,
            name: "แพทย์",
            value: 35,
            unit: 'คน',
            bg: 'bg-danger',
            icon: 'ion-graph',
            lnk: ''
        },
    ];

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

    $scope.getOpVisit = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);

        ChartService.getSeriesData('/op/visit/', year)
        .then(function(res) {
            var visitSeries = [];

            res.data.opvisit.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                visitSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ChartService.initBarChart("opVisitBarContainer", "ยอดผู้ป่วยนอกรายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
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

    $scope.getOpVisitType = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);

        ChartService.getSeriesData('/op/visit-type/', year)
        .then(function(res) {
            var dataSeries = [];

            $scope.pieOptions = ChartService.initPieChart("opVisitTypePieContainer", "สัดส่วนผู้ป่วยนอก ตามประเภทการมา", "", "สัดส่วนตามประเภทการมา");

            res.data.opVisitType.forEach((value, key) => {
                $scope.pieOptions.series[0].data.push({name: value.type, y: parseInt(value.num_pt)});
            });

            var chart = new Highcharts.Chart($scope.pieOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getIpVisit = function(e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ChartService.getSeriesData('/dashboard/ip-visit-year/', year)
        .then(function(res) {
            var visitSeries = [];

            res.data.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                visitSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ChartService.initBarChart("ipVisitBarContainer", "ยอดผู้ป่วยในรายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
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
    
    $scope.getIpClass = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ChartService.getSeriesData('/dashboard/ip-class-year/', year)
        .then(function(res) {
            var dataSeries = [];

            $scope.pieOptions = ChartService.initPieChart("ipClassificationPieContainer", "สัดส่วนผู้ป่วยใน ตามประเภทผู้ป่วย", "", "สัดส่วนตามประเภทผู้ป่วย");

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

    // $scope.getReferIn = function(e) {
    //     if(e) e.preventDefault();
        
    //     let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
    //     console.log(year);
        
    //     ChartService.getSeriesData('/op/referin/', year)
    //     .then(function(res) {
    //         var referinSeries = [];

    //         res.data.referin.forEach((value, key) => {
    //             let visit = value.num_pt ? parseInt(value.num_pt) : 0;

    //             referinSeries.push(visit);
    //         });

    //         var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
    //         $scope.barOptions = ChartService.initBarChart("referInBarContainer", "Refer In รายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
    //         $scope.barOptions.series.push({
    //             name: 'referin',
    //             data: referinSeries,
    //             color: '#8134af',
    //         });

    //         var chart = new Highcharts.Chart($scope.barOptions);
    //     }, function(err) {
    //         console.log(err);
    //     });
    // };
    
    // $scope.getReferOut = function(e) {
    //     if(e) e.preventDefault();
        
    //     let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
    //     console.log(year);
        
    //     ChartService.getSeriesData('/op/referout/', year)
    //     .then(function(res) {
    //         var referoutSeries = [];

    //         res.data.referout.forEach((value, key) => {
    //             let visit = value.num_pt ? parseInt(value.num_pt) : 0;

    //             referoutSeries.push(visit);
    //         });

    //         var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
    //         $scope.barOptions = ChartService.initBarChart("referOutBarContainer", "Refer Out รายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
    //         $scope.barOptions.series.push({
    //             name: 'referout',
    //             data: referoutSeries,
    //             color: '#41b6e6',
    //         });

    //         var chart = new Highcharts.Chart($scope.barOptions);
    //     }, function(err) {
    //         console.log(err);
    //     });
    // };

    $scope.getErVisit = function(e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ChartService.getSeriesData('/er/visit/', year)
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
            $scope.barOptions = ChartService.initBarChart("erVisitBarContainer", "ยอดผู้รับบริการรายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series = series;

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getErEmergency = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ChartService.getSeriesData('/er/emergency/', year)
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
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ChartService.getSeriesData('/or/visit/', year)
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

            let categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย'];
            $scope.barOptions = ChartService.initBarChart("orVisitBarContainer", "ยอดผู้รับบริการรายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series = series;

            let chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getOrType = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ChartService.getSeriesData('/or/or-type/', year)
        .then(function(res) {
            var dataSeries = [];

            $scope.pieOptions = ChartService.initPieChart("orTypePieContainer", "สัดส่วนผู้รับบริการผ่าตัด ตามประเภทการผ่าตัด", "", "สัดส่วนตามประเภทการผ่าตัด");

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
    
    $scope.getSumYearData = function (e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ChartService.getSeriesData('/dashboard/sum-year-chart/', year)
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

            $scope.barOptions = ChartService.initBarChart("barContainer2", "รายงานยอดหนี้สามปีย้อนหลัง", categories, 'จำนวน');
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

    $scope.getReferIn = function(e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ChartService.getSeriesData('/refer/referin-year/', year)
        .then(function(res) {            
            // let categories = [];
            let erData = [];
            let opData = [];
            let ipData = [];
            let alData = [];

            res.data.referin.forEach((value, key) => {
                let er = value.ER ? parseInt(value.ER) : 0;
                let op = value.OPD ? parseInt(value.OPD) : 0;
                let ip = value.IPD ? parseInt(value.IPD) : 0;
                // let al = value.ALL ? parseInt(value.ALL) : 0;

                // categories.push(value.yearmonth);
                erData.push(er);
                opData.push(op);
                ipData.push(ip);
                // alData.push(al);
            });

            let categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย'];
            $scope.barOptions = ChartService.initStackChart("referInBarContainer", "Refer In รายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'ER',
                data: erData
            }, {
                name: 'OPD',
                data: opData
            }, {
                name: 'IPD',
                data: ipData
            });

            let chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getReferOut = function(e) {
        if(e) e.preventDefault();
        
        let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();
        console.log(year);
        
        ChartService.getSeriesData('/refer/referout-year/', year)
        .then(function(res) {
            // let categories = [];
            let erData = [];
            let opData = [];
            let ipData = [];
            let alData = [];

            res.data.referout.forEach((value, key) => {
                let er = value.ER ? parseInt(value.ER) : 0;
                let op = value.OPD ? parseInt(value.OPD) : 0;
                let ip = value.IPD ? parseInt(value.IPD) : 0;
                // let al = value.ALL ? parseInt(value.ALL) : 0;

                // categories.push(value.yearmonth);
                erData.push(er);
                opData.push(op);
                ipData.push(ip);
                // alData.push(al);
            });

            let categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย'];
            $scope.barOptions = ChartService.initStackChart("referOutBarContainer", "Refer Out รายเดือน ปีงบ " + (year + 543), categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'ER',
                data: erData
            }, {
                name: 'OPD',
                data: opData
            }, {
                name: 'IPD',
                data: ipData
            });

            let chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };
}]);
