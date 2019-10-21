angular.module("vbdc-app").controller("selectDocsCtrl",
    ["$scope", "$uibModalInstance", "metadataService",
        function ($scope, $uibModalInstance, metadataService) {
            $scope.vm = {};

            $scope.vm.deleteItem = function () {
                $uibModalInstance.close(true);
            }

            $scope.vm.cancel = function () {
                $uibModalInstance.dismiss();
            }

            $scope.vm.loaiVanBanOptions = {
                dataValueField: "Title",
                dataTextField: "Title",
                dataSource:
                {
                    transport: {
                        read: function (options) {
                            metadataService.getAll("TheThucVanBan", "Active ne 0")
                                .then(function (data) {
                                    if (data.length > 0) {
                                        options.success(data);
                                    } else {
                                        options.success([]);
                                    }
                                })
                                .catch(function () {
                                    options.success([]);
                                });
                        }
                    }
                },
                filter: "contains"
            }

            $scope.vm.LinhVucOpt = {
                dataValueField: "Title",
                dataTextField: "Title",
                dataSource:
                {
                    transport: {
                        read: function (options) {
                            metadataService.getAll("LinhVuc", "Active ne 0")
                                .then(function (data) {
                                    if (data.length > 0) {
                                        options.success(data);
                                    } else {
                                        options.success([]);
                                    }
                                })
                                .catch(function () {
                                    options.success([]);
                                });
                        }
                    }
                },
                filter: "contains"
            }

        }]);