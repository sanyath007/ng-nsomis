(function (window) {
    window.__env = window.__env || {};
    /** 
        * Main env 
    */
    // API url
    window.__env.apiUrl = 'http://localhost/public_html/slim3-nsomis-api/public/';

    // Base url
    window.__env.baseUrl = window.location.protocol+ '//' +window.location.host+ '/public_html/ng-nsomis/';

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