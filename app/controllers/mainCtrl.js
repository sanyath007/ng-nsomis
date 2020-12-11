app.controller('mainController', [
    '$scope',
    '$http',
    'CONFIG',
    'AuthService', 
    function($scope, $http, CONFIG, AuthService)
{
    $scope.isLogedIn = false;

    $scope.sidebarMenuToggle = function(e) {
        console.log(e);
        $(".nav-link.active").parent().toggleClass('menu-open');
        $(".nav-link.active").siblings().css("display", "none");
        $(".nav-link.active").toggleClass('active');

        $(e.currentTarget).toggleClass('active');
    };
    
        
    $scope.login = function(e) {
        e.preventDefault();

        let username = 'sanyath', password = '0810736804';

        AuthService.login(username, password, function() {

        });
    };

    $scope.checkAuth = function() {
        // return 
    }
}]);
