
app.controller('ipController', function($scope, $http, CONFIG, StringFormatService) 
{
	$scope.sdate = '';
	$scope.edate = '';
	$scope.data = [];
	$scope.toDay = new Date();

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
});