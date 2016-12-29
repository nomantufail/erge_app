// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('erge', ['ionic', 'constants', 'ngCordova', 'erge.controllers', 'erge.services',
  'erge.Authentication', 'erge.Home', 'erge.Jobs', 'erge.Profile', 'erge.Menu', 'ionic-datepicker', 'ionic-timepicker',
  'credit-cards', 'erge.Directives', 'erge.Payments', 'ionic.rating', 'underscore', 'erge.Chat'])
  /*'ionic-ratings',, 'angular-simple-chat'*/

  .run(function ($ionicPlatform, $state, $localstorage, $rootScope, $ionicHistory, $ionicPopup) {
    /*$cordovaPush*/
    $ionicPlatform.ready(function () {
      //$rootScope.adnan="my name is rao adnan";
      if ($localstorage.get("isLogin") == "1") {
        $state.go('app.Home');
      } else {
        $state.go('startscreen');
      }
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      var isIOS = ionic.Platform.isIOS();
      var isAndroid = ionic.Platform.isAndroid();
      if (isAndroid || isIOS) {
        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
          console.log("location is " + (enabled ? "enabled" : "disabled"));
          if (!enabled) {
            navigator.notification.confirm(
              'Please turn on your location!',
              onConfirm,
              'Device Location',
              ['TURN ON', 'CANCEL']
            );
            function onConfirm(buttonIndex) {
              if (buttonIndex == 1) {
                cordova.plugins.diagnostic.switchToLocationSettings();
              }
            }
          }

        }, function (error) {
          Utils.showToast("The following error occurred: ", 'short');
        });

        //////cordova Push notification
        /* var androidConfig = {
         "senderID": "348849149264"
         };

         document.addEventListener("deviceready", function() {
         $cordovaPush.register(androidConfig).then(function (result) {
         console.log('cordova push on register : ', result);

         // Success
         }, function (err) {
         // Error
         })

         $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
         switch (notification.event) {
         case 'registered':
         if (notification.regid.length > 0) {
         alert('registration ID = ' + notification.regid);
         console.log('case registered, registration ID = ' + notification.regid);
         }
         break;

         case 'message':
         // this is the actual push notification. its format depends on the data model from the push server
         console.log(notification);
         console.log(JSON.stringify(notification))
         //var user_details = data.additionalData.payload.user_details;

         alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt +'notification data :'+notification);
         console.log('case message = ' + notification.message + ' msgCount = ' + notification.msgcnt +'notification data :'+notification);
         break;

         case 'error':
         alert('GCM error = ' + notification.msg);
         console.log('case GCM error = ' + notification.msg);
         break;

         default:
         alert('An unknown GCM event has occurred');
         console.log('case delault  An unknown GCM event has occurred');
         break;
         }
         });

         });*/


        /////////push notification

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
        $rootScope.push.on('notification', function (data) {
          console.log('$rootScope.push from app.js');
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
          }
          else if (type == "boss_assign_job") {
            console.log("boss_assign_job notification recieved : ")
            $state.go('app.ActiveJob', {data: user_details});
          }
          else if (type == "concierge_completed_job") {
            $state.go('app.ActiveJob', {data: user_details});
            $rootScope.$broadcast('concierge_completed_job', user_details);
            console.log('concierge_completed_job notification recieved');
            console.log('user_details : ', user_details);
          }
          else if (type == "boss_completed_job") {
            $state.go('app.CompletedJob', {data: user_details})
            $rootScope.$broadcast('boss_completed_job', user_details);
            console.log('boss_completed_job notification recieved');
            console.log('user_details : ', user_details);
          }
          else if (type == "new_job") {
            console.log('bfore going to home ');
            $state.go('app.Home');
            console.log('after going on home ');
            $rootScope.$broadcast('new_job', user_details);
            console.log('new job posted ');
            console.log('user_details : ', user_details);
          }
          else if (type == "message") {
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
        });
        $rootScope.push.on('error', function (e) {/*e.message*/
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
         console.log('$rootScope.pushForChat from app.js');
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

      }
    });

    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($ionicHistory.backView()) {
        console.log($state.current.name)
        if ($state.current.name == "signup") {
          $ionicHistory.goBack(-1);
        }

      } else {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Confirm Exit',
          template: "Are you sure you want to close app?"
        });
        confirmPopup.then(function (close) {
          if (close) {
            ionic.Platform.exitApp();
          }
          console.log("User canceled exit.");
        });
      }
      e.preventDefault();
      return false;
    }, 101);
    //ionic.Platform.isFullScreen = false;
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $sceProvider) {
    /*$httpProvider.defaults.withCredentials = true;
     $httpProvider.defaults.useXDomain = true;
     $sceProvider.enabled(false);*/

    //$ionicConfigProvider.scrolling.jsScrolling(false);
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

    $httpProvider.interceptors.push(function ($rootScope, $q) {
      return {
        request: function (config) {
          config.timeout = 60000;
          return config;
        },
        responseError: function (rejection) {
          return $q.reject(rejection);
        }
      }
    });
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    $sceProvider.enabled(false);
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.icon('ion-chevron-left');
    $ionicConfigProvider.backButton.text('');
    $stateProvider
      .state('startscreen', {
        url: '/startscreen',
        templateUrl: 'Authentication/MainScreen.html',
        controller: 'StartScreenCtrl'
      })
        .state('login', {
            url: '/login',
            cache: false,
            templateUrl: 'Authentication/Login.html',
            controller: 'loginCtrl'
        })
        .state('forgetpass', {
            url: '/forgetpass',
            cache: false,
            templateUrl: 'Authentication/ForgetPassword.html',
            controller: 'loginCtrl'
        })
      .state('signup', {
        url: '/signup',
        templateUrl: 'Authentication/Signup.html',
        controller: 'SignupCtrl'
      })

      .state('BankDetails', {
        url: '/bankdetails',
        params: {data: null},
        templateUrl: 'Authentication/BankDetails.html',
        controller: 'BankDetails'
      })


      /*.state('Signup', {
       url: '/signup',
       views: {
       'menuContent': {
       templateUrl: 'Authentication/Signup.html',
       controller: 'SignupCtrl'
       }
       }
       })*/
      .state('app', {
        url: '/app',
        cache: false,
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
      })
      .state('app.Home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'Home/HomeView.html',
            controller: 'MapCtrl'
          }
        }
      })
      .state('app.chat', {
        url: '/chat',
        cache: false,
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Chat/ActiveChat.html',
            controller: 'ActiveChat'
          }
        }
      })
      .state('app.JobDetail', {
        url: '/home/jobdetails',
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Jobs/JobDetailsView.html',
            controller: 'PostJobsCtrl'
          }
        }
      })
      .state('app.ActiveJob', {
        url: '/home/jobdetails/ActiveJob',
        params: {data: null},
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'Jobs/ActiveJobView.html',
            controller: 'ActiveJobCtrl'
          }
        }
      })
      .state('app.ActiveJobsList', {
        url: '/home/jobdetails/ActiveJobsList/',
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Jobs/ActiveJobsList.html',
            controller: 'ActiveJobsListCtrl'
          }
        }
      })
      .state('app.CompletedJob', {
        url: '/home/jobdetails/CompletedJob',
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Jobs/CompleteJobView.html',
            controller: 'completeJobCtrl'
          }
        }
      })
      .state('app.SelectPaymentMethod', {
        url: '/home/jobdetails/CompletedJob/SelectPaymentMethod',
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Jobs/PaymentMethodSeletion.html',
            controller: 'SelectPaymentMethodCtrl'
          }
        }
      })
      .state('app.payViaCreditCard', {
        url: '/home/jobdetails/CompletedJob/SelectPaymentMethod/PayViaCreditCard',
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Jobs/PayViaCreditCard.html',
            controller: 'PayViaCreditCardCtrl'
          }
        }
      })

      .state('app.jobson', {
        url: '/jobson',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'Jobs/JobsList.html',
            controller: 'JobsCtrl'
          }
        }
      })
      .state('app.jobson_completedjobs', {
        url: '/jobson/jobson_completedjobs',
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Jobs/CompletedJobsList.html',
            controller: 'completedJobsListCtrl'


          }
        }
      })
      .state('app.jobson_pendingjobs', {
        url: '/jobson/jobson_pendingjobs',
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Jobs/PendingJobsList.html',
            controller: 'PendingJobsListCtrl'

          }
        }
      })
      .state('app.singlePendingJonDetails', {
        url: '/jobson/SinglePendingJobDetails',
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Jobs/SinglePendingJobDetails.html',
            controller: 'SingilePendingJobDetailsCtrl'

          }
        }
      })
      .state('app.singleCompletedJonDetails', {
        url: '/jobson/SingleCompletedJobDetails',
        params: {data: null},
        views: {
          'menuContent': {
            templateUrl: 'Jobs/SingleCompleteJobDetails.html',
            controller: 'SingileCompletedJobDetailsCtrl'

          }
        }
      })
      .state('app.ChangePassword', {
        url: '/changePassword',
        views: {
          'menuContent': {
            templateUrl: 'Authentication/ChangePassword.html',
            controller: 'ChangePassword'
          }
        }
      })
      .state('app.Profile', {
        url: '/profile',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'Profile/ProfileView.html',
            controller: 'EditProfileCtrl'
          }
        }
      })
        .state('app.Payment', {
            url: '/Payment',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'Payments/Payment.html',
                    controller: 'ConciergePaymentCtrl'
                }
            }
        })
        .state('app.payment_settings', {
            url: '/payment_settings',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'Payments/payment_settings.html',
                    controller: 'payment_settings_ctrl'
                }
            }
        });


    /*  .state('app.playlists', {
     url: '/playlists',
     views: {
     'menuContent': {
     templateUrl: 'templates/playlists.html',
     controller: 'PlaylistsCtrl'
     }
     }
     })

     .state('app.single', {
     url: '/playlists/:playlistId',
     views: {
     'menuContent': {
     templateUrl: 'templates/playlist.html',
     controller: 'PlaylistCtrl'
     }
     }
     });*/
    // if none of the above states are matched, use this as the fallback
    //if ($localstorage.get("isLogin") == "1") {
    //  $urlRouterProvider.otherwise('/home');
    //} else {
    //  $urlRouterProvider.otherwise('/startscreen');
    //}
    //$urlRouterProvider.otherwise('/app');
  });
