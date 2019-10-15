(function() {
    "use strict";
    var appDeps = [
        "ui.router",
        "kendo.directives"
    ];
    angular.module("vbdc-app", appDeps);
})();
var app = angular.module("vbdc-app");
app.config([
  "$stateProvider",
  "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/view");

    $stateProvider
      // view
      .state("vbdc-dashboard", {
        url: "/dashboard",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "app/01.view/vbdc.dashboard.html",
            controller: "vbdc.dashboard.controller"
          },
          sidebar: {
            templateUrl: "app/00.common/vbdc.sidebar.html"
          }
        }
      })
      // view
      .state("vbdc-view", {
        url: "/view",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "app/01.view/vbdc.view.html",
            controller: "vbdc.view.controller"
          },
          sidebar: {
            templateUrl: "app/00.common/vbdc.sidebar.html"
          }
        }
      })
      // form
      .state("vbdc-form", {
        url: "/form",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "app/01.view/vbdc.form.html",
            controller: "vbdc.form.controller"
          },
          sidebar: {
            templateUrl: "app/00.common/vbdc.sidebar.html"
          }
        }
      });
  }
]);

"use strict";
(function(app, $) {
  app.directive("vbdcHeader", [
    function() {
      return {
        restrict: "E",
        templateUrl: "app/00.common/vbdc.header.html",
        scope: {},
        link: function($scope, element, attr, modelCtrl) {},
        controller: ["$scope", function($scope) {}]
      };
    }
  ]);
})(angular.module("vbdc-app"), jQuery);

angular.module("vbdc-app").controller("vbdc.dashboard.controller",[
  "$scope", function ($scope) {
    $scope.vm = {};
    $scope.onSeriesHover = function (e) {
      kendoConsole.log(kendo.format("event :: seriesHover ({0} : {1})", e.series.name, e.value));
    };

    $scope.electricity = new kendo.data.DataSource({
      transport: {
        read: [
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
        ]

      },
      sort: {
        field: "year",
        dir: "asc"
      }
    });
  }]);

angular.module("vbdc-app").controller("vbdc.form.controller", function($scope) {
  $scope.vm = {};
});

angular.module("vbdc-app").controller("vbdc.view.controller", [
  "$scope",
  function($scope) {
    $scope.vm = {};
    $scope.vm.advancedSearchMode = false;
    $scope.vm.items = [{ SoKyHieu: 1 }];

    $scope.vm.toggleFilterPanel = (value) => {
      _.set($scope, "vm.advancedSearchMode", value);
    };
  }
]);

