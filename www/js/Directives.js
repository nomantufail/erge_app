/**
 * Created by rao on 04-Feb-16.
 */
angular.module('erge.Directives', [])
  .directive('activeMap', function () {
    return {
      restrict: 'A',
      scope: {
        position: '=position'
      },
      link: function (scope, element, attrs) {
        scope.currentLocationPinter = 'img/user-loc-pointer.png';
        var Latlng = new google.maps.LatLng(31.554606, 74.357158),
          mapOptions = {
            zoom: 15,
            center: Latlng
          },
          map = new google.maps.Map(element[0], mapOptions);
        marker = new google.maps.Marker({
          position: Latlng,
          map: map,
          draggable: false,
          icon: scope.currentLocationPinter
        });

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        /* show directions between selected places*/

        scope.$watch(function () {
          return scope.position;

        }, function () {
          console.log(scope.position)
          directionsDisplay.setMap(map);
          directionsService.route({
            origin: scope.position.startlocation,
            destination: scope.position.endlocation,
            travelMode: google.maps.TravelMode.DRIVING
          }, function (response, status) {
            console.log('responce : ', response)
            if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
            } else {
              Utils.showToast("Unable to get directions between these points", 'short');
              //window.alert('Directions request failed due to ' + status);
            }
          });
        });
      }
    };
  })
  .directive('myMap', function (Utils, $ionicPopover, API, ServerRequest, $ionicLoading, $localstorage, $ionicModal, $rootScope, $ionicPopup, $ionicScrollDelegate) {
    // directive link function
    var link = function (scope, element, attrs) {
      var map, infoWindow;
      var bounds = new google.maps.LatLngBounds();
      var markers = [];
      scope.jobDetails = {};
      scope.InterestJobDescription = {
        details: ""
      };
      scope.currentLocationPinter = 'img/user-loc-pointer.png';
      //markers = [{lat: 40.0092001, long: 74.3571580}]
      // markers = scope.position;

      var user_data = $localstorage.getObject('user_data');
      // var Latlng = new google.maps.LatLng(31.5546060, 74.3571580);
      var Latlng = new google.maps.LatLng(user_data.lat, user_data.long);

      //console.log('Latlng : ', Latlng)
      // map config
      var mapOptions = {
        center: Latlng,
        zoom: 17,
        minZoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
        /*scrollwheel: false,
         draggable: false*/
      };
      // init the map
      function initMap() {

        //if (map === undefined) {

        map = new google.maps.Map(element[0], mapOptions);
        console.log('init map function called and map is : ', map);
        console.log('position length', scope.position.length)
        var marker = new google.maps.Marker({
          position: Latlng,
          map: map,
          draggable: false,
          icon: scope.currentLocationPinter
        });


        if (scope.position.length != 0) {
          if (user_data.role == "BOSS") {
            /*var marker = new google.maps.Marker({
              position: Latlng,
              map: map,
              draggable: false,
              icon: scope.currentLocationPinter
            });*/
            //map.setZoom(17);
            console.log('position length', scope.position.length)
            console.log('scope.position from directive : ', scope.position)
            for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(null);
            }
            markers = [];
            console.log(scope.position.length);
            angular.forEach(scope.position, function (value, key) {
              var location = new google.maps.LatLng(value.start_lat, value.start_long);
              setMarkerForBoss(map, location, value.name, value);
            });
            /*map.setCenter(bounds.getCenter())
             map.fitBounds(bounds)*/
          }
        } else {
          var marker = new google.maps.Marker({
            position: Latlng,
            map: map,
            draggable: false,
            icon: scope.currentLocationPinter
          });
        }
      }

      scope.$on('refresh_map', function () {
        //console.log('refresh_map broadcast recieved')
        initMap();
      });
      // place a marker
      function setMarker(map, position, title, content) {
        //console.log('content : ', content);
        if (content.applied == 0) {
          scope.pointer = 'img/green-man.png'
        } else if (content.applied == 1) {
          scope.pointer = 'img/red-man.png'
        }
        //var marker;
        var markerOptions = {
          position: position,
          map: map,
          title: title,
          //icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          icon: scope.pointer
        };
        var marker = new google.maps.Marker(markerOptions);
        markers.push(marker); // add marker to array
        bounds.extend(marker.position);
        google.maps.event.addListener(marker, 'click', function () {
          console.log('conteny : ', content);
          scope.jobDetails = {
            name: content.f_name,
            job_description: content.description,
            job_start_loc: content.start_loc,
            job_end_loc: content.dest_loc,
            price_for_job: content.price,
            job_complete_date: content.completion_date,
            job_complete_time: content.completion_time,
            boss_profile_pic: content.profile_pic,
            job_id: content.id,
            attachment: content.attachment,
            rating: content.rating,
            isApplied: content.applied
          }
          if (scope.jobDetails.isApplied == 0) {
            //scope.rquestBtnText = "INTERESTED"
            scope.rquestBtnText = "I want the job"
          } else if (scope.jobDetails.isApplied == 1) {
            scope.rquestBtnText = "RE-SEND"
          }
          scope.rating.rate = scope.jobDetails.rating;
          scope.showJobDetailsPopup();
          //scope.popover.show()
          //scope.openModal().then
          /* scope.openModal();
           document.getElementById('textareaid').focus();*/
          //var content= content;
          //console.log('content: content', content)
          //scope.$parent.$broadcast('jobDetails',content);
        });
      }

      function setMarkerForBoss(map, position, title, content) {
        scope.pointer = 'img/blue-man.png'
        //var marker;
        //map.setZoom(17);
        var markerOptions = {
          position: position,
          map: map,
          title: title,
          //icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          icon: scope.pointer
        };
        var marker = new google.maps.Marker(markerOptions);
        markers.push(marker); // add marker to array
        bounds.extend(marker.position);
        google.maps.event.addListener(marker, 'click', function () {
          console.log('conteny : ', content);
          scope.jobDetails = {
            job_description: content.description,
            job_start_loc: content.start_loc,
            job_end_loc: content.dest_loc,
            price_for_job: content.price,
            job_complete_date: content.completion_date,
            job_complete_time: content.completion_time,
            attachment: content.attachment,
            visibility_radius: content.visibility_radius,
            filename: content.filename
          }
          if (scope.jobDetails.filename == "") {
            scope.isAttachment = false;
          } else {
            scope.isAttachment = true;
          }
          /*//scope.rquestBtnText = "INTERESTED"
           scope.rquestBtnText = "I want the job"
           } else if (scope.jobDetails.isApplied == 1) {
           scope.rquestBtnText = "RE-SEND"
           }
           scope.rating.rate = scope.jobDetails.rating;*/
          //scope.showJobDetailsPopup();
          scope.popover.show()
          //scope.openModal().then
          /* scope.openModal();
           document.getElementById('textareaid').focus();*/
          //var content= content;
          //console.log('content: content', content)
          //scope.$parent.$broadcast('jobDetails',content);
        });
      }

      scope.readOnly = true;
      scope.rating = {};
      scope.rating.rate = 0;
      scope.rating.max = 5;

      scope.popover = $ionicPopover.fromTemplate('Jobs/BossPostedJobPopover.html', {
        scope: scope
      });
      // .fromTemplateUrl() method
      $ionicPopover.fromTemplateUrl('Jobs/BossPostedJobPopover.html', {
        scope: scope
      }).then(function (popover) {
        scope.popover = popover;
      });
      scope.openPopover = function () {
        scope.popover.show();
      };
      scope.closePopover = function () {
        scope.popover.hide();

      };
      //Cleanup the popover when we're done with it!
      scope.$on('$destroy', function () {
        scope.popover.remove();
      });
      // Execute action on hide popover
      scope.$on('popover.hidden', function () {
        // Execute action
      });
      // Execute action on remove popover
      scope.$on('popover.removed', function () {
        // Execute action
      })
      ////////


      /////////
      /* $ionicModal.fromTemplateUrl('Jobs/JobDetailsPopover.html', {
       scope: scope,
       animation: 'slide-in-up'
       }).then(function (modal) {
       scope.modal = modal;
       });
       scope.openModal = function () {
       scope.modal.show();
       };
       scope.closeModal = function () {
       scope.modal.hide();
       };
       //Cleanup the modal when we're done with it!
       scope.$on('$destroy', function () {
       scope.modal.remove();
       });
       // Execute action on hide modal
       scope.$on('modal.hidden', function () {
       // Execute action
       });
       // Execute action on remove modal
       scope.$on('modal.removed', function () {
       // Execute action
       });*/
      /////////
      /*scope.scrollUp = function () {
       window.scrollBy(0, -50);
       console.log('scrollUp fun called')

       //$ionicScrollDelegate.$getByHandle('my-scroll').scrollTop(true);
       }*/

      scope.showJobDetailsPopup = function () {
        scope.myPopup = $ionicPopup.show({
          templateUrl: 'Jobs/JobDetailsPopover.html',
          cssClass: 'job-details-popup',
          scope: scope
        });
      };
      scope.closeJobDetailsPopup = function () {
        scope.InterestJobDescription.details = '';
        scope.myPopup.close();
      }

      /////

      /*Img viewer popover start*/

      scope.ImgViewerDeleteBtn = false;
      scope.getStyleForImgViewer = function () {
        return {height: '362px'}
      }
      scope.popoverImgView = $ionicPopover.fromTemplate('Jobs/ImegeViewerPopover.html', {
        scope: scope
      });
      // .fromTemplateUrl() method
      $ionicPopover.fromTemplateUrl('Jobs/ImegeViewerPopover.html', {
        scope: scope
      }).then(function (popover) {
        scope.popoverImgView = popover;
      });
      scope.openImageViewerPopover = function (imgUrl) {
        console.log('openImageViewerPopover fun called');
        console.log('img url : ', imgUrl)
        scope.disableDeleteBtn = true;
        scope.image_file_uri = imgUrl;
        scope.popoverImgView.show();
      };
      scope.closePopoverimgView = function () {
        scope.image_file_uri = "";
        scope.popoverImgView.hide();
      };
      //Cleanup the popover when we're done with it!
      scope.$on('$destroy', function () {
        scope.popoverImgView.remove();
      });
      // Execute action on hide popover
      scope.$on('popover.hidden', function () {
        // Execute action
      });
      // Execute action on remove popover
      scope.$on('popover.removed', function () {
        // Execute action
      });
      /*Img viewer popover end*/
      scope.interestedInJob = function () {
        if (scope.InterestJobDescription.details == "") {
          console.log('InterestJobDescription', scope.InterestJobDescription.details)
          Utils.showToast('Specify some descriptions for BOSS', 'short');
          return;
        }
        else {
          var user_data = $localstorage.getObject('user_data');
          $ionicLoading.show();
          var params = {
            "appToken": API.appToken,
            "user_id": user_data.id,
            "job_id": scope.jobDetails.job_id,
            "description": scope.InterestJobDescription.details,
            "sessionToken": user_data.sessiontoken,
          };
          ServerRequest.makeServerRequest('post', 'json', API.BASE_URL + 'sendApplication', params)
            .success(function (response) {
              $ionicLoading.hide();
              if (response.status == "success") {
                scope.InterestJobDescription.details = "";
                console.log(response);
                scope.closeJobDetailsPopup();
                //scope.closePopover();
                Utils.showToast('Request send successfully', 'short');
              }
              else if (response.status == "error" && response.ErrorCode == "1012") {
                //scope.closePopover();
                scope.closeJobDetailsPopup();
                Utils.showToast("You have already applied to this job", "short");
              }
            })
            .error(function (response) {
              $ionicLoading.hide();
              scope.closeJobDetailsPopup();
              //scope.closePopover();
              Utils.showToast('Some error occued while sending request to boss', 'short');
            })
        }
      }

      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      /* show directions between selected places*/
      var start = "";
      var end = "";
      scope.$on('myCustomEvent', function (event, data) {
        console.log("myCustomEvent data DIRECTIVE: ", data); // 'Data to send'
        if (data == "start") {
          start = "done";
        }
        if (data == "start_clear") {
          start = "";
        }
        if (data == "end_clear") {
          end = "";
        }
        if (data == "end") {
          end = "done";
        }
        console.log("start : ", start);
        console.log("end : ", end);
        console.log(scope.a);
        if (start == 'done' && end == 'done') {
          console.log('value change');
          directionsDisplay.setMap(null);
          directionsDisplay.setMap(map);
          directionsService.route({
            origin: scope.a.startlocation,
            destination: scope.a.endlocation,
            travelMode: google.maps.TravelMode.DRIVING
          }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
            } else {
              Utils.showToast("Unable to get directions between these points", 'short');
              //window.alert('Directions request failed due to ' + status);
            }
          });
        }
        else if (start == '' && end == '') {
          initMap();
          //console.log('else part of set directions init map')
        }
      });
      setTimeout(function () {
        scope.$watch(function () {
          return scope.position;
        }, function () {
          console.log('psoition length', scope.position.length)
          if (scope.position.length != 0) {
            if (user_data.role == "CONCIERGE") {
              //console.log('position length', scope.position.length)
              initMap();
              console.log('scope.position from directive : ', scope.position)
              for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
              }
              markers = [];
              console.log(scope.position.length);
              angular.forEach(scope.position, function (value, key) {
                var location = new google.maps.LatLng(value.start_lat, value.start_long);
                setMarker(map, location, value.name, value);
              });
              /*if (scope.position.length == 1) {
                console.log('length is 1')
                map.setZoom(17);
              } else {*/
                map.setCenter(bounds.getCenter())
                map.fitBounds(bounds)
             /* if (scope.position.length == 1) {
                //console.log('length is 1')
                map.setZoom(17);
              }*/

             // }

            }
            else if (user_data.role == "BOSS") {
//console.log('position length', scope.position.length)
              initMap();
              console.log('scope.position from directive : ', scope.position)
              for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
              }
              markers = [];
              console.log(scope.position.length);
              angular.forEach(scope.position, function (value, key) {
                var location = new google.maps.LatLng(value.start_lat, value.start_long);
                map.setZoom(18);
                setMarkerForBoss(map, location, value.name, value);
              });
              /*map.setCenter(bounds.getCenter())
               map.fitBounds(bounds)*/
            }
          } else if (scope.position == "undefined" || scope.position.length == 0) {
            console.log('empty position')

            initMap();

          }

        });
      }, 500);
    };
    return {
      restrict: 'A',
      template: '<div id="map"></div>',
      replace: true,
      scope: {
        a: '=a',
        position: '=position',
        //initMap: '&initMap'
      },
      link: link
    };
  }
)

  /*  .directive('mapDirection', function (Utils) {
   // directive link function
   var link = function (scope, element, attrs) {
   //var map, infoWindow;
   var Latlng = new google.maps.LatLng(31.5546060, 74.3571580);
   console.log('Latlng : ', Latlng)
   // map config
   var mapOptions = {
   center: Latlng,
   zoom: 15,
   mapTypeId: google.maps.MapTypeId.ROADMAP,
   disableDefaultUI: true
   };
   function initMap() {
   }
   var map = new google.maps.Map(element[0], mapOptions);
   var directionsService = new google.maps.DirectionsService;
   var directionsDisplay = new google.maps.DirectionsRenderer;
   /!* show directions between selected places*!/
   var start = "";
   var end = "";
   scope.$on('myCustomEvent', function (event, data) {
   console.log("myCustomEvent data DIRECTIVE: ", data); // 'Data to send'
   if (data == "start") {
   start = "done";
   }
   if (data == "end") {
   end = "done";
   }
   console.log("start : ", start);
   console.log("end : ", end);
   console.log(scope.a);
   if (start == 'done' && end == 'done') {
   console.log('value change');
   directionsDisplay.setMap(null);
   directionsDisplay.setMap(map);
   directionsService.route({
   origin: scope.a.startlocation,
   destination: scope.a.endlocation,
   travelMode: google.maps.TravelMode.DRIVING
   }, function (response, status) {
   if (status === google.maps.DirectionsStatus.OK) {
   directionsDisplay.setDirections(response);
   } else {
   Utils.showToast("Unable to get directions between these points", 'short');
   //window.alert('Directions request failed due to ' + status);
   }
   });
   }
   });

   };
   return {
   restrict: 'A',
   template: '<div id="map"></div>',
   replace: true,
   scope: {
   a: '=a',
   //position: '=position',
   //initMap: '&initMap'
   },
   link: link
   };
   })*/


  .directive('ngAutocomplete', function () {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        options: '=?',
        details: '=?',
        type: '@flag',
      },

      link: function (scope, element, attrs, controller) {

        //options for autocomplete
        var opts
        var watchEnter = false
        //convert options provided to opts
        var initOpts = function () {

          opts = {}
          if (scope.options) {

            if (scope.options.watchEnter !== true) {
              watchEnter = false
            } else {
              watchEnter = true
            }

            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
              scope.gPlace.setTypes(opts.types)
            } else {
              scope.gPlace.setTypes([])
            }

            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
              scope.gPlace.setBounds(opts.bounds)
            } else {
              scope.gPlace.setBounds(null)
            }

            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
              scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
            } else {
              scope.gPlace.setComponentRestrictions(null)
            }
          }
        }

        if (scope.gPlace == undefined) {
          scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
        }
        google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
          var result = scope.gPlace.getPlace();
          if (result !== undefined) {
            if (result.address_components !== undefined) {

              scope.$apply(function () {

                scope.details = result;


                controller.$setViewValue(element.val());
                console.log('100');
                if (scope.type == 'start')
                  scope.$parent.$broadcast('myCustomEvent', scope.type);
                else
                  scope.$parent.$broadcast('myCustomEvent', scope.type);
              });
            }
            else {
              if (watchEnter) {
                getPlace(result)
              }
            }
          }
        })

        //function to get retrieve the autocompletes first result using the AutocompleteService
        var getPlace = function (result) {
          var autocompleteService = new google.maps.places.AutocompleteService();
          if (result.name.length > 0) {
            autocompleteService.getPlacePredictions(
              {
                input: result.name,
                offset: result.name.length
              },
              function listentoresult(list, status) {
                if (list == null || list.length == 0) {

                  scope.$apply(function () {
                    scope.details = null;
                  });

                } else {
                  var placesService = new google.maps.places.PlacesService(element[0]);
                  placesService.getDetails(
                    {'reference': list[0].reference},
                    function detailsresult(detailsResult, placesServiceStatus) {

                      if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
                        scope.$apply(function () {

                          controller.$setViewValue(detailsResult.formatted_address);
                          element.val(detailsResult.formatted_address);

                          scope.details = detailsResult;

                          //on focusout the value reverts, need to set it again.
                          var watchFocusOut = element.on('focusout', function (event) {
                            element.val(detailsResult.formatted_address);
                            element.unbind('focusout')
                          })

                        });
                      }
                    }
                  );
                }
              });
          }
        }

        controller.$render = function () {
          var location = controller.$viewValue;
          element.val(location);
        };

        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          initOpts()
        }, true);

      }

    };
  })
  .directive('disableTap', '_', function ($timeout, _) {
    return {
      link: function () {
        $timeout(function () {
          // Find google places div
          _.findIndex(angular.element(document.querySelectorAll('.pac-container')), function (container) {
            // disable ionic data tab
            container.setAttribute('data-tap-disabled', 'true');
            // leave input field if google-address-entry is selected
            container.onclick = function () {
              document.getElementById('autocomplete').blur();
              document.getElementById('autocomplete2').blur();
            };
          });
        }, 500);
      }
    };
  })


