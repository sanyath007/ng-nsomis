
app.controller('dashdayController', [
    '$scope',
    '$http',
    'CONFIG',
    'ChartService',
    'StringFormatService',
    function($scope, $http, CONFIG, ChartService, StringFormatService)
    {
        $scope.cardData = {};
        $scope.barOptions = {};
        $scope.pieOptions = {};

        $scope.cboDate = '';
        $scope.toDay = new Date();

        $scope.getCardDay = function () {
            if(e) e.preventDefault();

            $scope.loading = true;
            let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

            $http.get(`${CONFIG.baseUrl}/dashboard/card-data/${date}`)
            .then(function(res) {
                console.log(res);
                $scope.cardData = res.data[0];

                $scope.loading = false;
            }, function(err) {
                console.log(err);
                $scope.loading = false;
            });
        };

        $scope.getOpVisitDay = function (e) {
            if(e) e.preventDefault();

            let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

            ChartService.getSeriesData('/dashboard/op-visit/', date)
            .then(function(res) {
                let {dataSeries, categories} = ChartService.createDataSeries(
                    res.data,
                    { name: 'hhmm', value: 'num_pt'},
                    { name: 'd', value: '' }
                );

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

        $scope.getOpVisitTypeDay = function (e) {
            if(e) e.preventDefault();
            
            let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

            ChartService.getSeriesData('/dashboard/op-visit-type/', date)
            .then(function(res) {
                $scope.pieOptions = ChartService.initPieChart("opVisitTypePieContainer", "สัดส่วนผู้ป่วยนอก ตามประเภทการมา", "", "สัดส่วนตามประเภทการมา");

                res.data.forEach((value, key) => {
                    $scope.pieOptions.series[0].data.push({name: value.type, y: parseInt(value.num_pt)});
                });

                let chart = new Highcharts.Chart($scope.pieOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.getIpVisitDay = function(e) {
            if(e) e.preventDefault();
            
            let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

            ChartService.getSeriesData('/dashboard/ip-visit/', date)
            .then(function(res) {
                let {dataSeries, categories} = ChartService.createDataSeries(
                    res.data,
                    { name: 'hhmm', value: 'num_pt'},
                    { name: 'd', value: '' }
                );

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

        $scope.getIpClassDay = function (e) {
            if(e) e.preventDefault();
            
            let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

            ChartService.getSeriesData('/dashboard/ip-class/', date)
            .then(function(res) {
                $scope.pieOptions = ChartService.initPieChart("ipClassPieContainer", "สัดส่วนผู้ป่วยใน ตามประเภทผู้ป่วย", "", "สัดส่วนตามประเภทผู้ป่วย");

                res.data.forEach((value, key) => {
                    Object.keys(value).forEach(name => {
                        $scope.pieOptions.series[0].data.push({name: name, y: parseInt(value[name])});
                    });
                });

                let chart = new Highcharts.Chart($scope.pieOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.referInDay = function(e) {
            if(e) e.preventDefault();
            
            let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

            ChartService.getSeriesData('/dashboard/referin/', date)
            .then(function(res) {
                let {dataSeries, categories} = ChartService.createDataSeries(
                    res.data,
                    { name: 'hhmm', value: 'num_pt'},
                    { name: 'd', value: '' }
                );

                $scope.barOptions = ChartService.initBarChart("referInBarContainer", "Refer In", categories, 'จำนวน');
                $scope.barOptions.series.push({
                    name: 'refer in',
                    data: dataSeries,
                    color: '#8134af',
                });

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };
        
        $scope.referOutDay = function(e) {
            if(e) e.preventDefault();
            
            let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

            ChartService.getSeriesData('/dashboard/referout/', date)
            .then(function(res) {
                let {dataSeries, categories} = ChartService.createDataSeries(
                    res.data,
                    { name: 'hhmm', value: 'num_pt'},
                    { name: 'd', value: '' }
                );

                $scope.barOptions = ChartService.initBarChart("referOutBarContainer", "Refer Out", categories, 'จำนวน');
                $scope.barOptions.series.push({
                    name: 'refer out',
                    data: dataSeries,
                    color: '#41b6e6',
                });

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };

        
        $scope.getErVisitData = function() {
            let month = '2020';

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

                let categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
                $scope.barOptions = ChartService.initBarChart("erVisitBarContainer", "ยอดผู้รับบริการรายเดือน ปีงบ " + (parseInt(month) + 543), categories, 'จำนวน');
                $scope.barOptions.series = series;

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.getErEmergencyData = function () {
            let month = '2020';

            ChartService.getSeriesData('/er/emergency/', month)
            .then(function(res) {
                $scope.pieOptions = ChartService.initPieChart("erEmergencyPieContainer", "สัดส่วนการบริการ ตามประเภทความเร่งด่วน", "", "สัดส่วนตามประเภทความเร่งด่วน");

                res.data.emergency.forEach((value, key) => {
                    Object.keys(value).forEach(name => {
                        $scope.pieOptions.series[0].data.push({name: name, y: parseInt(value[name])});
                    });
                });

                let chart = new Highcharts.Chart($scope.pieOptions);
            }, function(err) {
                console.log(err);
            });
        };
        
        $scope.getOrVisitData = function() {
            let month = '2020';

            ChartService.getSeriesData('/or/visit/', month)
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

                let categories = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย']
                $scope.barOptions = ChartService.initBarChart("orVisitBarContainer", "ยอดผู้รับบริการรายเดือน ปีงบ " + (parseInt(month) + 543), categories, 'จำนวน');
                $scope.barOptions.series = series;

                let chart = new Highcharts.Chart($scope.barOptions);
            }, function(err) {
                console.log(err);
            });
        };

        $scope.getOrTypeData = function () {
            let month = '2020';

            ChartService.getSeriesData('/or/or-type/', month)
            .then(function(res) {
                $scope.pieOptions = ChartService.initPieChart("orTypePieContainer", "สัดส่วนผู้รับบริการผ่าตัด ตามประเภทการผ่าตัด", "", "สัดส่วนตามประเภทการผ่าตัด");

                res.data.ortype.forEach((value, key) => {
                    Object.keys(value).forEach(name => {
                        $scope.pieOptions.series[0].data.push({name: name, y: parseInt(value[name])});
                    });
                });

                let chart = new Highcharts.Chart($scope.pieOptions);
            }, function(err) {
                console.log(err);
            });
        };
    }
]);
