app.controller('productController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	'toaster',
	function($scope, $http, CONFIG, StringFormatService, toaster) 
	{
		$scope.sdate = '';
		$scope.cboWard = '';
		$scope.cboPeriod = '';
		$scope.dtpProductDate = StringFormatService.convFromDbDate(moment(new Date()).format('YYYY-MM-DD'));

		$scope.data = [];
		$scope.wards = [];
		$scope.staff = null;
		$scope.multiply = null;
		$scope.errors = null;

		const initMultiplyData = () => {
			return {
				type1: 0,
				type2: 0,
				type3: 0,
				type4: 0,
				type5: 0,
				totalType: 0.0,
				staff: 0,
				productivity: 0.0,
			};
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

		$scope.getProductSum = (e) => {
			if (e) e.preventDefault();

			let date = $scope.sdate !== ''
						? StringFormatService.convToDbDate($scope.sdate) 
						: moment().format('YYYY-MM-DD');
			let ward = $scope.cboWard === '' ? '00' : $scope.cboWard;

            $http.get(`${CONFIG.apiUrl}/product-ward/${date}/${ward}`)
            .then(res => {
				console.log(res);
				$scope.data = res.data.product;
				$scope.wards = res.data.wards;
			}, err => {
				console.log(err)
			});
		};

		$scope.getProductWard = (e) => {
			if (e) e.preventDefault();

			let date = $scope.sdate !== ''
						? StringFormatService.convToDbDate($scope.sdate) 
						: moment().format('YYYY-MM-DD');
			let ward = $scope.cboWard === '' ? '00' : $scope.cboWard;

            $http.get(`${CONFIG.apiUrl}/product-ward/${date}/${ward}`)
            .then(res => {
				console.log(res);
				$scope.data = res.data.product;
				$scope.wards = res.data.wards;
			}, err => {
				console.log(err)
			});
		};

		$scope.getProductAdd = () => {
			$http.get(`${CONFIG.apiUrl}/product-add`)
            .then(res => {
				console.log(res);

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
				console.log(res);

				$scope.data = res.data.workload;
				$scope.staff = res.data.staff;

				if ($scope.data) {
					$scope.multiply.x10 = parseInt($scope.data.type1) * 1;
					$scope.multiply.x35 = parseInt($scope.data.type2) * 3.5;
					$scope.multiply.x55 = parseInt($scope.data.type3) * 5.5;
					$scope.multiply.x75 = parseInt($scope.data.type4) * 7.5;
					$scope.multiply.x120 = parseInt($scope.data.type5) * 12;
					$scope.multiply.xtotal = $scope.multiply.x10 + $scope.multiply.x35 + $scope.multiply.x55 + $scope.multiply.x75 + $scope.multiply.x120;

					$scope.multiply.staff = parseInt($scope.staff.total) * 7;
					$scope.multiply.productivity = (($scope.multiply.xtotal*100)/$scope.multiply.staff).toFixed(2);
				}
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
			
			if (parseInt($scope.data.unknow) > 0) {
				toaster.pop('warning', "", 'คุณมีผู้ป่วยที่ยังไม่ได้ระบุประเภท กรุณาระบุประเภทผู้ป่วยก่อน !!!');

				return false;
			}

			let data = {
				ward: $scope.cboWard,
				period: $scope.cboPeriod,
				product_date: StringFormatService.convToDbDate($scope.dtpProductDate),
				total_patient: $scope.data.all,
				t1: $scope.data.type1,
				t2: $scope.data.type2,
				t3: $scope.data.type3,
				t4: $scope.data.type4,
				t5: $scope.data.type5,
				tx10: $scope.multiply.x10,
				tx35: $scope.multiply.x35,
				tx55: $scope.multiply.x55,
				tx75: $scope.multiply.x75,
				tx120: $scope.multiply.x120,
				txtotal: $scope.multiply.xtotal,
				rn: $scope.staff.rn,
				pn: $scope.staff.pn,
				total_staff: $scope.staff.total,
				staff_x7: $scope.staff.total,
				productivity: $scope.multiply.productivity,
				user: 'test'
			};

			$http.post(`${CONFIG.apiUrl}/product-store`, data)
            .then(res => {
				console.log(res);

				if (res.data.status === 0) {
					toaster.pop('warning', "", 'กรุณาเลือกวอร์ดและเลือกเวรก่อน !!!');

					$scope.errors = res.data.errors;
				} else {
					toaster.pop('success', "", 'บันทึกข้อมูลเรียบร้อย !!!');
				}
			}, err => {
				console.log(err)
			});
		};
	}
]);