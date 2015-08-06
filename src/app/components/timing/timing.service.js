(function() {
  'use strict';

  angular
    .module('sephora')
    .factory('timing', timing);

  /** @ngInject */
  function timing($rootScope) {

    var service = {
      init: init,
      listeners: []
    };

    service.listeners.push($rootScope.$on('sephora:photoListLoaded', function() {
      $rootScope.$broadcast('sephora:fadeLogoIn');
      $rootScope.$broadcast('sephora:fadeBanner');
    }));

    service.listeners.push($rootScope.$on('sephora:fadeLogoInComplete', function() {
      $rootScope.$broadcast('sephora:animatePhotoList');
    }));

    service.listeners.push($rootScope.$on('sephora:photoListAnimationComplete', function() {
      $rootScope.$broadcast('sephora:animateCameoList');
    }));

    service.listeners.push($rootScope.$on('sephora:cameoListAnimationComplete', function() {
      $rootScope.$broadcast('sephora:animatePhotoList');
    }));

    return service;

    function init() {
      $rootScope.$broadcast('sephora:start');
    }
  }
})();
