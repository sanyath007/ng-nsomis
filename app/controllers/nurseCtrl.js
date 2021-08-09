app.controller('nurseController', [
	'$scope',
	'$http',
	'CONFIG',
	'$routeParams',
	'StringFormatService',
	function($scope, $http, CONFIG, $routeParams, StringFormatService) 
	{
		$scope.sdate = '';
		$scope.edate = '';
		$scope.cboYear = '';
		$scope.cboDepart = '';
		$scope.searchFname = '';

		$scope.prefixes = [];
		$scope.positions = [];
		$scope.academics = [];
		$scope.hospPay18s = [];
		$scope.departs = [];

		$scope.data = [];
		$scope.pager = null;
		$scope.totalData = {};
		$scope.profile = null;
		$scope.toDay = new Date();

		$scope.personLists = [];

		$scope.newNurse = {
			cid: '',
			hn: '',
			prefix: '',
			fname: '',
			lname: '',
			birthdate: '',
			age_y: '',
			age_m: '',
			position: '',
			academic: '',
			hosp_pay18: '23839',
			checkin_date: '',
			start_date: '',
			level_y: '',
			level_m: '',
			cert_no: '',
			position_no: '',
			depart: ''
		};

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

		$scope.getAll = function(e, depart='', fname='') {
			if(e) e.preventDefault();

			const url = (depart === '' && fname === '')
						? `${CONFIG.apiUrl}/nurses`
						: `${CONFIG.apiUrl}/nurses?depart=${depart}&fname=${fname}`;

			$http.get(url)
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
				nurse.birthYear = moment(nurse.person_birth).format('YYYY');
				nurse.ageY = $scope.calcAge(nurse.person_birth, 'years');
				nurse.ageM = $scope.calcAge(nurse.person_birth, 'months') - (nurse.ageY*12);
				nurse.level = $scope.calcAge(nurse.person_singin, 'years');
			});
		}

		$scope.calcAge = function(birthdate, type) {
			return moment().diff(moment(birthdate), type);
		}

		$scope.setData = (response) => {
			$scope.data = response.data.items;
			$scope.pager = response.data.pager;

			calculatAge();
		};
		
		$scope.setPersonLists = (response) => {
			$scope.personLists = response.data.items;
			$scope.pager = response.data.pager;
		};

		$scope.onPaginateLinkClick = (e, link, cb) => {
            e.preventDefault();
            
            $http.get(link)
            .then(res => {
				cb(res);
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

		$scope.getInitForm = (e) => {
			if(e) e.preventDefault();
            
            $http.get(`${CONFIG.apiUrl}/nurses/init/form`)
            .then(res => {
				$scope.prefixes = res.data.prefixes;
				$scope.positions = res.data.positions;
				$scope.academics = res.data.academics;
				$scope.hospPay18s = res.data.hospPay18s;
				$scope.departs = res.data.departs;
            }, err => {
                console.log(err)
            });
		};

		$scope.showPersonLists = (e, id) => {
            e.preventDefault();
            
            $http.get(`${CONFIG.apiUrl}/persons`)
            .then(res => {
                $scope.personLists = res.data.items;
                $scope.pager = res.data.pager;

                $('#personLists').modal('show');
            }, err => {
                console.log(err)
            });
        };

		$scope.selectedPerson = (e, person) => {
			if (!person) return;

			e.preventDefault();
			$scope.newNurse.cid = person.person_id;
			$scope.newNurse.prefix = person.person_prefix;
			$scope.newNurse.fname = person.person_firstname;
			$scope.newNurse.lname = person.person_lastname;
			$scope.newNurse.birthdate = StringFormatService.convFromDbDate(person.person_birth);
			$scope.newNurse.age_y = $scope.calcAge(person.person_birth, 'year');
			$scope.newNurse.position = person.position_id;
			$scope.newNurse.academic = person.ac_id === '0' ? '' : person.ac_id;
			$scope.newNurse.start_date = StringFormatService.convFromDbDate(person.person_singin);
			$scope.newNurse.level_y = $scope.calcAge(person.person_singin, 'year');
		};

		$scope.onDepartChange = function(e) {
			$scope.getAll(e, $scope.cboDepart);
		};

		$scope.onFnameChange = function(e) {
			$scope.getAll(e, '', $scope.searchFname);
		};

		$scope.store = (e) => {
			if(e) e.preventDefault();
			console.log($scope.newNurse);

            // $http.post(`${CONFIG.apiUrl}/nurses`, $scope.newNurse)
            // .then(res => {
			// 	console.log(res);
            // }, err => {
            //     console.log(err)
            // });
		};
	}
]);