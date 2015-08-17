(function() {
  'use strict';

  angular
    .module('sephora')
    .constant('config', {
      initialDelay: 2500, // Initial delay to hold banner images
      secondaryTotal: 33, // Total number of small images
      secondaryPreloadCount: 10, // Number to preload
      secondaryImageCount: 10, // Number on screen
      secondaryTopPositions: [0, 0, 725, 725, 1450, 1450, 2175, 2175, 2900, 2900], //Positions relative to top
      secondaryAnimationSpeed: 200, // Speed of transition in ms
      secondaryInitialDelay: 800, // Time to wait for intial photos in ms
      secondaryAlternateDelay: 2800, // Time to wait for secondary photos in ms
      secondaryImageSize: 354, // Smallest edge in px
      featuredTotal: 12, // Number of cameos to pull at each interval
      featuredImageCount: 12, // Number of cameos to show on screen in each check
      featuredAnimationSpeed: 1000, // Speed of transition in ms
      featuredAnimationDelay: 5000, // Time to wait for intial photos in ms
      refreshInterval: 184000, // 3 minutes and 4 seconds
      refreshApiInterval: 30000, // 5 second only used by cameos
      fadeTime: 2500, // Time for fadein/fadeout in ms
      storeID: 'Powell Street', // Temporarily put in powell store
      apiImageSizeLarge: 'large',
      apiImageSizeMedium: 'medium',
      apiURL: 'http://gallery-qa.sephora.com/v4/api' // QA Server
      //apiURL: 'http://gallery.sephora.com/v4/api' // Live Server
  });

})();
