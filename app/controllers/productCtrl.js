app.controller('productController', [
	'$rootScope',
	'$scope',
	'$http',
	'$timeout',
	'$routeParams',
	'CONFIG',
	'StringFormatService',
	'DatetimeService',
	'ExcelService',
	'toaster',
	function(
		$rootScope, $scope, $http, $timeout, $routeParams, CONFIG,
		StringFormatService, DatetimeService, ExcelService, toaster
	) {
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

		const initTotalWardData = () => {
			return {
				patients: 0,
				type1: 0,
				xtype1: 0,
				type2: 0,
				xtype2: 0,
				type3: 0,
				xtype3: 0,
				type4: 0,
				xtype4: 0,
				type5: 0,
				xtype5: 0,
				xtotal: 0.0,
				staff_rn: 0,
				staff_pn: 0,
				staffs: 0,
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

		$scope.getProductOverAll = (e) => {
			if (e) e.preventDefault();
			
			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');

			$scope.dataTableOptions = {
				totalCol: parseInt(moment(month).endOf('month').format('D')),
			};

            $http.get(`${CONFIG.apiUrl}/product-overall/${month}`)
            .then(res => {
				$scope.data = res.data.wards;

				/** Create productivity of each day */
				$scope.data.forEach(w => {
					let total = 0;
					let count = 0;

					for(let day = 1; day <= $scope.dataTableOptions.totalCol; day++) {
						let prod = res.data.product.find(p => w.ward == p.ward);

						w[day] = prod && prod[`p${day}`] ? parseFloat(prod[`p${day}`])/parseInt(prod[`t${day}`]) : '';
						total += prod && prod[`p${day}`] ? parseFloat(prod[`p${day}`])/parseInt(prod[`t${day}`]) : 0;
						count += prod && prod[`p${day}`] ? 1 : 0;
					}

					w.count = count;
					w.total = total;
					/** Add new description data to each ward */
					w.desc = $rootScope.wardBed().find(wb => wb.ward === w.ward);
				});

				/** Sort data by each desc.sortBy element */
				$scope.filteredData = $scope.data.sort((wa, wb) => wa.desc.sortBy - wb.desc.sortBy);
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

					/** Add new description data to each ward */
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

			$scope.totalData = initTotalWardData();

			let month = ($scope.cboMonth !== '') 
                        ? DatetimeService.fotmatYearMonth($scope.cboMonth)
                        : moment().format('YYYY-MM');
			let ward = $scope.cboWard === '' ? '0' : $scope.cboWard;

            $http.get(`${CONFIG.apiUrl}/product-ward/${month}/${ward}`)
            .then(res => {
				$scope.data = res.data.product;

				let rowCount = 0;
				$scope.data.forEach(product => {
					$scope.totalData.patients += parseInt(product.total_patient);
					$scope.totalData.type1 += parseInt(product.type1);
					$scope.totalData.xtype1 += parseFloat(product.xtype1);
					$scope.totalData.type2 += parseInt(product.type2);
					$scope.totalData.xtype2 += parseFloat(product.xtype2);
					$scope.totalData.type3 += parseInt(product.type3);
					$scope.totalData.xtype3 += parseFloat(product.xtype3);
					$scope.totalData.type4 += parseInt(product.type4);
					$scope.totalData.xtype4 += parseFloat(product.xtype4);
					$scope.totalData.type5 += parseInt(product.type5);
					$scope.totalData.xtype5 += parseFloat(product.xtype5);
					$scope.totalData.xtotal += parseFloat(product.xtotal);
					$scope.totalData.staff_rn += parseInt(product.rn);
					$scope.totalData.staff_pn += parseInt(product.pn);
					$scope.totalData.staffs += parseInt(product.total_staff);
					$scope.totalData.xstaff += parseFloat(product.xstaff);
					$scope.totalData.productivity += parseFloat(product.productivity);
					rowCount++;
				});

				$scope.totalData.xtype1 = parseFloat($scope.totalData.xtype1) / rowCount;
				$scope.totalData.xtype2 = parseFloat($scope.totalData.xtype2) / rowCount;
				$scope.totalData.xtype3 = parseFloat($scope.totalData.xtype3) / rowCount;
				$scope.totalData.xtype4 = parseFloat($scope.totalData.xtype4) / rowCount;
				$scope.totalData.xtype5 = parseFloat($scope.totalData.xtype5) / rowCount;
				$scope.totalData.xtotal = parseFloat($scope.totalData.xtotal) / rowCount;
				$scope.totalData.xstaff = parseFloat($scope.totalData.xstaff) / rowCount;
				$scope.totalData.productivity = parseFloat($scope.totalData.productivity) / rowCount;
				console.log('row = ' +rowCount);
				console.log($scope.totalData);
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
				$scope.calcProductivity();
			}, err => {
				console.log(err)
			});
		};

		$scope.onChangeStaffAmount = () => {
			$scope.staff.total = parseInt($scope.staff.rn) + parseInt($scope.staff.pn);

			$scope.calcProductivity();
		};

		function setXType(period) {
			if (period === '1') { // เวรดึก
				$scope.xtype.type1 = 0.1;
				$scope.xtype.type2 = 1;
				$scope.xtype.type3 = 1.5;
				$scope.xtype.type4 = 2;
				$scope.xtype.type5 = 3;
			} else if (period === '2') { // เวรเช้า
				$scope.xtype.type1 = 0.3;
				$scope.xtype.type2 = 1.5;
				$scope.xtype.type3 = 2.4;
				$scope.xtype.type4 = 3.5;
				$scope.xtype.type5 = 5;
			} else if (period === '3') { // เวรบ่าย
				$scope.xtype.type1 = 0.1;
				$scope.xtype.type2 = 1;
				$scope.xtype.type3 = 1.6;
				$scope.xtype.type4 = 2;
				$scope.xtype.type5 = 4;
			}
		}

		$scope.calcProductivity = function() {
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
			if ($scope.cboPeriod === '1') { // เวรดึก
				chkTime = 'T02:00:00';
			} else if ($scope.cboPeriod === '2') { // เวรเช้า
				chkTime = 'T10:00:00';
			} else if ($scope.cboPeriod === '3') { // เวรบ่าย
				chkTime = 'T18:00:00';
			}

			if (moment(new Date()).diff(moment(StringFormatService.convToDbDate($scope.dtpProductDate) + chkTime), 'minutes') < 0) {
				toaster.pop('error', "", `ไม่สามารถบันทึกข้อมูลก่อนเวลาได้ ต้องบันทึกหลังเวลา ${chkTime} น. สำหรับ${$('#period option:selected').text()} !!!`);

				return false;
			}

			// Ask user for set unknow type to type 3
			if (parseInt($scope.data.unknow) > 0) {
				if(confirm(`คุณมีผู้ป่วยที่ยังไม่ได้ระบุประเภทจำนวน  ${$scope.data.unknow} ราย หากคุณทำการบันทึกผู้ป่วยประเภทดังกล่าวจะถูกนำไปรวมกับผู้ป่วยประเภท 2 คุณต้องการทำการบันทึกต่อไปหรือไม่?`)) {
					$scope.data.type2 = parseInt($scope.data.type2) + parseInt($scope.data.unknow);

					$scope.calcProductivity();
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

			$http.post(`${CONFIG.apiUrl}/product`, data)
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

		const checkSumPatientTotal = function() {
			let tempSumPatients = parseInt($scope.data.type1) + parseInt($scope.data.type2) + parseInt($scope.data.type3) + parseInt($scope.data.type4) + parseInt($scope.data.type5);
			console.log(tempSumPatients+ '!==' +$scope.data.all);

			if (tempSumPatients !== parseInt($scope.data.all)) {
				return true;
			}

			return false;
		};

		$scope.getProductEdit = function() {
			let id = $routeParams.id;

			$scope.multiply = initMultiplyData();
			$scope.staff = {
				rn: 0,
				pn: 0,
				total: 0
			};

			$http.get(`${CONFIG.apiUrl}/product/${id}`)
            .then(res => {
				$scope.wards = res.data.wards;

				$scope.wards.forEach(w => {
					w.desc = $rootScope.wardBed().find(wb => wb.ward === w.ward);
				});

				$scope.wards.sort((wa, wb) => wa.desc.sortBy - wb.desc.sortBy);

				/** Set edited data to input controls */
				$scope.data.id 			= res.data.product.id;
				$scope.dtpProductDate 	= StringFormatService.convFromDbDate(res.data.product.product_date);
				$scope.cboPeriod 		= res.data.product.period;
				$scope.cboWard 			= res.data.product.ward;
				/** Patient data */
				$scope.data.all = res.data.product.total_patient;
				$scope.data.type1 = res.data.product.type1;
				$scope.data.type2 = res.data.product.type2;
				$scope.data.type3 = res.data.product.type3;
				$scope.data.type4 = res.data.product.type4;
				$scope.data.type5 = res.data.product.type5;
				/** Officer data */
				$scope.staff.rn 	= res.data.product.rn;
				$scope.staff.pn 	= res.data.product.pn;
				$scope.staff.total 	= res.data.product.total_staff;

				setXType($scope.cboPeriod);
				$scope.calcProductivity();
			}, err => {
				console.log(err)
			});
		};

		$scope.update = (e) => {
			e.preventDefault();

			if ($scope.data.length === 0 && !$scope.multiply && !$scope.staff) {
				toaster.pop('warning', "", 'กรุณาเลือกวอร์ดและเลือกเวรก่อน !!!');

				return false;
			}

			if (checkSumPatientTotal()) {
				toaster.pop('error', "", 'คุณจำนวนรวมของผู้ป่วยแต่ละประเภทไม่เท่ากับผู้ป่วยทั้หมด !!!');

				return false;
			}

			if (moment().diff(moment(StringFormatService.convToDbDate($scope.dtpProductDate)), "days") > 3) {
				toaster.pop('error', "", 'ไม่สามารถแก้ไขข้อมูลที่ถูกบันทึกแล้วเกิน 3 วันได้ !!!');

				return false;
			}

			// Check if user save data before fit time 
			let chkTime = '';
			if ($scope.cboPeriod === '1') { // เวรดึก
				chkTime = 'T02:00:00';
			} else if ($scope.cboPeriod === '2') { // เวรเช้า
				chkTime = 'T10:00:00';
			} else if ($scope.cboPeriod === '3') { // เวรบ่าย
				chkTime = 'T18:00:00';
			}

			if (moment(new Date()).diff(moment(StringFormatService.convToDbDate($scope.dtpProductDate) + chkTime), 'minutes') < 0) {
				toaster.pop('error', "", `ไม่สามารถบันทึกข้อมูลก่อนเวลาได้ ต้องบันทึกหลังเวลา ${chkTime} น. สำหรับ${$('#period option:selected').text()} !!!`);

				return false;
			}

			/** Ask user for set unknow type to type 3 */
			if (parseInt($scope.data.unknow) > 0) {
				if(confirm(`คุณมีผู้ป่วยที่ยังไม่ได้ระบุประเภทจำนวน  ${$scope.data.unknow} ราย หากคุณทำการบันทึกผู้ป่วยประเภทดังกล่าวจะถูกนำไปรวมกับผู้ป่วยประเภท 2 คุณต้องการทำการบันทึกต่อไปหรือไม่?`)) {
					$scope.data.type2 = parseInt($scope.data.type2) + parseInt($scope.data.unknow);

					$scope.calcProductivity();
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

			$http.put(`${CONFIG.apiUrl}/product/${$scope.data.id}`, data)
            .then(res => {
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

		$scope.delete = (e, id) => {
			e.preventDefault();

			if (confirm(`คุณต้องการลบข้อมูล Productivity รหัส ${id} ใช่หรือไม่ ?` )) {
				$http.delete(`${CONFIG.apiUrl}/product/${id}`)
				.then(res => {
					if (res.data.status === 1) {
						toaster.pop('error', "", 'พบข้อผิดพลาด ไม่สามารถลบข้อมูลได้ !!!');
						$scope.errors = res.data.errors;
					} else if (res.data.status === 0) {
						toaster.pop('success', "", 'ลบข้อมูลเรียบร้อย !!!');
					}
				}, err => {
					console.log(err)
				});
			} else {

			}
		};

		$scope.exportToExcel = function (tableId) {
			console.log(tableId);
			var exportHref = ExcelService.tableToExcel(tableId, 'WireWorkbenchDataExport');
			$timeout(function() {
				location.href = exportHref;
			},100); // trigger download
		};
	}
]);