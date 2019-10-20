var app = angular.module("vbdc-app");
app.config([
  "$stateProvider",
  "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/view");

    var sidebar = {
      templateUrl: "$app/00.common/vbdc.sidebar.html",
      controller: "vbdc.sidebar.controller"
    }

    $stateProvider
      // view
      .state("vbdc-dashboard", {
        url: "/dashboard",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "$app/01.view/vbdc.dashboard.html",
            controller: "vbdc.dashboard.controller"
          },
          sidebar: sidebar
        }
      })
      // view
      .state("vbdc-view", {
        url: "/view",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "$app/01.view/vbdc.view.html",
            controller: "vbdc.view.controller"
          },
          sidebar: sidebar
        }
      })
      // active view
      .state("vbdc-active-view", {
        url: "/view.active",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "$app/01.view/vbdc.view.html",
            controller: "vbdc.view.controller"
          },
          sidebar: sidebar
        }
      })
      // deactive view
      .state("vbdc-deactive-view", {
        url: "/view.deactive",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "$app/01.view/vbdc.view.html",
            controller: "vbdc.view.controller"
          },
          sidebar: sidebar
        }
      })
      // all view
      .state("vbdc-all-view", {
        url: "/view.all",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "$app/01.view/vbdc.view.html",
            controller: "vbdc.view.controller"
          },
          sidebar: sidebar
        }
      })
      // form
      .state("vbdc-form", {
        url: "/form",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "$app/01.view/vbdc.form.html",
            controller: "vbdc.form.controller"
          },
          sidebar: sidebar
        }
      })
      // setting 
      .state("setting-linhvuc", {
        url: "/setting-linhvuc",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "$app/03.settings/01.Metadata/vbdc.metadata.setting.html",
            controller: "vbdc.metadata.setting.controller"
          },
          sidebar: sidebar
        }
      })
      .state("setting-thethuvanban", {
        url: "/setting-thethuvanban",
        data: { pageTitle: "", pageSubTitle: "" },
        views: {
          content: {
            templateUrl: "$app/03.settings/01.Metadata/vbdc.metadata.setting.html",
            controller: "vbdc.metadata.setting.controller"
          },
          sidebar: sidebar
        }
      });
  }
]);
