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
		$scope.cboFaction = '';
		$scope.cboDepart = '';
		$scope.cboDivision = '';
		$scope.searchFname = '';

		$scope.prefixes = [];
		$scope.typepositions = [];
		$scope.positions = [];
		$scope.academics = [];
		$scope.hospPay18s = [];
		$scope.factions = [];
		$scope.departs = [];
		$scope.divisions = [];
		$scope.duties = [];		
		let tmpDeparts = [];
		let tmpDivisions = [];

		$scope.moveFactions = [];
		$scope.moveDeparts = [];
		$scope.moveDivisions = [];
		$scope.moveDuties = [];
		let tmpMoveDeparts = [];
		let tmpMoveDivisions = [];

		$scope.data = [];
		$scope.pager = null;
		$scope.totalData = {};
		$scope.profile = null;
		$scope.toDay = new Date();

		$scope.personLists = [];
		$scope.cardStat1 = [];
		$scope.cardStat2 = [];

		$scope.nurseMove = {
			nurse: null,
			move_doc_no: '',
			move_doc_date: '',
			move_date: '',
			move_duty: '',
			move_faction: '',
			move_depart: '',
			move_division: '',
			in_out: 'O',
		};

		$scope.nurseTransfer = {
			nurse: null,
			transfer_date: '',
			transfer_doc_no: '',
			transfer_doc_date: '',
			transfer_to: '',
			in_out: 'O',
		};

		$scope.nurseLeave = {
			nurse: null,
			leave_doc_no: '',
			leave_doc_date: '',
			leave_date: '',
			leave_type: '',
			leave_reason: ''
		};

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

		$scope.getAll = function(e, depart='', division='', fname='') {
			if(e) e.preventDefault();

			division = division == null ? '' : division;
			const url = (depart === '' && division === '' && fname === '')
						? `${CONFIG.apiUrl}/nurses`
						: `${CONFIG.apiUrl}/nurses?depart=${depart}&division=${division}&fname=${fname}`;

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

			$http.get(`${CONFIG.apiUrl}/nurses/${id}/profile`)
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
				$scope.typepositions = res.data.typepositions;
				$scope.positions = res.data.positions;
				$scope.academics = res.data.academics;
				$scope.hospPay18s = res.data.hospPay18s;
				$scope.departs = res.data.departs.filter(dep => dep.faction_id === '5');
				$scope.divisions = res.data.divisions.filter(div => div.faction_id === '5');;
				tmpDivisions = res.data.divisions;
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
			$scope.getAll(e, $scope.cboDepart, $scope.cboDivision, $scope.searchFname);

			$scope.divisions = tmpDivisions.filter(div => div.depart_id === $scope.cboDepart);
		};

		$scope.onDivisionChange = function(e) {
			$scope.getAll(e, $scope.cboDepart, $scope.cboDivision, $scope.searchFname);
		};

		$scope.onFnameChange = function(e) {
			$scope.getAll(e, $scope.cboDepart, $scope.cboDivision, $scope.searchFname);
		};

		$scope.onMoveFactionChange = function(e) {
			$scope.moveDeparts = tmpMoveDeparts.filter(dep => dep.faction_id === $scope.nurseMove.move_faction);
		};

		$scope.onMoveDepartChange = function(e) {
			$scope.moveDivisions = tmpMoveDivisions.filter(div => div.depart_id === $scope.nurseMove.move_depart);

			const faction = $scope.moveDeparts.find(dep => dep.depart_id === $scope.nurseMove.move_depart);
			$scope.nurseMove.move_faction = faction.faction_id;
		};

		$scope.showMoveForm = function(e, type, nurse) {
			e.preventDefault();
            
            $http.get(`${CONFIG.apiUrl}/nurses/init/form`)
            .then(res => {
                $scope.moveFactions = res.data.factions;
                tmpMoveDeparts 		= res.data.departs;
                tmpMoveDivisions 	= res.data.divisions;
                $scope.moveDuties 	= res.data.duties.filter(dut => [1,2,4,5].includes(parseInt(dut.duty_id)));

				$scope.nurseMove.nurse = nurse;

				if (type == 'S') {
					$scope.moveDeparts 	= res.data.departs.filter(dep => dep.faction_id === '5');
					$scope.nurseMove.move_faction = '5';

					$('#shiftForm').modal('show');
				} else if (type == 'M') {
					$('#moveForm').modal('show');
				}
            }, err => {
                console.log(err)
            });
		}

		$scope.move = (e) => {
			if(e) e.preventDefault();

			console.log($scope.nurseMove);
			const id = $scope.nurseMove.nurse.person_id;

            $http.put(`${CONFIG.apiUrl}/nurses/${id}/move`, $scope.nurseMove)
            .then(res => {
				console.log(res);
				
				/** Clear values */
				$scope.nurseMove = {
					nurse: null,
					move_doc_no: '',
					move_doc_date: '',
					move_date: '',
					move_duty: '',
					move_faction: '',
					move_depart: '',
					move_division: '',
					in_out: 'O',
				};

				$('#moveForm').modal('hide');
				$('#shiftForm').modal('hide');
            }, err => {
                console.log(err)
            });
		};

		$scope.showTransferForm = function(e, nurse) {
			e.preventDefault();

			$scope.nurseTransfer.nurse = nurse;

			$('#transferForm').modal('show');
		}

		$scope.transfer = (e) => {
			if(e) e.preventDefault();

			console.log($scope.nurseTransfer);
			const id = $scope.nurseTransfer.nurse.person_id;

            $http.put(`${CONFIG.apiUrl}/nurses/${id}/transfer`, $scope.nurseTransfer)
            .then(res => {
				console.log(res);

				/** Clear values */
				$scope.nurseTransfer = {
					nurse: null,
					transfer_date: '',
					transfer_doc_no: '',
					transfer_doc_date: '',
					transfer_to: '',
					in_out: 'O',
				};

				$('#transferForm').modal('hide');
            }, err => {
                console.log(err)
            });
		};

		$scope.showLeaveForm = function(e, person) {
			e.preventDefault();

			$scope.nurseLeave.nurse = person;

			$('#leaveForm').modal('show');
		}

		$scope.leave = (e) => {
			if(e) e.preventDefault();

			const id = $scope.nurseLeave.nurse.person_id;

            $http.put(`${CONFIG.apiUrl}/supports/${id}/leave`, $scope.nurseLeave)
            .then(res => {
				console.log(res);

				/** Clear values */
				$scope.nurseLeave = {
					nurse: null,
					leave_doc_no: '',
					leave_doc_date: '',
					leave_date: '',
					leave_type: '',
					leave_reason: ''
				};

				$('#leaveForm').modal('hide');
            }, err => {
                console.log(err)
            });
		};

		$scope.unknown = (e, id) => {
			if(e) e.preventDefault();
			console.log(id);
            $http.put(`${CONFIG.apiUrl}/nurses/${id}/unknown`, {})
            .then(res => {
				console.log(res);
            }, err => {
                console.log(err)
            });
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

		$scope.getCardStat = function(e) {
			if(e) e.preventDefault();

			// $scope.totalData = initTotalBed();

			$scope.loading = true;
			$http.get(`${CONFIG.apiUrl}/nurses/card-stat`)
			.then(res => {
				let { nurse, types } = res.data;
				let supported = nurse
									.filter(pos => pos.position_id !== "22" && pos.position_id !== "27")
									.reduce((sum, cur) => {
										return sum + parseInt(cur.num);
									}, 0);

				let temp = types
							.filter(t => t.typeposition_id === "4" || t.typeposition_id === "5")
							.reduce((sum, cur) => {
								return sum + parseInt(cur.num);
							}, 0);

				/** Set card statistics of small box */
				$scope.cardStat1 = [
					{
						id: 1,
						name: "พยาบาลวิชาชีพ",
						value: parseInt(nurse.find(pos => pos.position_id === "22").num) + parseInt(nurse.find(pos => pos.position_id === "27").num),
						unit: 'คน',
						bg: 'bg-info',
						icon: 'ion-university',
						link: 'covid/1/all'
					},
					{
						id: 2,
						name: "สนับสนุน",
						value: supported,
						unit: 'คน',
						bg: 'bg-success',
						icon: 'ion-person-add',
						link: 'covid/2/all'
					}
				];

				$scope.cardStat2 = [
					{
						id: 1,
						name: "ข้าราชการ",
						value: parseInt(types.find(t => t.typeposition_id === "1").num),
						unit: 'คน',
						bg: 'bg-danger',
						icon: 'ion-person-stalker',
						link: 'covid/3/all'
					},
					{
						id: 2,
						name: "พกส",
						value: parseInt(types.find(t => t.typeposition_id === "7").num),
						unit: 'คน',
						bg: 'bg-warning',
						icon: 'ion-pie-graph',
						link: 'covid/0/all'
					},
					{
						id: 3,
						name: "พนักงานราชการ",
						value: types.find(t => t.typeposition_id === "2") ? parseInt(types.find(t => t.typeposition_id === "2").num) : 0,
						unit: 'คน',
						bg: 'bg-primary',
						icon: 'ion-android-clipboard',
						link: 'covid/0/all'
					},
					{
						id: 4,
						name: "ลูกจ้างชั่วคราว",
						value: temp,
						unit: 'คน',
						bg: 'bg-default',
						icon: 'ion-ios-redo',
						link: 'covid/0/all'
					}
				];
			}, err => {
				console.log(err);
			});
		};
	}
]);