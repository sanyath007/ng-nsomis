app.service('ChartService', [
    'CONFIG',
    '$http',
    'DatetimeService',
    function(CONFIG, $http, DatetimeService)
    {
        let service = this;

        service.initColumnChart = function(_container, _title, _ytitle) {
            return {
                chart: {
                    renderTo: _container,
                    type: 'column'
                },
                title: {
                    text: _title
                },
                xAxis: {
                    type: 'category',
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: _ytitle
                    }
                },
                legend: {
                    enabled: true,
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
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
        };

        service.getSeriesData2 = function (url) {
            return $http.get(CONFIG.apiUrl + url);
        };

        service.createDailyCategories = function() {
            return new Array(24);
        };

        service.createMonthlyCategories = function(month) {
            if(!month) return new Array(31)
            
            let endDate = DatetimeService.lastDayOfMonth(`${month}-01`);

            return new Array(endDate);
        }
        
        service.createYearlyCategories = function(lang) {
            let months = null;
            
            if(lang === 'en') {
                months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Api', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
            } else {
                months = ['ตค', 'พย', 'ธค', 'มค', 'กพ', 'มีค', 'เมย', 'พค', 'มิย', 'กค', 'สค', 'กย'];
            }

            return months;
        };

        service.createDataSeries = function(data, dataProps, catType) {
            let dataSeries = [];
            let categories = [];
            let catValue = 0;

            if(catType.name == 'd') {
                categories = service.createDailyCategories();
            } else if (catType.name == 'm') {
                categories = service.createMonthlyCategories(catType.value);
            }

            for(let i = 0; i < categories.length; i++) {
                if(catType.name == 'd') {
                    catValue = i;
                } else if (catType.name == 'm') {
                    catValue = i+1;
                }

                categories[i] = `${catValue}`;
                dataSeries.push(0);

                data.every((val, key) => {
                    if(parseInt(val[dataProps.name]) === catValue) {
                        dataSeries[i] = parseInt(val[dataProps.value]);
                        return false;
                    }

                    return true;
                });
            }

            return { dataSeries, categories }
        };

        service.createSeries = function(stacked) {
            let series = [];

            stacked.forEach((val, key) => {
                series.push({
                    name: val.name,
                    prop: val.prop,
                    color: val.color,
                    data: []
                })
            });

            return series;
        };

        service.createStackedDataSeries = function (stacked, data, dataProps, catType) {
            let series = [];
            let categories = [];
            let catValue = '';
            
            series = service.createSeries(stacked);
            
            if(catType.name == 'd') {
                categories = service.createDailyCategories();
            } else if (catType.name == 'm') {
                categories = service.createMonthlyCategories(catType.value);
            } else if (catType.name == 'o') {
                categories = data.map(d => {
                    return d[dataProps.name]+ '-' +d.name;
                });
            }

            for(let i = 0; i < categories.length; i++) {
                if(catType.name == 'd') {
                    catValue = i;
                } else if (catType.name == 'm') {
                    catValue = i+1;
                } else if (catType.name == 'o') {
                    catValue = categories[i].substr(0, 2);
                }

                if (catType.name != 'o') {
                    categories[i] = `${catValue}`;
                }

                data.every((val, key) => {
                    // if (catType.name == 'o') {         
                    //     console.log(val[dataProps.name]+ '==' +catValue);
                    // }

                    if(val[dataProps.name] == catValue) {
                        series.forEach((s, key) => {
                            s.data[i] = parseInt(val[s.prop]);
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
        };
    }
]);