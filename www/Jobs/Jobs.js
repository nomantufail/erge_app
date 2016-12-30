angular.module('erge.Jobs', [])
    //////////////////////////////////////////////////////////JobsCtrl Controller  start//////////////////////////////////////////////////////////////
    .controller('JobsCtrl', function($scope, $state, $localstorage, ServerRequest, API, $ionicLoading, Utils, MyHttpRequest) {
        $scope.boss = true;
        //$scope.jobs_ongoing = [];
        //$scope.onEmptyActive = false;

        $scope.goToJobDetail_new = function() {
            $state.go('app.ActiveJob_new', { data: {} });
        };
        $scope.$on("$ionicView.enter", function() {
            $scope.onerror = false;
            //$scope.jobs_ongoing = [];
            $scope.user_data = $localstorage.getObject('user_data');
            $scope.user_role = user_data.role;
            if ($scope.user_role == "BOSS") {
                $scope.boss = true;
                if (!Utils.checkConnection()) {
                    Utils.showConnectionDialog();

                } else {
                    $ionicLoading.show();
                    var params = {
                        "appToken": API.appToken,
                        "sessionToken": $scope.user_data.sessiontoken,
                        "user_id": $scope.user_data.id
                    };
                    MyHttpRequest("bossJobHistory", 'POST', params, true, true).then(function(response) {
                        $ionicLoading.hide();
                        console.log(response);
                        if (response != null) {
                            if (response.status == "success") {
                                $scope.onerror = false;
                                console.log("response.Data", response);

                                $scope.jobs_on = response.Data.jobson;
                                $scope.jobs_completed = response.Data.completedjobs;
                                $scope.jobs_pending = response.Data.unassignedjobs;

                                $scope.jobson_count = $scope.jobs_on.length;
                                $scope.finishedJobs_count = $scope.jobs_completed.length;
                                $scope.pendingJobs_count = $scope.jobs_pending.length;

                                if ($scope.jobs_on.length < 1) {
                                    $scope.jobson_count = $scope.jobs_on.length;
                                    //console.log('$scope.jobs_on.length', $scope.jobs_on.length)
                                    $scope.onEmptyActive = true;
                                } else {
                                    $scope.jobson_count = $scope.jobs_on.length;
                                    //console.log('$scope.jobs_on.length', $scope.jobs_on.length)
                                    $scope.onEmptyActive = false;
                                }

                                if ($scope.jobs_completed.length < 1) {
                                    $scope.onEmptyComplete = true;
                                } else {
                                    $scope.onEmptyComplete = false;
                                }

                                if ($scope.jobs_pending.length < 1) {
                                    $scope.onEmptyPending = true;
                                } else {
                                    $scope.onEmptyPending = false;
                                }
                            } else if (response.status == "error") {
                                $scope.onerror = true;
                                if (response.ErrorCode == "1000") {
                                    Utils.sessionErrorDialouge();
                                } else {
                                    Utils.showToast('error in getting jobs', 'short');
                                }
                                //console.log(response);
                            }
                        } else {
                            Utils.showNetworkProblemDialog();
                        }
                    });

                    /*ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'bossJobHistory', params)
                     .success(function (response) {
                     $ionicLoading.hide();
                     console.log(response)
                     if (response.status == "success") {
                     $scope.onerror = false;
                     console.log("response.Data", response);

                     $scope.jobs_on = response.Data.jobson;
                     $scope.jobs_completed = response.Data.completedjobs;
                     $scope.jobs_pending = response.Data.unassignedjobs;

                     $scope.jobson_count = $scope.jobs_on.length;
                     $scope.finishedJobs_count = $scope.jobs_completed.length;
                     $scope.pendingJobs_count = $scope.jobs_pending.length;

                     if ($scope.jobs_on.length < 1) {
                     $scope.jobson_count = $scope.jobs_on.length;
                     //console.log('$scope.jobs_on.length', $scope.jobs_on.length)
                     $scope.onEmptyActive = true;
                     } else {
                     $scope.jobson_count = $scope.jobs_on.length;
                     //console.log('$scope.jobs_on.length', $scope.jobs_on.length)
                     $scope.onEmptyActive = false;
                     }

                     if ($scope.jobs_completed.length < 1) {
                     $scope.onEmptyComplete = true;
                     } else {
                     $scope.onEmptyComplete = false;
                     }

                     if ($scope.jobs_pending.length < 1) {
                     $scope.onEmptyPending = true;
                     }
                     else {
                     $scope.onEmptyPending = false;
                     }
                     }
                     else if (response.status == "error") {
                     $scope.onerror = true;
                     if (response.ErrorCode == "1000") {
                     Utils.sessionErrorDialouge();
                     }
                     else {
                     Utils.showToast('error in getting jobs', 'short');
                     }
                     //console.log(response);
                     }
                     })
                     .error(function (response) {
                     console.log(response)
                     $scope.onerror = true;
                     $ionicLoading.hide();
                     Utils.showToast('Some error occued while getting jobs, try gain', 'short');
                     })*/
                }
            }
            if ($scope.user_role == "CONCIERGE") {
                $scope.boss = false;
                if (!Utils.checkConnection()) {
                    Utils.showConnectionDialog();
                } else {
                    $ionicLoading.show();
                    var params = {
                        "appToken": API.appToken,
                        "sessionToken": $scope.user_data.sessiontoken,
                        "user_id": $scope.user_data.id
                    };
                    ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'conciergeJobHistory', params)
                        .success(function(response) {
                            $ionicLoading.hide();
                            if (response.status == "success") {
                                $scope.jobs_on = response.Data.jobson;
                                $scope.jobs_completed = response.Data.completedjobs;
                                $scope.jobson_count = $scope.jobs_on.length;
                                $scope.finishedJobs_count = $scope.jobs_completed.length;
                                if ($scope.jobs_on.length < 1) {
                                    $scope.onEmptyActive = true;
                                }

                                if ($scope.jobs_completed.length < 1) {
                                    $scope.onEmptyComplete = true;
                                }
                            } else if (response.status == "error") {
                                $scope.onerror = true;
                                if (response.ErrorCode == "1000") {
                                    Utils.sessionErrorDialouge();
                                } else {
                                    Utils.showToast('error in getting jobs', 'short');
                                }
                                console.log(response);
                            }
                        })
                        .error(function(response) {
                            $scope.onerror = true;
                            $ionicLoading.hide();
                            Utils.showToast('Some error occued while getting jobs, try gain', 'short');
                        })

                }
            }

        })

        $scope.gotoActiveJob = function(item) {
            console.log(item)
            $state.go('app.ActiveJob', { data: item });
        }
        $scope.gotActiveJobList = function() {
            $state.go('app.ActiveJobsList', { data: $scope.jobs_on });
        }
        $scope.completedJobsListView = function() {
            $state.go('app.jobson_completedjobs', { data: $scope.jobs_completed });
        }
        $scope.pendingJobsListView = function() {
            $state.go('app.jobson_pendingjobs', { data: $scope.jobs_pending });
        }
        $scope.goToSinglePendingJobDetailsView = function(item) {
            $state.go('app.singlePendingJonDetails', { data: item });
        }
        $scope.goToSingleCompletedJobDetailsView = function(item) {
            $state.go('app.singleCompletedJonDetails', { data: item });
        }
        $scope.jobs_on = [];
        $scope.jobs_pending = [];
        $scope.jobs_completed = [];

    })
    .controller('SingilePendingJobDetailsCtrl', function($scope, Utils, $stateParams, $ionicPopover, API, ServerRequest, $localstorage, $ionicLoading, $ionicHistory, $state) {
        $scope.PendingJobDetail = $stateParams.data;
        //console.log('$scope.PendingJobDetail ',$scope.PendingJobDetail)
        $scope.ImgViewerDeleteBtn = false;
        console.log('$scope.PendingJobDetail : ', $scope.PendingJobDetail)
        $scope.getStyleForImgViewer = function() {
            if (!$scope.ImgViewerDeleteBtn)
                return { height: '362px' }
        }

        $scope.readOnly = true;
        $scope.rating = {};
        $scope.rating.rate = 0;
        $scope.rating.max = 5;

        $scope.hideHJobDetails = false;
        $scope.applicantsList = []
        $scope.changeJobDetailsShow = function() {
            console.log('changeJobDetailsShow fun', $scope.hideHJobDetails)
            if ($scope.hideHJobDetails == true) {
                $scope.hideHJobDetails = false;
            } else {
                $scope.hideHJobDetails = true;
            }
        }
        $scope.noApplicationFound = false;
        //get interested people list
        $scope.$on("$ionicView.enter", function() {
                $scope.onerror = false;
                //$scope.jobs_ongoing = [];
                $scope.user_data = $localstorage.getObject('user_data');
                if (!Utils.checkConnection()) {
                    Utils.showConnectionDialog();

                } else {
                    var params = {
                        "appToken": API.appToken,
                        "sessionToken": $scope.user_data.sessiontoken,
                        "user_id": $scope.user_data.id,
                        "job_id": $scope.PendingJobDetail.id
                    };
                    ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'fetchApplicants', params)
                        .success(function(response) {
                            $scope.hideLoder = true;
                            console.log(response)
                            if (response.status == "success") {
                                $scope.applicantsList = response.Data;
                                if ($scope.applicantsList.length == 0) {
                                    $scope.noApplicationFound = true;
                                }
                                console.log("response.Data", response);
                            } else if (response.status == "error") {
                                $scope.onerror = true;
                                if (response.ErrorCode == "1000") {
                                    Utils.sessionErrorDialouge();
                                } else {
                                    Utils.showToast('error in getting jobs', 'short');
                                }
                                //console.log(response);
                            }
                        })
                        .error(function(response) {
                            console.log(response)
                            $scope.onerror = true;
                            Utils.showToast('Some error occued while getting jobs, try gain', 'short');
                        })
                }
            })
            /*assign job to conscierge*/
        $scope.assignJobFun = function(canidate_id) {

            $ionicLoading.show();
            var params = {
                "appToken": API.appToken,
                "user_id": $scope.user_data.id,
                "sessionToken": $scope.user_data.sessiontoken,
                "job_id": $scope.PendingJobDetail.id,
                "canidate_id": canidate_id
            };
            ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'assignJob', params)
                .success(function(response) {
                    $ionicLoading.hide();
                    if (response.status == "success") {
                        Utils.showToast('Notification send to concierge', 'short');
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.jobson');
                    } else if (response.status == "error") {
                        if (response.ErrorCode == "1000") {
                            Utils.sessionErrorDialouge();
                        } else if (response.ErrorCode == "1022") {
                            Utils.showToast('This job has already assigned to someone else ', 'short');
                        } else {
                            Utils.showToast('Error in sending notification to concierge', 'short');
                        }

                        console.log(response);

                    }
                })
                .error(function(response) {
                    $ionicLoading.hide();
                    Utils.showToast('Some error occued while getting jobs for you', 'short');
                })
        }

        /*Img viewer popover start*/
        $scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        });
        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popoverImgView = popover;
        });
        $scope.openImageViewerPopover = function(imgUrl) {
            console.log('openImageViewerPopover fun called');
            $scope.image_file_uri = imgUrl;
            $scope.popoverImgView.show();
        };
        $scope.closePopoverimgView = function() {
            $scope.image_file_uri = "";
            $scope.popoverImgView.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popoverImgView.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        /*Img viewer popover end*/
    })
    .controller('SingileCompletedJobDetailsCtrl', function($scope, Utils, $stateParams, $ionicPopover, $state) {
        $scope.CompletedJobDetail = $stateParams.data;
        console.log($scope.CompletedJobDetail);
        $scope.ImgViewerDeleteBtn = false;
        console.log('$scope.PendingJobsList : ', $scope.PendingJobsList)
        $scope.getStyleForImgViewer = function() {
                if (!$scope.ImgViewerDeleteBtn)
                    return { height: '362px' }
            }
            /*rating*/
        $scope.readOnly = true;
        $scope.rating = {};
        $scope.rating.rate = '';
        $scope.rating.single_job_rate = ''
        $scope.rating.max = 5;
        /*Img viewer popover start*/
        $scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        });
        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popoverImgView = popover;
        });
        $scope.openImageViewerPopover = function(imgUrl) {
            console.log('openImageViewerPopover fun called');
            $scope.image_file_uri = imgUrl;
            $scope.popoverImgView.show();
        };
        $scope.closePopoverimgView = function() {
            $scope.image_file_uri = "";
            $scope.popoverImgView.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popoverImgView.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        /*Img viewer popover end*/
        $scope.callNumber = function(number) {
            console.log('call number function called ');
            window.plugins.CallNumber.callNumber(onSuccess, onError, number, true)

            function onSuccess(response) {
                console.log("success Fun :", response)
            }

            function onError(response) {
                console.log("success Fun :", response)
            }
        }
        $scope.sendmessege = function() {
            var userDataForChat = {
                f_name: $scope.CompletedJobDetail.f_name,
                l_name: $scope.CompletedJobDetail.l_name,
                profile_pic: $scope.CompletedJobDetail.profile_pic,
                resciever_id: $scope.CompletedJobDetail.canidate_id
            }
            console.log('sendmessege function called ')
            $state.go('app.chat', { data: userDataForChat });
        }

    })

