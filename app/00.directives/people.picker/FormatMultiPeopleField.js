(function () {
    "use strict";
    angular.module("vbdc-app").filter("FormatMultiPeopleField", function () {
        return function (pp) {
            var tmp = ""
            if (_.get(pp, "length") > 0) {
                _.forEach(pp, function (p) {
                    tmp += _.get(p, "Title") + "; "
                });
            }
            if (tmp.length > 0) {
                tmp = tmp.substr(0, tmp.length - 2);
            }
            return tmp;
        };
    });
})();


