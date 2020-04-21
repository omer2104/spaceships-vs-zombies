var clientApp = angular.module("clientApp", []);

/*
<div class='chat-body clearfix'>
    <div class='header'>
        <small class='text-muted'><span class='glyphicon glyphicon-time'></span>{{message.date | date:"MM/dd/yyyy 'at' h:mma"}}</small>
        <strong ng-if="!message.isMe" class="pull-right primary-font">{{message.displayName}}</strong>
    </div>
    <p>
        {{message.content}}
    </p>
</div>
*/
var messageToAppendHtml = "";
clientApp.controller("whatsappCtrl", ['$scope', '$http', '$window', '$filter', function ($scope, $http, $window, $filter) {
    // Get session info from the server
    $scope.inSession = false;
    $scope.sessionName = "";
    $scope.sessionUserName = "";
    $http.get('/users/session').success(function (data) {
        $scope.inSession = true;
        $scope.sessionName = data.displayName;
        $scope.sessionUserName = data.userName;
    });

    $scope.logOut = function () {
        $http.get('/logout').success(function () {
            $window.location.href = '/';
        });
    };

    // Load messages
    $scope.messages = [];

    $http.get('/whatsapp/messages').success(function (data) {
        $scope.messages = data;
    });

    $scope.addMessage = function () {
        var dataToSend = {
            "content": $scope.content
        };
        $http.post('/whatsapp/messages/add', dataToSend).success(function (data) {
            $scope.content = "";
        }).error(function () {
            alert("error");
        });
    };

    var es = new EventSource('/whatsapp/events/');
    es.onmessage = function (event) {
        var message = JSON.parse(event.data);

        var messageElement = $("<div class='chat-body clearfix'></div>");
        var messageHeader = $("<div class='header'></div>");
        var messageDate = $("<small class='text-muted'></small>");

        // Add the date
        $(messageDate).append("<span class='glyphicon glyphicon-time'></span>");
        var dateString = $filter('date')(message.date, "MM/dd/yyyy 'at' h:mma");
        $(messageDate).append(dateString);

        // If i sent the message
        if (message.userName == $scope.sessionUserName) {
            // Add me class to messageElement
            $(messageElement).addClass("me");
        } else { // If others sent the message
            // Add messanger name to the header
            var name = $('<strong class="pull-right primary-font">' + message.displayName + '</strong>');
            $(messageHeader).append(name);

            // Add others class to messageElement
            $(messageElement).addClass("others");
        }

        // Add date to header
        $(messageHeader).prepend(messageDate);

        // Add header and content to messageElement
        $(messageElement).append(messageHeader);
        $(messageElement).append('<p>' + message.content + '</p>');

        // Add the message to the chat
        $('#messagesDiv').prepend('<br />');
        $('#messagesDiv').prepend(messageElement);
    };
    
    // Add pressing enter will send the message
    $scope.keyUp = function(keyEvent) {
        if (keyEvent.keyCode == 13) {
            $scope.addMessage();
        }
    };
}]);