/**
 * ==================================================
 *  Filter
 * ==================================================
 */
app.filter('thdate', ['$filter', function($filter)
{
    return function(input) {
        if(input == null){ return ""; } 

        var arrDate = input.split('-');
        var thdate = arrDate[2]+ '/' +arrDate[1]+ '/' +(parseInt(arrDate[0])+543);

        return thdate;
    };
}]);
