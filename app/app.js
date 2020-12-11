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

var app = angular.module('App', ['ngRoute', 'ngStorage', 'toaster'])
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

    // .config(['$httpProvider',function ($httpProvider) {
    //     $httpProvider.interceptors.push('preventTemplateCache');
    // }])

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
    ])
    /**
     * ==================================================
     *  Filter
     * ==================================================
     */
    .filter('thdate', ['$filter', function($filter)
    {
        return function(input)
        {
            if(input == null){ return ""; } 

            var arrDate = input.split('-');
            var thdate = arrDate[2]+ '/' +arrDate[1]+ '/' +(parseInt(arrDate[0])+543);

            return thdate;
        };
    }]);
