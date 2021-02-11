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
		$scope.pager = null;
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

			$http.get(`${CONFIG.apiUrl}/nurses`)
			.then(res => {
				$scope.data = res.data.items;
				$scope.pager = res.data.pager;

				calculatAge();
			}, err => {
				console.log(err)
			});
		};

		const calculatAge = function() {
			$scope.data.forEach(nurse => {
				nurse.birthYear = moment(nurse.person.person_birth).format('YYYY');
				nurse.ageY = calcAge(nurse.person.person_birth, 'years');
				nurse.ageM = calcAge(nurse.person.person_birth, 'months') - (nurse.ageY*12);
				nurse.level = calcAge(nurse.start_date, 'years');
			});
		}

		const calcAge = function(birthdate, type) {
			return moment().diff(moment(birthdate), type);
		}

		$scope.onPaginateLinkClick = (e, link) => {
            e.preventDefault();
            
            $http.get(link)
            .then(res => {
                $scope.data = res.data.items;
                $scope.pager = res.data.pager;

				calculatAge();
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

				calculatAge();
			}, err => {
				console.log(err)
			});
		};
	}
]);