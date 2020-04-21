var clientApp = angular.module("clientApp", []);
var titles = ["About the website", "WhatsappHome app", "Our family photos", "Soon to be built"];

var descriptions = [
    "This website represents the work I've (Omer Saar) been doing in BSMH",
    "This is a chat app for everyone who is connected to our wifi",
    "Our family photos throughout the years are displayed here",
    "When I'll think of something good, I'll build it"
];

clientApp.controller("mainCtrl", ['$scope', '$http', function ($scope, $http) {
    var defaultOption = 0;
    var wheel = new wheelnav("wheelDiv");
    wheel.wheelRadius = 150;
    wheel.slicePathFunction = slicePath().DonutSlice;

    // spreader of the wheel
    wheel.spreaderEnable = true;
    wheel.spreaderInTitle = icon.list;
    wheel.spreaderOutTitle = icon.contract;
    wheel.spreaderTitleFont = '100 24px Helvetica';
    wheel.spreaderRadius = 50;
    wheel.colors = colorpalette.oceanfive;
    wheel.sliceHoverTransformFunction = sliceTransform().RotateTitleTransform;
    wheel.sliceSelectedTransformFunction = sliceTransform().MoveMiddleTransform;
    wheel.animatetime = 750;
    wheel.animateeffect = 'linear';
    wheel.initWheel(["About", "WhatsappHome", "Family photos", "Game"]);
    wheel.titleAttr = {
        fill: "#FFF"
    };
    wheel.titleSelectedAttr = {
        fill: "#111"
    };
    wheel.titleHoverAttr = {
        fill: "#111"
    };
    wheel.sliceSelectedAttr = {
        stroke: '#9CF',
        'stroke-width': 4
    };
    wheel.lineSelectedAttr = {
        stroke: '#9CF',
        'stroke-width': 4
    };
    wheel.titleSelectedAttr = {
        fill: '#9CF'
    };

    wheel.navItems[0].navigateFunction = function () {
        $('#optionTitle').html(titles[0]);
        $('#optionDesc').html(descriptions[0]);
    };
    wheel.navItems[1].navigateFunction = function () {
        $('#optionTitle').html(titles[1]);
        $('#optionDesc').html(descriptions[1]);
    };
    wheel.navItems[2].navigateFunction = function () {
        $('#optionTitle').html(titles[2]);
        $('#optionDesc').html(descriptions[2]);
    };
    wheel.navItems[3].navigateFunction = function () {
        $('#optionTitle').html(titles[3]);
        $('#optionDesc').html(descriptions[3]);
    };
    wheel.createWheel();
    wheel.refreshWheel();
    wheel.navigateWheel(defaultOption);
    $('#optionTitle').html(titles[defaultOption]);
    $('#optionDesc').html(descriptions[defaultOption]);

    // Check if there is a current session
    $scope.inSession = false;
    $scope.sessionName = "";
    $http.get('/users/session').success(function (data) {
        $scope.inSession = true;
        $scope.sessionName = data.displayName;
    });

    $scope.signIn = function () {
        var dataToSend = {
            "userName": $scope.userName,
            "password": $scope.password
        };

        $http.post('/login', dataToSend).success(function (data) {
            $scope.inSession = true;
            $scope.sessionName = data;

            // Clear from the screen
            $scope.userName = "";
            $scope.password = "";
        }).error(function (data) {
            swal("Oops!", "The username or password is incorrect!", "error");
        });
    };

    $scope.logOut = function () {
        $http.get('/logout').success(function () {
            $scope.inSession = false;
            $scope.sessionName = "";
        });
    };
}]);