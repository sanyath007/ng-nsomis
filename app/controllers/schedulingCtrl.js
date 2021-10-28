
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
		$scope.dataTableOptions = null;
		$scope.cboDepart = '';
		$scope.cboMonth = '';
		$scope.scheduling_shifts = [];

		$scope.range = function(min, max, step) {
			step = step || 1;
			var input = [];
			for (var i = min; i <= max; i += step) {
				input.push(i);
			}
			return input;
		};

		$scope.getAll = function(e) {
			if(e) e.preventDefault();

			let depart = $scope.cboDepart !== '' ? $scope.cboDepart : '0';
			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

			$scope.dataTableOptions = {
				totalCol: parseInt(moment(month).endOf('month').format('D')),
			};

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
			})
		};

		// TODO: move this method to filter
		$scope.formatShiftText = function(text)
		{
			return text.slice(0, text.lastIndexOf('|'));
		}
	}
]);