.controller('PendingJobsListCtrl', function($scope, $state, Utils, $stateParams, $ionicPopover) {
        $scope.PendingJobsList = $stateParams.data;
        $scope.ImgViewerDeleteBtn = false;
        console.log('$scope.PendingJobsList : ', $scope.PendingJobsList)
        $scope.getStyleForImgViewer = function() {
                if (!$scope.ImgViewerDeleteBtn)
                    return { height: '362px' }
            }
            /*Img viewer popover start*/
        $scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        });
        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popoverImgView = popover;
        });
        $scope.openImageViewerPopover = function(imgUrl) {
            console.log('openImageViewerPopover fun called');
            $scope.image_file_uri = imgUrl;
            $scope.popoverImgView.show();
        };
        $scope.closePopoverimgView = function() {
            $scope.image_file_uri = "";
            $scope.popoverImgView.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popoverImgView.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        /*Img viewer popover end*/
        $scope.goToSinglePendingJobDetailsView = function(item) {
            console.log('go to single pending job details view');
            $state.go('app.singlePendingJonDetails', { data: item });
        }

    })
    .controller('ActiveJobsListCtrl', function($scope, Utils, $stateParams, $ionicPopover, $state) {
        $scope.ActiveJobsList = $stateParams.data;

        $scope.ImgViewerDeleteBtn = false;
        $scope.getStyleForImgViewer = function() {
            if (!$scope.ImgViewerDeleteBtn)
                return { height: '362px' }
        }
        console.log('$scope.ActiveJobsList : ', $scope.ActiveJobsList)
            /*Img viewer popover start*/
        $scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        });
        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popoverImgView = popover;
        });
        $scope.openImageViewerPopover = function(imgUrl) {
            console.log('openImageViewerPopover fun called');
            $scope.image_file_uri = imgUrl;
            $scope.popoverImgView.show();
        };
        $scope.closePopoverimgView = function() {
            $scope.image_file_uri = "";
            $scope.popoverImgView.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popoverImgView.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        /*Img viewer popover end*/
        $scope.gotoActiveJob = function(item) {
            console.log(item)
            $state.go('app.ActiveJob', { data: item });
        }
    })
    .controller('completedJobsListCtrl', function($scope, Utils, $stateParams, $ionicPopover, $state) {
        $scope.CompletedJobsList = $stateParams.data;

        $scope.ImgViewerDeleteBtn = false;
        $scope.getStyleForImgViewer = function() {
            if (!$scope.ImgViewerDeleteBtn)
                return { height: '362px' }
        }
        console.log('rating', $scope.CompletedJobsList.rating)
        $scope.readOnly = true;
        $scope.rating = {};
        $scope.rating.rate = $scope.CompletedJobsList.rating;
        $scope.rating.max = 5;

        console.log('$scope.CompletedJobsList : ', $scope.CompletedJobsList)
            /*Img viewer popover start*/
        $scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        });
        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popoverImgView = popover;
        });
        $scope.openImageViewerPopover = function(imgUrl) {
            console.log('openImageViewerPopover fun called');
            $scope.image_file_uri = imgUrl;
            $scope.popoverImgView.show();
        };
        $scope.closePopoverimgView = function() {
            $scope.image_file_uri = "";
            $scope.popoverImgView.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popoverImgView.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        /*Img viewer popover end*/

        $scope.goToSingleCompletedJobDetailsView = function(item) {
            $state.go('app.singleCompletedJonDetails', { data: item });
        }

    })
    //////////////////////////////////////////////////////////JobsCtrl Controller  end//////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////PostJobsCtrl Controller start///////////////////////////////////////////////////////////////////////////
