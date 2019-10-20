angular.module("vbdc-app").controller("confirm.delete.modal.controller",
    ["$scope", "$uibModalInstance",
        function ($scope, $uibModalInstance) {
            $scope.vm = {};

            $scope.vm.deleteItem = function () {
                $uibModalInstance.close(true);
            }

            $scope.vm.cancel = function () {
                $uibModalInstance.dismiss();
            }

        }]);