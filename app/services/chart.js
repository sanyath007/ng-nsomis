app.service('ChartService', [
    'CONFIG',
    '$http',
    'DatetimeService',
    function(CONFIG, $http, DatetimeService)
    {
        let service = this;

        service.initBarChart = function(_container, _title, _categories, _ytitle) {
            return {
                chart: {
                    renderTo: _container,
                    type: 'column'
                },
                title: {
                    text: _title
                },
                xAxis: {
                    categories: _categories
                },
                yAxis: {
                    title: {
                        enabled: true,
                        text: _ytitle
                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: []
            };
        };

        service.initStackChart = function(_container, _title, _categories, _ytitle) {
            return {
                chart: {
                    renderTo: _container,
                    type: 'column'
                },
                title: {
                    text: _title
                },
                xAxis: {
                    categories: _categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: _ytitle
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                series: []
            };
        };

        service.initBarChart = function(_container, _title, _categories) {
            return {
                chart: {
                    renderTo: _container,
                    type: 'column'
                },
                title: {
                    text: _title
                },
                xAxis: {
                    categories: _categories
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: []
            };
        };

        service.initPieChart = function(_container, _title, _labelUnit, _seriesName) {
            return {
                chart: {
                    renderTo: _container,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: _title
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>จน.: {point.y}',
                    percentageDecimals: 1
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} % ({point.y} ' +_labelUnit+ ')',
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: _seriesName,
                    data: []
                }]
            };
        };

        service.getSeriesData = function (url, data) {
            return $http.get(CONFIG.apiUrl + url + data);
        }
        
        service.createDataSeriesDoM = function (data, month) {
            let dataSeries = [];
            let endDate = DatetimeService.lastDayOfMonth(`${month}-01`);
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

        service.createStackedDataSeriesDoM = function (data, stacked, month) {
            let endDate = DatetimeService.lastDayOfMonth(`${month}-01`);
            let categories = new Array(endDate);
            let series = [];

            stacked.forEach((val, key) => {
                series.push({
                    name: val,
                    data: [],
                })
            });

            for(let i = 0; i < categories.length; i++) {
                categories[i] = `${i+1}`;

                data.every((val, key) => {
                    if(parseInt(val.d) === i+1) {
                        series.forEach((s, key) => {
                            s.data[i] = parseInt(val[s.name]);
                        });

                        return false;
                    } else {
                        series.forEach((s, key) => {
                            s.data[i] = 0;
                        });
                    }

                    return true;
                });
            }

            return { series, categories }
        }
    }
]);