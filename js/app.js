
var app = angular.module('App', ['ngRoute']);
/**
 * ==================================================
 *  Intercept every request to templates directory
 * ==================================================
 */
app.service('preventTemplateCache', [function() {
    var service = this;
    service.request = function(config) {
      	if (config.url.indexOf('templates') !== -1) {
        	config.url = config.url + '?t=___REPLACE_IN_GULP___'
      	}
      	return config;
    };
}]);

app.config(['$httpProvider',function ($httpProvider) {
    $httpProvider.interceptors.push('preventTemplateCache');
}]);