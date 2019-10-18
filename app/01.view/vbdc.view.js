angular.module("vbdc-app").controller("vbdc.view.controller", [
  "$scope", "vbdcService",
  function ($scope, $vbdcService) {
    $scope.vm = {};
    $scope.vm.advancedSearchMode = false;

    $scope.vm.toggleFilterPanel = (value) => {
      _.set($scope, "vm.advancedSearchMode", value);
    };

    $scope.vm.buildQuery = function () {
      var criteria = _.get($scope, "vm.searchCriteria");
      var query = "";

      if (_.get(criteria, "SoKyHieu")) {
        if (query) {
          query = "<And>" + query + "<Contains><FieldRef Name='SoKyHieu' /><Value Type='Text'>" + _.get(criteria, "SoKyHieu") + "</Value></Contains></And>";
        } else {
          query = "<Contains><FieldRef Name='SoKyHieu' /><Value Type='Text'>" + _.get(criteria, "SoKyHieu") + "</Value></Contains>";
        }
      }
      if (_.get(criteria, "Keyword")) {
        var orquery = [];
        var temp = "";
        orquery.push(String.format("<Contains><FieldRef Name='Title' /><Value Type='Text'>{0}</Value></Contains>",
          criteria.Keyword));
        orquery.push(String.format("<Contains><FieldRef Name='SoKyHieu' /><Value Type='Text'>{0}</Value></Contains>",
          criteria.Keyword));

        _.forEach(orquery, function (item) {
          if (temp) {
            temp = "<Or>" + temp + item + "</Or>";
          } else {
            temp = item;
          }
        });
        if (query) {
          query = "<And>" + query + temp + "</And>";
        } else {
          query = temp;
        }
      }
      if (_.get(criteria, "DocumenTypes.length") > 0) {
        var temp = "";
        var orquery = _.map(_.map(criteria.DocumenTypes, "Title"), function (title) {
          return String.format("<Eq><FieldRef Name='TheThucVanBan' /><Value Type='Text'>{0}</Value></Eq>",
            title);
        });
        _.forEach(orquery, function (item) {
          if (temp) {
            temp = "<Or>" + temp + item + "</Or>";
          } else {
            temp = item;
          }
        });
        if (query) {
          query = "<And>" + query + temp + "</And>";
        } else {
          query = temp;
        }
      }
      if (_.get(criteria, "NgayBSFrom")) {
        if (query) {
          query = "<And>" + query + "<Geq><FieldRef Name='NgayThangVanBan' /><Value IncludeTimeValue='FALSE' Type='DateTime'>" + dateFormat(_.get(criteria, "NgayBSFrom")) + "</Value></Geq></And>";
        } else {
          query = "<Geq><FieldRef Name='NgayThangVanBan' /><Value IncludeTimeValue='FALSE' Type='DateTime'>" + dateFormat(_.get(criteria, "NgayBSFrom")) + "</Value></Geq>";
        }
      }

      if (_.get(criteria, "NgayBSTo")) {
        if (query) {
          query = "<And>" + query + "<Leq><FieldRef Name='NgayThangVanBan' /><Value IncludeTimeValue='FALSE' Type='DateTime'>" + dateFormat(_.get(criteria, "NgayBSTo")) + "</Value></Leq></And>";
        } else {
          query = "<Leq><FieldRef Name='NgayThangVanBan' /><Value IncludeTimeValue='FALSE' Type='DateTime'>" + dateFormat(_.get(criteria, "NgayBSTo")) + "</Value></Leq>";
        }
      }
      if (_.get(criteria, "BoPhanBienSoans.length") > 0) {
        var temp = "";
        var orquery = _.map(_.map(criteria.BoPhanBienSoans, "Code"), function (Code) {
          return "<Eq><FieldRef Name='BoPhanBienSoanText' /><Value Type='Text'>" + ";#" + Code + ";#" + "</Value></Eq>";
        });
        _.forEach(orquery, function (item) {
          if (temp) {
            temp = "<Or>" + temp + item + "</Or>";
          } else {
            temp = item;
          }
        });
        if (query) {
          query = "<And>" + query + temp + "</And>";
        } else {
          query = temp;
        }
      }
      if (_.get(criteria, "Statuses.length") > 0) {
        var temp = "";
        var orquery = _.map(_.get(criteria, "Statuses"), function (status) {
          return String.format("<Eq><FieldRef Name='TinhTrangHieuLuc' /><Value Type='Text'>{0}</Value></Eq>",
            status.Code);
        });
        _.forEach(orquery, function (item) {
          if (temp) {
            temp = "<Or>" + temp + item + "</Or>";
          } else {
            temp = item;
          }
        });
        if (query) {
          query = "<And>" + query + temp + "</And>";
        } else {
          query = temp;
        }
      }
      if (_.get(criteria, "CreatedBy.length") > 0) {
        var temp = "";
        var orquery = _.map(_.map(criteria.CreatedBy, "Id"), function (authorId) {
          return String.format("<Eq><FieldRef Name='IdNguoiTao' /><Value Type='Number'>{0}</Value></Eq>",
            authorId);
        });
        _.forEach(orquery, function (item) {
          if (temp) {
            temp = "<Or>" + temp + item + "</Or>";
          } else {
            temp = item;
          }
        });
        if (query) {
          query = "<And>" + query + temp + "</And>";
        } else {
          query = temp;
        }
      }
      if (_.get(criteria, "Nguoiki.length") > 0) {
        var temp = "";
        var orquery = _.map(_.map(criteria.Nguoiki, "Id"), function (nk) {
          return String.format("<Eq><FieldRef Name='IdNguoiKy' /><Value Type='Number'>{0}</Value></Eq>",
            nk);
        });
        _.forEach(orquery, function (item) {
          if (temp) {
            temp = "<Or>" + temp + item + "</Or>";
          } else {
            temp = item;
          }
        });
        if (query) {
          query = "<And>" + query + temp + "</And>";
        } else {
          query = temp;
        }
      }
      query = "<View><Query><OrderBy><FieldRef Name='Created' Ascending='FALSE'/></OrderBy><Where>" +
        query + "</Where></Query><RowLimit>25</RowLimit></View>";

      return query;
    },

      $scope.vm.search = function () {
        $vbdcService.getAllWithCaml("ThuocTinhVanBan", ["ID", "Title", "SoKyHieu", "NoiDung", "SoVanBan", "NgayBanHanh", "TheThucVanBan", "TinhTrangHieuLuc"],
          "vbdc", undefined, $scope.vm.buildQuery())
          .then((data) => {
            _.set($scope, "vm.items", data);
          })
      }

    $scope.vm.search();
  }
]);