.controller('PostJobsCtrl', function($scope, $state, $ionicPopover, $stateParams, Utils, $ionicLoading, $localstorage, API, $ionicActionSheet, ServerRequest, $ionicHistory, MyHttpRequest) {

        var user_data = $localstorage.getObject('user_data');
        $scope.image_file_uri = '';
        $scope.details_for_postJob = {
            startLocation: $stateParams.data.startlocation,
            endLocation: $stateParams.data.endlocation,
            jobDedcription: '',
            job_price: 0,
            job_radius: 40,
            job_due_date: 'DD-MM-YY',
            job_due_time: '',
            dateTimeForJob: ''
        }
        $scope.LatLongs = {
            start_lat: '',
            start_long: '',
            end_lat: '',
            end_long: ''
        }


        // console.log($scope.details_for_postJob)
        $scope.ImgViewerDeleteBtn = true;
        /*$scope.getStyleForImgViewer = function () {
         if (!$scope.ImgViewerDeleteBtn)
         return {height: '362px'}
         }*/
        $scope.$on("$ionicView.enter", function() {
            Utils.getAddressToLatLong($scope.details_for_postJob.startLocation).then(function(data) {
                $scope.LatLongs.start_lat = data.Latitude;
                $scope.LatLongs.start_long = data.Longitude;
            })
            Utils.getAddressToLatLong($scope.details_for_postJob.endLocation).then(function(data) {
                $scope.LatLongs.end_lat = data.Latitude;
                $scope.LatLongs.end_long = data.Longitude;
            })
        })
        $scope.$watch(function() {
            return $scope.image_file_uri;
        }, function() {
            if ($scope.image_file_uri == "") {
                $scope.chnageCamraIcon = true;
            } else {
                $scope.chnageCamraIcon = false;
            }

        });


        /*upload img function start */
        $scope.showActionsheet = function() {

            $ionicActionSheet.show({
                titleText: 'UPLOAD IMAGE',
                buttons: [
                    { text: '<i class="icon ion-images"></i> OPEN GALERY' },
                    { text: '<i class="icon ion-camera"></i> OPEN CAMERA' },
                ],
                //destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function() {
                    console.log('CANCELLED');
                },
                buttonClicked: function(index) {
                    if (index == 0) {
                        $scope.openImageLibraryFunction();
                        return true;
                    } else if (index == 1)
                        $scope.takeNewPictureFunction();
                    return true;
                },
            });

            $scope.openImageLibraryFunction = function() {
                navigator.camera.getPicture(onSuccess, onFail, {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: false,
                    correctOrientation: true
                });

                function onSuccess(imageURI) {
                    $scope.image_file_uri = imageURI;
                    var res = $scope.image_file_uri.match(/content/g);
                    if (res == "content") {
                        window.FilePath.resolveNativePath($scope.image_file_uri, successCallback, errorCallback);

                        function successCallback(value) {
                            $scope.image_file_uri = value;
                            console.log('img file uri converted , and value is : ', value)
                        }

                        function errorCallback(code, message) {
                            $scope.image_file_uri = "";
                            console.log('error code ', code)
                            console.log('error msg ', message)
                        }
                    }
                    if ($scope.image_file_uri != "") {
                        $scope.openImageViewerPopover();
                    }
                    //Ext.getCmp('profilePicId').setSrc(imageURI);
                    //showLoader();
                    Utils.showToast(imageURI + '==')
                        //me.saveProfilePic(imageURI);
                }

                function onFail(message) {
                    //hideLoader();
                    Utils.showToast(message, 'short');
                    // toastLong("");
                }
            }
            $scope.takeNewPictureFunction = function() {
                // Utils.showToast('takeNewPictureFunction called');
                navigator.camera.getPicture(onSuccess, onFail, {
                    //quality: 100,
                    destinationType: 1,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: false,
                    //encodingType: Camera.EncodingType.JPEG,
                    /*targetWidth: 100,
                     targetHeight: 100,*/
                    //popoverOptions: CameraPopoverOptions,
                    // saveToPhotoAlbum: true,
                    //cameraDirection: 1,
                    correctOrientation: true
                });

                function onSuccess(imageURI) {
                    $scope.image_file_uri = imageURI;
                    $scope.openImageViewerPopover();
                    //Ext.getCmp('profilePicId').setSrc(imageURI);
                    //showLoader();
                    //Utils.showToast(imageURI + '==')
                    //me.saveProfilePic(imageURI);
                }

                function onFail(message) {
                    //hideLoader();
                    Utils.showToast(message, long);
                    // toastLong("");
                }
            }
        }

        //edit description
        // $scope.editorEnabled = true;
        // $scope.isEditable = false;
        // $scope.editbutton = 'Profile_edit_on.png';
        // $scope.editDiscripttion = function() {
        //     if ($scope.isEditable == false) {
        //         $scope.editorEnabled = false;
        //         $scope.isEditable = true;
        //         $scope.editbutton = 'Profile_edit_off.png'
        //     } else {
        //         $scope.editorEnabled = true;
        //         $scope.isEditable = false;
        //         $scope.editbutton = 'Profile_edit_on.png'
        //     }
        // }

        /*upload image function end */
        $scope.postJob = function() {
            // if ($scope.details_for_postJob.startLocation == "") {
            //     Utils.showToast('Select start location', 'short');
            //     return;
            // } else if ($scope.details_for_postJob.startLocation == "") {
            //     Utils.showToast('Select end location', 'short');
            //     return;
            // } 
            if ($scope.details_for_postJob.jobDedcription == "") {
                Utils.showToast('Specify some description for job', 'short');
                return;
            } else if ($scope.details_for_postJob.job_price == 0) {
                Utils.showToast('Specify price for job', 'short');
                return;
            } else if ($scope.details_for_postJob.job_price > 9999 || $scope.details_for_postJob.job_price < 0) {
                Utils.showToast('Specify price for job btween 0 and 9999', 'short');
                return;
            } else if (isNaN($scope.details_for_postJob.job_price)) {
                Utils.showToast('Specify valid price for job', 'short');
                return;
            } else if ($scope.details_for_postJob.job_radius == 0) {
                Utils.showToast('Specify valid job visibility radius', 'short');
                return;
            } else if ($scope.details_for_postJob.job_radius < 1 || $scope.details_for_postJob.job_radius > 50) {
                Utils.showToast('Please select job visibility radius btween 1 and 50', 'short');
                return;
            } else if (isNaN($scope.details_for_postJob.job_radius)) {
                Utils.showToast('Specify valid radiud for job', 'short');
                return;
            }

            // else if ($scope.details_for_postJob.job_due_date == "DD-MM-YY") {
            //     Utils.showToast('Select date for job', 'short');
            //     return;
            // } else if ($scope.details_for_postJob.job_due_time == "") {
            //     Utils.showToast('Select time for job', 'short');
            //     return;

            // }

            /*else if ($scope.details_for_postJob.img == "") {
             Utils.confirmForJostingJobWithoutImg();
             //Utils.showToast('Attach some imge that can help conscierge to understand about job', 'short');
             return;
             }*/
            else {
                if ($scope.LatLongs.start_lat != "" && $scope.LatLongs.start_long != "" && $scope.LatLongs.end_lat != "" && $scope.LatLongs.end_long != "") {

                    // $scope.details_for_postJob.dateTimeForJob = $scope.details_for_postJob.job_due_date + $scope.details_for_postJob.job_due_time;
                    var today = new Date();
                    $scope.details_for_postJob.dateTimeForJob = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
                    //console.log('date unix ::', $scope.details_for_postJob.job_due_date);
                    //console.log('time unix ::', $scope.details_for_postJob.job_due_time);
                    //console.log('date and time unix  ::', $scope.details_for_postJob.dateTimeForJob);


                    if ($scope.image_file_uri == "") {
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
                                    //post button
                                    $scope.createJobWithoutimg();
                                    // console.log(buttonIndex + "");
                                } else if (buttonIndex == 2) {
                                    //uplaod now button
                                    $scope.showActionsheet();
                                    // console.log(buttonIndex + "");
                                }
                            }
                        } else {
                            alert('job can not post by browser');
                        }
                    } else {
                        //post job when img is uploaded
                        $ionicLoading.show();
                        createJobWithImgFun($scope.image_file_uri);
                    }

                } else {
                    Utils.showToast("Error in converting Locations to lat longs", 'short');

                }
            }
        }
        $scope.deleteimgFun = function() {
            $scope.image_file_uri = "";
            $scope.closePopoverimgView();
        }
        $scope.gotoCompletejobView = function() {
            $state.go('app.CompletedJob');
        }
        $scope.showAttachedfile = function() {
            $scope.openImageViewerPopover();
        }

        $scope.closePopover = function() {
            $scope.popover.hide();
        }

        ////////////////////////////////////////////////////////////////////pop up for post job start///////////////////////////////////////////////////////////////////////////
        $scope.popover = $ionicPopover.fromTemplate('Jobs/PostJobPopover.html', {
            scope: $scope
        });
        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('Jobs/PostJobPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });
        $scope.openPostJobPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        ////////////////////////////////////////////////////////////////////pop up for post job end ///////////////////////////////////////////////////////////////////////////
        /*create hin with out img upload function*/
        $scope.createJobWithoutimg = function() {
            $ionicLoading.show();
            var params = {
                "appToken": API.appToken,
                "sessionToken": user_data.sessiontoken,
                "user_id": user_data.id,
                "start_loc": $scope.details_for_postJob.startLocation,
                "dest_loc": $scope.details_for_postJob.endLocation,
                "start_lat": $scope.LatLongs.start_lat,
                "start_long": $scope.LatLongs.start_long,
                "dest_lat": $scope.LatLongs.end_lat,
                "dest_long": $scope.LatLongs.end_long,
                "description": $scope.details_for_postJob.jobDedcription,
                "price": $scope.details_for_postJob.job_price,
                "completion_date": $scope.details_for_postJob.dateTimeForJob,
                "visibility_radius": $scope.details_for_postJob.job_radius,
                "file": $scope.image_file_uri
            };
            MyHttpRequest("createJob", 'POST', params, false, true).then(function(response) {
                $ionicLoading.hide();
                // console.log(response);
                if (response != null) {
                    if (response.status == "success") {
                        Utils.showToast("Job posted successfully", "short");
                        $scope.details_for_postJob = {
                            startLocation: "",
                            endLocation: "",
                            jobDedcription: "",
                            job_price: 0,
                            job_radius: 0,
                            job_due_date: "DD-MM-YY",
                            job_due_time: "",
                            dateTimeForJob: ""
                        }
                        $scope.image_file_uri = "";
                        // $scope.selectedDate = {
                        //     secDate: "",
                        //     secTime: "SELECT TIME",
                        //     secTimeVal: ""
                        // }

                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $localstorage.set('clear_after_post', 1);
                        $state.go('app.Home');
                        //$scope.$broadcast('refresh_map');

                        //Utils.clearMapsLocations();


                    } else if (response.status == "error") {
                        if (response.ErrorCode == "1000") {
                            Utils.sessionErrorDialouge();
                        } else {
                            Utils.showToast('Error in posting job', 'short');
                        }
                        // console.log(response);
                    }
                } else {
                    Utils.showNetworkProblemDialog();
                }
            })


            /*ServerRequest.makeServerRequest('post', 'formData', API.BASE_URL + 'createJob', params)
             .success(function (response) {
             $ionicLoading.hide();
             if (response.status == "success") {
             Utils.showToast("Job posted successfully", "short");
             $ionicHistory.nextViewOptions({
             disableBack: true
             });
             $state.go('app.Home');
             }
             else if (response.status == "error") {
             if (response.ErrorCode == "1000") {
             Utils.sessionErrorDialouge();
             }
             else {
             Utils.showToast('Error in getting jobs for you', 'short');
             }
             console.log(response);
             }
             })
             .error(function (response) {
             $ionicLoading.hide();
             Utils.showToast('error in posting job', 'short');
             })*/
        }

        /*create job function , upload img for job START*/
        function createJobWithImgFun(imageURI) {
            // console.log("createJobFun");
            rr = imageURI;
            var fail = function(error) {
                $ionicLoading.hide();
                console.log(error)
                Utils.showToast('Could not upload image', 'short');
            }
            var win = function(r) {
                    $ionicLoading.hide();
                    var rr = JSON.parse(r.response);
                    if (rr.status == "success") {
                        Utils.showToast("Job posted successfully", "short");

                        $scope.details_for_postJob = {
                            startLocation: "",
                            endLocation: "",
                            jobDedcription: "",
                            job_price: 0,
                            job_radius: 0,
                            job_due_date: "DD-MM-YY",
                            job_due_time: "",
                            dateTimeForJob: ""
                        }
                        $scope.image_file_uri = "";
                        $scope.selectedDate = {
                            secDate: "",
                            secTime: "SELECT TIME",
                            secTimeVal: ""
                        }
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        //$localstorage.set('clear_after_post',1);
                        $localstorage.set('clear_after_post', 1);
                        $state.go('app.Home');
                        //$scope.$broadcast('refresh_map');
                    }
                    if (rr.status == "error") {
                        if (rr.ErrorCode == "1000") {
                            Utils.sessionErrorDialouge();
                        } else {
                            Utils.showToast("job not posted, try again later", "short");
                        }
                    }
                    //$scope.profileData.profile_pic = rr.Data;
                    $scope.$apply();
                    //console.log('pppp', $scope.profileData.profile_pic);
                    //$localstorage.setObject('profile_pic', rr.Data);
                    //console.log(r.response.Data);
                    //$scope.profileData = $scope.image_file_uri;

                    // console.log(rr.Data);
                    // console.log("Code = " + r.responseCode);
                    // console.log("Response = ", r.response);
                    // console.log("Sent = " + r.bytesSent);
                }
                //var options = new FileUploadOptions();
            var options = new FileUploadOptions();

            var headers = {
                Connection: "close"
            };
            // options.withCredentials = true;
            options.fileKey = "file";
            options.headers = headers;
            options.chunkedMode = false;
            //options.mimeType = $scope.post.file.type;
            options.mimeType = "image/jpeg";
            var params = {
                "appToken": API.appToken,
                "sessionToken": user_data.sessiontoken,
                "user_id": user_data.id,
                "start_loc": $scope.details_for_postJob.startLocation,
                "dest_loc": $scope.details_for_postJob.endLocation,
                "start_lat": $scope.LatLongs.start_lat,
                "start_long": $scope.LatLongs.start_long,
                "dest_lat": $scope.LatLongs.end_lat,
                "dest_long": $scope.LatLongs.end_long,
                "description": $scope.details_for_postJob.jobDedcription,
                "price": $scope.details_for_postJob.job_price,
                "completion_date": $scope.details_for_postJob.dateTimeForJob,
                "visibility_radius": $scope.details_for_postJob.job_radius
            };
            options.params = params;
            // console.log(options);
            // console.log(params);
            var ft = new FileTransfer();
            ft.onprogress = function(progressEvent) {
                // console.log(progressEvent.loaded / progressEvent.total);
            };
            ft.upload(imageURI, encodeURI(API.BASE_URL + 'createJob'), win, fail, options);
        }

        /*create job function , upload img for job end*/
        ////////////////////////////////////////////////////////////////////pop up for image viewer start//////////////////////////////////////////////////////////////////////

        $scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        });
        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popoverImgView = popover;
        });
        $scope.openImageViewerPopover = function($event) {
            $scope.popoverImgView.show($event);
        };

        $scope.closePopoverimgView = function() {
            $scope.popoverImgView.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popoverImgView.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        /*pop up for image viewer end*/
        ////////////////////////////////////////////////////////////////////pop up for image viewer End///////////////////////////////////////////////////////////////////////
        /*data picker start*/
        $scope.datePickerDefault = {
            date: 'MMMM-DD-YY'
        }
        $scope.selectedDate = {
            secDate: "",
            secTime: "SELECT TIME",
            secTimeVal: ""
        }
        var temp = new Date();
        temp.setDate(temp.getDate() - 1);
        $scope.datepickerObject = {
            showdate: 'MM-DD-YYYY',
            titleLabel: 'Title',
            todayLabel: 'Today',
            closeLabel: 'Close',
            setLabel: 'Set',
            setButtonType: 'button-assertive',
            todayButtonType: 'button-assertive',
            closeButtonType: 'button-assertive',
            inputDate: new Date(),
            mondayFirst: true,
            templateType: 'popup',
            showTodayButton: 'true',
            modalHeaderColor: 'bar-positive',
            modalFooterColor: 'bar-positive',
            from: temp, //Optional
            to: new Date(2020, 8, 25),
            callback: function(val) {
                datePickerCallback(val);
                console.log(val);
            },
            dateFormat: 'MMMM-dd-yyyy', //Optional
            closeOnSelect: false, //Optional
        };
        var ts = moment(new Date()).unix();
        $scope.selectedDate.secDate = ts;
        var datePickerCallback = function(val) {
            if (typeof(val) === 'undefined') {
                console.log('No date selected');
            } else {
                var ts = moment(val).unix();

                $scope.details_for_postJob.job_due_date = ts;
                $scope.datepickerObject.showdate = moment.unix(ts).format("MMMM-DD-YYYY");
                //$scope.datepickerObject.inputDate= moment.unix(ts).format("MMMM-DD-YYYY");

            }
        };
        /*date picker end*/

        /*time picker start*/

        $scope.timePickerObject = {
            inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
            step: 15,
            format: 12,
            titleLabel: 'SET TIME',
            setLabel: 'SET',
            closeLabel: 'Cancel',
            setButtonType: 'button-assertive',
            closeButtonType: 'button-stable',
            callback: function(val) {
                timePickerCallback(val);
                console.log(val);
            }
        };

        function timePickerCallback(val) {
            if (typeof(val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTime = new Date(val * 1000);
                $scope.selectedDate.secTime = moment(val * 1000).utc().format('hh:mm a');
                $scope.selectedDate.secTimeVal = val;
                //console.log($scope.selectedDate.secTimeVal);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                $scope.details_for_postJob.job_due_time = val;
                /* var hours;
                 if(selectedTime.getUTCHours() >12){
                 hours=selectedTime.getUTCHours()-12;
                 var postFix=" PM";

                 }
                 else{
                 hours=selectedTime.getUTCHours();
                 var postFix=" AM";
                 }
                 var time =hours+':'+selectedTime.getUTCMinutes()+postFix;
                 console.log('time : ',time)*/
            }
        }

        /*time picker end*/
    })
    ////////////////////////////////////////////////////////////////////post job Controller end///////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////ActiveJobCtrl Controller  start///////////////////////////////////////////////////////////////////////////
