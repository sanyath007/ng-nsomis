/**
 * ==================================================
 *  Filter
 * ==================================================
 */
app.filter('dbdate', ['$filter', function($filter)
{
    return function(input) {
        if(input == null){ return ""; }
        
        var arrDate = input.split('/');
        var dbdate = (parseInt(arrDate[2])-543)+ '-' +arrDate[1]+ '-' +arrDate[0];

        return dbdate;
    };
}]);