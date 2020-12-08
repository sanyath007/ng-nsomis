app.service('ChartService', ['CONFIG', '$http', function(CONFIG, $http) {
	this.initBarChart = function(_container, _title, _categories, _ytitle) {
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

    this.initStackChart = function(_container, _title, _categories, _ytitle) {
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

    this.initBarChart = function(_container, _title, _categories) {
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

    this.initPieChart = function(_container, _title, _labelUnit, _seriesName) {
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

	this.getSeriesData = function (url, data) {
		return $http.get(CONFIG.apiUrl + url + data);
	}
}]);