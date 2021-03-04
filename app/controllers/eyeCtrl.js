
app.controller('eyeController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	function($scope, $http, CONFIG, StringFormatService)
	{
		$scope.sdate = '';
		$scope.edate = '';
		$scope.data = [];

		$scope.getVision2020 = function(e) {
			if(e) e.preventDefault();
			
			let startDate = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');
			let endDate = ($('#edate').val() !== '') 
							? StringFormatService.convToDbDate($scope.edate) 
							: moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/eye/visio2020/${startDate}/${endDate}`)
			.then(res => {
				$scope.data = res.data.vision;

				$scope.data.forEach(async (visit) => {
					let resDc = await $http.get(`${CONFIG.apiUrl}/eye/visio2020/followup/${visit.hn}/${visit.vn}/1`);					
					let dc = (resDc.data.length > 0) ? resDc.data[0] : null;
					
					if (dc) {
						let resFu1 = await $http.get(`${CONFIG.apiUrl}/eye/visio2020/followup/${visit.hn}/${dc.vn}/0`);					
						let fu1 = (resFu1.data.length > 0) ? resFu1.data[0] : null;
						visit.fu1 = fu1;
					}

					if (visit.fu1) {
						let resFu2 = await $http.get(`${CONFIG.apiUrl}/eye/visio2020/followup/${visit.hn}/${visit.fu1.vn}/0`);					
						let fu2 = (resFu2.data.length > 0) ? resFu2.data[0] : null;
						visit.fu2 = fu2;
					}
				})
			}, err => {
				console.log(err);
			});
		};
	}
]);