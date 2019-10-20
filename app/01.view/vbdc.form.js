angular.module("vbdc-app").controller("vbdc.form.controller", function ($scope, metadataService, $location, vbdcService) {
    $scope.vm = {
        document: {
            Nam: new Date().getFullYear()
        },
        isEdit: true,
        dataLoaded: true,
        form: {
            isNew: function () {
                return true;
            }
        }
    };
    $scope.vm.actions = {
        canUpdateRequestDetail: function () {
            return true;
        },
        goBack: function () {
            $location.path("/view");
        },
        load: function () {
            $scope.vm.departments = [];
            metadataService.getAllWithSelect("Departments", "Active ne 0", "Id,Title,Code,ParentCode,ItemOrder")
                .then(function (data) {
                    $scope.vm.departments = data;
                })
        }
    }
    //load
    $scope.vm.actions.load();

    //get arraybuffer from file
    $(document).on('change', '#fileInput', function () {
        if ($("#fileInput")[0] && $("#fileInput")[0].files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.vm.arrayBuffer = event.target.result;
            }
            reader.readAsDataURL($("#fileInput")[0].files[0]);
        }
    });

    //validate
    $scope.vm.actions.validateForm = function () {
        var errors = [];

        var fileInput = $("#fileTepVanBan");

        if (_.get(fileInput[0], "files.length") <= 0 && _.get($state, "current.name") === d01_CONSTANTS.APP_STATE.NEW_FORM.name) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Tệp văn bản",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        if (!(_.get($scope, "vm.document.SoVanBan.Id") > 0)) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Sổ văn bản",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        if (!(_.get($scope, "vm.document.LoaiVanBan.length") > 0)) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Loại văn bản",
                Message: "Bắt buộc phải nhập dữ liệu chính xác"
            });
        }

        if (!(_.get($scope, "vm.document.SoKyHieu.length") > 0)) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Số ký hiệu",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        if (!(_.get($scope, "vm.document.TrichYeu.length") > 0)) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Trích yếu",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        if (!_.get($scope, "vm.document.NgayDen")) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Ngày đến",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        if (!(_.get($scope, "vm.document.CoQuanBanHanh.length") > 0)) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Cơ quan ban hành",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        if (!(_.get($scope, "vm.document.SoDen"))) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Số đến",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        if (!_.get($scope, "vm.document.NgayThang")) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Ngày tháng văn bản",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        if (!(_.get($scope, "vm.document.SoTrang"))) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Số trang",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        // if (moment(_.get($scope, "vm.document.NgayThang")).startOf('day').isAfter(moment(_.get($scope, "vm.document.NgayDen")).startOf('day'))) {
        //     errors.push({
        //         Group: "Trường dữ liệu bắt buộc",
        //         Field: "Ngày đến",
        //         Message: "Ngày đến phải lớn hơn hoặc bằng ngày tháng văn bản"
        //     });
        // }


        _.set($scope, "vm.errors", errors);
        if (errors.length > 0) {
            return false;
        }
        return true;
    };
    //Save item

    $scope.vm.actions.saveItem = function () {

        // if (!$scope.vm.actions.validateForm()) {
        //     return;
        // }    
        vbdcService.saveItem({ "Title": "123" }, "DocumentMatadata")
            .then(function (item) {
                if ($("#fileInput")[0] && $("#fileInput")[0].files.length > 0) {
                    vbdcService.uploadFile($scope.vm.arrayBuffer, $("#fileInput")[0].files[0].name, "VanBan", _spPageContextInfo.siteAbsoluteUrl + "/vbdc/VanBan")
                        .then(function (data) {
                            var fileId = data.get_listItemAllFields().get_id();
                            vbdcService.saveItem({ "Id": fileId, "ItemId": item.get_id().toString() }, "VanBan")
                                .then(function () {

                                })
                        })
                }
            })
            .catch(function (err) {
                var err2 = err;
            })
    }

    //Kendo options
    $scope.vm.optLoaiVanBan = {
        dataValueField: "Id",
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
    },

        $scope.vm.optThamQuyenKy = {
            dataValueField: "Id",
            dataTextField: "Title",
            dataSource:
            {
                transport: {
                    read: function (options) {
                        metadataService.getAll("ThamQuyenBanHanh", "Active ne 0")
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
        },

        $scope.vm.optTinhTrangHieuLuc = {
            dataValueField: "Id",
            dataTextField: "Title",
            dataSource:
            {
                transport: {
                    read: function (options) {
                        metadataService.getAll("TinhTrangHieuLuc", "Active ne 0")
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
        },
        $scope.vm.optSoVanBan = {
            autoBind: false,
            valuePrimitive: true,
            dataSource: [
                "Sổ văn bản thường",
                "Sổ văn bản mật"
            ]
        }
});
