angular.module("vbdc-app").controller("vbdc.metadata.setting.controller", [
  "$scope", "spUserService", "metadataService", "$state", "vbdcService", "$uibModal",
  function ($scope, $spUserService, $metadataService, $state, $vbdcService, $uibModal) {
    $scope.vm = {};
    $scope.vm.listName = '';

    $scope.vm.isLinhVucSetting = function () {
      return _.get($state, "current.name") === "setting-linhvuc";
    }

    $scope.vm.isTheThucVanBanSetting = function () {
      return _.get($state, "current.name") === "setting-thethuvanban";
    }

    $scope.vm.isViewAll = function () {
      return _.get($state, "current.name") === "vbdc-all-view";
    }

    $scope.vm.getViewName = function () {
      if ($scope.vm.isLinhVucSetting()) {
        $scope.vm.viewName = "Lĩnh vực";
        $scope.vm.listName = "LinhVuc";
      } else if ($scope.vm.isTheThucVanBanSetting()) {
        $scope.vm.viewName = "Thể thức văn bản";
        $scope.vm.listName = "TheThucVanBan";
      } else if ($scope.vm.isDeActiveView()) {
        $scope.vm.viewName = "Văn bản hết hiệu lực";
      } else if ($scope.vm.isViewAll()) {
        $scope.vm.viewName = "Toàn bộ văn bản";
      }
    }
    $scope.vm.getViewName();

    $scope.vm.search = function () {
      $scope.vm.dataLoaded = false;
      $spUserService.getCurrentProfile()
        .then((data) => {
          _.set($scope, "vm.userProfile", data);
          return $metadataService.getAll($scope.vm.listName, "Active ne 0")
        })
        .then(function (items) {
          _.set($scope, "vm.items", items);
          $scope.vm.dataLoaded = true;
        })
        .finally(function () {

        })
    }

    $scope.vm.search();

    $scope.vm.actions = {
      editItem: function (item) {
        _.set(item, "isEdit", true);
      },
      save: function (item) {
        $.blockUI({
          message: '<h4>Đang cập nhật dữ liệu...</h4>',
        });
        delete item.isEdit;
        $vbdcService.saveItem(_.pick(item, ["Id", "Title", "ItemOrder", "Active", "Code"]), $scope.vm.listName)
          .then(function () {
            //$msg.success("Dữ liệu đã được tạo thành công.");
            $scope.vm.search();
          })
          .catch(function (e) {
            //$msg.error("Có lỗi trong quá trình xử lý. Hãy liên hệ với Quản trị hệ thống để được hỗ trợ.");
          })
          .finally(function () {
            $.unblockUI();
          });
      },
      deleteItem: function (item) {
        $uibModal.open({
          templateUrl: "$app/04.modals/confirm.delete.template.html",
          backdrop: "static",
          windowClass: 'show',
          controller: "confirm.delete.modal.controller",
          size: "sm",
          resolve: {}
        })
          .result.then(function (result) {
            if (result) {
              $.blockUI({
                message: '<h4>Đang cập nhật dữ liệu...</h4>',
              });
              $vbdcService
                .deleteItem(_.get(item, "Id"), "vbdc", $scope.vm.listName)
                .then(function () {
                  //$msg.success("Dữ liệu đã được xóa thành công.");
                  $scope.vm.search();
                })
                .catch(function (error) {
                  //$msg.error("Có lỗi trong quá trình xử lý. Hãy liên hệ với Quản trị hệ thống để được hỗ trợ.");
                })
                .finally(function () {
                  $.unblockUI();
                });
            }
            else {
              $scope.vm.formLoad();
              Fx.unblockUI();
            }
          });

      },
      cancel: function (item) {
        item.isEdit = false;
        $scope.vm.formLoad();
      },
      getClass: function (item) {
        return "text-blue"
      },
    };
  }
]);
