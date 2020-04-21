var clientApp = angular.module('clientApp', []);

clientApp.controller('signUpCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.submit = function () {
        if ($scope.userName == null ||
            $scope.password == null ||
            $scope.nickname == null) {
            swal("Oops!", "Please fill all the fields", "error");
        } else {
            var dataToSend = {
                userName: $scope.userName,
                nickname: $scope.nickname,
                password: $scope.password
            };
            
            $http.post('/signUp/submit', dataToSend).success(function (data) {
                swal("Excellent!", "You are now registered", "success");
                
                // Reset fields
                $scope.userName = "";
                $scope.nickname = "";
                $scope.password = "";
            }).error(function (data) {
                swal("Oops!", data, "error");
            });
        }
    };
}]);