angular.module('erge.services', [])

//http request service...
.service('ServerRequest', function($http) {

    this.makeServerRequest = function(requestType, requestDataFormat, requestUrl, requestData) {
        //console.log('request data : ' , requestData);
        switch (requestType) {
            case 'get':
                {
                    return angular.isUndefined(requestData) ? $http.get(requestUrl) : $http.get(requestUrl, { params: requestData });
                }
            case 'post':
                {
                    if (requestDataFormat == 'json') {
                        requestData = JSON.stringify(requestData);
                        return $http.post(requestUrl, requestData, {
                            headers: { 'Content-type': undefined },
                            withCredentials: false,
                        });
                    } else {
                        return $http.post(requestUrl, requestData, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            transformRequest: function(obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            }
                        });
                    }
                }
            case 'delete':
                {
                    if (requestDataFormat == 'json') {
                        return $http.delete(requestUrl, requestData);
                    } else {
                        return $http.delete(requestUrl, { params: requestData }, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            transformRequest: function(obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            }
                        });
                    }
                }
            case 'update':
                {
                    if (requestDataFormat == 'json') {
                        return $http.put(requestUrl, requestData);
                    } else {
                        return $http.put(requestUrl, requestData, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            transformRequest: function(obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            }
                        });
                    }
                }
        }
    };
    this.sendPostData = function(url, data) {
        return $http({
            withCredentials: false,
            method: 'POST',
            url: url,
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded'
                'Content-type': undefined
            },
            data: data,
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        });
    }

    this.sendGetData = function(url, data) {

        var data = angular.isUndefined(data) ? "" : data;

        return $http({
            method: 'GET',
            url: url,
            params: data
        });
    }
})

.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])

