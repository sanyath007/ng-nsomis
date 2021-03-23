app.controller('productController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	'DatetimeService',
	'toaster',
	function($scope, $http, CONFIG, StringFormatService, DatetimeService, toaster) 
	{
		$scope.cboSDate = '';
		$scope.cboMonth = '';
		$scope.cboWard = '';
		$scope.cboPeriod = '';
		$scope.dtpProductDate = StringFormatService.convFromDbDate(moment(new Date()).format('YYYY-MM-DD'));

		$scope.dataTableOptions = null;

		$scope.data = [];
		$scope.wards = [];
		$scope.staff = null;
		$scope.multiply = null;
		$scope.errors = null;
		$scope.unknows = [];

		$('#product_date').datepicker({
			autoclose: true,
			language: 'th',
			format: 'dd/mm/yyyy',
			thaiyear: true
		})
		.datepicker('update', new Date())
		.on('changeDate', e => {
			$scope.dtpProductDate = e.format();

			$scope.getWorkload(e);
		});

		const initMultiplyData = () => {
			return {
				xtype1: 0,
				xtype2: 0,
				xtype3: 0,
				xtype4: 0,
				xtype5: 0,
				xtotal: 0.0,
				xstaff: 0,
				productivity: 0.0,
			};
		};

		$scope.range = function(min, max, step) {
			step = step || 1;
			var input = [];
			for (var i = min; i <= max; i += step) {
				input.push(i);
			}
			return input;
		};

		const calcAge = function(birthdate, type) {
			return moment().diff(moment(birthdate), type);
		}
		
		$scope.getProductSum = (e) => {
			if (e) e.preventDefault();
			
			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

			$scope.dataTableOptions = {
				totalCol: parseInt(moment(month).endOf('month').format('D')),
			};

            $http.get(`${CONFIG.apiUrl}/product-sum/${month}`)
            .then(res => {
				$scope.data = res.data.wards;

				// create productivity of each day
				$scope.data.forEach(w => {
					for(let day = 1; day <= $scope.dataTableOptions.totalCol; day++) {
						let prod = res.data.product.find(p => {
							return w.ward == p.ward && w.period == p.period && day == p.product_day;
						});

						w[day] = prod ? prod.productivity : '';
					}
				});
			}, err => {
				console.log(err)
			});
		};

		$scope.getProductWard = (e) => {
			if (e) e.preventDefault();

			let date = $scope.cboSDate !== ''
						? StringFormatService.convToDbDate($scope.cboSDate) 
						: moment().format('YYYY-MM-DD');
			let ward = $scope.cboWard === '' ? '0' : $scope.cboWard;

            $http.get(`${CONFIG.apiUrl}/product-ward/${date}/${ward}`)
            .then(res => {
				$scope.data = res.data.product;
				$scope.wards = res.data.wards;
			}, err => {
				console.log(err)
			});
		};

		$scope.getProductAdd = () => {
			$http.get(`${CONFIG.apiUrl}/product-add`)
            .then(res => {
				$scope.wards = res.data;
			}, err => {
				console.log(err)
			});
		};

		$scope.getWorkload = (e) => {
			$scope.multiply = initMultiplyData();

			let date = $scope.dtpProductDate !== ''
						? StringFormatService.convToDbDate($scope.dtpProductDate) 
						: moment().format('YYYY-MM-DD');
			let period = $scope.cboPeriod === '' ? 1 : $scope.cboPeriod;
			let ward = $scope.cboWard === '' ? '00' : $scope.cboWard;

			$http.get(`${CONFIG.apiUrl}/product-workload/${date}/${period}/${ward}`)
            .then(res => {
				$scope.data = res.data.workload;
				$scope.staff = res.data.staff;

				calcProductivity();
			}, err => {
				console.log(err)
			});
		};

		$scope.onChangeStaffAmount = () => {
			$scope.staff.total = parseInt($scope.staff.rn) + parseInt($scope.staff.pn);
			
			calcProductivity();
		};

		function calcProductivity() {
			if ($scope.data) {
				$scope.multiply.xtype1 = parseInt($scope.data.type1) * 0.5;
				$scope.multiply.xtype2 = parseInt($scope.data.type2) * 3.5;
				$scope.multiply.xtype3 = parseInt($scope.data.type3) * 5.5;
				$scope.multiply.xtype4 = parseInt($scope.data.type4) * 7.5;
				$scope.multiply.xtype5 = parseInt($scope.data.type5) * 12;
				$scope.multiply.xtotal = $scope.multiply.xtype1 + $scope.multiply.xtype2 + $scope.multiply.xtype3 + $scope.multiply.xtype4 + $scope.multiply.xtype5;
				$scope.multiply.xstaff = parseInt($scope.staff.total) * 7;
				$scope.multiply.productivity = (($scope.multiply.xtotal*100)/$scope.multiply.xstaff).toFixed(2);
			}
		};

		$scope.showUnknowClassList = (e) => {
			e.preventDefault();
            
			let date = $scope.dtpProductDate !== ''
						? StringFormatService.convToDbDate($scope.dtpProductDate) 
						: moment().format('YYYY-MM-DD');
			let period = $scope.cboPeriod === '' ? 1 : $scope.cboPeriod;
			let ward = $scope.cboWard === '' ? '00' : $scope.cboWard;

            $http.get(`${CONFIG.apiUrl}/unknow-type/${date}/${period}/${ward}`)
            .then(res => {
				console.log(res);
                $scope.unknows = res.data;
                // $scope.pager = res.data.pager;

				$scope.unknows.forEach(u => {
					u.ageY = calcAge(u.birthday, 'years');
				});
				
                $('#ipUnknowTypeList').modal('show');
			}, err => {
                console.log(err)
            });
		};

		$scope.store = (e) => {
			e.preventDefault();

			if ($scope.data.length === 0 && !$scope.multiply && !$scope.staff) {
				toaster.pop('warning', "", 'กรุณาเลือกวอร์ดและเลือกเวรก่อน !!!');

				return false;
			}
			
			// ask user for set unknow type to type 3
			if (parseInt($scope.data.unknow) > 0) {
				if(confirm(`คุณมีผู้ป่วยที่ยังไม่ได้ระบุประเภทจำนวน  ${$scope.data.unknow} ราย หากคุณทำการบันทึกผู้ป่วยประเภทดังกล่าวจะถูกนำไปรวมกับผู้ป่วยประเภท 3 คุณต้องการทำการบันทึกต่อไปหรือไม่?`)) {
					$scope.data.type3 = parseInt($scope.data.type3) + parseInt($scope.data.unknow);

					calcProductivity();
				} else {
					return false;
				}
			}

			let data = {
				ward: $scope.cboWard,
				period: $scope.cboPeriod,
				product_date: StringFormatService.convToDbDate($scope.dtpProductDate),
				total_patient: $scope.data.all,
				type1: $scope.data.type1,
				type2: $scope.data.type2,
				type3: $scope.data.type3,
				type4: $scope.data.type4,
				type5: $scope.data.type5,
				xtype1: $scope.multiply.xtype1,
				xtype2: $scope.multiply.xtype2,
				xtype3: $scope.multiply.xtype3,
				xtype4: $scope.multiply.xtype4,
				xtype5: $scope.multiply.xtype5,
				xtotal: $scope.multiply.xtotal,
				rn: $scope.staff.rn,
				pn: $scope.staff.pn,
				total_staff: $scope.staff.total,
				xstaff: $scope.multiply.xstaff,
				productivity: $scope.multiply.productivity,
				user: 'test'
			};

			$http.post(`${CONFIG.apiUrl}/product-store`, data)
            .then(res => {
				console.log(res);

				if (res.data.status === 1) {
					toaster.pop('error', "", 'คุณกรอกข้อมูลไม่ครบ กรุณาเลือกวอร์ดและเลือกเวรก่อน !!!');
					$scope.errors = res.data.errors;
				} else if (res.data.status === 2) {
					toaster.pop('error', "", 'คุณบันทึกข้อมูลซ้ำ !!!');
				} else if (res.data.status === 0) {
					toaster.pop('success', "", 'บันทึกข้อมูลเรียบร้อย !!!');
				}
			}, err => {
				console.log(err)
			});
		};
	}
]);