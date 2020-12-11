
app.service('AuthService', ['CONFIG', '$http', function(CONFIG, $http) {
    let service = {};

    this.login = function(username, password, callback) {
        return $http.post(`${CONFIG.apiUrl}/login`, { username, password });
    };
}]);