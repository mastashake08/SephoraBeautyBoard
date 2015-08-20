(function() {
  'use strict';

  angular
    .module('sephora')
    .directive('photoList', photoList);

  /** @ngInject */
  function photoList() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/photoList/photoList.html',
      scope: {},
      controller: photoListController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function photoListController($rootScope, $element, config, api, preloader) {
      /*jshint validthis:true */
      var vm = this,
          listeners = [],
          photoIndex = 0;

      vm.photos = [];

      vm.loadImages = function() {
        var data = {
          total: config.secondaryApiCount,
          store_id: $rootScope.store_id
        };

        api.getSecondary(data).then(function(response) {
          vm.photos = response.slice(0, config.secondaryTotal);

          preloader.preloadImages( vm.photos.slice(0, config.secondaryPreloadCount) ).then(
            function handleResolve( imageLocations ) {
              $rootScope.$broadcast('sephora:photoListLoaded');
            }
          ).then(
            function() {
              preloader.preloadImages(vm.photos.slice(config.secondaryPreloadCount));
            }
          );
        });
      };

      vm.animatePhotoList = function() {
        var photoLength = vm.photos.length,
            vSequence = [],
            topPositions = config.secondaryTopPositions,
            delay = photoIndex >= config.secondaryImageCount ? config.secondaryAlternateDelay : config.secondaryInitialDelay;

        // First set 1 second, second and third set 5 seconds
        // Second set stacks randomly and third

        $($element)
          .find('li')
          .slice(photoIndex, photoIndex + config.secondaryImageCount)
          .each(function(idx, el) {
            var $el = $(el),
                num = Math.floor(Math.random() * 8) + 1,
                positionIdx = idx % 2 ? (idx - 1): idx,
                imgWidth = $el.data('width'),
                imgHeight = $el.data('height'),
                singleAnimation;

            num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

            if(imgWidth < imgHeight) {
              $el.css('max-width', config.secondaryImageSize);
            } else {
              $el.find('img').css('max-height', config.secondaryImageSize);
            }

            $el.css('top', topPositions[positionIdx]);

            singleAnimation = {
              e: $el,
              p: {
                translateX: [ 0, '-700px' ],
                scaleX: [1, 2.5],
                scaleY: [1, 2.5],
                rotateZ: [num, num * -1 * 4]
              },
              o: {
                duration: config.secondaryAnimationSpeed,
                easing: 'easeOut',
                delay: delay
              }
            };

            if(idx % 2) {
              singleAnimation.p.translateX = [ 0, '700px' ];
            }

            if(idx === 9) {
              singleAnimation.o.complete = function() {
                $rootScope.$broadcast('sephora:photoListAnimationComplete');
              };
            }

            vSequence.push(singleAnimation);
        });

        $.Velocity.RunSequence(vSequence);

        photoIndex = (photoIndex + config.secondaryImageCount < vm.photos.length) ? photoIndex + config.secondaryImageCount : vm.photos.length;
      };

      listeners.push($rootScope.$on('sephora:start', function() {
        vm.loadImages();
      }));

      listeners.push($rootScope.$on('sephora:animatePhotoList', function() {
        vm.animatePhotoList();
      }));

      $rootScope.$on('$destroy', function() {
        angular.forEach(listeners, function(listener) {
          listener();
        });
      });
    }
  }

})();