.controller('ActiveJobCtrl', function($scope, $state, $cordovaGeolocation, $compile, $stateParams, $ionicPopover, API, Utils, $localstorage, $ionicLoading, ServerRequest) {
        $scope.activeJobDetails = $stateParams.data;
        //$scope.activeJobDetails=data;
        console.log(' $scope.activeJobDetails : ', $scope.activeJobDetails);
        $scope.position = {
                startlocation: $scope.activeJobDetails.start_loc,
                endlocation: $scope.activeJobDetails.dest_loc
            }
            /*call function*/
        $scope.callNumber = function() {
            console.log('call number function called ');
            window.plugins.CallNumber.callNumber(onSuccess, onError, $scope.activeJobDetails.mobile_no, true)

            function onSuccess(response) {
                console.log("success Fun :", response)
            }

            function onError(response) {
                console.log("success Fun :", response)
            }
        }
        $scope.sendmessege = function() {
            var userDataForChat = {
                f_name: $scope.activeJobDetails.f_name,
                l_name: $scope.activeJobDetails.l_name,
                profile_pic: $scope.activeJobDetails.profile_pic,
                resciever_id: $scope.activeJobDetails.canidate_id
            }
            console.log('sendmessege function called ')
            $state.go('app.chat_new', { data: userDataForChat });
        }

        /*ratings stars*/
        $scope.readOnly = true;
        $scope.rating = {};
        $scope.rating.rate = $scope.activeJobDetails.rating;
        $scope.rating.max = 5;
        /*Img viewer popover start*/
        $scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        });
        $scope.ImgViewerDeleteBtn = false;
        $scope.getStyleForImgViewer = function() {
                if (!$scope.ImgViewerDeleteBtn)
                    return { height: '362px' }
            }
            // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popoverImgView = popover;
        });
        $scope.openImageViewerPopover = function(imgUrl) {
            console.log('openImageViewerPopover fun called');
            $scope.image_file_uri = imgUrl;
            $scope.popoverImgView.show();
        };
        $scope.closePopoverimgView = function() {
            $scope.image_file_uri = "";
            $scope.popoverImgView.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popoverImgView.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        /*Img viewer popover end*/

        /*complete job function*/
        $scope.jobComplete = function() {

            if (!Utils.checkConnection()) {
                Utils.showConnectionDialog();
            } else {
                $scope.user_data = $localstorage.getObject('user_data');
                if (user_data.role == "BOSS") {
                    $state.go('app.CompletedJob', { data: $scope.activeJobDetails });
                    return;
                    $scope.jobCompleteByBoss();

                }
                if (user_data.role == "CONCIERGE") {
                    $scope.jobCompleteByConscierge();
                }
            }
        }
        $scope.jobCompleteByConscierge = function() {
            console.log('jobCompleteByConscierge function')
            $ionicLoading.show();
            var params = {
                "appToken": API.appToken,
                "sessionToken": $scope.user_data.sessiontoken,
                "user_id": $scope.user_data.id,
                "job_id": $scope.activeJobDetails.id
            };
            ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'conciergeCompleteJob', params)
                .success(function(response) {
                    $ionicLoading.hide();
                    console.log(response)
                    if (response.status == "success") {
                        Utils.showToast('Notification send to boss successfully', 'short');
                        console.log('conciergeCompleteJob api success, and responce is  : ', response);


                    } else if (response.status == "error") {
                        console.log('conciergeCompleteJob api success, and responce is  : ', response);

                        if (response.ErrorCode == "1000") {
                            Utils.sessionErrorDialouge();
                        } else {
                            Utils.showToast('error in sending notofication to boss', 'short');
                        }
                        //console.log(response);
                    }
                })
                .error(function(response) {
                    console.log('conciergeCompleteJob api failure, and responce is  : ', response);
                    $ionicLoading.hide();
                    Utils.showToast('Some error occued while sending notofication to boss', 'short');
                })
        }
        $scope.jobCompleteByBoss = function() {
            console.log('jobCompleteByBoss function')
            $ionicLoading.show();
            var params = {
                "appToken": API.appToken,
                "sessionToken": $scope.user_data.sessiontoken,
                "user_id": $scope.user_data.id,
                "job_id": $scope.activeJobDetails.id
            };
            ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'bossCompleteJob', params)
                .success(function(response) {
                    $ionicLoading.hide();
                    console.log(response)
                    if (response.status == "success") {
                        Utils.showToast('Notification send to concierge successfully', 'short');
                        console.log('bossCompleteJob api success, and responce is  : ', response);


                    } else if (response.status == "error") {
                        console.log('bossCompleteJob api success, and responce is  : ', response);

                        if (response.ErrorCode == "1000") {
                            Utils.sessionErrorDialouge();
                        } else {
                            Utils.showToast('error in getting jobs', 'short');
                        }
                        //console.log(response);
                    }
                })
                .error(function(response) {
                    console.log('conciergeCompleteJob api failure, and responce is  : ', response);
                    $ionicLoading.hide();
                    Utils.showToast('Some error occued while sending notofication to boss', 'short');
                })
        }

        $scope.$on('concierge_completed_job', function(event, data) {
            $scope.role = 'Conscierge';
            $scope.openCompleteJobpopover();
            //$state.go('app.ActiveJob', {data: data})
            console.log('con_res_for_job broadcast recieve :', data)
            $scope.concierge_completed_job = data;
            //$scope.popoverConRes.show();
        });
        ////////////////////////////////////////////////////////////////////complete job popover start///////////////////////////////////////////////////////////////////////////
        $scope.CompleteJobpopover = $ionicPopover.fromTemplate('Jobs/CompleteJobPopover.html', {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('Jobs/CompleteJobPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.CompleteJobpopover = popover;
        });
        $scope.openCompleteJobpopover = function() {
            $scope.CompleteJobpopover.show();
        };
        $scope.closeCompleteJobpopover = function() {
            $scope.CompleteJobpopover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.CompleteJobpopover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        ////////////////////////////////////////////////////////////////////complete job popover  end ///////////////////////////////////////////////////////////////////////////


    })
    //////////////////////////////////////////////////////////////////ActiveJobCtrl Controller  end///////////////////////////////////////////////////////////////////////
    .
