/**
 * ==================================================
 *  AngularJS
 * ==================================================
 */

var env = {};

// Import variables if present (from env.js)
if(window){  
    Object.assign(env, window.__env);
}

var app = angular.module('App', ['ngRoute', 'ngStorage', 'toaster', 'angular-loading-bar', 'ngAnimate'])
    /**
     * ==================================================
     *  App Config
     * ==================================================
     */
    .constant('CONFIG', env)

    /**
     * ==================================================
     *  Intercept every request to templates directory
     * ==================================================
     */
    // .service('preventTemplateCache', [function() {
    //     var service = this;

    //     service.request = function(config) {
    //         if (config.url.indexOf('templates') !== -1) {
    //             config.url = config.url + '?t=___REPLACE_IN_GULP___'
    //         }
    //         return config;
    //     };
    // }])

    .config(['$httpProvider', function ($httpProvider) {
        // $httpProvider.interceptors.push('preventTemplateCache');

        $httpProvider.interceptors.push([
			'$rootScope',
			'$q',
			'$location',
			'$localStorage',
			function($rootScope, $q, $location, $localStorage)
			{
				return {
					'request': function(config) {
						config.headers = config.headers || {};
						if($localStorage.currentUser) {
							config.headers.Authorization = `Bearer ${$localStorage.currentUser.token}`;
						}

						return config;
					},
					'responseError': function(res) {
						if(res.status === 401 || res.status === 403) {							
							$rootScope.clearAuthToken();

							$location.path('/');
						}

						return $q.reject(res);
					}
				}
			}
		]);
    }])

    /**
     * ==================================================
     *  Global functions
     * ==================================================
     */
    .run([
        '$rootScope',
        '$window',
        '$http',
        'CONFIG',
        '$localStorage',
        function ($rootScope, $window, $http, CONFIG, $localStorage) 
        {
            // keep user logged in after page refresh
            if ($localStorage.currentUser) {
                $rootScope.isLogedIn = true;
                // add jwt token to auth header for all requests made by the $http service
                $http.defaults.headers.common.Authorization = `Bearer ${$localStorage.currentUser.token}`;
            }

            $rootScope.wardBed = function() {
                return [
                    { ward: '06', bed: 8, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 1 }, sortBy: 1 }, // พิเศษ 1 ชั้น 1
                    { ward: '11', bed: 12, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 2 }, sortBy: 2 }, // พิเศษ 2 ชั้น 2
                    { ward: '12', bed: 10, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 3 }, sortBy: 3 }, // พิเศษ 3 ชั้น 3
                    { ward: '02', bed: 30, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 4 }, sortBy: 4 }, // อายุรกรรมหญิง ชั้น 4
                    { ward: '01', bed: 26, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 5 }, sortBy: 5 }, // อายุรกรรมชาย ชั้น 5
                    { ward: '14', bed: 8, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 5 }, sortBy: 6 }, // Stroke Unit ชั้น 5
                    { ward: '18', bed: 24, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 6 }, sortBy: 7 }, // Cohort อาคารอายุรกรรม ชั้น 6
                    { ward: '17', bed: 0, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 6 }, sortBy: 8 }, // IntermediateCare ชั้น 6
                    { ward: '08', bed: 30, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 7 }, sortBy: 9 }, // กุมารเวชกรรม ชั้น 7
                    { ward: '07', bed: 30, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 8 }, sortBy: 10 }, // ศัลยกรรมหญิง ชั้น 8
                    { ward: '10', bed: 30, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 9 }, sortBy: 11 }, // ศัลกรรมชาย ชั้น 9
                    { ward: '00', bed: 30, building: { no: 4, name: 'อาคารผู้ป่วยใน', floor: 10 }, sortBy: 12 }, // จักษุ โสต ศอ นาสิก ชั้น 10
                    { ward: '05', bed: 8, building: { no: 6, name: 'อาคารผู้ป่วยนอก', floor: 3 }, sortBy: 13 }, // วิกฤต (ICU) อาคารผู้ป่วยนอก ชั้น 3
                    { ward: '15', bed: 2, building: { no: 6, name: 'อาคารสิรินคร', floor: 2 }, sortBy: 14 }, // ทารกแรกเกิดวิกฤต (NICU) อาคารสิรินคร ชั้น 2
                    { ward: '13', bed: 10, building: { no: 6, name: 'อาคารสิรินคร', floor: 2 }, sortBy: 15 }, // ทารกแรกเกิดป่วย (SNB) อาคารสิรินคร ชั้น 2
                    { ward: '20', bed: 24, building: { no: 6, name: 'อาคารสิรินคร', floor: 2 }, sortBy: 16 }, // เด็กวิกฤต (PICU) อาคารสิรินคร ชั้น 2
                    { ward: '19', bed: 24, building: { no: 6, name: 'อาคารสิรินคร', floor: 3 }, sortBy: 17 }, // Trauma อาคารสิรินคร ชั้น 3
                    { ward: '09', bed: 30, building: { no: 6, name: 'อาคารสิรินคร', floor: 4 }, sortBy: 18 }, // สูติ-นรีเวชกรรม อาคารสิรินคร ชั้น 4
                    { ward: '04', bed: 8, building: { no: 6, name: 'อาคารสิรินคร', floor: 4 }, sortBy: 19 }, // ห้องคลอด ตึกสิรินคร
                    { ward: '16', bed: 0, building: { no: 99, name: 'เทศบาลฯ', floor: 0 }, sortBy: 20 }, // ตึก HICI ปฐมภูมิ
                    { ward: '21', bed: 50, building: { no: 99, name: 'รพ.สนาม เทศบาลฯ', floor: 0 }, sortBy: 21 }, // Cohort Ward เทศบาลฯ
                ];
            };

            
            $rootScope.sumAdmdate = function(data, totalDate) {
                data.forEach(d => {
                    d.sumBedOcc1 = $rootScope.calculateBedOcc(d.admdate, d.bed.bed, totalDate);

                    d.activeBed1 = $rootScope.calculateActiveBed(d.sumBedOcc1, d.bed.bed);

                    d.sumAdm = d.stat.reduce((sum, st) => {
                        return sum + parseInt(st.admdate);
                    }, 0);

                    d.sumHr = d.stat.reduce((sum, st) => {
                        return sum + parseInt(st.admit_hour);
                    }, 0);

                    d.sumPt = d.stat.length;

                    d.sumBedOcc2 = $rootScope.calculateBedOcc(d.sumAdm, d.bed.bed, totalDate);

                    d.activeBed2 = $rootScope.calculateActiveBed(d.sumBedOcc2, d.bed.bed);
                });

                return data;
            }

            $rootScope.calculateBedOcc = function(sumAdmdate, totalBed, totalDate) {
                return (sumAdmdate*100)/(totalBed*totalDate);
            }

            $rootScope.calculateActiveBed = function(bedOcc, totalBed) {
                return (bedOcc*totalBed)/100;
            }

            $rootScope.showLogin = function() {
                $('#loginForm').modal('show');
            };

            $rootScope.clearAuthToken = function() {
                // remove user from local storage and clear http auth header
                delete $localStorage.currentUser;

                $http.defaults.headers.common.Authorization = '';
                
                $rootScope.isLogedIn = false;
            };

            $rootScope.redirectToIndex = function(route) {
                setTimeout(function (){
                    window.location.href = `${CONFIG.baseUrl}/${route}`;
                }, 2000);
            };
            
            $rootScope.redirectToHome = function() {
                setTimeout(function (){
                    window.location.href = `${CONFIG.baseUrl}/`;
                }, 2000);
            };
        }
    ]);
