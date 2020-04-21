var clientApp = angular.module('clientApp', []);

clientApp.controller('fpCtrl', ['$scope', '$http', function ($scope, $http) {
    $('#gallery').jGallery({ backgroundColor: 'black', textColor: 'white', height: '85vh', canChangeMode: false });
}]);