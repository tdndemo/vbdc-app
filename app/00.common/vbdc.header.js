"use strict";
(function(app, $) {
  app.directive("vbdcHeader", [
    function() {
      return {
        restrict: "E",
        templateUrl: "$app/00.common/vbdc.header.html",
        scope: {},
        link: function($scope, element, attr, modelCtrl) {},
        controller: ["$scope", function($scope) {}]
      };
    }
  ]);
})(angular.module("vbdc-app"), jQuery);
