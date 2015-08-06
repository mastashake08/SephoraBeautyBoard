(function() {
  'use strict';

  angular
    .module('sephora')
    .factory('api', api);

  /** @ngInject */
  function api(config, utils, $log, $http, $cookies) {
    var apiHost = config.apiURL;

    var service = {
      apiHost: apiHost,
      getCameo: getCameo,
      getSecondary: getSecondary
    };

    return service;

    function getCameo(data) {
      return $http.get(apiHost + '/gallery/get_sotf_main.json', { params: data })
        .then(getCameoComplete)
        .catch(getCameoFailed);

      function getCameoComplete(response) {
        var results = response.data.results;

        if(results.length > 0) {
          $cookies.put('content_id', results[results.length - 1].content_id)
        }

        return results;
      }

      function getCameoFailed(error) {
        $log.error('XHR Failed for getCameo.\n' + angular.toJson(error.data, true));
      }
    }

    function getSecondary(data) {
      return $http.get(apiHost + '/gallery/get_sotf_secondary.json', { params: data })
        .then(getSecondaryComplete)
        .catch(getSecondaryFailed);

      function getSecondaryComplete(response) {
        var photoData = [];

        photoData = photoData.concat(response.data.results.by_store);
        photoData = photoData.concat(response.data.results.countouring);
        photoData = photoData.concat(response.data.results.featured);
        photoData = photoData.concat(response.data.results.popular);
        photoData = photoData.concat(response.data.results.smokey_eye);

        return utils.shuffleArray(photoData);
      }

      function getSecondaryFailed(error) {
        $log.error('XHR Failed for getSecondary.\n' + angular.toJson(error.data, true));
      }
    }
  }
})();
