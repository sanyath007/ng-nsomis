app.service('ChartService', [
    'CONFIG',
    '$http',
    'DatetimeService',
    function(CONFIG, $http, DatetimeService)
    {
        let service = this;

        service.initColumnChart = function(_container, _title, _ytitle, _format) {
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
                            format: _format
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

        service.initAreaChart = function(_container, _title, _categories, _labelUnit) {
            return {
                chart: {
                    renderTo: _container,
                    type: 'area'
                },
                accessibility: {
                    description: 'Image description: An area chart compares the nuclear stockpiles of the USA and the USSR/Russia between 1945 and 2017. The number of nuclear weapons is plotted on the Y-axis and the years on the X-axis. The chart is interactive, and the year-on-year stockpile levels can be traced for each country. The US has a stockpile of 6 nuclear weapons at the dawn of the nuclear age in 1945. This number has gradually increased to 369 by 1950 when the USSR enters the arms race with 6 weapons. At this point, the US starts to rapidly build its stockpile culminating in 32,040 warheads by 1966 compared to the USSR’s 7,089. From this peak in 1966, the US stockpile gradually decreases as the USSR’s stockpile expands. By 1978 the USSR has closed the nuclear gap at 25,393. The USSR stockpile continues to grow until it reaches a peak of 45,000 in 1986 compared to the US arsenal of 24,401. From 1986, the nuclear stockpiles of both countries start to fall. By 2000, the numbers have fallen to 10,577 and 21,000 for the US and Russia, respectively. The decreases continue until 2017 at which point the US holds 4,018 weapons compared to Russia’s 4,500.'
                },
                title: {
                    text: _title
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: _categories,
                    allowDecimals: false,
                    labels: {
                        formatter: function () {
                            return this.value; // clean, unformatted number for year
                        }
                    },
                    accessibility: {
                        rangeDescription: 'Range: 1940 to 2017.'
                    }
                },
                yAxis: {
                    title: {
                        text: 'จำนวน Admit (ราย)'
                    },
                },
                tooltip: {
                    pointFormat: 'ยอด Admit <b>{point.y:,.0f}</b>'
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: []
            }
        };

        service.initLineChart = function(_container, _title, _categories, _labelUnit) {
            return {
                chart: {
                    renderTo: _container
                },
                title: {
                    text: _title
                },
            
                subtitle: {
                    text: ''
                },
            
                yAxis: {
                    title: {
                        text: ''
                    }
                },
            
                xAxis: {
                    categories: _categories,
                    accessibility: {
                        rangeDescription: 'Range: 2010 to 2017'
                    }
                },
            
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
            
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        dataLabels: {
                            enabled: true
                        }
                    }
                },

                series: [],

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            }
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

        service.createArbitraryDataSeries = function(data, dataProps) {
            let dataSeries = [];
            let categories = [];

            /** Create categories */
            categories = data.map(d => {
                return d[dataProps.name];
            });

            for(let i = 0; i < categories.length; i++) {
                console.log(categories[i]);
                data.every(val => {
                    if(val[dataProps.name] === categories[i]) {
                        dataSeries[i] = parseInt(val[dataProps.value]);
                        return false;
                    }

                    return true;
                });
            }

            return { dataSeries, categories }
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