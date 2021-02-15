app.controller('nurseController', [
	'$scope',
	'$http',
	'CONFIG',
	'$routeParams',
	function($scope, $http, CONFIG, $routeParams) 
	{
		$scope.cboYear = '';
		$scope.sdate = '';
		$scope.edate = '';
		$scope.data = [];
		$scope.pager = null;
		$scope.totalData = {};
		$scope.profile = null;
		$scope.toDay = new Date();

		const initTotalGenerations = function() {
			return {
				b: 0,
				x: 0,
				y: 0,
				z: 0
			}
		};
		
		const initTotalLevels = function() {
			return {
				novice: 0,
				beginner: 0,
				competent: 0,
				proficient: 0,
				expert: 0
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

		$scope.getNurse = (e) => {
			const id = $routeParams.id;

			$http.get(`${CONFIG.apiUrl}/nurses/profile/${id}`)
			.then(res => {
				$scope.profile = res.data;
			}, err => {
				console.log(err);
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

		const calcTotalGen = function() {
			$scope.totalData.generations = initTotalGenerations();

			$scope.data.forEach(nurse => {
				$scope.totalData.generations.b += (nurse.birthYear >= 1946 && nurse.birthYear <= 1964) ? 1 : 0; // gen b
				$scope.totalData.generations.x += (nurse.birthYear >= 1965 && nurse.birthYear <= 1979) ? 1 : 0; // gen x
				$scope.totalData.generations.y += (nurse.birthYear >= 1980 && nurse.birthYear <= 1997) ? 1 : 0; // gen y
				$scope.totalData.generations.z += (nurse.birthYear >= 1998) ? 1 : 0; // gen z
			});
		}
		
		const calcTotalLevel = function() {
			$scope.totalData.levels = initTotalLevels();

			$scope.data.forEach(nurse => {
				$scope.totalData.levels.novice += (nurse.level < 1) ? 1 : 0; // Novice
				$scope.totalData.levels.beginner += (nurse.level >= 1 && nurse.level < 2) ? 1 : 0; // Beginner
				$scope.totalData.levels.competent += (nurse.level >= 2 && nurse.level < 3) ? 1 : 0; // Competent
				$scope.totalData.levels.proficient += (nurse.level >= 3 && nurse.level < 5) ? 1 : 0; // Proficient
				$scope.totalData.levels.expert += (nurse.level >= 5) ? 1 : 0; // Expert
			});
		}

		$scope.getGenList = function(e) {
			if(e) e.preventDefault();

			let year = $scope.cboYear !== '' ? parseInt($scope.cboYear) - 543 : $scope.toDay.getFullYear();

			$http.get(`${CONFIG.apiUrl}/nurses/gen-list`)
			.then(res => {
				$scope.data = res.data.nurses;

				calculatAge();
				calcTotalGen();
				calcTotalLevel();
			}, err => {
				console.log(err)
			});
		};
	}
]);