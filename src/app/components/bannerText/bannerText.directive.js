(function() {
  'use strict';

  angular
    .module('sephora')
    .directive('bannerText', bannerText);

  /** @ngInject */
  function bannerText() {
    var directive = {
      restrict: 'E',
      template: '<img ng-src="/assets/images/text.png" />',
      scope: {},
      controller: bannerTextController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function bannerTextController($rootScope, $element, config, timing) {
      /*jshint validthis:true */
      var vm = this,
          listeners = [];


      listeners.push($rootScope.$on('sephora:fadeBanner', function() {
        $element.velocity('fadeOut', {
          duration: config.fadeTime
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
