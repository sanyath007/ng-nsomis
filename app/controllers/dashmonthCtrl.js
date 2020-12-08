
app.controller('dashmonthController', function($scope, $http, CONFIG, ChartService, StringFormatService) {
    $scope.cardData = {};
    $scope.barOptions = {};
    $scope.pieOptions = {};
    $scope.cboMonth = '';
    
    const createDataSeriesDoM = function(data, month) {
        let dataSeries = [];
        let endDate = lastDayOfMonth(`${month}-01`);
        let categories = new Array(endDate);

        for(let i = 0; i < categories.length; i++) {
            categories[i] = `${i+1}`;
            dataSeries.push(0);

            data.every((val, key) => {
                if(parseInt(val.d) === i+1) {
                    dataSeries[i] = parseInt(val.num_pt);
                    return false;
                }

                return true;
            });
        }

        return { dataSeries, categories }
    }
    
    const lastDayOfMonth = function(date) {
        if(!date) return 31;

        return parseInt(moment(date).endOf('month').format('DD'));
    }

    const fotmatYearMonth = function(my) {
        if(!my) return moment().format('YYYY-MM');

        let [month, year] = my.split('/');

        return `${year-543}-${month}`;
    };

    $scope.getCardDay = function () {
        if(e) e.preventDefault();

        $scope.loading = true;
        let month = ($scope.cboMonth !== '') 
                    ? $scope.cboMonth
                    : moment().format('MM');

        $http.get(`${CONFIG.baseUrl}/dashboard/card-data/${month}`)
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

        let month = ($scope.cboMonth !== '') 
                    ? fotmatYearMonth($scope.cboMonth)
                    : moment().format('YYYY-MM');

        ChartService.getSeriesData('dashboard/op-visit-month/', month)
        .then(function(res) {
            let {dataSeries, categories} = createDataSeriesDoM(res.data, month);

            $scope.barOptions = ChartService.initBarChart("opVisitBarContainer", "ยอดผู้ป่วยนอก", categories, 'จำนวน');
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
                    ? fotmatYearMonth($scope.cboMonth)
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
                    ? fotmatYearMonth($scope.cboMonth)
                    : moment().format('YYYY-MM');

        ChartService.getSeriesData('/dashboard/ip-visit-month/', month)
        .then(function(res) {
            console.log(res);
            let {dataSeries, categories} = createDataSeriesDoM(res.data, month);

            $scope.barOptions = ChartService.initBarChart("ipVisitBarContainer", "ยอดผู้ป่วยใน", categories, 'จำนวน');
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
                    ? fotmatYearMonth($scope.cboMonth)
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

    $scope.referIn = function(e) {
        if(e) e.preventDefault();
        
        let month = ($scope.cboMonth !== '') 
                    ? $scope.cboMonth
                    : moment().format('MM');

        ChartService.getSeriesData('dashboard/referin/', month)
        .then(function(res) {
            let {dataSeries, categories} = createDataSeriesDoM(res.data);

            $scope.barOptions = ChartService.initBarChart("referInBarContainer", "Refer In", categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'refer in',
                data: dataSeries,
                color: '#8134af',
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    }
    
    $scope.referOut = function(e) {
        if(e) e.preventDefault();
        
        let month = ($scope.cboMonth !== '') 
                    ? $scope.cboMonth
                    : moment().format('MM');

        ChartService.getSeriesData('dashboard/referout/', month)
        .then(function(res) {
            let {dataSeries, categories} = createDataSeriesDoM(res.data);

            $scope.barOptions = ChartService.initBarChart("referOutBarContainer", "Refer Out", categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'refer out',
                data: dataSeries,
                color: '#41b6e6',
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    }

    
    $scope.getErVisitData = function() {
        var month = '2020';

        ChartService.getSeriesData('er/visit/', month)
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
            $scope.barOptions = ChartService.initBarChart("erVisitBarContainer", "ยอดผู้รับบริการรายเดือน ปีงบ " + (parseInt(month) + 543), categories, 'จำนวน');
            $scope.barOptions.series = series;

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getErEmergencyData = function () {
        var month = '2020';
        // var selectMonth = document.getElementById('selectMonth').value;
        // var month = (selectMonth == '') ? moment().format('YYYY-MM') : selectMonth;
        // console.log(month);

        ChartService.getSeriesData('/er/emergency/', month)
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
    
    $scope.getOrVisitData = function() {
        var month = '2020';

        ChartService.getSeriesData('or/visit/', month)
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
            $scope.barOptions = ChartService.initBarChart("orVisitBarContainer", "ยอดผู้รับบริการรายเดือน ปีงบ " + (parseInt(month) + 543), categories, 'จำนวน');
            $scope.barOptions.series = series;

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getOrTypeData = function () {
        var month = '2020';
        // var selectMonth = document.getElementById('selectMonth').value;
        // var month = (selectMonth == '') ? moment().format('YYYY-MM') : selectMonth;
        // console.log(month);

        ChartService.getSeriesData('/or/or-type/', month)
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

    $scope.getPeriodData = function () {
        var selectMonth = document.getElementById('selectMonth').value;
        var month = (selectMonth == '') ? moment().format('YYYY-MM') : selectMonth;
        console.log(month);

        ChartService.getSeriesData('/report/period-chart/', month)
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

            $scope.barOptions = ChartService.initStackChart("barContainer", "รายงานการให้บริการ ตามช่วงเวลา", categories, 'จำนวนการให้บริการ');
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

    $scope.getReferData = function () {
        var selectMonth = document.getElementById('selectMonth').value;
        var month = (selectMonth == '') ? moment().format('YYYY-MM') : selectMonth;
        console.log(month);

        ChartService.getSeriesData('/report/refer-chart/', month)
        .then(function(res) {
            console.log(res);
            var nSeries = [];
            var mSeries = [];
            var aSeries = [];
            var eSeries = [];
            var categories = [];

            angular.forEach(res.data, function(value, key) {
                categories.push(value.d)
                nSeries.push(value.n);
                mSeries.push(value.m);
                aSeries.push(value.a);
            });

            $scope.barOptions = ChartService.initStackChart("barContainer", "รายงานการให้บริการให้บริการรับ-ส่งต่อผู้ป่วย", categories, 'จำนวน Refer');
            $scope.barOptions.series.push({
                name: 'เวรดึก',
                data: nSeries
            }, {
                name: 'เวรเช้า',
                data: mSeries
            }, {
                name: 'เวรบ่าย',
                data: aSeries
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };
});
