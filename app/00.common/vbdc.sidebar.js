angular.module("vbdc-app").controller("vbdc.sidebar.controller", [
  "$scope", "spUserService",
  function ($scope, $spUserService) {
    $scope.vm = {};

    $scope.vm.search = function () {
      $spUserService.getCurrentProfile()
        .then((data) => {
          _.set($scope, "vm.userProfile", data);
        })
    }

    $scope.vm.search();
  }
]);
