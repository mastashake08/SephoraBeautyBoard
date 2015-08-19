(function() {
  'use strict';

  angular
    .module('sephora')
    .directive('featuredPhotos', featuredPhotos);

  /** @ngInject */
  function featuredPhotos() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/featuredPhotos/featuredPhotos.html',
      scope: {},
      controller: featuredPhotosController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function featuredPhotosController($rootScope, $scope, $interval, $cookies, $element, config, api, preloader) {
      /*jshint validthis:true */
      var vm = this,
          listeners = [],
          preloadedCameos = [];

      vm.cameos = [];

      vm.init = function() {
        listeners.push($rootScope.$on('sephora:start', function() {
          vm.refreshCameos();

          $interval(function(){
            vm.refreshCameos();
          }, config.refreshApiInterval);
        }));

        listeners.push($rootScope.$on('sephora:animateCameoList', function() {
          vm.copyCameoList();
        }));

        listeners.push($rootScope.$on('sephora:cameoListAnimationComplete', function() {
          $rootScope.$apply(function(){
            vm.cameos = [];
          });
        }));

        $rootScope.$watch(
          function () { return $($element).find('li').length; },
          function (newValue, oldValue) {
            if (newValue !== oldValue) {
              vm.animateCameoList();
            }
          }
        );

        $rootScope.$on('$destroy', function() {
          angular.forEach(listeners, function(listener) {
            listener();
          });
        });

        //Needs to be in last directive of app
        $rootScope.$broadcast('sephora:contentDone');
      };

      vm.refreshCameos = function() {
        var data = {
          total: config.featuredTotal,
          store_id: $rootScope.store_id,
          //since: $cookies.get('content_id')
          since: localStorage.getItem($rootScope.store_id + 'content_id')
        };

        api.getCameo(data).then(function(response){
          preloader.preloadImages( response, config.apiImageSizeLarge ).then(
            function handleResolve( imageLocations ) {
              for(var i = 0, length = imageLocations.length; i < length; i++) {
                if(preloadedCameos.indexOf(imageLocations[i]) === -1) {
                  preloadedCameos.push(imageLocations[i]);
                }
              }
            }
          );
        });
      };

      vm.copyCameoList = function() {
        if(preloadedCameos.length > 0) {
          $rootScope.$apply(function () {
            vm.cameos = preloadedCameos.slice(0, config.featuredImageCount);
            preloadedCameos = preloadedCameos.slice(config.featuredImageCount);
          });
        } else {
          $rootScope.$broadcast('sephora:cameoListAnimationComplete');
        }
      };

      vm.animateCameoList = function() {
        var vSequence = [];

        $($element)
          .find('li')
          .each(function(idx, el) {
            var $el = $(el),
                singleAnimation;

            singleAnimation = {
              e: $el,
              p: {
                scaleX: [1, 2.5],
                scaleY: [1, 2.5],
                translateX: [ 0, '-2000px' ]
              },
              o: {
                duration: config.featuredAnimationSpeed,
                easing: 'easeOut',
                complete: function() {
                  localStorage.setItem($rootScope.store_id + 'content_id', $el.data('content-id'));
                }
              }
            };

            vSequence.push(singleAnimation);

            singleAnimation = {
              e: $el,
              p: {
                scaleX: [2.5, 1],
                scaleY: [2.5, 1],
                translateX: [ '2000px', 0 ]
              },
              o: {
                duration: config.featuredAnimationSpeed,
                easing: 'easeOut',
                delay: config.featuredAnimationDelay
              }
            };

            if(idx === vm.cameos.length - 1) {
              singleAnimation.o.complete = function() {
                $rootScope.$broadcast('sephora:cameoListAnimationComplete');
              };
            }

            vSequence.push(singleAnimation);
        });

        $.Velocity.RunSequence(vSequence);
      };
    }
  }

})();
