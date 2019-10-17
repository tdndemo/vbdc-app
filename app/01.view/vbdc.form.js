angular.module("vbdc-app").controller("vbdc.form.controller", function($scope, metadataService, $location) {
  $scope.vm = {
    document: {
      Nam: new Date().getFullYear()
    },    
    isEdit: true,
    dataLoaded: true,
    form : {
      isNew: function(){
        return true;
      }
    }    
  }; 
  $scope.vm.actions = {
    canUpdateRequestDetail: function(){
      return true;
    },
    goBack: function(){
      $location.path("/view");
    },
    load: function(){
      $scope.vm.departments = [];
      metadataService.getAllWithSelect("Departments", "Active ne 0", "Id,Title,Code,ParentCode,ItemOrder")
        .then(function(data){
          $scope.vm.departments = data;
        })
    }
  }
  $scope.vm.actions.load();

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

    if (moment(_.get($scope, "vm.document.NgayThang")).startOf('day').isAfter(moment(_.get($scope, "vm.document.NgayDen")).startOf('day'))) {
        errors.push({
            Group: "Trường dữ liệu bắt buộc",
            Field: "Ngày đến",
            Message: "Ngày đến phải lớn hơn hoặc bằng ngày tháng văn bản"
        });
    }


    _.set($scope, "vm.errors", errors);
    if (errors.length > 0) {
        return false;
    }
    return true;
  };
  //Save item
  /*
  $scope.vm.actions.saveItem = function () {

    if (!$scope.vm.actions.validateForm()) {
        return;
    }

    $scope.vm.processRequestBeforeSaving();
    Fx.blockUI();
    var itemId = _.get($stateParams, "id");
    if (_.get($scope, "vm.AddCoQuanBanHanh") == true) {
        _.set($scope, "vm.Department.Title", _.get($scope, "vm.document.CoQuanBanHanh"));
        _.set($scope, "vm.Department.Active", true);
        _.set($scope, "vm.Department.isOutDoc", false);
        $CoQuanBanHanh.save($scope.vm.Department);
    }

    var filter = ("(SoVanBan/Id eq '" + _.get($scope, "vm.document.SoVanBan.Id") + "') and (SoKyHieu eq '"
        + _.get($scope, "vm.document.SoKyHieu") + "' or SoDen eq " + _.get($scope, "vm.document.SoDen") + ")"
        + " and ChiNhanhTaoVBCode eq '" + _.get($scope, "vm.document.ChiNhanhTaoVBCode") + "'");
    var query = {};
    query.$filter = filter;

    $docs
        .getAll({
            params: query
        })
        .then(function (data) {
            var findSKH = _.find(data, function (so) {
                return so.SoKyHieu == _.get($scope, "vm.document.SoKyHieu");
            });
            var findSo = _.find(data, function (so) {
                return so.SoDen == _.get($scope, "vm.document.SoDen") && so.Year == _.get($scope, "vm.document.Year");
            });

            if (itemId > 0 && _.get($state, "current.name") === d01_CONSTANTS.APP_STATE.DISPLAY_FORM.name) {
                if ((_.get(findSKH, "Id") > 0 && _.get($scope, "vm.document.Id") != _.get(findSKH, "Id")) ||
                    (_.get(findSo, "Id") > 0 && _.get($scope, "vm.document.Id") != _.get(findSo, "Id"))) {
                    if (_.get($scope, "vm.errors.length") < 0) {
                        _.set($scope, "vm.errors", []);

                    }
                    if (_.get(findSKH, "Id") > 0 && _.get($scope, "vm.document.Id") != _.get(findSKH, "Id")) {
                        _.get($scope, "vm.errors").push({
                            Group: "Trường dữ liệu bắt buộc",
                            Field: "Số ký hiệu",
                            Message: "Số ký hiệu bị trùng"
                        });
                    }
                    if (_.get(findSo, "Id") > 0 && _.get($scope, "vm.document.Id") != _.get(findSo, "Id")) {
                        _.get($scope, "vm.errors").push({
                            Group: "Trường dữ liệu bắt buộc",
                            Field: "Số đến",
                            Message: "Số đến bị trùng"
                        });
                    }
                    Fx.unblockUI();
                } else {
                    var fileInput = $("#fileTepVanBan");
                    if (_.get(fileInput[0], "files.length") > 0) {
                        $fxUtils.updateFileToFolder(_.get($scope, "vm.siteUrl"), "fileTepVanBan", _.get($scope, "vm.document.File.Name"), "Documents").then(function (data) {
                            $docs
                               .save($scope.vm.document)

                               .then(function () {
                                   $msg.success(GLOBAL_CONSTANTS.DEFAULT_MESSAGES.ITEM.SAVE.SUCCESS);
                                   $scope.vm.form.load();
                               })
                               .catch(function (error) {
                                   console.log(error);
                                   $msg.error(GLOBAL_CONSTANTS.DEFAULT_MESSAGES.ERROR_OCCURRED);
                               })
                               .finally(function () {
                                   Fx.unblockUI();
                               });
                        });
                    }
                    else {
                        $docs
                           .save($scope.vm.document)

                           .then(function () {
                               $msg.success(GLOBAL_CONSTANTS.DEFAULT_MESSAGES.ITEM.SAVE.SUCCESS);
                               $scope.vm.form.load();
                           })
                           .catch(function (error) {
                               console.log(error);
                               $msg.error(GLOBAL_CONSTANTS.DEFAULT_MESSAGES.ERROR_OCCURRED);
                           })
                           .finally(function () {
                               Fx.unblockUI();
                           });
                    }

                }
            }
            else {
                if (_.get(findSKH, "Id") > 0 || _.get(findSo, "Id") > 0) {
                    if (_.get($scope, "vm.errors.length") < 0) {
                        _.set($scope, "vm.errors", []);

                    }
                    if (_.get(findSKH, "Id") > 0) {
                        _.get($scope, "vm.errors").push({
                            Group: "Trường dữ liệu bắt buộc",
                            Field: "Số ký hiệu",
                            Message: "Số ký hiệu bị trùng"
                        });
                    }
                    if (_.get(findSo, "Id") > 0) {
                        _.get($scope, "vm.errors").push({
                            Group: "Trường dữ liệu bắt buộc",
                            Field: "Số đến",
                            Message: "Số đến bị trùng"
                        });
                    }
                    Fx.unblockUI();
                } else {
                    var file = $("#fileTepVanBan")[0].files[0];
                    var doc = {};
                    if (_.get($scope, "vm.document.IsHO")) {
                        $scope.vm.actions.setPermissionGroup(_.get($scope, "vm.groupVanThuTitle"));
                        $scope.vm.actions.setPermissionGroup(_.get($scope, "vm.groupChanhTitle"));
                    } else {

                    }
                    $docs
                        .uploadDocument(file, _.get($scope, "vm.document"))
                        .then(function (document) {

                            return $scope.vm.attachmentCtrl.upload("" + document.Id)
                                        .then(function (result) {
                                            _.set(document, "RequestAttachments", result);
                                            _.set(document, "DuocChinhSuaThongTin", true);
                                            if (!_.get(document, "IsHO")) {
                                                _.set(document, "TinhTrang", d01_CONSTANTS.STATUS.DRAFT);
                                                $scope.vm.actions.getUser(_.get(document, "ChiNhanhTaoVB.BanLanhDao.Title"));
                                                _.set($scope.vm, "task.Title", "Kính chuyển giám đốc chi nhánh để xử lý");
                                                _.set($scope.vm, "task.Desc", "Kính chuyển giám đốc chi nhánh để xử lý");
                                            }
                                            _.set(document, "DanhSachDuocXem", _.get($scope, "vm.document.DanhSachDuocXem"))
                                            return $docs.save(document).then(function (data) {
                                                doc = data;
                                                var groupPer=[];
                                                if (_.get(doc, "IsHO")) {
                                                    _.set($scope.vm, "task.Title", "Kính chuyển ban Trợ lý quản trị để xử lý");
                                                    _.set($scope.vm, "task.Desc", "Kính chuyển ban Trợ lý quản trị để xử lý");
                                                    groupPer = [_.get($scope, "vm.groupVanThuId"), _.get($scope, "vm.groupChanhId")];
                                                } else {
                                                    _.set($scope.vm, "task.AssignedToGroup", [{ Id: _.get(doc, "ChiNhanhTaoVB.BanLanhDao.Id") }]);
                                                    groupPer = [_.get(doc, "ChiNhanhTaoVB.AdminManagerGroup.Id"), _.get(doc, "ChiNhanhTaoVB.BanLanhDao.Id")];
                                                }
                                                _.set($scope.vm, "task.Document.Id", _.get(doc, "Id"));
                                                _.set($scope.vm, "task.Status", d01_CONSTANTS.TASK_STATUS.PENDING);
                                                return $fxTasks
                                                     .save(_.get($scope.vm, "task"))
                                                     .then(function (data1) {
                                                         var readers = [_.get(data1, "NguoiXuLyChinh.Id")];
                                                         $scope.vm.actions.sendMail(readers, []);
                                                         var assignedTo = _.map(_.get(data1, "AssignedTo"), function (item) {
                                                             return _.get(item, "Id")
                                                         })
                                                         var assignedToGroup = _.map(_.get(data1, "AssignedToGroup"), function (item) {
                                                             return _.get(item, "Id")
                                                         })
                                                         if (!(_.get($scope, "item.AssignedToGroup.Id") > 0)) {
                                                             return $docs.backup(data).then(function (doc) {
                                                                 return $permissions
                                                                      .setPermissions("VanBanDen", _.get(doc, "Id"), _.concat(readers, assignedTo, assignedToGroup, groupPer), [], null)
                                                             });
                                                         }
                                                     })
                                                 .then(function () {
                                                     _.set($scope.vm, "task", {});
                                                 })
                                            });
                                        });

                        })
                        .then(function () {
                            $msg.success(GLOBAL_CONSTANTS.DEFAULT_MESSAGES.ITEM.SAVE.SUCCESS);
                            $scope.vm.form.load();
                        })
                        .catch(function (error) {
                            console.log(error);

                            $msg.error(GLOBAL_CONSTANTS.DEFAULT_MESSAGES.ERROR_OCCURRED);
                        })
                        .finally(function () {
                            Fx.unblockUI();
                        });
                }
            }

        });


  }
  */
  //Kendo options
  $scope.vm.optLoaiVanBan = {
    dataValueField: "Id",
    dataTextField: "Title",
    dataSource:
      {
          transport: {
              read: function (options) {
                metadataService.getAll("TheThucVanBan","Active ne 0")
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
                metadataService.getAll("ThamQuyenBanHanh","Active ne 0")
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
                metadataService.getAll("TinhTrangHieuLuc","Active ne 0")
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
