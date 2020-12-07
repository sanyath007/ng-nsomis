
app.controller('orController', function($scope, $http, CONFIG, StringFormatService) {
	$scope.sdate = '';
	$scope.edate = '';
	$scope.data = [];
	$scope.totalData = {};
	$scope.toDay = new Date();

	const initTotalData = function() {
		return {
			num: 0,
			small: 0,
			large: 0,
			other: 0,
			eye: 0,
			orth: 0,
			cs: 0,
			gen: 0,
			morning: 0,
			afternoon: 0,
			evening: 0,
			night: 0,
		};
	}

	$scope.getNumDayData = function(e) {
		if(e) e.preventDefault();

		$scope.totalData = initTotalData();

		let startDate = ($('#sdate').val() !== '') 
						? StringFormatService.convToDbDate($scope.sdate) 
						: moment().format('YYYY-MM-DD');
		let endDate = ($('#edate').val() !== '') 
						? StringFormatService.convToDbDate($scope.edate) 
						: moment().format('YYYY-MM-DD');

		$http.get(`${CONFIG.apiUrl}/or/num-day/${startDate}/${endDate}`)
		.then(res => {
			console.log(res)
			$scope.data = res.data.numdays;

			$scope.data.forEach((val, key) => {
				$scope.totalData.num += parseInt(val.num);
				$scope.totalData.small += parseInt(val.small);
				$scope.totalData.large += parseInt(val.large);
				$scope.totalData.other += parseInt(val.other);
				$scope.totalData.eye += parseInt(val.eye);
				$scope.totalData.orth += parseInt(val.orth);
				$scope.totalData.cs += parseInt(val.cs);
				$scope.totalData.gen += parseInt(val.gen);
				$scope.totalData.morning += parseInt(val.morning);
				$scope.totalData.afternoon += parseInt(val.afternoon);
				$scope.totalData.evening += parseInt(val.evening);
				$scope.totalData.night += parseInt(val.night);
			});
		}, err => {
			console.log(err)
		});
	};
});