(function(module) {
try {
  module = angular.module('vbdc-app');
} catch (e) {
  module = angular.module('vbdc-app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('$app/00.common/vbdc.header.html',
    '<div class="row"><div class="col-md-12" style="margin-bottom:-6px"><span style="font-size: 22px; font-weight: 600;color: #6c757d">Hệ thống quản lý văn bản</span></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('vbdc-app');
} catch (e) {
  module = angular.module('vbdc-app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('$app/00.common/vbdc.sidebar.html',
    '<nav id="sidebar" class="sidebar-wrapper"><div class="sidebar-content"><div class="sidebar-item sidebar-brand"><a href="#">Demo Company</a> <span style="margin-right: 20px" id="pin-sidebar" class="btn btn-outline-secondary rounded-0" href="#"><i class="fa fa-bars"></i></span></div><div class="sidebar-item sidebar-header d-flex flex-nowrap"><div class="user-pic"><img class="img-responsive img-rounded" src="img/user.jpg" alt="User picture"></div><div class="user-info"><span class="user-name">Jhon <strong>Smith</strong> </span><span class="user-role">Administrator</span></div></div><div class="sidebar-item sidebar-menu"><ul><li class="nav-item"><a href="#/dashboard"><i class="fas fa-home"></i> <span class="menu-text">Trang chủ</span></a></li><li class="header-menu"><span>Thông tin</span></li><li class="sidebar-dropdown"><a><i class="fas fa-file-alt"></i> <span class="menu-text">Danh sách văn bản</span></a><div class="sidebar-submenu"><ul><li><a ui-sref="vbdc-view">Tra cứu văn bản</a></li><li><a href="#">Văn bản còn hiệu lực</a></li><li><a href="#">Văn bản hết hiệu lực</a></li></ul></div></li><li class="sidebar-dropdown"><a href="#"><i class="fas fa-chart-line"></i> <span class="menu-text">Báo cáo</span></a><div class="sidebar-submenu"><ul><li><a ui-sref="vbdc-view">Tra cứu văn bản</a></li><li><a href="#">Văn bản còn hiệu lực</a></li><li><a href="#">Văn bản hết hiệu lực</a></li></ul></div></li><li class="header-menu"><span>Quản trị</span></li><li class="sidebar-dropdown"><a href="#"><i class="fas fa-cogs"></i> <span>Thiết lập</span></a><div class="sidebar-submenu"><ul><li><a ui-sref="vbdc-view">Danh mục</a></li><li><a href="#">Phòng ban</a></li></ul></div></li></ul></div></div><div class="sidebar-footer"><div class="dropdown"><a href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-bell"></i> <span class="badge badge-pill badge-warning notification">3</span></a><div class="dropdown-menu notifications" aria-labelledby="dropdownMenuMessage"><div class="notifications-header"><i class="fa fa-bell"></i> Notifications</div><div class="dropdown-divider"></div><a class="dropdown-item" href="#"><div class="notification-content"><div class="icon"><i class="fas fa-check text-success border border-success"></i></div><div class="content"><div class="notification-detail">Lorem ipsum dolor sit amet consectetur adipisicing elit. In totam explicabo</div><div class="notification-time">6 minutes ago</div></div></div></a><a class="dropdown-item" href="#"><div class="notification-content"><div class="icon"><i class="fas fa-exclamation text-info border border-info"></i></div><div class="content"><div class="notification-detail">Lorem ipsum dolor sit amet consectetur adipisicing elit. In totam explicabo</div><div class="notification-time">Today</div></div></div></a><a class="dropdown-item" href="#"><div class="notification-content"><div class="icon"><i class="fas fa-exclamation-triangle text-warning border border-warning"></i></div><div class="content"><div class="notification-detail">Lorem ipsum dolor sit amet consectetur adipisicing elit. In totam explicabo</div><div class="notification-time">Yesterday</div></div></div></a><div class="dropdown-divider"></div><a class="dropdown-item text-center" href="#">View all notifications</a></div></div><div class="dropdown"><a href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-envelope"></i> <span class="badge badge-pill badge-success notification">7</span></a><div class="dropdown-menu messages" aria-labelledby="dropdownMenuMessage"><div class="messages-header"><i class="fa fa-envelope"></i> Messages</div><div class="dropdown-divider"></div><a class="dropdown-item" href="#"><div class="message-content"><div class="pic"><img src="img/user.jpg" alt=""></div><div class="content"><div class="message-title"><strong>Jhon doe</strong></div><div class="message-detail">Lorem ipsum dolor sit amet consectetur adipisicing elit. In totam explicabo</div></div></div></a><a class="dropdown-item" href="#"><div class="message-content"><div class="pic"><img src="img/user.jpg" alt=""></div><div class="content"><div class="message-title"><strong>Jhon doe</strong></div><div class="message-detail">Lorem ipsum dolor sit amet consectetur adipisicing elit. In totam explicabo</div></div></div></a><a class="dropdown-item" href="#"><div class="message-content"><div class="pic"><img src="img/user.jpg" alt=""></div><div class="content"><div class="message-title"><strong>Jhon doe</strong></div><div class="message-detail">Lorem ipsum dolor sit amet consectetur adipisicing elit. In totam explicabo</div></div></div></a><div class="dropdown-divider"></div><a class="dropdown-item text-center" href="#">View all messages</a></div></div><div class="dropdown"><a href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> <span class="badge-sonar"></span></a><div class="dropdown-menu" aria-labelledby="dropdownMenuMessage"><a class="dropdown-item" href="#">My profile</a> <a class="dropdown-item" href="#">Help</a> <a class="dropdown-item" href="#">Setting</a></div></div><div><a href="#"><i class="fa fa-power-off"></i></a></div><div class="pinned-footer"><a href="#"><i class="fas fa-ellipsis-h"></i></a></div></div></nav><script src="framework/main.js"></script>');
}]);
})();

