(function() {
  'use strict';

  angular
    .module('sephora')
    .directive('logo', bannerText);

  /** @ngInject */
  function bannerText() {
    var directive = {
      restrict: 'E',
      template: '<img ng-src="/assets/images/logo.png" />',
      scope: {},
      controller: logoController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function logoController($rootScope, $element, config, timing) {
      /*jshint validthis:true */
      var vm = this,
          listeners = [];

      listeners.push($rootScope.$on('sephora:fadeLogoIn', function() {
        $element.velocity('fadeIn', {
          duration: config.fadeTime,
          delay: config.initialDelay,
          complete: function() {
            $rootScope.$broadcast('sephora:fadeLogoInComplete');
          }
        });
      }));

      $rootScope.$on('$destroy', function() {
        angular.forEach(listeners, function(listener) {
          listener();
        });
      });
    }
  }

})();
