angular.module("vbdc-app").controller("vbdc.view.controller", [
  "$scope", "vbdcService", "metadataService", "$state",
  function ($scope, $vbdcService, $metadataService, $state) {
    $scope.vm = {};
    $scope.vm.advancedSearchMode = false;

    $scope.vm.export = "Export Excel";
    $scope.csv = {
      bom: "\ufeff",
      columnOrder: ["SoKyHieu", "TrichYeu", "NgayBanHan", "TheThucVanBan", "DonViBienSoan", "TinhTrangHieuLuc", "ThamQuyenKy"]
    };
    $scope.vm.filename = "Danh sách văn bản định chế_" + moment(new Date()).format('DD.MM.YYYY');
    $scope.vm.header = ["Số ký hiệu", "Trích yếu", "Sổ văn bản", "Ngày hiệu lực", "Thể thức văn bản", "Thẩm quyền ban hành", "Người tạo", "Đơn vị biên soạn", "Tình trạng hiệu lực"];
    function buildDataForCsv() {
      return _.map(_.get($scope, "vm.itemsE"), function (item) {
        var NgayHieuLuc1 = "";
        if (item.NgayHieuLuc) {
          NgayHieuLuc1 = moment(item.NgayHieuLuc).format("DD/MM/YYYY");
        }
        return {
          SoKyHieu: _.get(item, "SoKyHieu"),
          TrichYeu: _.get(item, "NoiDung"),
          SoVanBan: _.get(item, "SoVanBan"),
          NgayHieuLuc: NgayHieuLuc1,
          TheThucVanBan: _.get(item, "TheThucVanBan"),
          ThamQuyenKy: _.get(item, "ThamQuyenKy"),
          TenNguoiTao: _.get(item, "TenNguoiTao"),
          DonViBienSoan: _.get(item, "DonViBienSoan[0].Title"),
          TinhTrangHieuLuc: _.get(item, "TinhTrangHieuLuc"),
        };
      });
    }

    $scope.vm.toggleFilterPanel = (value) => {
      _.set($scope, "vm.advancedSearchMode", value);
    };

    $scope.vm.isActiveView = function () {
      return _.get($state, "current.name") === "vbdc-active-view";
    }

    $scope.vm.isDeActiveView = function () {
      return _.get($state, "current.name") === "vbdc-deactive-view";
    }

    $scope.vm.isViewAll = function () {
      return _.get($state, "current.name") === "vbdc-all-view";
    }

    $scope.vm.getViewName = function () {
      if (_.get($state, "current.name") === "vbdc-view") {
        $scope.vm.viewName = "Tra cứu văn bản";
      } else if ($scope.vm.isActiveView()) {
        $scope.vm.viewName = "Văn bản còn hiệu lực";
      } else if ($scope.vm.isDeActiveView()) {
        $scope.vm.viewName = "Văn bản hết hiệu lực";
      } else if ($scope.vm.isViewAll()) {
        $scope.vm.viewName = "Toàn bộ văn bản";
      }
    }
    $scope.vm.getViewName();

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
      if (_.get(criteria, "TheThucVanBan.length") > 0) {
        var temp = "";
        var orquery = _.map(_.map(criteria.TheThucVanBan, "Title"), function (title) {
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

      if (_.get(criteria, "TTHL.length") > 0) {
        var temp = "";
        var orquery = _.map(_.map(criteria.TTHL, "Title"), function (status) {
          return String.format("<Eq><FieldRef Name='TinhTrangHieuLuc' /><Value Type='Text'>{0}</Value></Eq>",
            status);
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
      if (_.get(criteria, "NgayBHFrom")) {
        if (query) {
          query = "<And>" + query + "<Geq><FieldRef Name='NgayBanHanh' /><Value IncludeTimeValue='FALSE' Type='DateTime'>" + dateFormat(_.get(criteria, "NgayBHFrom")) + "</Value></Geq></And>";
        } else {
          query = "<Geq><FieldRef Name='NgayBanHanh' /><Value IncludeTimeValue='FALSE' Type='DateTime'>" + dateFormat(_.get(criteria, "NgayBHFrom")) + "</Value></Geq>";
        }
      }

      if (_.get(criteria, "NgayBHTo")) {
        if (query) {
          query = "<And>" + query + "<Leq><FieldRef Name='NgayBanHanh' /><Value IncludeTimeValue='FALSE' Type='DateTime'>" + dateFormat(_.get(criteria, "NgayBHTo")) + "</Value></Leq></And>";
        } else {
          query = "<Leq><FieldRef Name='NgayBanHanh' /><Value IncludeTimeValue='FALSE' Type='DateTime'>" + dateFormat(_.get(criteria, "NgayBHTo")) + "</Value></Leq>";
        }
      }
      if (_.get(criteria, "NguoiTao.length") > 0) {
        var temp = "";
        var orquery = _.map(_.map(criteria.NguoiTao, "Id"), function (authorId) {
          return String.format("<Eq><FieldRef Name = 'Author' LookupId = 'TRUE'/><Value Type='Lookup'>{0}</Value></Eq> ",
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
      if (_.get(criteria, "ThamQuyenKy.length") > 0) {
        var temp = "";
        var orquery = _.map(_.map(criteria.ThamQuyenKy, "Title"), function (status) {
          return String.format("<Eq><FieldRef Name='ThamQuyenKy' /><Value Type='Text'>{0}</Value></Eq>",
            status);
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
          "vbdc", undefined, _.replace($scope.vm.buildQuery(), ">25<", ">3000<"))
          .then((data) => {
            _.set($scope, "vm.itemsE", data);
            $scope.getArray = buildDataForCsv();
          })

        $metadataService.getAll("TinhTrangHieuLuc", "Active ne 0").then(function (tthl) {
          _.set($scope, "vm.tthl", tthl);
          if ($scope.vm.isActiveView()) {
            _.set($scope, "vm.searchCriteria.TTHL", [_.find(tthl, function (t) {
              return t.Title === "Hiệu lực";
            })])
          }
          if ($scope.vm.isDeActiveView()) {
            _.set($scope, "vm.searchCriteria.TTHL", [_.find(tthl, function (t) {
              return t.Title === "Hết hiệu lực";
            })])
          }
          return $vbdcService.getAllWithCaml("ThuocTinhVanBan", ["ID", "Title", "SoKyHieu", "NoiDung", "SoVanBan", "NgayBanHanh", "TheThucVanBan", "TinhTrangHieuLuc"],
            "vbdc", undefined, $scope.vm.buildQuery())
        })
          .then((data) => {
            _.set($scope, "vm.items", data);
          })
      }

    $scope.vm.resetSearch = function () {
      _.set($scope, "vm.searchCriteria", {});
      $scope.vm.search();
    }

    $scope.vm.search();

    $scope.vm.optLoaiVanBan = {
      dataValueField: "Title",
      dataTextField: "Title",
      dataSource:
      {
        transport: {
          read: function (options) {
            $metadataService.getAll("TheThucVanBan", "Active ne 0")
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

    $scope.vm.optTinhTrangHieuLuc = {
      dataValueField: "Id",
      dataTextField: "Title",
      dataSource:
      {
        transport: {
          read: function (options) {
            $metadataService.getAll("TinhTrangHieuLuc", "Active ne 0")
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

    $scope.vm.optThamQuyenKy = {
      dataValueField: "Id",
      dataTextField: "Title",
      dataSource:
      {
        transport: {
          read: function (options) {
            $metadataService.getAll("ThamQuyenBanHanh", "Active ne 0")
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
  }
]);