(function(module) {
try {
  module = angular.module('vbdc-app');
} catch (e) {
  module = angular.module('vbdc-app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('$app/01.view/vbdc.dashboard.html',
    '<div class="row"><div class="col-xl-3 col-sm-6 mb-3"><div class="card text-white bg-primary o-hidden h-100"><div class="card-body"><div class="card-body-icon"><i class="fas fa-book"></i></div><div class="mr-5">100 Văn bản</div></div><a class="card-footer text-white clearfix small z-1" href="#/view"><span class="float-left">Xem chi tiết</span> <span class="float-right"><i class="fas fa-angle-right"></i></span></a></div></div><div class="col-xl-3 col-sm-6 mb-3"><div class="card text-white bg-warning o-hidden h-100"><div class="card-body"><div class="card-body-icon"><i class="far fa-paper-plane"></i></div><div class="mr-5">11 Văn bản hiệu lực</div></div><a class="card-footer text-white clearfix small z-1" href="#"><span class="float-left">Xem chi tiết</span> <span class="float-right"><i class="fas fa-angle-right"></i></span></a></div></div><div class="col-xl-3 col-sm-6 mb-3"><div class="card text-white bg-success o-hidden h-100"><div class="card-body"><div class="card-body-icon"><i class="far fa-calendar-times"></i></div><div class="mr-5">5 Văn bản hết hiệu lực</div></div><a class="card-footer text-white clearfix small z-1" href="#"><span class="float-left">Xem chi tiết</span> <span class="float-right"><i class="fas fa-angle-right"></i></span></a></div></div><div class="col-xl-3 col-sm-6 mb-3"><div class="card text-white bg-danger o-hidden h-100"><div class="card-body"><div class="card-body-icon"><i class="fas fa-wrench"></i></div><div class="mr-5">Thiết lập</div></div><a class="card-footer text-white clearfix small z-1" href="#"><span class="float-left">Xem chi tiết</span> <span class="float-right"><i class="fas fa-angle-right"></i></span></a></div></div></div><div class="card"><div class="card-header"><span class="card-link" data-toggle="collapse" href="#collapseOne"><i class="fas fa-file-alt" style="margin-right: 10px"></i> <span style="font-size: 17px;font-weight: 600">Văn bản mới ban hành</span></span></div><div id="collapseOne" class="collapse show" data-parent="#accordion"><div class="card-body"><div class="table-responsive"><table class="table table-hover table-bordered table-scroll" style="margin-bottom: 0px"><thead class="thead-light"><tr class="heading"><th style="min-width:140px">Số ký hiệu</th><th style="min-width:200px">Trích yếu</th><th style="min-width:100px">Sổ văn bản</th><th style="min-width:150px">Ngày ban hành</th><th style="min-width:150px">Thể thức văn bản</th><th style="min-width:160px">Tình trạng hiệu lực</th><th style="min-width:81px" ng-if="vm.isVanThu()"></th></tr></thead><tbody><tr ng-repeat="item in vm.items"><td><a href="javascript:;" ng-click="vm.actions.openItem(item)">{{ item.SoKyHieu }}</a></td><td><a href="javascript:;" ng-click="vm.actions.openItem(item)">{{ item.NoiDung }}</a></td><td><a href="javascript:;" ng-click="vm.actions.openItem(item)">{{ item.SoVanBan }}</a></td><td style="width:120px"><a href="javascript:;" ng-click="vm.actions.openItem(item)">{{ item.NgayBanHanh }}</a></td><td>{{ item.TheThucVanBan }}</td><td>{{ item.TinhTrangHieuLuc }}</td></tr></tbody></table></div></div></div></div><div class="card" style="margin-top:15px"><div class="card-header"><span class="card-link" data-toggle="collapse" href="#collapseOne"><i class="fas fa-chart-line" style="margin-right: 10px"></i> <span style="font-size: 17px;font-weight: 600">Biểu đồ số lượng văn bản phát hành</span></span></div><div id="collapseOne" class="collapse show" data-parent="#accordion"><div class="card-body"><div><h4>Hover some series</h4><div kendo-chart k-legend="{ position: \'bottom\' }" k-series-defaults="{ type: \'line\' }" k-series="[\n' +
    '                                   { field: \'nuclear\', name: \'Nuclear electricity\' },\n' +
    '                                   { field: \'hydro\', name: \'Hydro electricity\' },\n' +
    '                                   { field: \'wind\', name: \'Wind electricity\' }\n' +
    '                               ]" k-data-source="electricity" k-series-hover="onSeriesHover" style="height: 250px"></div></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('vbdc-app');
} catch (e) {
  module = angular.module('vbdc-app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('$app/01.view/vbdc.form.html',
    'Đây là form');
}]);
})();

