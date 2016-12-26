var home;
angular.module('erge.Home', ['ionic', 'ngCordova', 'google.places'])
  .controller('MapCtrl', function ($rootScope, $ionicHistory, $scope, $cordovaCamera, $state, $cordovaGeolocation, $ionicPopover, $compile, $ionicActionSheet, Utils, $q, $localstorage, $ionicLoading, ServerRequest, API, $ionicPopup) {
    //variables for job details
    home = $cordovaCamera;
    $scope.position = [];


    /* setTimeout(function () {
     var fromField = document.getElementById('fromLocation');
     var autoCompleteFrom = new google.maps.places.Autocomplete(fromField, {
     types: ['geocode']
     });
     google.maps.event.addListener(autoCompleteFrom, 'place_changed', function (aa) {
     console.log(fromField.value);
     });
     }, 1000);*/

    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    console.log('push variable: ', $rootScope.push);
    //$scope.gPlace;
    //console.log($scope.gPlace);
    $scope.$on("$ionicView.enter", function () {

      var clear_after_post = $localstorage.get('clear_after_post');

      if (clear_after_post == 0 || clear_after_post == 'undefined' || clear_after_post == null) {
        console.log('clear_after_post ', clear_after_post);
      } else if (clear_after_post == 1) {
        $scope.jobLocations.startlocation = "";
        $scope.jobLocations.endlocation = "";
        $scope.$broadcast('refresh_map');
        $localstorage.set('clear_after_post', 0);
      }

      $scope.image_file_uri = "";
      // varable for job descriptions
      $scope.jobDescription = {
        text: ''
      };
      $scope.disableImgViewerDeleteBtn = false;
      user_data = $localstorage.getObject('user_data');
      //$scope.changeHome;

      if (user_data.role == "BOSS") {
        $scope.changeHome = true;
        $scope.ImgViewerDeleteBtn = true;

        $ionicLoading.show();
        var params = {
          "appToken": API.appToken,
          "user_id": user_data.id,
          "sessionToken": user_data.sessiontoken,
        };
        ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'bossHomePage', params)
          .success(function (response) {
            $ionicLoading.hide();
            if (response.status == "success") {
              console.log(response);

              $scope.position = response.Data;
              console.log(' $scope.position=response.Data : ', $scope.position)
            }
            else if (response.status == "error") {
              if (response.ErrorCode == "1000") {
                Utils.sessionErrorDialouge();
              }
              else {
                Utils.showToast('Error in getting your jobs', 'short');
              }
              console.log(response);
            }
          })
          .error(function (response) {
            $ionicLoading.hide();
            Utils.showToast('Some error occued while your jobs', 'short');
          })

      }
      if (user_data.role == "CONCIERGE") {
        $scope.ImgViewerDeleteBtn = false;
        $scope.getStyleForImgViewer = function () {
          if (!$scope.ImgViewerDeleteBtn)
            return {height: '362px'}
        }
        $scope.changeHome = false;
        var filter = 'all'
        $scope.getjobsForConscierge(filter);
      }
    })
    $scope.jobLocations = {
      startlocation: "",
      endlocation: "",
    };
    $scope.getjobsForConscierge = function (filter) {
      var filter = filter;
      //console.log('filter ===', filter)
      $ionicLoading.show();
      var params = {
        "appToken": API.appToken,
        "user_id": user_data.id,
        "sessionToken": user_data.sessiontoken,
        "filter": filter
      };
      ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'conciergeHomePage', params)
        .success(function (response) {
          $ionicLoading.hide();
          if (response.status == "success") {
            console.log(response);
            //$localstorage.setObject("JobsForCon", response.Data.jobs);
            $localstorage.set('current_balance', response.Data.current_balance);
            $localstorage.set('requested_amount', response.Data.requested_amount);
            $scope.position = response.Data.jobs;
            //var aaa=$localstorage.get('current_balance');

            /* if($scope.position.length ==0){
             $scope.position=[]
             }*/
            console.log(' $scope.position=response.Data : ', $scope.position)
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
          Utils.showToast('Some error occued while getting jobs for you', 'short');
        })
    }
    console.log($localstorage.get('current_balance'));
    $scope.job_duration = 'all';
    $scope.jobDurationChnaged = function (item) {
      console.log('item ', item)
      $scope.job_duration = item;
      $scope.getjobsForConscierge($scope.job_duration);
    }

    $scope.getStyle = function () {
      if (!$scope.changeHome)
        return {height: '100%'}
    }
    //variable for imege uri
    /* $scope.image_file_uri = "img/flag.jpg";*/
    $scope.image_file_uri = "";
    $scope.deleteimgFun = function () {
      $scope.image_file_uri = "";
      $scope.closePopoverimgView();
    }
    $scope.jobDetails = {
      name: "",
      profile_pic: "",
      descriptoin: "",
      location: "",
      fare: "",
      attachment: "",
      time: ""
    };
    $scope.InterestJobDescription = {
      details: ""
    };
    console.log('cont $scope.position', $scope.position)
    $scope.inform = false;
    $scope.inform = false;
    $scope.showJobDetailView = function () {
      $state.go('app.JobDetail', {id: 1});
    }
    /*location search clear buttons*/

    $scope.clearStartLocation = function () {
      $scope.jobLocations.startlocation = ''
      var start_clear = "start_clear"
      $scope.$parent.$broadcast('myCustomEvent', start_clear);
    }
    $scope.clearEndLocation = function () {
      $scope.jobLocations.endlocation = ''
      var end_clear = "end_clear"
      $scope.$parent.$broadcast('myCustomEvent', end_clear);
    }
    $scope.gotoJobDetailView = function () {
      console.log($scope.jobDescription.text)
      /*if ($scope.image_file_uri == "") {
       Utils.showToast('Attach some imge that can help conscierge to understand about job', 'short');
       return;
       }
       else*/
      if ($scope.jobLocations.startlocation == "") {
        Utils.showToast('Enter job start location', 'short');
        return;
      }
      else if ($scope.jobLocations.endlocation == "") {
        Utils.showToast('Enter job end location', 'short');
        return;
      }
      else if ($scope.jobDescription.text == "") {
        console.log('$scope.jobDescription', $scope.jobDescription);
        Utils.showToast('Specify some description for job', 'short');
        return;
      }
      else if ($scope.jobDescription.text.length > 100) {
        Utils.showToast('Job description is too long', 'short');
        return;
      } else {
        var data = {
          img: $scope.image_file_uri,
          startLocation: $scope.jobLocations.startlocation,
          endLocation: $scope.jobLocations.endlocation,
          jobDedcription: $scope.jobDescription.text
        }

        $state.go('app.JobDetail', {data: data});
      }
    }
    $scope.$watch(function () {
      return $scope.image_file_uri;

    }, function () {
      if ($scope.image_file_uri == "") {
        $scope.chnageCamraIcon = true;
      } else {
        $scope.chnageCamraIcon = false;
      }

    });
    /*img vierer popover*/
    $scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
      scope: $scope
    });
    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popoverImgView = popover;
    });
    $scope.openImageViewerPopover1 = function ($event) {
      $scope.popoverImgView.show($event);
    };
    $scope.openImageViewerPopover = function (imgUrl) {
      console.log('openImageViewerPopover fun called');
      console.log('img url : ', imgUrl)
      $scope.disableDeleteBtn = true;
      $scope.image_file_uri = imgUrl;
      $scope.popoverImgView.show();
    };
    $scope.closePopoverimgView = function () {
      $scope.popoverImgView.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.popoverImgView.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
    });
    /*pop up for image viewer end*/

    /*opopover for conscierge interest in a job start*/

    $scope.popoverConRes = $ionicPopover.fromTemplate('Jobs/confirmConsResponcePopover.html', {
      scope: $scope
    });

    $ionicPopover.fromTemplateUrl('Jobs/confirmConsResponcePopover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popoverConRes = popover;
    });
    $scope.popoverConRes = function ($event) {
      $scope.popoverConRes.show($event);
    };
    $scope.showConResPopOver = function ($event) {
      $scope.popoverConRes.show($event);
    };

    $scope.closePopover = function () {
      $scope.popoverConRes.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.popoverConRes.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
    });
    /*opopover for conscierge interest in a job end*/
    $scope.readOnlycon_res = true;
    $scope.rating_con = {}
    $scope.rating_con.rate = 0;
    $scope.rating_con.max = 5;

    /*jobdetails popup*/
    //$scope.rquestBtnText = "INTERESTED"
    $scope.rquestBtnText = "I want the job"
    $scope.showJobDetailsPopup = function () {
      $scope.myPopup = $ionicPopup.show({
        templateUrl: 'Jobs/JobDetailsPopover.html',
        cssClass: 'job-details-popup',
        scope: $scope
      });
    };
    $scope.closeJobDetailsPopup = function () {
      $scope.InterestJobDescription.details = "";
      $scope.myPopup.close();
      $scope.getjobsForConscierge($scope.job_duration);
    }

    /*interested in new posted job function*/
    $scope.interestedInJob = function () {
      if ($scope.InterestJobDescription.details == "") {
        console.log('InterestJobDescription', $scope.InterestJobDescription.details)
        Utils.showToast('Specify some descriptions for BOSS', 'short');
        return;
      }
      else {
        var user_data = $localstorage.getObject('user_data');
        $ionicLoading.show();
        var params = {
          "appToken": API.appToken,
          "user_id": user_data.id,
          "job_id": $scope.jobDetails.job_id,
          "description": $scope.InterestJobDescription.details,
          "sessionToken": user_data.sessiontoken,
        };
        ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'sendApplication', params)
          .success(function (response) {
            $ionicLoading.hide();
            if (response.status == "success") {
              $scope.InterestJobDescription.details = "";
              console.log(response);
              $scope.closeJobDetailsPopup();
              //$scope.closePopover();
              Utils.showToast('Request send successfully', 'short');
              $scope.getjobsForConscierge($scope.job_duration);
            }
            else if (response.status == "error" && response.ErrorCode == "1012") {
              //$scope.closePopover();
              $scope.closeJobDetailsPopup();
              Utils.showToast("You have already applied to this job", "short");
            }
          })
          .error(function (response) {
            $ionicLoading.hide();
            $scope.closeJobDetailsPopup();
            //$scope.closePopover();
            Utils.showToast('Some error occued while sending request to boss', 'short');
          })
      }
    }

    /*broadcast recieve listner*/
    $scope.$on('clearBothLocatin', function () {
      console.log('clear both broadcast recieved ');
      $scope.jobLocations.startlocation = "";
      $scope.jobLocations.endlocation = "";
    });

    $scope.$on('new_job', function (event, data) {
      $scope.jobDetails = {
        name: data.f_name,
        job_description: data.description,
        job_start_loc: data.start_loc,
        job_end_loc: data.dest_loc,
        price_for_job: data.price,
        job_complete_date: data.completion_date,
        job_complete_time: data.completion_time,
        boss_profile_pic: data.profile_pic,
        job_id: data.id,
        attachment: data.attachment,
        rating: data.rating,
        isApplied: data.applied
      }
      $scope.showJobDetailsPopup();
      console.log('new_job broadcast recieved in controller :', data)
    });
    $scope.$on('concierge_completed_job', function (event, data) {
      $scope.role = 'Concierge';
      $scope.openCompleteJobpopover();
      $state.go('app.ActiveJob', {data: data})
      console.log('con_res_for_job broadcast recieve :', data)
      $scope.concierge_completed_job = data;
      //$scope.popoverConRes.show();
    });
    /*brodcast recieve of conscierge responce for a job start*/
    $scope.$on('con_res_for_job', function (event, data) {
      console.log('con_res_for_job broadcast recieve :', data)
      $scope.con_res_for_job = data;
      /*rating bar for popover */
      $scope.rating_con.rate = $scope.con_res_for_job.rating;
      $scope.popoverConRes.show();
    });


    /*brodcast recieve of conscierge responce for a job start*/
    /*Assign job to conscierge*/
    $scope.assignJobFun = function () {
      $scope.popoverConRes.hide();
      $ionicLoading.show();
      var params = {
        "appToken": API.appToken,
        "user_id": user_data.id,
        "sessionToken": user_data.sessiontoken,
        "job_id": $scope.con_res_for_job.job_id,
        "canidate_id": $scope.con_res_for_job.canidate_id
      };
      ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'assignJob', params)
        .success(function (response) {
          $ionicLoading.hide();
          if (response.status == "success") {
            Utils.showToast(('Notification send to concierge', 'short'))
          }
          else if (response.status == "error") {
            if (response.ErrorCode == "1000") {
              Utils.sessionErrorDialouge();
            } else if (response.ErrorCode == "1022") {
              Utils.showToast('This job has already assigned to someone else ', 'short');
            }
            else {
              Utils.showToast('Error in sending notification to concierge', 'short');
            }

            console.log(response);

          }
        })
        .error(function (response) {
          $ionicLoading.hide();
          Utils.showToast('Some error occued while getting jobs for you', 'short');
        })
    }


    $scope.showActionsheet = function () {
      $ionicActionSheet.show({
        titleText: 'UPLOAD IMAGE',
        buttons: [
          {text: '<i class="icon ion-images"></i> OPEN GALERY'},
          {text: '<i class="icon ion-camera"></i> OPEN CAMERA'},
        ],
        //destructiveText: 'Delete',
        cancelText: 'Cancel',
        cancel: function () {
          console.log('CANCELLED');
        },
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.openImageLibraryFunction();
            return true;
          }
          else if (index == 1)
            $scope.takeNewPictureFunction();
          return true;
          //console.log('BUTTON CLICKED', index);
          //return true;
        },
        //destructiveButtonClicked: function() {
        //  console.log('DESTRUCT');
        //  return true;
        //}
      });
      $scope.openImageLibraryFunction = function () {
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: 0,
          //allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          //targetWidth: 100,
          //targetHeight: 100,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true

        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
          console.log('imageData ', imageData)

          $scope.image_file_uri = imageData;
          console.log('img get succcess and img uri is : ', $scope.image_file_uri);
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
            $scope.openImageViewerPopover1();
          }
          //Ext.getCmp('profilePicId').setSrc(imageURI);
          //showLoader();
          Utils.showToast(imageData + '==')
          //me.saveProfilePic(imageURI);

        }, function (err) {
          Utils.showToast(err, 'short');
          // error
        });

        /*//Utils.showToast('openImageLibraryFunction called','short');
         navigator.camera.getPicture(onSuccess, onFail, {
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
         allowEdit: false,
         correctOrientation: true
         });
         function onSuccess(imageURI) {

         $scope.image_file_uri = imageURI;
         console.log('img get succcess and img uri is : ',$scope.image_file_uri);
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
         }*/
      }
      $scope.takeNewPictureFunction = function () {
        Utils.showToast('takeNewPictureFunction called');
        navigator.camera.getPicture(onSuccess, onFail, {
          //quality: 100,
          destinationType: 1,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          //encodingType: Camera.EncodingType.JPEG,
          //targetWidth: 100,
          //targetHeight: 100,
          //popoverOptions: CameraPopoverOptions,
          // saveToPhotoAlbum: true,
          //cameraDirection: 1,
          correctOrientation: true
        });

        function onSuccess(imageURI) {
          $scope.image_file_uri = imageURI;
          $scope.openImageViewerPopover1();
          //Ext.getCmp('profilePicId').setSrc(imageURI);
          //showLoader();
          Utils.showToast(imageURI + '==')
          //me.saveProfilePic(imageURI);
        }

        function onFail(message) {
          //hideLoader();
          Utils.showToast(message, 'long');
          // toastLong("");
        }
      }
    }
  });
