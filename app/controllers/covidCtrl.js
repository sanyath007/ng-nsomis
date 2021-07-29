
app.controller('covidController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	function($scope, $http, CONFIG, StringFormatService)
	{
		$scope.cboDate = '';
		$scope.data = [];

		$scope.getNumTambon = function(e) {
			if(e) e.preventDefault();
			
			$scope.loading = true;
            let date = ($scope.cboDate !== '') 
                        ? StringFormatService.convToDbDate($scope.cboDate)
                        : moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/covid/num-tambon/${date}`)
			.then(res => {
				console.log(res);
				// $scope.data = res.data.vision;

				// $scope.data && $scope.data.forEach(async (visit) => {
				// 	let resDc = await $http.get(`${CONFIG.apiUrl}/eye/visio2020/followup/${visit.hn}/${visit.vn}/1`);					
				// 	let dc = (resDc.data.length > 0) ? resDc.data[0] : null;
					
				// 	if (dc) {
				// 		let resFu1 = await $http.get(`${CONFIG.apiUrl}/eye/visio2020/followup/${visit.hn}/${dc.vn}/0`);					
				// 		let fu1 = (resFu1.data.length > 0) ? resFu1.data[0] : null;
				// 		visit.fu1 = fu1;
				// 	}

				// 	if (visit.fu1) {
				// 		let resFu2 = await $http.get(`${CONFIG.apiUrl}/eye/visio2020/followup/${visit.hn}/${visit.fu1.vn}/0`);					
				// 		let fu2 = (resFu2.data.length > 0) ? resFu2.data[0] : null;
				// 		visit.fu2 = fu2;
				// 	}
				// })
			}, err => {
				console.log(err);
			});
		};
	}
]);