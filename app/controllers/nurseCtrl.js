app.controller('nurseController', [
	'$scope',
	'$http',
	'CONFIG',
	function($scope, $http, CONFIG) 
	{
		$scope.cboYear = '';
		$scope.sdate = '';
		$scope.edate = '';
		$scope.data = [];
		$scope.totalData = {};
		$scope.toDay = new Date();

		const initTotalSumYear = function() {
			return {
				men: 0,
				women: 0,
				app: 0,
				notapp: 0,
				total: 0,
			}
		};

		$scope.getAll = function(e) {
			if(e) e.preventDefault();

			let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();

			$http.get(`${CONFIG.apiUrl}/nurses/gen-list`)
			.then(res => {
				$scope.data = res.data.nurses;

				$scope.data.forEach(nurse => {
					let personBirthDate = moment(nurse.person.person_birth);
					let ageYear = moment().diff(personBirthDate, 'years');
					let ageMonth = moment().diff(personBirthDate, 'months') - (ageYear*12);
					
					nurse.ageY = ageYear;
					nurse.ageM = ageMonth;
					nurse.birthYear = moment(nurse.person.person_birth).format('YYYY');
					nurse.level = moment().diff(moment(nurse.start_date), 'years');
				});
			}, err => {
				console.log(err)
			});
		};

		$scope.getGenList = function(e) {
			if(e) e.preventDefault();

			let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();

			$http.get(`${CONFIG.apiUrl}/nurses/gen-list`)
			.then(res => {
				$scope.data = res.data.nurses;

				$scope.data.forEach(nurse => {
					let personBirthDate = moment(nurse.person.person_birth);
					let ageYear = moment().diff(personBirthDate, 'years');
					let ageMonth = moment().diff(personBirthDate, 'months') - (ageYear*12);
					
					nurse.ageY = ageYear;
					nurse.ageM = ageMonth;
					nurse.birthYear = moment(nurse.person.person_birth).format('YYYY');
					nurse.level = moment().diff(moment(nurse.start_date), 'years');
				});
			}, err => {
				console.log(err)
			});
		};
	}
]);