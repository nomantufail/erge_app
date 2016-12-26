/**
 * Created by rao on 21-Jan-16.
 */
var hello;
angular.module('erge.Profile', [])
  .controller('EditProfileCtrl', function ($scope, Utils, $localstorage, $ionicLoading, API, ServerRequest, $ionicActionSheet,$ionicPopup) {
    /*get user data from local storage to show on profile*/
    var user_data = $localstorage.getObject('user_data');
    /*lat long string to convert latlong to real address*/
    var latlongStr = user_data.lat + ',' + user_data.long;
    /*calling utils function to covert lat long to real address*/
    Utils.getLatLongToAddress(latlongStr).then(function (data) {
      $scope.profileData.location = data;
    });

    $scope.readOnly = true;
    $scope.rating = {};
    $scope.rating.rate =user_data.rating;
    $scope.rating.max = 5;

    $scope.gPlace;
    /*profile data variables*/
    $scope.profileData = {
      sessionToken: user_data.sessiontoken,
      user_id: user_data.id,
      f_name: user_data.f_name,
      l_name: user_data.l_name,
      location: "Pakistan",
      mobile: user_data.mobile_no,
      email: user_data.email,
      bio: user_data.bio,
      roll: user_data.role,
      profile_pic: user_data.profile_pic,
      lat: user_data.lat,
      long: user_data.long
    };
    console.log($scope.profileData.profile_pic);
    //$scope.color_on = '#003672';
    //$scope.color_off = '#005f96';
    $scope.editorEnabled = true;
    $scope.isEditable = false;

    $scope.editbutton = 'Profile_edit_on.png'
    $scope.showprogess = false;
    $scope.editButtonFunction = function () {
      console.log($scope.profileData.location);
      if ($scope.isEditable == false) {
        $scope.editorEnabled = false;
        $scope.isEditable = true;
        $scope.editbutton = 'Profile_edit_off.png'
      }
      else {
        $scope.editorEnabled = true;
        $scope.isEditable = false;
        $scope.editbutton = 'Profile_edit_on.png'
      }
    }
    $scope.showPrivacyPolicyPopup = function () {
      console.log('showPrivacyPolicyPopup fun');
      $scope.myPopup = $ionicPopup.show({
        title: 'ERGE Privacy Policy',
        templateUrl: 'Profile/PrivacyPolicyPopup.html',
        cssClass: 'TermAndConditionsPopup',
        $scope: $scope,
        buttons: [
          {
            text: '<b>ACKNOWLEDGE</b>',
            type: 'button-positive',
            onTap: function (e) {
            $scope.myPopup.close();
            }
          }
        ]
      });
    };
    $scope.saveprofile = function () {
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else if (!$scope.isEditable) {
        Utils.showToast('Profile is not editable', 'short');
      } else {
        Utils.getAddressToLatLong($scope.profileData.location).then(function (data) {
          $scope.profileData.lat = data.Latitude;
          $scope.profileData.long = data.Longitude;
        });
      }
      if ($scope.profileData.f_name.trim() == "") {
        Utils.showToast("Enter first name!", 'short');
        return;
      }
      else if ($scope.profileData.l_name.trim() == "") {
        Utils.showToast("Enter last name!", 'short');
        return;
      }
      else if ($scope.profileData.location == "") {
        Utils.showToast("Enter Location", 'short');
        return;
      }
      else if ($scope.profileData.mobile == "") {
        Utils.showToast("Enter mobile no!", 'short');
        return;
      }
      else if ($scope.profileData.bio.trim() == "") {
        Utils.showToast("Enter Bio", 'short');
        return;
      }
      else {
        $ionicLoading.show();
        var params = {
          "appToken": API.appToken,
          "sessionToken": $scope.profileData.sessionToken,
          "email": $scope.profileData.email,
          "user_id": $scope.profileData.user_id,
          "f_name": $scope.profileData.f_name,
          "l_name": $scope.profileData.l_name,
          "mobile": $scope.profileData.mobile,
          "lat": $scope.profileData.lat,
          "long": $scope.profileData.long,
          "bio": $scope.profileData.bio,
        };
        ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'editProfile', params)
          .success(function (response) {
            console.log(response);
            $ionicLoading.hide();
            if (response.status == "success") {
              Utils.showToast('Profile updated successfully', 'short');
              $scope.isEditable = false;
            }
            else if (response.status == "error") {
              if (response.ErrorCode == "1000") {
                Utils.showToast('your session expired, login again', 'short');
              } else {
                Utils.showToast('Profile not updated successfully', 'short');
              }
            }
          })
          .error(function (response) {
            $ionicLoading.hide();
            Utils.showToast('Some error occued while updation profile, try gain', 'short');
          })
      }

    }


    $scope.image_file_uri = "";
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
    }
    $scope.openImageLibraryFunction = function () {
      Utils.showToast('openImageLibraryFunction called');
      navigator.camera.getPicture(onSuccess, onFail, {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        //correctOrientation: true
      });
      function onSuccess(imageURI) {
        $scope.image_file_uri = imageURI;
        var res = $scope.image_file_uri.match(/content/g);
        if (res == "content") {
          window.FilePath.resolveNativePath($scope.image_file_uri, successCallback, errorCallback);
          function successCallback(value) {

            $scope.image_file_uri = value;
            $scope.saveProfilePic($scope.image_file_uri);
          }

          function errorCallback(code, message) {
            $scope.image_file_uri = "";
            console.log('error code ', code)
            console.log('error msg ', message)
          }
        }else{
          $scope.image_file_uri = value;
          $scope.saveProfilePic($scope.image_file_uri);
        }
        Utils.showToast(imageURI + '==')
      }

      function onFail(message) {
        Utils.showToast("Error occurred.", 3)
        // toastLong("Error occurred.", 3);
      }
    }
    $scope.takeNewPictureFunction = function () {
      Utils.showToast('takeNewPictureFunction called');
      navigator.camera.getPicture(onSuccess, onFail, {

        destinationType: 1,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        //targetWidth: 100,
        //targetHeight: 100,
        //popoverOptions: CameraPopoverOptions,
        // saveToPhotoAlbum: true,
        //cameraDirection: 1,
        //correctOrientation: true
      });

      function onSuccess(imageURI) {
        $scope.image_file_uri = imageURI;
        //$scope.profileData.profile_pic = imageURI;
        //hello=$scope;
        $scope.saveProfilePic(imageURI);
        Utils.showToast(imageURI + '==')
      }

      function onFail(message) {
        Utils.showToast(message, long);
      }
    }


    $scope.saveProfilePic = function (imageURI) {
      rr = imageURI;

      var fail = function (error) {
        Utils.showToast('error in uploading img ERROR');
      }
      var win = function (r) {
        var rr = JSON.parse(r.response);
        $scope.profileData.profile_pic = rr.Data;
        $scope.$apply();
        console.log('pppp', $scope.profileData.profile_pic);
        $localstorage.setObject('profile_pic', rr.Data);
        //console.log(r.response.Data);
        //$scope.profileData = $scope.image_file_uri;

        console.log(rr.Data);
        console.log("Code = " + r.responseCode);
        console.log("Response = ", r.response);
        console.log("Sent = " + r.bytesSent);
      }
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
        "sessionToken": $scope.profileData.sessionToken,
        "user_id": $scope.profileData.user_id,
      };
      options.params = params;
      var ft = new FileTransfer();
      ft.onprogress = function (progressEvent) {

        /* if (progressEvent.lengthComputable) {
         var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
         console.log(perc);
         $scope.showprogess=true;
         document.getElementById("prog").value = perc;
         }*/

        console.log(progressEvent.loaded / progressEvent.total);
      };
      ft.upload(imageURI, encodeURI(API.BASE_URL + 'editProfilePic'), win, fail, options);
    }
  })
  .
  directive('googleplace', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, model) {
        var options = {
          types: [],
          componentRestrictions: {}
        };
        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

        google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
          scope.$apply(function () {
            model.$setViewValue(element.val());
          });
        });
      }
    };
  });
