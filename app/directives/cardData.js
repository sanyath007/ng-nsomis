
app.directive('cardData', function(){
    return {
        restrict:'E',
        templateUrl: './templates/directives/card-data.html',
        link: (scope, el, attr) => {
            if(attr.data) {
                scope.data = scope.$eval(attr.data);
            }
        }
    }
});
