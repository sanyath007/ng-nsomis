
app.controller('mainController', function($scope, $http, CONFIG) {
    $scope.tabToggle = function(e) {
        $(".nav-link.active").toggleClass('active');
        
        $(e.target).toggleClass('active');
    };
});
