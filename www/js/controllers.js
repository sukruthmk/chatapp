angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
})

.controller('HomeCtrl', function($scope, $cookieStore, $location, $window) {
    var userObj = $cookieStore.get('obj');
    var roomId = '1194450';
    if(typeof userObj != 'undefined') {
        $window.location.href = '#/rooms/' + roomId;
    }
    $scope.signIn = function(user) {
        var userObj = { 'username' : user};
        $cookieStore.put('obj', userObj);
        $window.location.href = '#/rooms/' + roomId;
    };
})

.controller('RoomCtrl', function($scope, $stateParams, $timeout, $firebase, $location, $ionicScrollDelegate, $cookieStore, $ionicLoading) {
  var messagesRef = new Firebase('https://sweltering-heat-9318.firebaseio.com/rooms/' + $stateParams.roomId);

  $scope.newMessage = "";
  $scope.messagesObj = $firebase(messagesRef);
  var userObj = $cookieStore.get('obj');
  $scope.username = userObj.username;

  $scope.leftButtons = [
    { 
      type: 'button-energized',
      content: '<i class="icon ion-arrow-left-c"></i>',
      tap: function(e) {
        $location.path('/');
      }
    }
  ]

  var scrollBottom = function() {
    // Resize and then scroll to the bottom
    $ionicScrollDelegate.resize();
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom();
    });
  };
  
  $ionicLoading.show({
    template: 'loading'
  })

  $scope.$watch('messagesObj', function (value) {
    var messagesObj = angular.fromJson(angular.toJson(value));
    $timeout(function () {scrollBottom()});
    $scope.messages = [];

    angular.forEach(messagesObj, function (message, key) {
      $scope.messages.push(message);
    });

    if ($scope.messages.length) {
      $ionicLoading.hide();
      loaded = true;
    }
  }, true);
    
  $scope.submitAddMessage = function() {
    $scope.messagesObj.$add({
      created_by: this.username,
      content: this.newMessage,
      created_at: new Date()
    });
    this.newMessage = "";

    scrollBottom();
  };
})