controller('completeJobCtrl', function($scope, Utils, $stateParams, $localstorage, $state, $ionicLoading, ServerRequest, API, $ionicPopover, $ionicHistory) {
    $scope.jobDetailsForComplete = $stateParams.data;

    $scope.user_data = $localstorage.getObject('user_data');
    $scope.job = { bonus: 0 };
    $scope.user_role = $scope.user_data.role;
    if ($scope.user_role == "BOSS") {
        console.log('user roll boss')
        $scope.editBonus = false;
        var current_time = new Date().getTime();
        $scope.jobCompleteDuration = Utils.calculateTimeDifference($scope.jobDetailsForComplete.start_date * 1000, current_time)
        console.log('$scope.jobCompleteDuration : ', $scope.jobCompleteDuration)
    } else if ($scope.user_role == "CONCIERGE") {
        $scope.editBonus = true;
        $scope.job.bonus = $scope.jobDetailsForComplete.bonus;
        $scope.jobCompleteDuration = $scope.jobDetailsForComplete.jobCompleteDuration;

    }

    console.log($scope.jobDetailsForComplete);
    $scope.readOnly = true;
    $scope.rating = {};
    $scope.rating.rate = '';
    $scope.rating.max = 5;
    $scope.submitButtonFunction = function() {
        if ($scope.user_role == "BOSS") {
            $scope.completeJobByBossWithPayment();

        } else if ($scope.user_role == "CONCIERGE") {
            $scope.consciergeRateBoss();

        }
    }
    $scope.getStyle = function() {
        if (!$scope.changeHome)
            return { height: '100%' }
    }
    $scope.completeJobByBossWithPayment = function() {
        if (!Utils.checkConnection()) {
            Utils.showConnectionDialog();
        } else if ($scope.rating.rate == "") {
            Utils.showToast('Please rate Concierge ', 'long');
            return;
        } else if ($scope.job.bonus == 0 || $scope.job.bonus > 0) {
            console.log('jobCompleteByBoss function')
            var data = {
                "job_id": $scope.jobDetailsForComplete.id,
                "rating": $scope.rating.rate,
                "bonus": $scope.job.bonus,
                "jobCompleteDuration": $scope.jobCompleteDuration,
                "jobPrice": $scope.jobDetailsForComplete.price,
            }
            $state.go('app.SelectPaymentMethod', { data: data });
        } else {
            Utils.showToast('Add bonus for this job, it can be in between 0 and 999$ ', 'long');
            return;
        }
    }
    $scope.consciergeRateBoss = function() {
        if (!Utils.checkConnection()) {
            Utils.showConnectionDialog();
        } else if ($scope.rating.rate == "") {
            Utils.showToast('Please rate your Boss ', 'long');
            return;
        } else {
            console.log('concierge rate boss function')
            $ionicLoading.show();
            var params = {
                "appToken": API.appToken,
                "sessionToken": $scope.user_data.sessiontoken,
                "user_id": $scope.user_data.id,
                "rating": $scope.rating.rate,
                "job_id": $scope.jobDetailsForComplete.id,
            };
            ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'consciergeRating', params)
                .success(function(response) {
                    $ionicLoading.hide();
                    console.log(response)
                    if (response.status == "success") {
                        Utils.showToast('Thank you for rate your Boss', 'long');
                        console.log('concierge rate boss api success, and responce is  : ', response);
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.jobson');
                    } else if (response.status == "error") {
                        //console.log('bossCompleteJob api success, and responce is  : ', response);

                        if (response.ErrorCode == "1000") {
                            Utils.sessionErrorDialouge();
                        } else {
                            Utils.showToast('error in rating boss', 'short');
                        }
                        //console.log(response);
                    }
                })
                .error(function(response) {
                    $ionicLoading.hide();
                    console.log('rating your boss api failure, and responce is  : ', response);
                    Utils.showToast('Some error occued while rating boss', 'short');
                })
        }

    }

    $scope.$on('boss_completed_job', function(event, data) {
        $scope.role = 'Boss';
        $scope.openCompleteJobpopover();
        //$state.go('app.CompletedJob', {data: data})
        console.log('con_res_for_job broadcast recieve :', data)
        $scope.concierge_completed_job = data;

        //$scope.popoverConRes.show();

    });

    ////////////////////////////////////////////////////////////////////complete job popover start///////////////////////////////////////////////////////////////////////////
    $scope.CompleteJobpopover = $ionicPopover.fromTemplate('Jobs/CompleteJobPopover.html', {
        scope: $scope
    });

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('Jobs/CompleteJobPopover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.CompleteJobpopover = popover;
    });
    $scope.openCompleteJobpopover = function() {
        $scope.CompleteJobpopover.show();
    };
    $scope.closeCompleteJobpopover = function() {
        $scope.CompleteJobpopover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.CompleteJobpopover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });
    ////////////////////////////////////////////////////////////////////complete job popover  end ///////////////////////////////////////////////////////////////////////////

})

