
app.controller('ipController', function($scope, $http, CONFIG) 
{
	$scope.data = [];

	$scope.getAdmdateData = function(e) {
		if(e) e.preventDefault();

		$http.get(`${CONFIG.apiUrl}/ip/admdate`)
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