app.controller('mainController', [
    '$rootScope',
    '$scope',
    '$http',
    'CONFIG',
    'AuthService',
    '$localStorage',
    'toaster',
    function($rootScope, $scope, $http, CONFIG, AuthService, $localStorage, toaster)
{
    $scope.signinUser = {
        username: 'sanyath',
        password: '0810736804'
    }

    $scope.sidebarMenuToggle = function(e) {
        console.log(e);
        $(".nav-link.active").parent().toggleClass('menu-open');
        $(".nav-link.active").siblings().css("display", "none");
        $(".nav-link.active").toggleClass('active');

        $(e.currentTarget).toggleClass('active');
    };

    $scope.login = function(e) {
        e.preventDefault();

        let { username, password } = $scope.signinUser;

        AuthService.login(username, password)
        .then(res => {
            // store username and token in local storage to keep user logged in between page refreshes
            $localStorage.currentUser = { username: username, token: res.data.token };
            // set isLogin status is true 
            $rootScope.isLogedIn = true;

            toaster.pop('success', "", 'เข้าสู่ระบบสำเร็จ !!!');
            // hide login form modal
            $('#loginForm').modal('hide');
        }, err => {
            console.log(err)
            toaster.pop('error', "", 'ไม่สามารถเข้าสู่ระบบได้ !!!');
        });
    };

    $scope.logout = function(e) {
        e.preventDefault();

        $rootScope.clearAuthToken();
    }
}]);
