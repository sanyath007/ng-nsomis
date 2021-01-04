
app.controller('orController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	function($scope, $http, CONFIG, StringFormatService)
	{
		$scope.sdate = '';
		$scope.edate = '';
		$scope.data = [];
		$scope.totalData = {};
		$scope.toDay = new Date();

		const initTotalData = function() {
			return {
				num: 0,
				miner: 0,
				major: 0,
				other: 0,			
				sur: 0,
				obs: 0,
				gyn: 0,
				ent: 0,
				eye: 0,
				ort: 0,
				neu: 0,
				max: 0,
				oth: 0,
				morning: 0,
				afternoon: 0,
				evening: 0,
				night: 0,
			};
		}
		
		const initTotalExpensesData = function() {
			return {
				qty: 0,
				price: 0
			}
		};
		
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
					$scope.totalData.miner += parseInt(val.miner);
					$scope.totalData.major += parseInt(val.major);
					$scope.totalData.other += parseInt(val.other);
					$scope.totalData.sur += parseInt(val.sur);
					$scope.totalData.obs += parseInt(val.obs);
					$scope.totalData.gyn += parseInt(val.gyn);
					$scope.totalData.ent += parseInt(val.ent);
					$scope.totalData.eye += parseInt(val.eye);
					$scope.totalData.ort += parseInt(val.ort);
					$scope.totalData.neu += parseInt(val.neu);
					$scope.totalData.max += parseInt(val.max);
					$scope.totalData.oth += parseInt(val.oth);
					$scope.totalData.morning += parseInt(val.morning);
					$scope.totalData.afternoon += parseInt(val.afternoon);
					$scope.totalData.evening += parseInt(val.evening);
					$scope.totalData.night += parseInt(val.night);
				});
			}, err => {
				console.log(err)
			});
		};

		$scope.getExpenses = function(e) {
			if(e) e.preventDefault();

			$scope.totalData = initTotalExpensesData();

			let startDate = ($('#sdate').val() !== '') 
							? StringFormatService.convToDbDate($scope.sdate) 
							: moment().format('YYYY-MM-DD');
			let endDate = ($('#edate').val() !== '') 
							? StringFormatService.convToDbDate($scope.edate) 
							: moment().format('YYYY-MM-DD');

			$http.get(`${CONFIG.apiUrl}/or/expenses/${startDate}/${endDate}`)
			.then(res => {
				console.log(res)
				$scope.data = res.data;

				$scope.data.forEach((val, key) => {
					$scope.totalData.qty += parseInt(val.sum_qty);
					$scope.totalData.price += parseInt(val.sum_price);
				});
			}, err => {
				console.log(err)
			});
		};
	}
]);