(function (window) {
  window.__env = window.__env || {};

  /** 
  	* Main env 
  */
  // API url
  window.__env.apiUrl = 'http://dev.your-api.com';

  // Base url
  window.__env.baseUrl = '/';

  // App Name
  window.__env.appName = '';

  // App Version
  window.__env.appVersion = '1.0.0';

  // System Language
  window.__env.sysLang = 'TH';

  // Google Analytics id
  window.__env.ggAnalyticsId = '';

  /** 
  	* Custom env 
  */


  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
}(this));