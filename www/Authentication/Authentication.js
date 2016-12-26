var hello;
angular.module('erge.Authentication', [])

  /*START LOGIN CONTROLLER*/
  .controller('loginCtrl', function ($scope, $sce, Utils, $ionicPopover, $state, $ionicLoading, ServerRequest, API, $localstorage, $ionicHistory, MyHttpRequest) {
    //console.log('Login controller');
    $scope.videoUrl = $sce.trustAsResourceUrl('img/erge-video.mp4');
    /*Ligin data modal*/
    $scope.$on("$ionicView.enter", function () {
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else {
        $scope.loginFieldsData.currentPlatform = ionic.Platform.platform();
        if ($scope.loginFieldsData.currentPlatform == "android" || $scope.loginFieldsData.currentPlatform == "ios") {
          Utils.getRegId().then(function (data) {
            $scope.loginFieldsData.device_id = data;
          });
        } else {
          $scope.loginFieldsData.device_id = "12345678963228";
        }
        Utils.getLatLongFun().then(function (data) {
          $scope.loginFieldsData.lat = data.Latitude;
          $scope.loginFieldsData.long = data.Longitude;
        });
      }
    })
    $scope.loginFieldsData = {
      email: "",
      password: "",
      roll: "",
      lat: "",
      long: "",
      device_id: "",
      currentPlatform: ""

    };
    $scope.forgetPasswordData = {
      email: ""
    };
    /* $scope.image_c = 'radio_off.png';
     $scope.image_b = 'radio_off.png';*/
    /*set roll as boss function*/
    /* $scope.setRoleBosss = function () {
     if ($scope.loginFieldsData.roll == "" || $scope.loginFieldsData.roll == "boss" || $scope.loginFieldsData.roll == "cons") {
     $scope.loginFieldsData.roll = "boss";
     $scope.image_b = 'radio_on.png';
     $scope.image_c = 'radio_off.png';
     console.log($scope.loginFieldsData.roll);
     }
     }
     /!*set roll as conseirge function*!/
     $scope.setRoleCons = function () {
     if ($scope.loginFieldsData.roll == "" || $scope.loginFieldsData.roll == "cons" || $scope.loginFieldsData.roll == "boss") {
     $scope.loginFieldsData.roll = "cons";
     $scope.image_b = 'radio_off.png';
     $scope.image_c = 'radio_on.png';
     console.log($scope.loginFieldsData.roll);
     }
     }*/
    /* LOGIN FUNCTION*/
    $scope.loginFun = function () {
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else if ($scope.loginFieldsData.email == "") {
        Utils.showToast("Enter email address!", 'short');
        return;
      }
      else if (!Utils.validateEmail($scope.loginFieldsData.email)) {
        Utils.showToast("Enter valid email address!", 'long');
        return
      }
      else if ($scope.loginFieldsData.password == "") {
        Utils.showToast("Enter password!", 'short');
        return;
      } else {
        $ionicLoading.show();
        var timezone = new Date().getTimezoneOffset();
        var params = {
          "appToken": API.appToken,
          "email": $scope.loginFieldsData.email,
          "password": $scope.loginFieldsData.password,
          "lat": $scope.loginFieldsData.lat,
          "long": $scope.loginFieldsData.long,
          "plateform": $scope.loginFieldsData.currentPlatform,
          "device_id": $scope.loginFieldsData.device_id,
          "timezone": timezone
        };


        /**/

        MyHttpRequest("login", 'POST', params, true, true).then(function (response) {
          $ionicLoading.hide();
          console.log(response);
          if (response != null) {
            if (response.status == "success") {
              //console.log(response);
              $localstorage.set("session_key", response.Data.sessiontoken);
              $localstorage.set("isLogin", "1");
              $localstorage.setObject("user_data", response.Data);
              Utils.showToast('You are loged-in successfully', 'short');
              $localstorage.set("c_details", "1");
              $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
              });
              $state.go('app.Home');
            }
            else if (response.status == "error") {
              console.log(response);
              if (response.ErrorCode == "1007") {
                Utils.showToast('invalid email or password', 'short');
              } else if (response.ErrorCode == "1008") {
                //console.log(response.Data);
                Utils.showToast('Save Bank Details', 'long');
                $state.go('BankDetails', {data: response.Data})
              }
            }
          } else {
            Utils.showNetworkProblemDialog();
          }
        });

        /**/


        /*ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'login', params)
         .success(function (response) {
         $ionicLoading.hide();
         if (response.status == "success") {
         console.log(response);
         $localstorage.set("session_key", response.Data.sessiontoken);
         $localstorage.set("isLogin", "1");
         $localstorage.setObject("user_data", response.Data);
         Utils.showToast('You are loged-in successfully', 'short');
         $localstorage.set("c_details", "1");
         $ionicHistory.nextViewOptions({
         disableAnimate: true,
         disableBack: true
         });
         $state.go('app.Home');
         }
         else if (response.status == "error") {
         console.log(response);
         if (response.ErrorCode == "1007") {
         Utils.showToast('invalid email or password', 'short');
         } else if (response.ErrorCode == "1008") {
         console.log(response.Data);
         Utils.showToast('Save Bank Details', 'long');
         $state.go('BankDetails', {data: response.Data})
         }
         }
         })
         .error(function (response) {
         console.log('error responce', response);
         $ionicLoading.hide();
         Utils.showToast('Some error occued while login, try gain', 'short');
         })*/
      }
    }

    //  console.log($scope.loginFieldsData.password);

    $scope.goToSignupView = function () {
      $state.go('signup');
    }

    $scope.popover = $ionicPopover.fromTemplate('Authentication/ForgetPassword.html', {
      scope: $scope
    });
    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('Authentication/ForgetPassword.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });
    $scope.openForgetPassPopover = function ($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
    });
    $scope.forgetPass = function () {
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else if ($scope.forgetPasswordData.email.trim() == "") {
        Utils.showToast("Enter email address!", 'short');
        return;
      }
      else if (!Utils.validateEmail($scope.forgetPasswordData.email)) {
        Utils.showToast("Enter valid email address!", 'short');
        return
      } else {
        $ionicLoading.show();
        var params = {
          "appToken": API.appToken,
          "email": $scope.forgetPasswordData.email
        };
        ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'forgetPass', params)
          .success(function (response) {
            $ionicLoading.hide();
            $scope.closePopover();
            if (response.status == "success") {
              console.log(response);
              Utils.showToast('New password sent on email', 'short');
            }
            else if (response.status == "error") {
              console.log(response);
              if (response.ErrorCode == "1006") {
                Utils.showToast('This email not registered with ERGE ', 'short');
              }
              else
                Utils.showToast('Password does not sent successfully', 'short');
            }
          })
          .error(function (response) {
            $scope.closePopover();
            $ionicLoading.hide();
            Utils.showToast('Some error occued while sending email, try again', 'short');
          })


      }

      //}
    }

  })
  /*END  LOGIN CONTROLLER*/

  /*START FORGET PASSWORD CONTROLLER*/
  .controller('ForgetPasswordCtrl', function ($scope, Utils, API, MyHttpRequest, ServerRequest, $ionicLoading, $state) {
    $scope.forgetPasswordData = {
      email: ""
    };
    $scope.forgetPass = function () {
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else {
        if ($scope.forgetPasswordData.email.trim() == "") {
          Utils.showToast("Enter email address!", 'short');
          return;
        }
        else if (!Utils.validateEmail($scope.forgetPasswordData.email)) {
          Utils.showToast("Enter valid email address!", 'short');
          return
        } else {

          $ionicLoading.show();
          var params = {
            "appToken": API.appToken,
            "email": $scope.forgetPasswordData.email
          };
          ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'forgetPass', params)
            .success(function (response) {
              $ionicLoading.hide();
              if (response.status == "success") {

                console.log(response);
                Utils.showToast('New password sent on email', 'short');
              }
              else if (response.status == "error") {
                if (response.ErrorCode == "1000") {
                  Utils.sessionErrorDialouge();
                } else {
                  Utils.showToast('Password does not sent successfully', 'short');
                }
                console.log(response);

              }
            })
            .error(function (response) {
              $ionicLoading.hide();
              Utils.showToast('Some error occued while sending email, try again', 'short');
            })
        }
      }
    }
  })
  /*END FORGET PASSWORD CONTROLLER*/

  /*START CHANGE PASSWORD CONTROLLER*/
  .controller('ChangePassword', function ($scope, Utils, API, ServerRequest, $localstorage, $ionicLoading, MESSAGES, $state) {
    $scope.changePasswordData = {
      password: "",
      new_password: "",
      confirm_password: "",

    };
    $scope.changePassword = function () {
      if ($scope.changePasswordData.password.trim() == "") {
        Utils.showToast("Enter password!", 'short');
        return;
      }
      else if ($scope.changePasswordData.new_password.trim() == "") {
        Utils.showToast("Enter new password!", 'short');
        return;
      }
      else if ($scope.changePasswordData.new_password.length < 6) {
        Utils.showToast("Password must contains six characters!", 'short');
        return;
      }
      else if ($scope.changePasswordData.confirm_password == "") {
        Utils.showToast("Enter confirm password!", 'short');
        return;
      }
      else if ($scope.changePasswordData.confirm_password.length < 6) {
        Utils.showToast("Password must contains six characters!", 'short');
        return;
      }
      else if ($scope.changePasswordData.new_password != $scope.changePasswordData.confirm_password) {
        Utils.showToast("New password and Confirm password does not match!", 'short');
        return;
      }
      else {
        $ionicLoading.show();
        var user_data = $localstorage.getObject('user_data');
        var params = {
          "appToken": API.appToken,
          "oldpassword": $scope.changePasswordData.password,
          "password": $scope.changePasswordData.new_password,
          "user_id": user_data.id,
          "sessionToken": user_data.sessiontoken
        };
        ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'changePassword', params)
          .success(function (response) {
            $ionicLoading.hide();
            if (response.status == "success") {
              console.log(response);
              Utils.showToast('Password changed successfully', 'short');
              //$state.go('app.Home');
            }
            else if (response.status == "error") {
              if (response.ErrorCode == "1011") {
                Utils.showToast('You current password not matched', 'short');
              }
              else if (response.ErrorCode == "1000") {
                Utils.sessionErrorDialouge();

              } else
              //console.log(response);
                Utils.showToast('Password does not changed successfully', 'short');
            }
          })
          .error(function (response) {
            $ionicLoading.hide();
            Utils.showToast('Some error occued while changin password, try again', 'short');
          })
      }
    }
  })
  /*END CHANGE PASSWORD CONTROLLER*/

  /*START SIGNUP CONTROLLER*/
  .controller('SignupCtrl', function ($scope, Utils, $state, $ionicLoading, API, MyHttpRequest, ServerRequest, $localstorage, $ionicHistory, $ionicPopup) {
    $scope.code = "";
    $scope.$on("$ionicView.enter", function () {
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else {
        $scope.signUpData.currentPlatform = ionic.Platform.platform();
        if ($scope.signUpData.currentPlatform == "android" || $scope.signUpData.currentPlatform == "ios") {
          Utils.getRegId().then(function (data) {
            $scope.signUpData.device_id = data;
          });
        } else {
          $scope.signUpData.device_id = "12345678963228";
        }
        Utils.getLatLongFun().then(function (data) {
          $scope.signUpData.lat = data.Latitude;
          $scope.signUpData.long = data.Longitude;
        });
      }
    })
    $scope.changeCheck = false;
    $scope.termAndConditionCheckBox = function () {
      if ($scope.changeCheck == false) {
        $scope.changeCheck = true;
      } else {
        $scope.changeCheck = false;
      }
    }
    /*terms and condition pop up*/
    $scope.showTermAndConditionsPopup = function () {
      $scope.myPopup = $ionicPopup.show({
        title: 'ERGE Terms and Conditions',
        templateUrl: 'Authentication/TermsAndConditionPopUp.html',
        cssClass: 'TermAndConditionsPopup',
        $scope: $scope,
        buttons: [

          {
            text: '<b>AGREE</b>',
            type: 'button-positive',
            onTap: function (e) {
              $scope.changeCheck = true;
            }
          }
        ]
      });
    };
    $scope.closeTermAndConditionsPopup = function () {
      $scope.myPopup.close();
    }

    //$scope.isCheckedTC=false;

    $scope.signUpData = {
      appToken: "LpmEDriRQdKoGAPzRAlstFVEVbjPyPah",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
      emailCode: "",
      roll: "",
      f_name: "",
      l_name: "",
      //plateform: "andriod",
      code: "",
      device_id: "",
      lat: "",
      long: "",
      currentPlatform: ""
    };
    $scope.verificationField = true;
    $scope.color_on = '#003672';
    $scope.color_off = '#005f96';
    $scope.setRoleBosss = function () {
      $scope.signUpData.roll = "BOSS";
      $scope.color_on = '#003672';
      $scope.color_off = '#005f96';
      console.log($scope.signUpData.roll);
    }
    $scope.setRoleCons = function () {
      $scope.signUpData.roll = "CONCIERGE";
      $scope.color_on = '#005f96';
      $scope.color_off = '#003672';
      console.log($scope.signUpData.roll);
    }
//////////////////////////////////////////////sign up function ///////////////////////////////////////////////////////////////////////////
    $scope.signup = function () {
      /*$state.go('BankDetails');
       return;*/
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else if ($scope.signUpData.roll == "") {
        Utils.showToast("Specify user roll!", 'short');
        return;
      } else if ($scope.signUpData.f_name.trim() == "") {
        Utils.showToast("Enter first name!", 'short');
        return;
      } else if ($scope.signUpData.l_name.trim() == "") {
        Utils.showToast("Enter last name!", 'short');
        return;
      }
      else if ($scope.signUpData.email == "") {
        Utils.showToast("Enter email address!", 'short');
        return;
      }
      else if (!Utils.validateEmail($scope.signUpData.email)) {
        Utils.showToast("Enter valid email address!", 'long');
        return
      }
      else if ($scope.signUpData.password.trim() == "") {
        Utils.showToast("Enter password!", 'short');
        return;
      }
      else if ($scope.signUpData.password.length < 6) {
        Utils.showToast("Password must contains six characters!", 'short');
        return;
      } else if ($scope.signUpData.confirmPassword.trim() == "") {
        Utils.showToast("Enter confirm password!", 'short');
        return;
      } else if ($scope.signUpData.confirmPassword != $scope.signUpData.password) {
        Utils.showToast("Password and confirm password does not match", 'short');
        return;
      } else if ($scope.signUpData.mobile == "") {
        Utils.showToast("Enter mobile no!", 'short');
        return;
      }
      else if ($scope.signUpData.emailCode == "") {
        Utils.showToast("Enter email verification code", 'short');
        return;
      }
      else if ($scope.changeCheck == false) {
        Utils.showToast("You have to agree our terms and conditions", 'short');
        return;
      }
      else {
        $ionicLoading.show();
        //console.log($scope.signUpData);
        var timezone = new Date().getTimezoneOffset();
        var params = {
          "appToken": API.appToken,
          "email": $scope.signUpData.email,
          "f_name": $scope.signUpData.f_name,
          "l_name": $scope.signUpData.l_name,
          "mobile": $scope.signUpData.mobile,
          "password": $scope.signUpData.password,
          "role": $scope.signUpData.roll,
          "code": $scope.signUpData.emailCode,
          "lat": $scope.signUpData.lat,
          "long": $scope.signUpData.long,
          "plateform": $scope.signUpData.currentPlatform,
          "device_id": $scope.signUpData.device_id,
          "timezone": timezone
        };
        ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'register', params)
          .success(function (response) {
            console.log(response);
            $ionicLoading.hide();
            if (response.status == "success") {
              console.log(response);
              $localstorage.set("session_key", response.Data.sessiontoken);
              $localstorage.set("isLogin", "1");
              $localstorage.setObject("user_data", response.Data);
              $localstorage.set("c_details", "1");
              $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
              });
              $state.go('app.Home');
              Utils.showToast('You have registered successfully', 'short');
            }
            else if (response.status == "error") {
              //console.log(response);
              if (response.ErrorCode == "1005") {
                Utils.showToast('Email validation code is not correct!', 'short');
              }
            }
          })
          .error(function (response) {
            $ionicLoading.hide();
            Utils.showToast('Some error occued while sending email, try again', 'short');
          })

      }
    }
    /*
     verify email function
     */
    $scope.verifyMail = function () {
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else if ($scope.signUpData.email == "") {
        Utils.showToast("Enter email address!", 'short');
        return;
      }
      else if (!Utils.validateEmail($scope.signUpData.email)) {
        Utils.showToast("Enter valid email address!", 'long');
        return
      }
      else {
        $ionicLoading.show();
        var params = {
          "appToken": API.appToken,
          "email": $scope.signUpData.email
        };

        MyHttpRequest("verifyEmail", 'POST', params, true, true).then(function (response) {
          $ionicLoading.hide();
          if (response != null) {
            if (response.status == "success") {
              $scope.signUpData.emailCode = response.code;
              Utils.verifyMailSend();
              $scope.verificationField = false;
            }
            else if (response.status == "error") {
              if (response.ErrorCode == "1004") {
                Utils.showToast('This email already registered!', 'short');
              }
            }
          } else {
            Utils.showNetworkProblemDialog();
          }
        });

        /*ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'verifyEmail', params)
         .success(function (response) {
         $ionicLoading.hide();
         if (response.status == "success") {
         console.log(response);
         Utils.verifyMailSend();
         $scope.verificationField=false;
         }
         else if (response.status == "error") {
         console.log(response);
         if (response.ErrorCode == "1004") {
         Utils.showToast('This email already registered!', 'short');
         }
         }
         })
         .error(function (response) {
         $ionicLoading.hide();
         Utils.showToast('Some error occued while sending email, try again', 'short');
         })*/
      }
    }
  })
  /*END SIGNUP CONTROLLER*/

  /*START STARTCREEN CONTROLLER CONTROLLER*/
  .controller('StartScreenCtrl', function ($scope, $state, $sce) {
    $scope.videoUrl = $sce.trustAsResourceUrl('img/erge-video.mp4');
    console.log('StartScreenCtrl');
    $scope.loginView = function () {
      $state.go('login');
    }
    $scope.signupView = function () {
      $state.go('signup');
    }
    $scope.testbutton = function () {
      $state.go('app.chat', {data: 36});
    }

  })
  /* END STARTCREEN CONTROLLER CONTROLLER*/

  /*START BANK DETAILS CONTROLLER*/
  .controller('BankDetails', function ($scope, $state, Utils, $localstorage, $ionicLoading, ServerRequest, API, $stateParams) {
    $scope.userDetails = {
      "user_id": "",
      "lat": "",
      "long": "",
      "plateform": "",
      "device_id": ""
    }
    $scope.$on("$ionicView.enter", function () {
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else {
        $scope.userDetails.plateform = ionic.Platform.platform();
        if ($scope.userDetails.plateform == "android" || $scope.userDetails.plateform == "ios") {
          Utils.getRegId().then(function (data) {
            $scope.userDetails.device_id = data;
          });
        } else {
          $scope.userDetails.device_id = "12345678963228";
        }
        Utils.getLatLongFun().then(function (data) {
          $scope.userDetails.lat = data.Latitude;
          $scope.userDetails.long = data.Longitude;
        });
      }
    })
    console.log(' $stateParams.data : ', $stateParams.data)
    $scope.userDetails.user_id = $stateParams.data;
    //hello = $scope;
    console.log('BankDetails');
    $scope.BankDetails = {
      payment_type: "",
      card_number: "4242424242424242",
      exp_month: "",
      exp_year: "",
      exp_date: "",
      cvc: "",
    }
    $scope.selectedDate = {
      secDate: "",
      secTime: "Select Time",
      secTimeVal: ""
    }
    var temp = new Date();
    temp.setDate(temp.getDate() - 1);
    $scope.datepickerObject = {
      titleLabel: ' ',
      //todayLabel: 'TODAY',
      closeLabel: 'CLOSE',
      setLabel: 'SET',
      setButtonType: 'button-assertive',
      todayButtonType: 'button-assertive',
      closeButtonType: 'button-assertive',
      inputDate: new Date(temp.getFullYear(), temp.getMonth() + 1, 1),
      mondayFirst: true,
      templateType: 'popup',
      todayButtonType: "ng-hide",
      showTodayButton: 'false',
      //modalHeaderColor: 'bar-positive',
      modalFooterColor: 'bar-positive',
      from: temp, //Optional
      to: new Date(2018, 8, 25),
      callback: function (val) {
        datePickerCallback(val);
      },
      dateFormat: 'MMMM-DD-YYYY', //Optional
      closeOnSelect: false, //Optional
    };
    /*var ts = moment(new Date()).unix();
     $scope.selectedDate.secDate = ts;*/
    var datePickerCallback = function (val) {
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        $scope.BankDetails.exp_date = val;
        //$scope.$apply();
        //var unixdate = $scope.BankDetails.exp_date.getTime();
        var ts = moment(val).unix();
        $scope.BankDetails.exp_date = ts;
        $scope.datepickerObject.inputDate = moment.unix(ts).format("MMMM-DD-YYYY");
        //var unixdate=new Date(val);
        //console.log(unixdate);
      }
    };

    $scope.image_c = 'radio_off.png';
    $scope.image_b = 'radio_off.png';
    $scope.setPaymentMethodPaypal = function () {
      $scope.BankDetails.payment_type = "paypal";
      $scope.image_b = 'radio_on.png';
      $scope.image_c = 'radio_off.png';
      console.log($scope.BankDetails.payment_type);
    }
    $scope.setPaymentMethodVisa = function () {
      $scope.BankDetails.payment_type = "visa";
      $scope.image_b = 'radio_off.png';
      $scope.image_c = 'radio_on.png';
      console.log($scope.BankDetails.payment_type);
    }

    $scope.bankDetailBack = function () {
      $state.go('signup');
    }

    $scope.saveBankDetailFun = function () {
      console.log($scope.BankDetails.exp_date);
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else if ($scope.BankDetails.payment_type.trim() == "") {
        Utils.showToast("Select payment method.", 'long');
        return
      }
      else {
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
          }
          else if ($scope.BankDetails.exp_date == "") {
            Utils.showToast("Select Expiry data", 'short');
            return;
          }

          else {
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
    stripeResponseHandler = function (status, response) {
      if (response.error) {
        $ionicLoading.hide();
        Utils.showToast('Invalid card details', 'long');
        return;

      } else {
        console.log("response.id, stripe token", response.id);
        /* var user_data = $localstorage.getObject('user_data');
         //console.log(user_data);
         var user_id = user_data.id;*/

        var exp_date = $scope.BankDetails.exp_date;
        var timezone = new Date().getTimezoneOffset();
        //console.log('user id  : ', user_id)
        var params = {
          "user_id": $scope.userDetails.user_id,
          "card_number": $scope.BankDetails.card_number,
          "exp_date": exp_date,
          "cvc": $scope.BankDetails.cvc,
          "payment_method": $scope.BankDetails.payment_type,
          "appToken": API.appToken,
          "stripe_token": response.id,
          "lat": $scope.userDetails.lat,
          "long": $scope.userDetails.long,
          "plateform": $scope.userDetails.plateform,
          "device_id": $scope.userDetails.device_id,
          "timezone": timezone
        };
        console.log('parm for save bank details', params);
        ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'savePayment', params)
          .success(function (response) {
            //console.log(response);
            $ionicLoading.hide();
            if (response.status == "success") {
              console.log('save bank details responce :', response);

              $localstorage.set("session_key", response.Data.sessiontoken);
              $localstorage.set("isLogin", "1");
              $localstorage.set("c_details", "1");
              $localstorage.setObject("user_data", response.Data);
              Utils.showToast('Bank details saved successfully!', 'short');
              $state.go('app.Home');
            }
            else if (response.status == "error") {
              //console.log(response);
              Utils.showToast('Bank details not saved try again', 'short');
            }
          })
          .error(function (response) {
            $ionicLoading.hide();
            Utils.showToast('Some error occued while sending email, try again', 'short');
          })
      }
    }
  })
