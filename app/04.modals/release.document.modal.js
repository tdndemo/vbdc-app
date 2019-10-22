angular.module("vbdc-app").controller("release.document.modal.controller",
  ["$scope", "$uibModalInstance", "metadataService",
    function ($scope, $uibModalInstance, $metadataService) {
      $scope.vm = {};

      $scope.vm.search = function () {
        $scope.vm.departments = [];
        $metadataService.getAllWithSelect("Departments", "Active ne 0", "Id,Title,Code,ParentCode,ItemOrder")
          .then(function (data) {
            $scope.vm.departments = data;
          })
      }

      $scope.vm.deleteItem = function () {
        $uibModalInstance.close(true);
      }

      $scope.vm.cancel = function () {
        $uibModalInstance.dismiss();
      }

    }]);