
app.service('AuthService', ['CONFIG', '$http', function(CONFIG, $http) {
    let service = {};

    this.login = function(username, password, callback) {
        $http.post(`${CONFIG.apiUrl}/login`, { username, password })
        .then(res => {
            console.log(res)
        }, err => {
            console.log(err)
        });
    };
}]);