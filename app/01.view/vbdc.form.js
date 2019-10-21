angular.module("vbdc-app").controller("vbdc.form.controller", function ($scope, metadataService,
    $location, vbdcService, $uibModal, $stateParams) {
    $scope.fCanEdit = function () {
        return true;
    }
    $scope.vm = {
        // document: {
        //     NamVanBan: new Date().getFullYear()
        // },
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
            var itemId = _.get($stateParams, "id");
            if (itemId) {
                vbdcService.getAllWithCaml("ThuocTinhVanBan", ["ID", "Title", "SoKyHieu", "NoiDung", "SoVanBan",
                    "NgayBanHanh", "TheThucVanBan", "TinhTrangHieuLuc", "DonViBienSoan", "TenVanBan", "NamVanBan",
                    "NguoiBienSoan", "NguoiNhanUyQuyen", "LanBanHanh", "LyDoBanHanh", "NguoiKy", "NgayKy", "ThamQuyenKy",
                    "NgayHieuLuc", "NgayHetHieuLuc", "NgayDinhChi", "NgayBiHuyBo", "NgaySuaDoi", "NgayBiThayThe", "VanBanLienQuan"],
                    "vbdc", "", "<View><Query>" +
                    '<Where><Eq><FieldRef Name="ID" /><Value Type="Number">' + itemId + '</Value></Eq></Where>' +
                    "</Query>" +
                "</View>")
                    .then(function (data) {
                        if (data.length > 0) {
                            $scope.vm.document = data[0];
                            $scope.vm.DVBS = JSON.parse(data[0].DonViBienSoan || "[]");
                        }
                        else {
                            $scope.vm.document = {
                                NamVanBan: new Date().getFullYear()
                            };
                        }
                    })
            }
            else {
                $scope.vm.document = {
                    NamVanBan: new Date().getFullYear()
                };
            }
            $scope.vm.departments = [];
            metadataService.getAllWithSelect("Departments", "Active ne 0", "Id,Title,Code,ParentCode,ItemOrder")
                .then(function (data) {
                    $scope.vm.departments = data;
                })
        },
        addRelatedDocuments: function () {
            $uibModal.open({
                animation: true,
                templateUrl: '$app/04.modals/select.vanban.template.html',
                controller: 'selectDocsCtrl as vm',
                size: 'lg',
                backdrop: 'static',
                windowClass: 'show',
                resolve: {}
            });
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
        // var fileInput = $("#fileTepVanBan");
        // if (_.get(fileInput[0], "files.length")) {
        //     errors.push({
        //         Group: "Trường dữ liệu bắt buộc",
        //         Field: "Tệp văn bản",
        //         Message: "Bắt buộc phải nhập dữ liệu"
        //     });
        // }

        // if (!(_.get($scope, "vm.tmp.SVB"))) {
        //     errors.push({
        //         Group: "Trường dữ liệu bắt buộc",
        //         Field: "Sổ văn bản",
        //         Message: "Bắt buộc phải nhập dữ liệu"
        //     });
        // }

        if (!(_.get($scope, "vm.document.TheThucVanBan"))) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Thể thức văn bản",
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

        if (!(_.get($scope, "vm.document.TenVanBan.length") > 0)) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Tên văn bản",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        if (!(_.get($scope, "vm.DVBS.length") > 0)) {
            errors.push({
                Group: "Trường dữ liệu bắt buộc",
                Field: "Đơn vị biên soạn",
                Message: "Bắt buộc phải nhập dữ liệu"
            });
        }

        _.set($scope, "vm.errors", errors);
        if (errors.length > 0) {
            return false;
        }
        return true;
    };

    $scope.vm.actions.saveItem = function () {
        if (!$scope.vm.actions.validateForm()) {
            return;
        }
        $.blockUI({
            message: '<h4>Đang cập nhật dữ liệu...</h4>',
        });
        $scope.vm.document.NguoiBienSoanId = _.get($scope.vm.document.NguoiBienSoan, "Id");
        $scope.vm.document.NguoiKyId = _.get($scope.vm.document.NguoiKy, "Id");
        $scope.vm.document.NguoiNhanUyQuyenId = _.get($scope.vm.document.NguoiNhanUyQuyen, "Id");
        delete $scope.vm.document.NguoiBienSoan;
        delete $scope.vm.document.NguoiKy;
        delete $scope.vm.document.NguoiNhanUyQuyen;
        $scope.vm.document.DonViBienSoan = JSON.stringify($scope.vm.DVBS || []);
        $scope.vm.document.Id = $scope.vm.document.ID;
        metadataService.saveItem($scope.vm.document, "ThuocTinhVanBan")
            .then(function (item) {
                if ($("#fileInput")[0] && $("#fileInput")[0].files.length > 0) {
                    vbdcService.uploadFile($scope.vm.arrayBuffer, $("#fileInput")[0].files[0].name, "VanBan", _spPageContextInfo.siteAbsoluteUrl + "/vbdc/VanBan")
                        .then(function (data) {
                            var fileId = data.get_listItemAllFields().get_id();
                            vbdcService.saveItem({ "Id": fileId, "ItemId": item.Id.toString() }, "VanBan")
                        })
                }
            })
            .then(function () {
                $.unblockUI();
                window.open(_spPageContextInfo.webAbsoluteUrl + "/default.aspx#/view/");
            })
            .catch(function (err) { })
            .finally(function () {
                $.unblockUI();
            })
    }

    $scope.vm.getMultiField = function (data) {
        var result = "";
        if (data.length > 0) {
            result = _.join(_.map(data, "Title"), ";");
        }
        return result;
    }
    //Kendo options
    $scope.vm.optLoaiVanBan = {
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
    },

        $scope.vm.optThamQuyenKy = {
            dataValueField: "Title",
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
            dataValueField: "Title",
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
