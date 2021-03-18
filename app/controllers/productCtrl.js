app.controller('productivityController', [
	'$scope',
	'$http',
	'CONFIG',
	'StringFormatService',
	function($scope, $http, CONFIG, StringFormatService) 
	{
		$scope.sdate = '';
		$scope.cboWard = '';
		$scope.cboPeriod = '';
		$scope.dtpProductDate = StringFormatService.convFromDbDate(moment(new Date()).format('YYYY-MM-DD'));

		$scope.data = [];
		$scope.wards = [];
		$scope.staff = null;
		$scope.multiply = null;

		const initMultiplyData = () => {
			return {
				type1: 0,
				type2: 0,
				type3: 0,
				type4: 0,
				type5: 0,
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

		$scope.getProductWard = (e) => {
			if (e) e.preventDefault();

			let date = $scope.sdate !== ''
						? StringFormatService.convToDbDate($scope.sdate) 
						: moment().format('YYYY-MM-DD');
			let ward = $scope.ward === '' ? '00' : $scope.ward;

            $http.get(`${CONFIG.apiUrl}/product-ward/${date}/${ward}`)
            .then(res => {
				console.log(res);

				$scope.data = res.data;
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
					$scope.multiply.type1 = parseInt($scope.data.type1) * 1;
					$scope.multiply.type2 = parseInt($scope.data.type2) * 3.5;
					$scope.multiply.type3 = parseInt($scope.data.type3) * 5.5;
					$scope.multiply.type4 = parseInt($scope.data.type4) * 7.5;
					$scope.multiply.type5 = parseInt($scope.data.type5) * 12;
				}
			}, err => {
				console.log(err)
			});
		};
	}
]);