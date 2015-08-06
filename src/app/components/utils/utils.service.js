(function() {
  'use strict';

  angular
    .module('sephora')
    .factory('utils', utils);

  /** @ngInject */
  function utils() {

    var service = {
      shuffleArray: shuffleArray
    };

    return service;

    function shuffleArray(o) {
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    }
  }
})();
