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
              "country": "Spain",
              "year": "2008",
              "unit": "GWh",
              "solar": 2578,
              "hydro": 26112,
              "wind": 32203,
              "nuclear": 58973
            },
            {
              "country": "Spain",
              "year": "2007",
              "unit": "GWh",
              "solar": 508,
              "hydro": 30522,
              "wind": 27568,
              "nuclear": 55103
            },
            {
              "country": "Spain",
              "year": "2006",
              "unit": "GWh",
              "solar": 119,
              "hydro": 29831,
              "wind": 23297,
              "nuclear": 60126
            },
            {
              "country": "Spain",
              "year": "2005",
              "unit": "GWh",
              "solar": 41,
              "hydro": 23025,
              "wind": 21176,
              "nuclear": 57539
            },
            {
              "country": "Spain",
              "year": "2004",
              "unit": "GWh",
              "solar": 56,
              "hydro": 34439,
              "wind": 15700,
              "nuclear": 63606
            },
            {
              "country": "Spain",
              "year": "2003",
              "unit": "GWh",
              "solar": 41,
              "hydro": 43897,
              "wind": 12075,
              "nuclear": 61875
            },
            {
              "country": "Spain",
              "year": "2002",
              "unit": "GWh",
              "solar": 30,
              "hydro": 26270,
              "wind": 9342,
              "nuclear": 63016
            },
            {
              "country": "Spain",
              "year": "2001",
              "unit": "GWh",
              "solar": 24,
              "hydro": 43864,
              "wind": 6759,
              "nuclear": 63708
            },
            {
              "country": "Spain",
              "year": "2000",
              "unit": "GWh",
              "solar": 18,
              "hydro": 31807,
              "wind": 4727,
              "nuclear": 62206
            }
          ])
        }
      },
      sort: {
        field: "year",
        dir: "asc"
      }
    });
  }]);
