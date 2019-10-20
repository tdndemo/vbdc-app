angular.module("vbdc-app").controller("vbdc.dashboard.controller", [
  "$scope", "vbdcService", function ($scope, $vbdcService) {
    $scope.vm = {};

    $scope.vm.search = function () {

      var query = "<View><Query>" +
        '<OrderBy><FieldRef Name="Created" Ascending="FALSE"/></OrderBy>' +
        "</Query>" +
        "<RowLimit>10</RowLimit>" +
        "</View>";
      $vbdcService.getAllWithCaml("ThuocTinhVanBan", ["ID", "Title", "SoKyHieu", "NoiDung", "SoVanBan", "NgayBanHanh", "TheThucVanBan", "TinhTrangHieuLuc"],
        "vbdc", undefined, query)
        .then((data) => {
          _.set($scope, "vm.items", data);
          _.set($scope, "vm.itemsActive", _.filter(data, (d) => {
            return d.TinhTrangHieuLuc === 'Hiệu lực';
          }));
          _.set($scope, "vm.itemsDeactive", _.filter(data, (d) => {
            return d.TinhTrangHieuLuc === 'Hết hiệu lực';
          }));
        })
    }

    $scope.vm.search();

    $scope.electricity = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          options.success([
            {
              "country": "Demo Company",
              "month": "8/2019",
              "unit": "Văn bản",
              "all": 100,
              "active": 60,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "month": "7/2019",
              "unit": "Văn bản",
              "all": 120,
              "active": 80,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "month": "6/2019",
              "unit": "Văn bản",
              "all": 90,
              "active": 50,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "month": "5/2019",
              "unit": "Văn bản",
              "all": 60,
              "active": 20,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "month": "4/2019",
              "unit": "Văn bản",
              "all": 140,
              "active": 60,
              "deactive": 80,
            },
            {
              "country": "Demo Company",
              "month": "3/2019",
              "unit": "Văn bản",
              "all": 100,
              "active": 60,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "month": "2/2019",
              "unit": "Văn bản",
              "all": 120,
              "active": 60,
              "deactive": 60,
            },
            {
              "country": "Demo Company",
              "month": "1/2019",
              "unit": "Văn bản",
              "all": 110,
              "active": 70,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "month": "9/2019",
              "unit": "Văn bản",
              "all": 100,
              "active": 60,
              "deactive": 40,
            },
          ])
        }
      },
      sort: {
        field: "month",
        dir: "asc"
      },
    });
  }]);
