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
            $scope.vm.items = [];
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
                            if (_.get($scope.vm.document.VanBanLienQuan, "length") > 0) {
                                var listId = _.compact($scope.vm.document.VanBanLienQuan.split(";"));
                                var temp = "";
                                var orquery = _.map(listId, function (id) {
                                    return String.format("<Eq><FieldRef Name='ID' /><Value Type='Number'>{0}</Value></Eq>",
                                        id);
                                });
                                _.forEach(orquery, function (item) {
                                    if (temp) {
                                        temp = "<Or>" + temp + item + "</Or>";
                                    } else {
                                        temp = item;
                                    }
                                });
                                temp = "<View><Query><OrderBy><FieldRef Name='Created' Ascending='FALSE'/></OrderBy><Where>" +
                                    temp + "</Where></Query><RowLimit>25</RowLimit></View>";
                                vbdcService.getAllWithCaml("ThuocTinhVanBan", ["ID", "Title", "SoKyHieu", "NoiDung", "SoVanBan",
                                    "NgayBanHanh", "TheThucVanBan", "TinhTrangHieuLuc", "DonViBienSoan", "TenVanBan", "NamVanBan",
                                    "NguoiBienSoan", "NguoiNhanUyQuyen", "LanBanHanh", "LyDoBanHanh", "NguoiKy", "NgayKy", "ThamQuyenKy",
                                    "NgayHieuLuc", "NgayHetHieuLuc", "NgayDinhChi", "NgayBiHuyBo", "NgaySuaDoi", "NgayBiThayThe", "VanBanLienQuan"],
                                    "vbdc", "", temp)
                                    .then(function (data) {
                                        $scope.vm.items = data;
                                    });
                            }
                            else {
                                $scope.vm.items = [];
                            }
                        }
                        else {
                            $scope.vm.document = {
                                NamVanBan: new Date().getFullYear()
                            };
                            $scope.vm.items = [];
                        }
                    })
            }
            else {
                $scope.vm.document = {
                    NamVanBan: new Date().getFullYear(),
                };
                $scope.vm.items = [];
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
                resolve: {
                    $parent: function () {
                        return $scope.vm
                    }
                }
            });
        },
        releaseDoc: function () {
            $uibModal.open({
                animation: true,
                templateUrl: '$app/04.modals/release.document.template.html',
                controller: 'release.document.modal.controller',
                size: 'lg',
                backdrop: 'static',
                windowClass: 'show',
                resolve: {
                    $parent: function () {
                        return $scope.vm
                    }
                }
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
        if ($scope.vm.items.length > 0) {
            $scope.vm.document.VanBanLienQuan = _.join(_.map($scope.vm.items, "ID"), ";");
        }
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
                $location.path("/view");
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
    $scope.vm.optLoaiVanBanLienQuan = {
        autoBind: false,
        valuePrimitive: true,
        dataSource: [
            "Loại 1",
            "Loại 2"
        ]
    }
});
