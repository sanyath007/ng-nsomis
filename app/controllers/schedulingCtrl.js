
app.controller('schedulingController', [
	'$rootScope',
	'$scope',
	'$http',
	'$routeParams',
	'CONFIG',
	'StringFormatService',
	'DatetimeService',
	function($rootScope, $scope, $http, $routeParams, CONFIG, StringFormatService, DatetimeService)
	{
		$scope.sdate = '';
		$scope.edate = '';
		$scope.data = [];
		$scope.dataTableOptions = {
			totalCol: parseInt(moment().endOf('month').format('D')),
		};
		$scope.cboFaction = '';
		$scope.cboDepart = '';
		$scope.cboDivision = '';
		$scope.cboMonth = '';
		$scope.cboYear = '';
		$scope.factions = [];
		$scope.departs = [];
		$scope.divisions = [];
		$scope.divisionMembers = [];
		$scope.scheduling_shifts = [];
		$scope.newScheduling = {
			faction: '',
			depart: '',
			division: '',
			month: '',
			year: '',
			controller: '',
			shifts: []
		};

		let tempDeparts = [];
		let tempDivisions = [];

		$('#month').datepicker({
			autoclose: true,
			format: 'mm/yyyy',
			viewMode: "months", 
			minViewMode: "months",
			language: 'th',
			thaiyear: true
		})
		.datepicker('update', new Date())
		.on('changeDate', function(e) {
			const [m, y] = e.format().split('/');

			$scope.setTableColumns(`${y}-${m}-01`);
		});

		$('#year').datepicker({
			autoclose: true,
			format: 'yyyy',
			viewMode: "years", 
			minViewMode: "years",
			language: 'th',
			thaiyear: true
		})
		.datepicker('update', moment().month() >= 9 ? moment().add(1, 'year').toDate() : new Date())
		.on('changeDate', function(e) {
			console.log(e.format());
		});

		$scope.range = function(min, max, step) {
			step = step || 1;
			var input = [];
			for (var i = min; i <= max; i += step) {
				input.push(i);
			}
			return input;
		};

		$scope.initForm = function () {
			$http.get(`${CONFIG.apiUrl}/schedulings/add`)
			.then(res => {
				console.log(res);

				$scope.factions = res.data.factions;
				tempDeparts = res.data.departs;
				tempDivisions = res.data.divisions;
			}, err => {
				console.log(err);
			})
		};

		$scope.setTableColumns = function (month) {
			$scope.dataTableOptions = {
				totalCol: parseInt(moment(month).endOf('month').format('D')),
			};
		};

		$scope.getAll = function(e) {
			if(e) e.preventDefault();

			let depart = $scope.cboDepart !== '' ? $scope.cboDepart : '0';
			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

			$scope.setTableColumns(month);

			$http.get(`${CONFIG.apiUrl}/schedulings?depart=${depart}&month=${month}`)
			.then(res => {
				console.log(res);
				const { shifts, ...data } = res.data.scheduling;
				$scope.data = data;
				const memberOfDep = res.data.memberOfDep

				// TODO: create shifts of each person of each days by columns
				memberOfDep.forEach(person => {
					let person_shifts = [];
					for(let d = 1; d <= $scope.dataTableOptions.totalCol; d++) {
						const sh = shifts.filter(sh => sh.person_id === person.person_id && d === moment(sh.date).date());

						let shiftText = '';
						
						if (sh.length === 0) {
							shiftText = '';
						} else {
							sh.forEach(s => {
								shiftText += (s.shift_id === '1' ? 'ด' : s.shift_id === '2' ? 'ช' : 'บ') + '|';
							});
						}

						person_shifts.push(shiftText);
					}

					$scope.scheduling_shifts.push({
						person_id: person.person_id,
						person_name: person.person_firstname+ ' ' +person.person_lastname,
						shifts: person_shifts
					});
				});
			}, err => {
				console.log(err);
			});
		};

		// TODO: move this method to filter
		$scope.formatShiftText = function(text) {
			return text.slice(0, text.lastIndexOf('|'));
		};

		$scope.onFactionChange = function(faction) {
			$scope.departs = tempDeparts.filter(dep => dep.faction_id === faction);
		};

		$scope.onDepartChange = function(depart) {
			$scope.divisions = tempDivisions.filter(div => div.depart_id === depart);
		};

		$scope.onDivisionChange = function(division) {
			getMemberOfDivision(division);
		};

		const getMemberOfDivision = function(division) {
			$http.get(`${CONFIG.apiUrl}/schedulings/member-of/${division}`)
			.then(res => {
				$scope.divisionMembers = res.data;
			}, err => {
				console.log(err);
			});
		};

		$scope.onSelectedShift = function(event, shift, ctrl) {
			event.preventDefault();

			document.getElementById(ctrl).value = shift;

			document.getElementById(ctrl+ '_btnGroupDrop').innerText = shift;
			if (shift == 'ด') {
				document.getElementById(ctrl+ '_btnGroupDrop').classList.remove('btn-success', 'btn-danger');
				document.getElementById(ctrl+ '_btnGroupDrop').classList.add('btn-info');
			} else if (shift == 'ช') {
				document.getElementById(ctrl+ '_btnGroupDrop').classList.remove('btn-info', 'btn-danger');
				document.getElementById(ctrl+ '_btnGroupDrop').classList.add('btn-success');
			} else if (shift == 'บ') {
				document.getElementById(ctrl+ '_btnGroupDrop').classList.remove('btn-info', 'btn-success');
				document.getElementById(ctrl+ '_btnGroupDrop').classList.add('btn-danger');
			}
		};

		$scope.onAddShift = function(event, person) {
			event.preventDefault();

			let person_shifts = [];
			for (let d = 1; d <= $scope.dataTableOptions.totalCol; d++) {
				person_shifts.push(document.getElementById(person+ '_' +d).value);
			}

			$scope.newScheduling.shifts.push({
				person_id: person,
				day_shifts: person_shifts,
			});

			console.log($scope.newScheduling.shifts);
			// TODO: disabled add button
		};

		$scope.store = function(event) {
			event.preventDefault();

			console.log($scope.newScheduling);
			// $http.post(`${CONFIG.apiUrl}/schedulings`)
			// .then(res => {
			// 	console.log(res);
			// }, err => {
			// 	console.log(err);
			// });
		};
	}
]);