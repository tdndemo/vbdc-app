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
