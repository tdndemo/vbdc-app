angular.module("vbdc-app").controller("vbdc.view.controller", [
  "$scope",
  function($scope) {
    $scope.vm = {};
    $scope.vm.advancedSearchMode = false;
    $scope.vm.items = [{ SoKyHieu: 1 }];

    $scope.vm.toggleFilterPanel = (value) => {
      _.set($scope, "vm.advancedSearchMode", value);
    };
  }
]);
