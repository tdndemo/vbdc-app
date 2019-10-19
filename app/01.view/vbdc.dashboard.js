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

    $scope.onSeriesHover = function (e) {
      kendoConsole.log(kendo.format("event :: seriesHover ({0} : {1})", e.series.name, e.value));
    };

    $scope.electricity = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          options.success([
            {
              "country": "Demo Company",
              "year": "2008",
              "unit": "Văn bản",
              "all": 100,
              "active": 60,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "year": "2007",
              "unit": "Văn bản",
              "all": 120,
              "active": 80,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "year": "2006",
              "unit": "Văn bản",
              "all": 90,
              "active": 50,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "year": "2005",
              "unit": "Văn bản",
              "all": 60,
              "active": 20,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "year": "2004",
              "unit": "Văn bản",
              "all": 140,
              "active": 60,
              "deactive": 80,
            },
            {
              "country": "Demo Company",
              "year": "2003",
              "unit": "Văn bản",
              "all": 100,
              "active": 60,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "year": "2002",
              "unit": "Văn bản",
              "all": 120,
              "active": 60,
              "deactive": 60,
            },
            {
              "country": "Demo Company",
              "year": "2001",
              "unit": "Văn bản",
              "all": 110,
              "active": 70,
              "deactive": 40,
            },
            {
              "country": "Demo Company",
              "year": "2000",
              "unit": "Văn bản",
              "all": 100,
              "active": 60,
              "deactive": 40,
            },
          ])
        }
      },
      sort: {
        field: "year",
        dir: "asc"
      }
    });
  }]);
