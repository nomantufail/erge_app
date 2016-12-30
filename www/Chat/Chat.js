var hello;
/**
 * Created by rao on 30-Mar-16.
 */
angular.module('erge.Chat', [])

.controller('ActiveChat', function($scope, $localstorage, MyHttpRequest, $ionicLoading, Utils, API, $stateParams, $ionicScrollDelegate, $timeout) {
    $scope.user_data = $localstorage.getObject('user_data');
    $scope.userDataForChat = $stateParams.data;
    $scope.messege = { text: "" }

    /* console.log('document loaded: ', document.getElementsByClassName('lastRow').addEventListener("focus", function(){
     alert('sd');
     }, false));
     $scope.$on('$viewContentLoaded', function(event) {

     console.log('lastrows: ', $('.lastRow'));
     $('.lastRow').trigger('click');

     $('.lastRow').on('click', function(){
     console.log('focus works');
     });

     });*/


    //$ionicScrollDelegate.scrollTop(true);
    /*$timeout(function(){
     var chatBox = document.getElementById('chat-messege');
     chatBox.scrollBottom(chatBox.scrollHeight);
     }, 0);*/
    $scope.$on('new_message', function(event, data) {
        console.log('broadcasr recieved in controler and data is : ', data);

        /*chat_message: "Nothing special"
         created_at: "April-07-2016 05:15 PM"
         f_name: "Boss"
         l_name: "Boss account"
         message_id: 442
         profile_pic: "http://vengiledevs.cloudapp.net/erge/ergeapi/public/profile_pic/56de71b743f87df10bf2988c60bb82ecf6772c3a09b2de337ce2d.jpg"
         receiver_id: "36"
         sender_id: "35"
         type: "message"
         user_type: 1*/
        $scope.messeges.push(data);
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
        console.log("after push messege on broadcast recieve", $scope.messeges)
            /*var obj = {
             chat_message: data.chat_message,
             created_at: data.created_at,
             f_name: data.f_name,
             l_name: data.l_name,
             message_id:data.message_id ,
             profile_pic: data.profile_pic,
             sender_id: data.sender_id,
             type: data.type
             }
             $scope.messeges[$scope.messeges.length]=obj;*/
    });
    $scope.scrollMsgsUp = function() {
        console.log('dcsdcdscd')
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
    }

    console.log('active chat controller resciever_id : ', $scope.resciever_id);
    $scope.messeges = [];
    $scope.$on("$ionicView.enter", function() {
        if (!Utils.checkConnection()) {
            Utils.showConnectionDialog();
        } else {
            $ionicLoading.show();
            var params = {
                "appToken": API.appToken,
                "sessionToken": $scope.user_data.sessiontoken,
                "user_id": $scope.user_data.id,
                "fan_id": $scope.userDataForChat.resciever_id,
                "page_id": 1
                    //"fan_id": 36
            };
            MyHttpRequest("viewMessages", 'POST', params, true, true).then(function(response) {
                $ionicLoading.hide();
                console.log(response);
                if (response != null) {
                    if (response.status == "success") {
                        console.log("response.Data", response);
                        $scope.messeges = response.Data.messages;
                        $scope.current_page_id = response.current_page_id;
                        $scope.more_messages = response.more_messages;
                        //$ionicScrollDelegate.scrollBottom(true);
                        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
                        //hello= $ionicScrollDelegate.scrollBottom(true);
                        //hello=$ionicScrollDelegate;


                    } else if (response.status == "error") {
                        if (response.ErrorCode == "1000") {
                            Utils.sessionErrorDialouge();
                        } else {
                            Utils.showToast('error in getting your perevious messeges', 'short');
                        }
                        //console.log(response);
                    }
                } else {
                    Utils.showNetworkProblemDialog();
                }
            });
        }

    });
    $scope.getMoreMesseges = function() {
        console.log('$scope.more_messages : ', $scope.more_messages);
        console.log('$scope.current_page_id : ', $scope.current_page_id);

        if ($scope.more_messages == 1) {
            if (!Utils.checkConnection()) {
                Utils.showConnectionDialog();
            } else {
                //$ionicLoading.show();
                var params = {
                    "appToken": API.appToken,
                    "sessionToken": $scope.user_data.sessiontoken,
                    "user_id": $scope.user_data.id,
                    "fan_id": $scope.userDataForChat.resciever_id,
                    "page_id": $scope.current_page_id + 1
                        //"fan_id": 36
                };
                MyHttpRequest("viewMessages", 'POST', params, true, true).then(function(response) {
                    $scope.$broadcast('scroll.refreshComplete');
                    //$ionicLoading.hide();
                    console.log(response);
                    if (response != null) {
                        if (response.status == "success") {
                            console.log("response.Data", response);
                            console.log("response.Data.messages", response.Data.messages);
                            for (var i = 0; i < response.Data.messages.length; i++) {
                                $scope.messeges.unshift(response.Data.messages[i]);
                            }
                            //$scope.messeges.unshift(response.Data.messages);
                            $scope.current_page_id = response.current_page_id;
                            $scope.more_messages = response.more_messages;
                            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
                            //hello= $ionicScrollDelegate.scrollBottom(true);
                            //hello=$ionicScrollDelegate;


                        } else if (response.status == "error") {
                            if (response.ErrorCode == "1000") {
                                Utils.sessionErrorDialouge();
                            } else {
                                Utils.showToast('error in getting your perevious messeges', 'short');
                            }
                            //console.log(response);
                        }
                    } else {
                        Utils.showNetworkProblemDialog();
                    }
                });
            }
        } else {
            Utils.showToast('No more messeges', 'short')
        }
    }
    $scope.sendMessege = function() {
        if ($scope.messege.text == "") {
            Utils.showToast('type some messege to send', 'short');
            return;
        } else {
            var obj = {
                chat_message: $scope.messege.text,
                created_at: "sending ...",
                f_name: "Con",
                l_name: "Conscierge",
                message_id: $scope.messeges.length.toString(),
                profile_pic: "http://vengiledevs.cloudapp.net/erge/ergeapi/public/profile_pic/56eab42e90679df28fde1f0fe34bfc4353707ea3637d609c0c1d5.jpg",
                sender_id: user_data.id.toString(),
                user_type: 1
            }
            $scope.messeges.push(obj); //[$scope.messeges.length]=obj;
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
            var msg = $scope.messege.text;
            $scope.messege.text = "";
            console.log("after push messege without sending", $scope.messeges);
            if (!Utils.checkConnection()) {
                Utils.showConnectionDialog();
            } else {
                //$ionicLoading.show();
                var params = {
                    "appToken": API.appToken,
                    "sessionToken": $scope.user_data.sessiontoken,
                    "user_id": $scope.user_data.id,
                    "receiver_id": $scope.userDataForChat.resciever_id,
                    "chat_message": msg
                };
                console.log('send messege params : ', params);
                MyHttpRequest("sendMessage", 'POST', params, false, true).then(function(response) {
                    //$ionicLoading.hide();
                    console.log(response);
                    if (response != null) {
                        if (response.status == "success") {
                            console.log("response.Data", response.Data);
                            $scope.messeges[$scope.messeges.length - 1] = response.Data;
                            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);

                            console.log(" after push new messege after sending sucessfully ", $scope.messeges)
                            Utils.showToast('Messege send successfully', 'short');
                        } else if (response.status == "error") {
                            if (response.ErrorCode == "1000") {
                                Utils.sessionErrorDialouge();
                            } else {
                                Utils.showToast('error in getting your perevious messeges', 'short');
                            }
                            //console.log(response);
                        }
                    } else {
                        Utils.showNetworkProblemDialog();
                    }
                });
            }


        }
    }
    $scope.dummys = [{
        message: "hi dude!",
        time: "7:00 PM",
        pic: "img/job-img.png",
        message_by: "msg-left",
        name: "Adam Ch."
    }, {
        message: "hi dude!",
        time: "7:00 PM",
        pic: "img/job-img.png",
        message_by: "msg-right",
        name: "Adam Ch."
    }, {
        message: "hi dude!",
        time: "7:00 PM",
        pic: "img/job-img.png",
        message_by: "msg-left",
        name: "Adam Ch."
    }, {
        message: "hi dude!",
        time: "7:00 PM",
        pic: "img/job-img.png",
        message_by: "msg-left",
        name: "Adam Ch."
    }];
    $scope.content = '';
    $scope.dummyMessage = function() {
        if ($scope.content != '') {
            var obj = {
                message: $scope.content,
                time: "7:00 PM",
                pic: "img/job-img.png",
                message_by: "msg-left",
                name: "Adam Ch."
            }
            $scope.content = '';
            $scope.dummys.push(obj);
        } else {
            Utils.showToast('Cannot send empty msg', 'short');
        }

    }

})