.factory('MyHttpRequest', ['$http', '$q', "$httpParamSerializerJQLike", 'API', function($http, $q, $httpParamSerializerJQLike, API) {
    return function(path, method, data, dataToStringify, maxRetriesFlag) {
        var MAX_REQUESTS = 3,
            counter = 1,
            results = $q.defer(),
            headers = {
                'Content-type': undefined
            };
        //try {
        //  if (navigator.network.connection.type == 'none') {
        //    results.resolve('internet_issue');
        //    return results.promise;
        //  }
        //} catch (error) {}

        if (dataToStringify) {
            data = JSON.stringify(data);
            console.log(data);
        } else {
            data = $httpParamSerializerJQLike(data);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        //function signOut() {
        //  localStorage['ls.user'] = null;
        //  localStorage['ls.loggedIn'] = false;
        //  localStorage['loggedIn'] = false;
        //  localStorage['ls.credentials'] = null;
        //  localStorage['ls.lastTab'] = 0;
        //  localStorage['ls.currentTab'] = 0;
        //
        //  var options = {
        //    duration: 1.2,
        //    curve: "linear"
        //  };
        //  supersonic.ui.initialView.show();
        //  // redirect to login page
        //  supersonic.data
        //    .channel('login')
        //    .publish({
        //      type: 'sessionExpired'
        //    })
        //}

        var request = function() {
            $http({
                    method: method,
                    url: API.BASE_URL + path,
                    headers: headers,
                    withCredentials: false,
                    data: data,
                })
                .success(function(response) {
                    if (response.Errorcode == 1003) {
                        signOut();
                    }
                    results.resolve(response)
                })
                .error(function(error) {
                    console.log('error');
                    if (counter < MAX_REQUESTS && maxRetriesFlag) {
                        request();
                        counter++;
                    } else {
                        results.resolve(null);
                        return results.promise;
                    }
                });
        };

        request();
        return results.promise;
    }
}])

.factory('Utils', ['$window', '$q', '$rootScope', '$state', '$ionicHistory', function($window, $q, $rootScope, $state, $ionicHistory) {
    return {
        showToast: function(msg, duration) {
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid || isIOS) {
                window.plugins.toast.showWithOptions({
                    message: msg,
                    duration: duration,
                    position: "bottom",
                    addPixelsY: -40 // added a negative value to move it up a bit (default 0)
                });
            } else {
                alert(msg);
            }
        },
        showNetworkProblemDialog: function() {
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid || isIOS) {
                navigator.notification.confirm(
                    'Something went wrong please check your internet connection!',
                    onConfirm,
                    'Network Connection', ['Ok']
                );

                function onConfirm(buttonIndex) {

                }
            }
        },
        checkConnection: function() {
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid || isIOS) {
                var networkState = navigator.connection.type;
                if (networkState == Connection.NONE)
                    return false;
                return true;
            }
            return true;
        },
        showConnectionDialog: function() {
            var isIOS = ionic.Platform.isIOS();
            var self = this;
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid || isIOS) {
                navigator.notification.confirm(
                    'Network connection problem!',
                    onConfirm,
                    'Network Connection', ['Retry', 'Ok']
                );

                function onConfirm(buttonIndex) {
                    if (buttonIndex == 1) {
                        console.log(buttonIndex + "");
                        if (!self.checkConnection()) {
                            self.showConnectionDialog();
                        }
                    }
                }
            }
        },
        sessionErrorDialouge: function() {
            var isIOS = ionic.Platform.isIOS();
            var self = this;
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid || isIOS) {
                navigator.notification.confirm(
                    'This may due to login from other device',
                    onConfirm,
                    'App Session Expired', ['Logout']
                );

                function onConfirm(buttonIndex) {
                    if (buttonIndex == 1) {
                        window.localStorage.clear();
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $state.go('startscreen');
                    }
                }
            } else {
                alert('session expired');
            }
        },
        onErrorCompleteJobDialouge: function() {
            var isIOS = ionic.Platform.isIOS();
            var self = this;
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid || isIOS) {
                navigator.notification.confirm(
                    'Job Completed',
                    onConfirm,
                    'It may take some time to show this job in completed jobs list. so, don\'t worry if you found ', ['OK']
                );

                function onConfirm(buttonIndex) {
                    if (buttonIndex == 1) {
                        $state.go('app.jobson');
                    }
                }
            } else {
                alert('session expired');
            }
        },
        verifyMailSend: function() {
            var isIOS = ionic.Platform.isIOS();
            var self = this;
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid || isIOS) {
                navigator.notification.confirm(
                    'Note: it may went to spam',
                    onConfirm,
                    'A verification code sent to you by mail', ['OK']
                );

                function onConfirm(buttonIndex) {}
            } else {
                alert('mail sent successfully');
            }
        },
        confirmForJostingJobWithoutImg: function() {
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid || isIOS) {
                navigator.notification.confirm(
                    'Are you sure to post job without any image',
                    onConfirm,
                    'No Image Attched', ['POST', 'UPLOAD NOW']
                );

                function onConfirm(buttonIndex) {
                    if (buttonIndex == 1) {

                        console.log(buttonIndex + "");

                    } else if (buttonIndex == 0) {
                        console.log(buttonIndex + "");
                    }
                }
            } else {
                alert('jon can not post by browser');
            }
        },
        validateEmail: function(email) {
            var ereg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            return ereg.test(email);
        },
        isPhone: function(email) {
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid || isIOS)
                return true;
            else
                return false;
        },
        getDevice: function() {
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid()
            if (isAndroid) {
                return 'android';
            } else if (isIOS) {
                return 'ios';
            } else
                return 'browser';

        },
        getLatLongFun: function() {
            var latLongObj = {
                'Latitude': "",
                'Longitude': ""
            }
            var qq = $q.defer();
            navigator.geolocation.getCurrentPosition(onSuccess = function(position) {
                latLongObj.Latitude = position.coords.latitude;
                latLongObj.Longitude = position.coords.longitude;
                qq.resolve(latLongObj);
            }, onError = function(error) {
                console.log('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            });
            return qq.promise;
        },
        valid_credit_card: function(value) {
            console.log(value);
            var error = "1";
            var illegalChars = /\W/; // allow letters, numbers, and underscores
            var visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
            var amex = new RegExp("^3[47][0-9]{13}$");
            var mastercard = new RegExp("^5[1-5][0-9]{14}$");
            var lengthFlag = false;
            if (value == "") {
                return error = "Enter valid card number";
            }
            if (visa.test(value))
                lengthFlag = true;
            else if (amex.test(value))
                lengthFlag = true;
            else if (mastercard.test(value))
                lengthFlag = true;
            if (!lengthFlag)
                return error = "Credit card number is invalid";
            if (illegalChars.test(value)) {
                return error = "Credit card number contain illegal characters";
            } else {
                return error;
            }
        },
        getAddressToLatLong: function(value) {
            var latLongObj = {
                'Latitude': "",
                'Longitude': ""
            }
            var qq = $q.defer();
            var geocoder = new google.maps.Geocoder();
            var address = value;
            geocoder.geocode({ 'address': address }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    latLongObj.Latitude = results[0].geometry.location.lat();
                    latLongObj.Longitude = results[0].geometry.location.lng();
                    qq.resolve(latLongObj);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            }, onError = function(error) {
                console.log('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            });
            return qq.promise;
        },
        getLatLongToAddress: function(value) {
            var address;
            var qq = $q.defer();
            var geocoder = new google.maps.Geocoder();

            var latlngStr = value.split(',', 2);
            var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
            geocoder.geocode({ 'location': latlng }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    // console.log(results[1]);
                    // console.log(latlng);

                    if (results[1]) {
                        var p = results[1].formatted_address;
                        qq.resolve(p);
                        console.log(results[1].formatted_address);
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
            return qq.promise;
        },
        getRegId: function() {
            var qq = $q.defer();
            $rootScope.push = PushNotification.init({
                android: {
                    senderID: "348849149264",
                    //forceShow: true,
                    icon: 'img/erge-icon.png',
                    sound: true,
                    vibrate: true
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                },
                windows: {}
            });
            $rootScope.push.on('notification', function(data) {
                console.log('$rootScope.push from services');
                console.log(data.message);
                //console.log(data.title);
                //console.log(data.count);
                console.log(data.sound);
                //console.log(data.image);
                console.log(data.additionalData);
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData

                console.log('push notification recieved');
                console.log(data);
                //console.log(JSON.stringify(data))
                var type = data.additionalData.payload.user_details.type;
                var user_details = data.additionalData.payload.user_details;
                if (type == "cons_app") {
                    console.log("user_details ::", user_details);
                    var data = {
                        application_description: user_details.application_description,
                        bio: user_details.bio,
                        f_name: user_details.f_name,
                        l_name: user_details.l_name,
                        profile_pic: user_details.profile_pic,
                        rating: user_details.rating,
                        job_id: user_details.job_id,
                        canidate_id: user_details.canidate_id
                    }
                    $state.go('app.Home');
                    $rootScope.$broadcast('con_res_for_job', data)
                    console.log('cons_app :');
                } else if (type == "boss_assign_job") {
                    console.log("boss_assign_job notification recieved : ")
                    $state.go('app.ActiveJob', { data: user_details });
                } else if (type == "concierge_completed_job") {
                    $state.go('app.ActiveJob', { data: user_details });
                    $rootScope.$broadcast('concierge_completed_job', user_details);
                    console.log('concierge_completed_job notification recieved');
                    console.log('user_details : ', user_details);
                } else if (type == "boss_completed_job") {
                    $state.go('app.CompletedJob', { data: user_details })
                    $rootScope.$broadcast('boss_completed_job', user_details);
                    console.log('boss_completed_job notification recieved');
                    console.log('user_details : ', user_details);
                } else if (type == "new_job") {
                    console.log('bfore going to home ');
                    $state.go('app.Home');
                    console.log('after going on home ');
                    $rootScope.$broadcast('new_job', user_details);
                    console.log('new job posted ');
                    console.log('user_details : ', user_details);
                } else if (type == "message") {
                    console.log('type == "message"', user_details)
                    var userDataForChat = {
                        f_name: user_details.f_name,
                        l_name: user_details.l_name,
                        profile_pic: user_details.profile_pic,
                        resciever_id: user_details.sender_id
                    }
                    var brodcastdata = {
                        chat_message: user_details.chat_message,
                        created_at: user_details.created_at,
                        f_name: user_details.f_name,
                        l_name: user_details.l_name,
                        message_id: user_details.message_id.toString(),
                        profile_pic: user_details.profile_pic,
                        sender_id: user_details.sender_id,
                        user_type: 0
                    }
                    console.log('bfore going to chat ');
                    $state.go('app.chat', { data: userDataForChat });
                    console.log('after going on chat ');
                    $rootScope.$broadcast('new_message', brodcastdata);
                    console.log('new messege recieve ');
                }
            });
            $rootScope.push.on('error', function(e) { /*e.message*/ });
            $rootScope.push.on('registration', function(data) {
                // data.registrationId
                console.log(data.registrationId);
                //return data.registrationId;
                qq.resolve(data.registrationId);

            });
            /*$rootScope.pushForChat = PushNotification.init({
              android: {
                senderID: "348849149264",
                //forceShow: true,
                icon: 'img/erge-icon.png',
                sound: true,
                vibrate: true
              },
              ios: {
                alert: "true",
                badge: "true",
                sound: "true"
              },
              windows: {}
            });
            $rootScope.pushForChat.on('notification', function (data) {
              console.log('$rootScope.pushForChat from services');
              console.log(data.message);
              //console.log(data.title);
              //console.log(data.count);
              console.log(data.sound);
              //console.log(data.image);
              console.log(data.additionalData);
              // data.message,
              // data.title,
              // data.count,
              // data.sound,
              // data.image,
              // data.additionalData
              console.log('pushForChat notification recieved ');
              console.log(data);
              //console.log(JSON.stringify(data))
              var type = data.additionalData.payload.user_details.type;
              var user_details = data.additionalData.payload.user_details;
              if (type == "message") {
                console.log('type == "message"', user_details)
                var userDataForChat = {
                  f_name: user_details.f_name,
                  l_name: user_details.l_name,
                  profile_pic: user_details.profile_pic,
                  resciever_id: user_details.sender_id
                }
                var brodcastdata = {
                  chat_message: user_details.chat_message,
                  created_at: user_details.created_at,
                  f_name: user_details.f_name,
                  l_name: user_details.l_name,
                  message_id: user_details.message_id.toString(),
                  profile_pic: user_details.profile_pic,
                  sender_id: user_details.sender_id,
                  user_type: 0
                }
                console.log('bfore going to chat ');
                $state.go('app.chat', {data: userDataForChat});
                console.log('after going on chat ');
                $rootScope.$broadcast('new_message', brodcastdata);
                console.log('new messege recieve ');
              }
            });*/

            return qq.promise;
        },
        showImgViewer: function(imgUrl) {

        },
        calculateTimeDifference: function(tstart, tend) {
            var diff = Math.floor((tend - tstart) / 1000),
                units = [
                    { d: 60, l: "S" },
                    { d: 60, l: "M" },
                    { d: 24, l: "H" },
                    { d: 7, l: "D" }
                ];
            var s = '';
            var i = 0;
            while (i < units.length) {
                if (i == 0)
                    s = (diff % units[i].d) + " " + units[i].l + s;
                else
                    s = (diff % units[i].d) + " " + units[i].l + " : " + s;
                diff = Math.floor(diff / units[i].d);
                i++;
            }
            return s;
        },
        clearMapsLocations: function() {
            console.log('clear both location called from utils');
            var end_clear = "end_clear"
            var start_clear = "start_clear"
            $rootScope.$broadcast('myCustomEvent', end_clear);
            $rootScope.$broadcast('myCustomEvent', start_clear);
            $rootScope.$broadcast('clearBothLocatin');

        }
    }
}])

.factory('ImgViewer', ['$ionicPopover', '$scope', function($ionicPopover, $scope) {
    $scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
        scope: $scope
    });
    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popoverImgView = popover;
    });
    return {
        showImgViewer: function(imgUrl) {
            $scope.image_file_uri = imgUrl;
            $scope.popoverImgView.show($event);
        },
        closeImgViewer: function() {
            $scope.popoverImgView.hide();
        }
    }
}])