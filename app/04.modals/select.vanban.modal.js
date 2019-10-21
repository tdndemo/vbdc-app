angular.module("vbdc-app").controller("selectDocsCtrl",
    ["$scope", "$uibModalInstance", "$document",
        function ($scope, $uibModalInstance, $document) {
            $scope.vm = {};

            $scope.vm.deleteItem = function () {
                $uibModalInstance.close(true);
            }

            $scope.vm.cancel = function () {
                $uibModalInstance.dismiss();
            }

        }]);