app.controller('mainController', ['$scope', '$http', 'CONFIG', function($scope, $http, CONFIG)
{
    $scope.sidebarMenuToggle = function(e) {
        console.log(e);
        $(".nav-link.active").parent().toggleClass('menu-open');
        $(".nav-link.active").siblings().css("display", "none");
        $(".nav-link.active").toggleClass('active');

        $(e.currentTarget).toggleClass('active');
    };
}]);