(function(module) {
try {
  module = angular.module('vbdc-app');
} catch (e) {
  module = angular.module('vbdc-app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('$app/01.view/vbdc.view.html',
    '<div class="card"><div class="card-header"><span class="card-link" data-toggle="collapse" href="#collapseOne"><i class="fas fa-file-alt" style="margin-right: 10px"></i> <span style="font-size: 17px;font-weight: 600">Danh sách văn bản định chế</span> </span><button type="button" class="btn btn-sm" ng-click="vm.toggleFilterPanel(true);" ng-show="!vm.advancedSearchMode" style="float: right; padding: 2px; font-size:14px"><i class="fas fa-filter font-green-jungle right-5"></i>Tìm kiếm</button> <button type="button" class="btn btn-sm" ng-click="vm.toggleFilterPanel(false);" ng-show="vm.advancedSearchMode" style="float: right; padding: 2px; font-size:14px"><i class="fas fa-times" style="margin-right: 5px;color: red"></i> Đóng tìm kiếm</button></div><div id="collapseOne" class="collapse show" data-parent="#accordion"><div class="card-body"><div class="row" ng-if="vm.advancedSearchMode" style="margin-bottom:20px"><label class="col-sm-2 control-label">Từ khóa:</label><div class="col-sm-4"><input maxlength="100" type="text" class="form-control input-sm" ng-model="vm.searchCriteria.Keyword"></div><label class="col-sm-2 control-label">Từ khóa:</label><div class="col-sm-4"><input maxlength="100" type="text" class="form-control input-sm" ng-model="vm.searchCriteria.Keyword"></div><label class="col-sm-2 control-label">Thể thức văn bản:</label><div class="col-sm-4"><input maxlength="100" type="text" class="form-control input-sm" ng-model="vm.searchCriteria.Keyword"></div><label class="col-sm-2 control-label">Tình trạng hiệu lực:</label><div class="col-sm-4"><input maxlength="100" type="text" class="form-control input-sm" ng-model="vm.searchCriteria.Keyword"></div><label class="col-sm-2 control-label">Người tạo:</label><div class="col-sm-4"><input maxlength="100" type="text" class="form-control input-sm" ng-model="vm.searchCriteria.Keyword"></div><label class="col-sm-2 control-label">Ngày hiệu lực:</label><div class="col-sm-4"><input kendo-date-picker k-format="\'dd/MM/yyyy\'" style="width:120px" k-ng-model="vm.searchCriteria.NgayBSFrom"> <span style="margin: 0 5px">-</span> <input kendo-date-picker k-format="\'dd/MM/yyyy\'" style="width:120px" k-ng-model="vm.searchCriteria.NgayBSTo"></div><label class="col-sm-2 control-label">Thẩm quyền ban hành:</label><div class="col-sm-4"><input maxlength="100" type="text" class="form-control input-sm" ng-model="vm.searchCriteria.Keyword"></div><div class="col-sm-12"><div class="col-sm-6"><div class="btn-group pull-right"><button type="button" class="btn btn-default btn-sm" ng-click="vm.search()"><i class="fa fa-search font-green-jungle right-5"></i> Tìm</button> <button type="button" class="btn btn-default btn-sm" ng-click="vm.resetSearch()"><i class="fas fa-sync-alt right-5"></i></button> <a class="btn btn-sm btn-default" href="javascript:;" ng-csv="getArray" add-bom="vm.export.bom" csv-header="vm.header" csv-column-order="csv.columnOrder" filename="{{vm.filename}}.csv"><i class="fas fa-file-excel font-green-jungle right-5"></i> In sổ văn bản</a></div></div></div></div><div class="table-responsive"><table class="table table-hover table-bordered table-scroll" style="margin-bottom: 0px"><thead class="thead-light"><tr class="heading"><th style="min-width:140px">Số ký hiệu</th><th style="min-width:200px">Trích yếu</th><th style="min-width:100px">Sổ văn bản</th><th style="min-width:150px">Ngày ban hành</th><th style="min-width:150px">Thể thức văn bản</th><th style="min-width:160px">Tình trạng hiệu lực</th><th style="min-width:81px" ng-if="vm.isVanThu()"></th></tr></thead><tbody><tr ng-repeat="item in vm.items"><td><a href="javascript:;" ng-click="vm.actions.openItem(item)">{{ item.SoKyHieu }}</a></td><td><a href="javascript:;" ng-click="vm.actions.openItem(item)">{{ item.NoiDung }}</a></td><td><a href="javascript:;" ng-click="vm.actions.openItem(item)">{{ item.SoVanBan }}</a></td><td style="width:120px"><a href="javascript:;" ng-click="vm.actions.openItem(item)">{{ item.NgayBanHanh }}</a></td><td>{{ item.TheThucVanBan }}</td><td>{{ item.TinhTrangHieuLuc }}</td></tr></tbody></table></div></div></div></div><style>.control-label {\n' +
    '    margin-top: 5px;\n' +
    '    margin-bottom: 30px;\n' +
    '  }</style>');
}]);
})();

//# sourceMappingURL=vbdc.js.map
