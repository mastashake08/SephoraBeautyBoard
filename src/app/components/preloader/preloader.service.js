(function () {
  'use strict';

  angular
    .module('sephora')
    .service('preloader', preloader);

  /** @ngInject */
  function preloader($q, $rootScope, config) {

    var service = {
      preloadImages: preloadImages,
      preloadImage: preloadImage,
      handleImageLoad: handleImageLoad,
      handleImageError: handleImageError
    };

    return service;

    function preloadImages(images) {
      service.processedImages = [];
      service.num = 0;
      service.count = images.length;
      service.deferred = $q.defer();
      service.promise = service.deferred.promise;

      angular.forEach(images, function(image) {
        service.preloadImage(image);
      });

      return( service.promise );
    }

    function preloadImage(image, size) {
      var imageLoader;

      size = size ? size : config.apiImageSizeMedium;
      
      imageLoader = $(new Image())
        .load(
          function (event) {

            // Since the load event is asynchronous, we have to
            // tell AngularJS that something changed.
            $rootScope.$apply(
              function () {

                service.handleImageLoad(image);

                // Clean up object reference to help with the
                // garbage collection in the closure.
                imageLoader = event = null;

              }
            );

          }
        )
        .error(
          function (event) {

            // Since the load event is asynchronous, we have to
            // tell AngularJS that something changed.
            $rootScope.$apply(
              function () {

                service.handleImageError(image);

                // Clean up object reference to help with the
                // garbage collection in the closure.
                imageLoader = event = null;
              }
            );

          }
        )
        .prop('src', image.media[size]);
    }

    function handleImageLoad(image) {
      service.processedImages.push(image);

      if(service.num < service.count - 1) {
        service.num++;
      } else {
        service.deferred.resolve( service.processedImages );
      }
    }

    function handleImageError() {
      service.deferred.reject();
    }
  }
})();
