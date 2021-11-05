app.controller('productController', [
	'$rootScope',
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	'DatetimeService',
	'toaster',
	function($rootScope, $scope, $http, CONFIG, StringFormatService, DatetimeService, toaster) 
	{
		$scope.cboSDate = '';
		$scope.cboMonth = '';
		$scope.cboWard = '';
		$scope.cboPeriod = '1';
		$scope.dtpProductDate = StringFormatService.convFromDbDate(moment(new Date()).format('YYYY-MM-DD'));

		$scope.dataTableOptions = null;

		$scope.data = [];
		$scope.filteredData = [];
		$scope.wards = [];
		$scope.staff = null;
		$scope.multiply = null;
		$scope.errors = null;
		$scope.ipTypeLists = [];
		$scope.xtype = {
			type1: 0.3,
			type2: 1.5,
			type3: 2.4,
			type4: 3.5,
			type5: 5,
		};

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

		$scope.initForm = () => {
			$http.get(`${CONFIG.apiUrl}/products/init-form`)
            .then(res => {
				$scope.wards = res.data.wards;

				$scope.wards.forEach(w => {
					w.desc = $rootScope.wardBed().find(wb => wb.ward === w.ward);
				});

				$scope.wards.sort((wa, wb) => wa.desc.sortBy - wb.desc.sortBy);
			}, err => {
				console.log(err)
			});
		};

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

				/** Create productivity of each day */
				$scope.data.forEach(w => {
					for(let day = 1; day <= $scope.dataTableOptions.totalCol; day++) {
						let prod = res.data.product.find(p => {
							return w.ward == p.ward && w.period == p.period && day == p.product_day;
						});

						w[day] = prod ? prod.productivity : '';
					}

					w.desc = $rootScope.wardBed().find(wb => wb.ward === w.ward);
				});

				/** Sort data by each desc.sortBy element */
				$scope.filteredData = $scope.data.sort((wa, wb) => wa.desc.sortBy - wb.desc.sortBy);
			}, err => {
				console.log(err)
			});
		};

		$scope.filterData = (filteredWard) => {
			if (filteredWard === '') {
				$scope.filteredData = $scope.data;
			} else {
				$scope.filteredData = $scope.data.filter(wd => wd.ward === filteredWard);
			}
		};

		$scope.getProductWard = (e) => {
			if (e) e.preventDefault();

			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');
			let ward = $scope.cboWard === '' ? '0' : $scope.cboWard;

            $http.get(`${CONFIG.apiUrl}/product-ward/${month}/${ward}`)
            .then(res => {
				$scope.data = res.data.product;
			}, err => {
				console.log(err)
			});
		};

		$scope.getProductAdd = () => {
			$http.get(`${CONFIG.apiUrl}/product-add`)
            .then(res => {
				$scope.wards = res.data;

				$scope.wards.forEach(w => {
					w.desc = $rootScope.wardBed().find(wb => wb.ward === w.ward);
				});

				$scope.wards.sort((wa, wb) => wa.desc.sortBy - wb.desc.sortBy);
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

				setXType(period);
				calcProductivity();
			}, err => {
				console.log(err)
			});
		};

		$scope.onChangeStaffAmount = () => {
			$scope.staff.total = parseInt($scope.staff.rn) + parseInt($scope.staff.pn);

			calcProductivity();
		};

		function setXType(period) {
			if (period === '1') {
				$scope.xtype.type1 = 0.3;
				$scope.xtype.type2 = 1.5;
				$scope.xtype.type3 = 2.4;
				$scope.xtype.type4 = 3.5;
				$scope.xtype.type5 = 5;
			} else if (period === '2') {
				$scope.xtype.type1 = 0.1;
				$scope.xtype.type2 = 1.6;
				$scope.xtype.type3 = 2;
				$scope.xtype.type4 = 2;
				$scope.xtype.type5 = 4;
			} else if (period === '3') {
				$scope.xtype.type1 = 0.1;
				$scope.xtype.type2 = 1;
				$scope.xtype.type3 = 1.5;
				$scope.xtype.type4 = 2;
				$scope.xtype.type5 = 3;
			}
		}

		function calcProductivity() {
			if ($scope.data) {
				$scope.multiply.xtype1 = (parseInt($scope.data.type1) * $scope.xtype.type1).toFixed(2);
				$scope.multiply.xtype2 = (parseInt($scope.data.type2) * $scope.xtype.type2).toFixed(2);
				$scope.multiply.xtype3 = (parseInt($scope.data.type3) * $scope.xtype.type3).toFixed(2);
				$scope.multiply.xtype4 = (parseInt($scope.data.type4) * $scope.xtype.type4).toFixed(2);
				$scope.multiply.xtype5 = (parseInt($scope.data.type5) * $scope.xtype.type5).toFixed(2);

				$scope.multiply.xtotal = (parseFloat($scope.multiply.xtype1) + parseFloat($scope.multiply.xtype2) + parseFloat($scope.multiply.xtype3) + parseFloat($scope.multiply.xtype4) + parseFloat($scope.multiply.xtype5)).toFixed(2);
				$scope.multiply.xstaff = parseInt($scope.staff.total) * 7;
				$scope.multiply.productivity = (($scope.multiply.xtotal*100)/$scope.multiply.xstaff).toFixed(2);
			}
		}

		$scope.showIpTypeLists = (e, ipType) => {
			e.preventDefault();
            
			let date = $scope.dtpProductDate !== ''
						? StringFormatService.convToDbDate($scope.dtpProductDate) 
						: moment().format('YYYY-MM-DD');
			let period = $scope.cboPeriod === '' ? 1 : $scope.cboPeriod;
			let ward = $scope.cboWard === '' ? '00' : $scope.cboWard;
			let type = ipType === '' ? 0 : ipType;

            $http.get(`${CONFIG.apiUrl}/ip-type/${date}/${period}/${ward}/${type}`)
            .then(res => {
                $scope.ipTypeLists = res.data;
                // $scope.pager = res.data.pager;

				$scope.ipTypeLists.forEach(u => {
					u.ageY = DatetimeService.calcAge(u.birthday, 'years');
				});
				
                $('#ipTypeLists').modal('show');
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

			// Check if user save data before fit time 
			let chkTime = '';
			if ($scope.cboPeriod === '1') {
				chkTime = 'T15:00:00';
			} else if ($scope.cboPeriod === '2') {
				chkTime = 'T23:00:00';
			} else if ($scope.cboPeriod === '3') {
				chkTime = 'T07:00:00';
			}

			if (moment(new Date()).diff(moment(StringFormatService.convToDbDate($scope.dtpProductDate) + chkTime), 'minutes') < 0) {
				toaster.pop('error', "", `ไม่สามารถบันทึกข้อมูลก่อนเวลาได้ ต้องบันทึกหลังเวลา ${chkTime} น. สำหรับ${$('#period option:selected').text()} !!!`);

				return false;
			}

			// Ask user for set unknow type to type 3
			if (parseInt($scope.data.unknow) > 0) {
				if(confirm(`คุณมีผู้ป่วยที่ยังไม่ได้ระบุประเภทจำนวน  ${$scope.data.unknow} ราย หากคุณทำการบันทึกผู้ป่วยประเภทดังกล่าวจะถูกนำไปรวมกับผู้ป่วยประเภท 2 คุณต้องการทำการบันทึกต่อไปหรือไม่?`)) {
					$scope.data.type2 = parseInt($scope.data.type2) + parseInt($scope.data.unknow);

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