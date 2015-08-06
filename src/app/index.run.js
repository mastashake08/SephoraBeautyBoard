(function() {
  'use strict';

  angular
    .module('sephora')
    .run(runBlock);

  /** @ngInject */
  function runBlock($location, $rootScope, $timeout, $window, config, timing) {
    var params = $location.search();

    $rootScope.store_id = 'store_name' in params ? params.store_name : config.storeID;

    //Refresh screen at this interval
    $rootScope.refresh_interval = 'refresh_interval' in params ? params.refresh_interval : config.refreshInterval;

    $rootScope.refresh_api_interval = 'refresh_api_interval' in params ? params.refresh_api_interval : config.refreshApiInterval;

    $rootScope.$on('sephora:contentDone', function() {
      timing.init();
    });

    $timeout(function(){
      $window.location.reload();
    }, $rootScope.refresh_interval);
  }
})();
