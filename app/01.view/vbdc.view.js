angular.module("vbdc-app").controller("vbdc.view.controller", [
  "$scope", "vbdcService",
  function ($scope, $vbdcService) {
    $scope.vm = {};
    $scope.vm.advancedSearchMode = false;
    $scope.vm.items = [{ SoKyHieu: 1 }];

    $scope.vm.toggleFilterPanel = (value) => {
      _.set($scope, "vm.advancedSearchMode", value);
    };

    $scope.vm.search = function() {
      $vbdcService.getItemsByCalm()
        .then((data) => { 
          console.log(data) 
        })
    }

    $scope.vm.search();
  }
]);
