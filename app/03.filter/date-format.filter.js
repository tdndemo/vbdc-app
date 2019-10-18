"use strict";

(function (app, _) {
    app.filter("formatDate", function () {
        return function (date, format) {
            if (date) {
                if (format) {
                    return moment(date).format(format);
                }
                return moment(date).format("DD/MM/YYYY");
            } else {
                return "";
            }
        };
    });
})(angular.module("vbdc-app"), _);