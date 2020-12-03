
app.controller('homeController', function($scope, $http, CONFIG, ReportService) {
    $scope.pieOptions = {};
    $scope.barOptions = {};
    $scope.cardData = {};

    $scope.getCardData = function () {
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

    $scope.getOpVisitMonthData = function () {
        var month = '2020';

        ReportService.getSeriesData('op/visit/', month)
        .then(function(res) {
            var visitSeries = [];

            res.data.opvisit.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                visitSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("opVisitBarContainer", "ยอดผู้ป่วยนอกรายเดือน ปีงบ " + (parseInt(month) + 543), categories, 'จำนวน');
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

    $scope.getOpVisitTypeData = function () {
        var month = '2020';
        // var selectMonth = document.getElementById('selectMonth').value;
        // var month = (selectMonth == '') ? moment().format('YYYY-MM') : selectMonth;
        // console.log(month);

        ReportService.getSeriesData('/op/visit-type/', month)
        .then(function(res) {
            var dataSeries = [];

            $scope.pieOptions = ReportService.initPieChart("opVisitTypePieContainer", "สัดส่วนผู้ป่วยนอก ตามประเภทการมา");

            res.data.opVisitType.forEach((value, key) => {
                $scope.pieOptions.series[0].data.push({name: value.type, y: parseInt(value.num_pt)});
            });

            var chart = new Highcharts.Chart($scope.pieOptions);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.getIpVisitMonthData = function() {
        var month = '2020';

        ReportService.getSeriesData('ip/visit/', month)
        .then(function(res) {
            var visitSeries = [];

            res.data.ipvisit.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                visitSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("ipVisitBarContainer", "ยอดผู้ป่วยในรายเดือน ปีงบ " + (parseInt(month) + 543), categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'ip visit',
                data: visitSeries,
                color: '#1f640a',
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    }

    $scope.referInBarContainer = function() {
        var month = '2020';

        ReportService.getSeriesData('op/referin/', month)
        .then(function(res) {
            var referinSeries = [];

            res.data.referin.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                referinSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("referInBarContainer", "Refer In รายเดือน ปีงบ " + (parseInt(month) + 543), categories, 'จำนวน');
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
    
    $scope.referOutBarContainer = function() {
        var month = '2020';

        ReportService.getSeriesData('op/referout/', month)
        .then(function(res) {
            var referoutSeries = [];

            res.data.referout.forEach((value, key) => {
                let visit = value.num_pt ? parseInt(value.num_pt) : 0;

                referoutSeries.push(visit);
            });

            var categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
            $scope.barOptions = ReportService.initBarChart("referOutBarContainer", "Refer Out รายเดือน ปีงบ " + (parseInt(month) + 543), categories, 'จำนวน');
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

    $scope.getSumYearData = function () {       
        var month = '2020';

        ReportService.getSeriesData('/dashboard/sum-year-chart/', month)
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

    $scope.getPeriodData = function () {
        var selectMonth = document.getElementById('selectMonth').value;
        var month = (selectMonth == '') ? moment().format('YYYY-MM') : selectMonth;
        console.log(month);

        ReportService.getSeriesData('/report/period-chart/', month)
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

    $scope.getErEmergencyData = function () {
        var month = '2020';
        // var selectMonth = document.getElementById('selectMonth').value;
        // var month = (selectMonth == '') ? moment().format('YYYY-MM') : selectMonth;
        // console.log(month);

        ReportService.getSeriesData('/er/emergency/', month)
        .then(function(res) {
            console.log(res);
            var dataSeries = [];

            $scope.pieOptions = ReportService.initPieChart("erEmergencyPieContainer", "ยอดการบริการ ตามประเภทความเร่งด่วน");

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

    $scope.getReferData = function () {
        var selectMonth = document.getElementById('selectMonth').value;
        var month = (selectMonth == '') ? moment().format('YYYY-MM') : selectMonth;
        console.log(month);

        ReportService.getSeriesData('/report/refer-chart/', month)
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

            $scope.barOptions = ReportService.initStackChart("barContainer", "รายงานการให้บริการให้บริการรับ-ส่งต่อผู้ป่วย", categories, 'จำนวน Refer');
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

    $scope.getFuelDayData = function () {
        var selectMonth = document.getElementById('selectMonth').value;
        var month = (selectMonth == '') ? moment().format('YYYY-MM') : selectMonth;
        console.log(month);

        ReportService.getSeriesData('/report/fuel-day-chart/', month)
        .then(function(res) {
            console.log(res);
            var nSeries = [];
            var mSeries = [];
            var categories = [];

            angular.forEach(res.data, function(value, key) {
                categories.push(value.bill_date)
                nSeries.push(value.qty);
                mSeries.push(value.net);
            });

            $scope.barOptions = ReportService.initBarChart("barContainer", "รายงานการใช้น้ำมันรวม รายวัน", categories, 'จำนวน');
            $scope.barOptions.series.push({
                name: 'ปริมาณ(ลิตร)',
                data: nSeries
            }, {
                name: 'มูลค่า(บาท)',
                data: mSeries
            });

            var chart = new Highcharts.Chart($scope.barOptions);
        }, function(err) {
            console.log(err);
        });
    };
});
