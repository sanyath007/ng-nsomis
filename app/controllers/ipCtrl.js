
app.controller('ipController', ['$scope', '$http', 'CONFIG', 'StringFormatService', function($scope, $http, CONFIG, StringFormatService) 
{
	$scope.sdate = '';
	$scope.edate = '';
	$scope.data = [];
	$scope.totalClass = {};
	$scope.toDay = new Date();

	const initTotalClass = function() {
		return {
			type1: 0,
			type2: 0,
			type3: 0,
			type4: 0,
			type5: 0,
			unknown: 0,
			all: 0,
		};
	}

	$scope.getAdmdateData = function(e) {
		if(e) e.preventDefault();

		let startDate = ($('#sdate').val() !== '') 
						? StringFormatService.convToDbDate($scope.sdate) 
						: moment().format('YYYY-MM-DD');
		let endDate = ($('#edate').val() !== '') 
						? StringFormatService.convToDbDate($scope.edate) 
						: moment().format('YYYY-MM-DD');

		$http.get(`${CONFIG.apiUrl}/ip/admdate/${startDate}/${endDate}`)
		.then(res => {
			console.log(res)
			let admdate = res.data.admdate
			let wardStat = res.data.wardStat

			admdate.forEach(d => d.stat = wardStat.filter(st => d.ward === st.ward));
			
			$scope.data = sumAdmdate(admdate);
		}, err => {
			console.log(err)
		});
	}

	const sumAdmdate = function(data) {
		data.forEach(d => {
			d.sumAdm = d.stat.reduce((sum, st) => {
				return sum + parseInt(st.admdate);
			}, 0);

			d.sumHr = d.stat.reduce((sum, st) => {
				return sum + parseInt(st.admit_hour);
			}, 0);
			
			d.sumPt = d.stat.length;
		});
		
		return data;
	}

	$scope.getIpClassData = function(e) {
		if(e) e.preventDefault();

		$scope.totalClass = initTotalClass();

		let startDate = ($('#sdate').val() !== '') 
						? StringFormatService.convToDbDate($scope.sdate) 
						: moment().format('YYYY-MM-DD');
		let endDate = ($('#edate').val() !== '') 
						? StringFormatService.convToDbDate($scope.edate) 
						: moment().format('YYYY-MM-DD');

		$http.get(`${CONFIG.apiUrl}/ip/class/${startDate}/${endDate}`)
		.then(res => {
			console.log(res)
			$scope.data = res.data.classes;

			$scope.data.forEach((val, key) => {
				$scope.totalClass.type1 += parseInt(val.type1);
				$scope.totalClass.type2 += parseInt(val.type2);
				$scope.totalClass.type3 += parseInt(val.type3);
				$scope.totalClass.type4 += parseInt(val.type4);
				$scope.totalClass.type5 += parseInt(val.type5);
				$scope.totalClass.unknown += parseInt(val.unknown);
				$scope.totalClass.all += parseInt(val.all);
			});
		}, err => {
			console.log(err)
		});
	};

	$scope.getPtDchByWard = function(e) {

	};
}]);