angular.module('erge.Payments', [])
  .controller('ConciergePaymentCtrl', function ($scope, Utils, $stateParams, $localstorage, $ionicLoading, API, $ionicHistory, MyHttpRequest,$state) {
    $scope.user_data = $localstorage.getObject('user_data');
    console.log('balance : ',$scope.user_data.current_balance)
    $scope.conscierge_paymentDetails = {
      password: "",
      email: "",
      ammount: 0,
      current_balance:  $localstorage.get('current_balance'),
      requested_amount:  $localstorage.get('requested_amount'),

    }
/* withdraw request*/
    $scope.withdrawRequest = function () {
      if (!Utils.checkConnection()) {
        Utils.showConnectionDialog();
      } else {
        if ($scope.conscierge_paymentDetails.ammount == 0) {
          Utils.showToast("Enter withdraw ammount", 'long');
        } else if (isNaN($scope.conscierge_paymentDetails.ammount)) {
          Utils.showToast("Enter valid withdraw ammount", 'long');
        } else if ($scope.conscierge_paymentDetails.ammount > $scope.conscierge_paymentDetails.current_balance) {
          Utils.showToast("Withdraw ammount is greater than tatal balance", 'long');
        } else if ($scope.conscierge_paymentDetails.email == "") {
          Utils.showToast("Enter email address!", 'long');
        } else if (!Utils.validateEmail($scope.conscierge_paymentDetails.email)) {
          Utils.showToast("Enter valid email address!", 'long');
          return
        }
        else if ($scope.conscierge_paymentDetails.password == "") {
          Utils.showToast("Enter password!", 'short');
          return;
        }else {
          //console.log($scope.conscierge_paymentDetails);
          //return;
          $ionicLoading.show();
          var params = {
            "user_id": $scope.user_data.id,
            "appToken": API.appToken,
            "sessionToken": $scope.user_data.sessiontoken,
            "requested_amount": $scope.conscierge_paymentDetails.ammount,
            "password": $scope.conscierge_paymentDetails.password,
            "paypal_email": $scope.conscierge_paymentDetails.email

          };
          MyHttpRequest("requestPayment", 'POST', params, true, true).then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            if (response != null) {
              if (response.status == "success") {
                Utils.showToast('Payment request submitted successfully', 'long');
                $localstorage.set('current_balance', response.Data.current_balance);
                $localstorage.set('requested_amount', response.Data.requested_amount);
                $scope.conscierge_paymentDetails = {
                  password: "",
                  email: "",
                  ammount: 0,
                  current_balance:  $localstorage.get('current_balance'),
                  requested_amount:  $localstorage.get('requested_amount'),
                }
                $ionicHistory.nextViewOptions({
                  disableBack: true
                });
                $state.go('app.Home');

              }
              else if (response.status == "error") {
                if (response.ErrorCode == "1000") {
                  Utils.sessionErrorDialouge();
                }
                else if (response.ErrorCode == "1021") {
                  Utils.showToast('Password is incorrect', 'short');
                }
              }
            } else {
              Utils.showNetworkProblemDialog();
            }
          })
        }

      }
    }
  })
