"use strict";
(function (global, app, _, $) {
    app.service("metadataService", [
        "$q", "$http",
        function ($q, $http) {
            this.getAll = function (listname, filter) {
                var dfd = $q.defer();
                var restUrl = _spPageContextInfo.siteAbsoluteUrl + "/vbdc/_api/lists/getByTitle('" + listname + "')/items?$select=Id,Title,ItemOrder,Active,Code";
                if (filter) {
                    restUrl += "&$filer=" + filter + "&$orderby=ItemOrder asc";
                }
                $http.get(restUrl, {
                    headers: {
                        "Accept": "application/json;odata=verbose",
                    },
                }).success(function (data) {
                    dfd.resolve(_.get(data, "d.results"));
                }).error(function (error) {
                    console.log(error);
                    dfd.resolve(false);
                });
                return dfd.promise;
            };

            this.getAllWithSelect = function (listname, filter, select) {
                var dfd = $q.defer();
                var restUrl = _spPageContextInfo.siteAbsoluteUrl + "/vbdc/_api/lists/getByTitle('" + listname + "')/items?$select=" + select;
                if (filter) {
                    restUrl += "&$filer=" + filter;
                }
                $http.get(restUrl, {
                    headers: {
                        "Accept": "application/json;odata=verbose",
                    },
                }).success(function (data) {
                    dfd.resolve(_.get(data, "d.results"));
                }).error(function (error) {
                    console.log(error);
                    dfd.resolve(false);
                });
                return dfd.promise;
            };
        }
    ]);

})(this, angular.module("vbdc-app"), _, jQuery);