.controller('SelectPaymentMethodCtrl', function($scope, Utils, $stateParams, $localstorage, $state, $ionicLoading, ServerRequest, API, $ionicHistory, MyHttpRequest) {
        $scope.jobDetailsForComplete = $stateParams.data;
        console.log('details for compete job ', $scope.jobDetailsForComplete);
        /* {job_id: 78, rating: 3, bonus: "3", jobCompleteDuration: "4 D : 14 H : 43 M : 49 S"}*/
        $scope.totalAmmount = $scope.jobDetailsForComplete.bonus + $scope.jobDetailsForComplete.jobPrice;

        var bonus = parseInt($scope.jobDetailsForComplete.bonus);
        var jobPrice = parseInt($scope.jobDetailsForComplete.jobPrice);
        $scope.totalAmmount = bonus + jobPrice;
        console.log('totalAmmount : ', $scope.totalAmmount)

        $scope.payViaCreditCard = function() {
            $state.go('app.payViaCreditCard', { data: $scope.jobDetailsForComplete })
        }
        $scope.payWithPayPal = function() {

        }
        var app = {
            // Application Constructor
            initialize: function() {
                this.bindEvents();
            },
            // Bind Event Listeners
            //
            // Bind any events that are required on startup. Common events are:
            // 'load', 'deviceready', 'offline', and 'online'.
            bindEvents: function() {
                document.addEventListener('deviceready', this.onDeviceReady, false);
            },
            // deviceready Event Handler
            //
            // The scope of 'this' is the event. In order to call the 'receivedEvent'
            // function, we must explicity call 'app.receivedEvent(...);'
            onDeviceReady: function() {
                app.receivedEvent('deviceready');
            },
            // Update DOM on a Received Event
            receivedEvent: function(id) {
                /* var parentElement = document.getElementById(id);
                 var listeningElement = parentElement.querySelector('.listening');
                 var receivedElement = parentElement.querySelector('.received');

                 listeningElement.setAttribute('style', 'display:none;');
                 receivedElement.setAttribute('style', 'display:block;');

                 console.log('Received Event: ' + id);*/

                // start to initialize PayPalMobile library
                app.initPaymentUI();
            },

            initPaymentUI: function() {
                var clientIDs = {
                    "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
                    "PayPalEnvironmentSandbox": "ARwTlsp-1Us2c4sEomoKkpfxbmflKIBMcB6dngdehB46W7MWyAfE_mbMwVxKNsaVskEgmeTdtCYawkeR"
                };
                PayPalMobile.init(clientIDs, app.onPayPalMobileInit);
            },
            onSuccesfulPayment: function(payment) {
                console.log('payment: ', payment);
                console.log("payment success: " + JSON.stringify(payment, null, 4));
                console.log('transection id ', payment.response.id)
                console.log('transection state ', payment.response.state)
                if (payment.response.state == "approved") {
                    $ionicLoading.show();
                    var user_data = $localstorage.getObject('user_data');
                    var params = {
                        "user_id": user_data.id,
                        "payment_method": 'paypal',
                        "payPalTransectionId": payment.response.id,
                        "appToken": API.appToken,
                        "sessionToken": user_data.sessiontoken,
                        "job_id": $scope.jobDetailsForComplete.job_id,
                        "rating": $scope.jobDetailsForComplete.rating,
                        "bonus": $scope.jobDetailsForComplete.bonus,
                        "jobCompleteDuration": $scope.jobDetailsForComplete.jobCompleteDuration
                    };
                    MyHttpRequest("bossCompleteJob", 'POST', params, true, true).then(function(response) {
                        $ionicLoading.hide();
                        console.log(response);
                        if (response != null) {
                            if (response.status == "success") {
                                Utils.showToast('Notification send to concierge successfully', 'long');
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('app.jobson');
                                console.log('bossCompleteJob api success, and responce is  : ', response);
                            } else if (response.status == "error") {
                                Utils.onErrorCompleteJobDialouge();
                            }
                        } else {
                            Utils.onErrorCompleteJobDialouge();
                        }
                    })
                }


            },
            onAuthorizationCallback: function(authorization) {
                console.log("authorization: " + JSON.stringify(authorization, null, 4));
            },
            createPayment: function() {
                // for simplicity use predefined amount
                // optional payment details for more information check [helper js file](https://github.com/paypal/PayPal-Cordova-Plugin/blob/master/www/paypal-mobile-js-helper.js)
                var paymentDetails = new PayPalPaymentDetails($scope.totalAmmount, "0.00", "0.00");
                var payment = new PayPalPayment($scope.totalAmmount, "USD", "Job Payment", "Sale", paymentDetails);
                var user_data = $localstorage.getObject('user_data');
                var job_details = {
                    "user_id": user_data.id,
                    "job_id": $scope.jobDetailsForComplete.job_id,
                    "rating": $scope.jobDetailsForComplete.rating,
                    "bonus": $scope.jobDetailsForComplete.bonus,
                    "jobCompleteDuration": $scope.jobDetailsForComplete.jobCompleteDuration
                };
                console.log('job details send with paypal ', job_details);
                payment.custom = job_details;
                return payment;

            },
            configuration: function() {
                // for more options see `paypal-mobile-js-helper.js`
                var config = new PayPalConfiguration({
                    merchantName: "ERGE",
                    merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
                    merchantUserAgreementURL: "https://mytestshop.com/agreement"
                });
                return config;
            },
            onPrepareRender: function() {
                // buttons defined in index.html
                //  <button id="buyNowBtn"> Buy Now !</button>
                //  <button id="buyInFutureBtn"> Pay in Future !</button>
                //  <button id="profileSharingBtn"> ProfileSharing !</button>
                var buyNowBtn = document.getElementById("buyNowBtn");
                /* var buyInFutureBtn = document.getElementById("buyInFutureBtn");
                 var profileSharingBtn = document.getElementById("profileSharingBtn");*/

                buyNowBtn.onclick = function(e) {
                    // single payment
                    PayPalMobile.renderSinglePaymentUI(app.createPayment(), app.onSuccesfulPayment, app.onUserCanceled);
                };

                /*buyInFutureBtn.onclick = function(e) {
                 // future payment
                 PayPalMobile.renderFuturePaymentUI(app.onAuthorizationCallback, app.onUserCanceled);
                 };*/

                /*profileSharingBtn.onclick = function(e) {
                 // profile sharing
                 PayPalMobile.renderProfileSharingUI(["profile", "email", "phone", "address", "futurepayments", "paypalattributes"], app.onAuthorizationCallback, app.onUserCanceled);
                 };*/
            },
            onPayPalMobileInit: function() {
                // must be called
                // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
                PayPalMobile.prepareToRender("PayPalEnvironmentSandbox", app.configuration(), app.onPrepareRender);
            },
            onUserCanceled: function(result) {
                console.log(result);
            }
        };

        app.initialize();

    })
    .controller('PayViaCreditCardCtrl', function($scope, Utils, $stateParams, $localstorage, $state, $ionicLoading, ServerRequest, API, $ionicHistory, MyHttpRequest) {
        console.log('pay via credit card controller')
        $scope.jobDetailsForComplete = $stateParams.data;
        /* var data={
         "job_id": $scope.jobDetailsForComplete.id,
         "rating": $scope.rating.rate,
         "bonus": $scope.job.bonus,
         "jobCompleteDuration": $scope.jobCompleteDuration
         }*/
        console.log('$scope.jobDetailsForComplete : ', $scope.jobDetailsForComplete)
        $scope.BankDetails = {
            payment_type: "",
            card_number: "4242424242424242",
            exp_month: "",
            exp_year: "",
            exp_date: "",
            cvc: "",
        }

        /* Date Picker start*/
        $scope.datePickerDefault = {
            date: 'MMMM-DD-YY'
        }
        $scope.selectedDate = {
            secDate: "",
            secTime: "SELECT TIME",
            secTimeVal: ""
        }
        var temp = new Date();
        temp.setDate(temp.getDate() - 1);
        $scope.datepickerObject = {
            showdate: 'MM-DD-YYYY',
            titleLabel: 'Title',
            todayLabel: 'Today',
            closeLabel: 'Close',
            setLabel: 'Set',
            setButtonType: 'button-assertive',
            todayButtonType: 'button-assertive',
            closeButtonType: 'button-assertive',
            inputDate: new Date(),
            mondayFirst: true,
            templateType: 'popup',
            showTodayButton: 'true',
            modalHeaderColor: 'bar-positive',
            modalFooterColor: 'bar-positive',
            from: temp, //Optional
            to: new Date(2020, 8, 25),
            callback: function(val) {
                datePickerCallback(val);
                console.log(val);
            },
            dateFormat: 'MMMM-dd-yyyy', //Optional
            closeOnSelect: false, //Optional
        };
        var ts = moment(new Date()).unix();
        $scope.selectedDate.secDate = ts;
        var datePickerCallback = function(val) {
            if (typeof(val) === 'undefined') {
                console.log('No date selected');
            } else {
                var ts = moment(val).unix();

                $scope.BankDetails.exp_date = ts;
                $scope.datepickerObject.showdate = moment.unix(ts).format("MMMM-DD-YYYY");
            }
        };
        /*complete job using credit card*/

        $scope.completeJobPayingViaCreditCard = function() {
            if (!Utils.checkConnection()) {
                Utils.showConnectionDialog();
            } else {
                console.log($scope.BankDetails.card_number);
                var credit_card_error = Utils.valid_credit_card($scope.BankDetails.card_number);
                if (credit_card_error != "1") {
                    console.log(credit_card_error);
                    Utils.showToast(credit_card_error);
                    return
                } else {
                    if ($scope.BankDetails.cvc.trim() == "" || $scope.BankDetails.cvc.length < 3 || isNaN($scope.BankDetails.cvc) == true) {
                        Utils.showToast("Enter valid CVC", 'short');
                        return;
                    } else if ($scope.BankDetails.exp_date == "") {
                        Utils.showToast("Select Expiry data", 'short');
                        return;
                    } else {
                        console.log($scope.BankDetails.exp_date);
                        var Exp_date = new Date($scope.BankDetails.exp_date * 1000);
                        var Exp_month = Exp_date.getMonth() + 1;
                        var Exp_year = Exp_date.getFullYear();
                        Stripe.setPublishableKey(API.stripe_public_key);
                        $ionicLoading.show();
                        Stripe.createToken({
                            number: $scope.BankDetails.card_number,
                            cvc: $scope.BankDetails.cvc,
                            exp_month: Exp_month,
                            exp_year: Exp_year
                        }, stripeResponseHandler);
                    }
                }
            }

        }
        stripeResponseHandler = function(status, response) {
            if (response.error) {
                $ionicLoading.hide();
                Utils.showToast('Invalid card details', 'long');
                return;

            } else {
                console.log("response.id, stripe token", response.id);
                var user_data = $localstorage.getObject('user_data');
                var user_id = user_data.id;

                var params = {
                    "user_id": user_data.id,
                    "payment_method": 'creditcard',
                    "appToken": API.appToken,
                    "stripe_token": response.id,
                    "sessionToken": user_data.sessiontoken,
                    "job_id": $scope.jobDetailsForComplete.job_id,
                    "rating": $scope.jobDetailsForComplete.rating,
                    "bonus": $scope.jobDetailsForComplete.bonus,
                    "jobCompleteDuration": $scope.jobDetailsForComplete.jobCompleteDuration,
                };
                console.log('parm for save bank details', params);

                MyHttpRequest("bossCompleteJob", 'POST', params, true, false).then(function(response) {
                    $ionicLoading.hide();
                    console.log(response);
                    if (response != null) {
                        if (response.status == "success") {
                            Utils.showToast('Notification send to concierge successfully', 'long');
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.jobson');
                            console.log('bossCompleteJob api success, and responce is  : ', response);
                        } else if (response.status == "error") {
                            if (response.ErrorCode == "1000") {
                                Utils.sessionErrorDialouge();
                            } else {
                                Utils.showToast('error in sending notification', 'short');
                            }
                            //console.log(response);
                        }
                    } else {
                        Utils.showNetworkProblemDialog();
                    }
                })

                /* ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'bossCompleteJob', params)
                 .success(function (response) {
                 $ionicLoading.hide();
                 console.log(response)
                 if (response.status == "success") {
                 Utils.showToast('Notification send to concierge successfully', 'long');
                 $ionicHistory.nextViewOptions({
                 disableBack: true
                 });
                 $state.go('app.jobson');
                 console.log('bossCompleteJob api success, and responce is  : ', response);
                 }
                 else if (response.status == "error") {
                 if (response.ErrorCode == "1000") {
                 Utils.sessionErrorDialouge();
                 }
                 else {
                 Utils.showToast('error in sending notification', 'short');
                 }
                 //console.log(response);
                 }
                 })
                 .error(function (response) {
                 console.log('conciergeCompleteJob api failure, and responce is  : ', response);
                 $ionicLoading.hide();
                 Utils.showToast('Some error occued while sending notofication to concierge', 'short');
                 })*/
            }
        }
    })