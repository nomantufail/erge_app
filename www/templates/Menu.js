/**
 * Created by rao on 21-Jan-16.
 */
angular.module('erge.Menu', [])

.controller('MenuCtrl', function($scope, $state, $localstorage, API, $ionicLoading, ServerRequest, Utils, $ionicHistory) {
    var user_data = $localstorage.getObject('user_data');
    var user_role = user_data.role;
    if (user_role == "BOSS") {
        $scope.user_conscierge = false;
    }
    if (user_role == "CONCIERGE") {
        $scope.user_conscierge = true;
    }

    var roleConscierge;
    // user_data.role
    //var profile_pic=user_data.profile_pic;
    // console.log('user_data ::', user_data);

    $scope.user_profile_pic = API.BASE_URL + 'public/profile_pic/avatar.jpg';
    //console.log('$scope.user_profile_pic ,,', $scope.user_profile_pic)
    $scope.testFun = function() {
        Utils.clearMapsLocations();
    }


    $scope.showProfileView = function() {
        $state.go('app.Profile');
    }
    $scope.showJobsView = function() {
        $state.go('app.jobson');
    }
    $scope.showChangePasswordView = function() {
        $state.go('app.ChangePassword');
    }
    $scope.logout = function() {
        if (!Utils.checkConnection()) {
            Utils.showConnectionDialog();
        } else {
            $ionicLoading.show();
            var user_data = $localstorage.getObject('user_data');
            var sessionToken = user_data.sessiontoken;
            var user_id = user_data.id;
            var params = {
                "user_id": user_id,
                "appToken": API.appToken,
                "sessionToken": sessionToken
            };
            ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'logout', params)
                .success(function(response) {
                    $ionicLoading.hide();
                    if (response.status == "success") {
                        Utils.showToast('Logout successfully', 'short');
                        $ionicHistory.clearHistory();
                        window.localStorage.clear();
                        $state.go('startscreen');
                    } else if (response.status == "error") {
                        if (response.ErrorCode == "1000") {
                            window.localStorage.clear();
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $state.go('startscreen');
                        } else {
                            Utils.showToast('Logout operation not successfull', 'short');
                        }
                    }
                })
                .error(function(response) {
                    $ionicLoading.hide();
                    Utils.showToast('Some error occued ', 'short');
                })
        }
        window.localStorage.clear();
    }

})