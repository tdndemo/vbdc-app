"use strict";
angular.module("vbdc-app").factory("vbdcService", [
  "$q",
  "$injector",
  "$http",
  function($q, $injector, $http) {
    var lib = {};

    lib.getAllUserInSites = function() {
      var dfd = $q.defer();
      var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers";
      $http
        .get(restUrl, {
          headers: {
            Accept: "application/json;odata=verbose"
          }
        })
        .success(function(data) {
          dfd.resolve(_.get(data, "d.results"));
        })
        .error(function(error) {
          console.log(error);
          dfd.resolve(null);
        });
      return dfd.promise;
    };

    lib.getAllWithCaml = function(
      listName,
      arrayProperties,
      site,
      paging,
      camlQ
    ) {
      var dfd = $q.defer();
      var result = [];
      var sortColumn = "Modified";
      var clientContext = new SP.ClientContext(
        _spPageContextInfo.webAbsoluteUrl + "/" + site
      );
      var list = clientContext
        .get_web()
        .get_lists()
        .getByTitle(listName);
      var camlQuery = new SP.CamlQuery();
      if (paging) {
        var position = new SP.ListItemCollectionPosition();
        position.set_pagingInfo(paging);
        camlQuery.set_listItemCollectionPosition(position);
      }
      if (camlQ) {
        camlQuery.set_viewXml(camlQ);
      } else {
        camlQuery.set_viewXml(
          "<View><Query>" +
            '<OrderBy><FieldRef Name="Modified" Ascending="FALSE"/></OrderBy>' +
            "</Query>" +
            "<RowLimit>1</RowLimit>" +
            "</View>"
        );
      }

      var items = list.getItems(camlQuery);
      clientContext.load(items);
      clientContext.executeQueryAsync(
        function() {
          var itemEnumerator = items.getEnumerator();
          while (itemEnumerator.moveNext()) {
            var row = {};
            var item = itemEnumerator.get_current();
            _.forEach(arrayProperties, a => {
              row["" + a] = item.get_item("" + a);
            });
            result.push(row);
          }
          if (items.get_listItemCollectionPosition()) {
            result.nextPagingInfo = items
              .get_listItemCollectionPosition()
              .get_pagingInfo();
          } else {
            result.nextPagingInfo = null;
          }
          if (items.itemAt(0)) {
            if (_.isDate(items.itemAt(0).get_item(sortColumn))) {
              result.previousPagingInfo =
                "PagedPrev=TRUE&Paged=TRUE&p_ID=" +
                items.itemAt(0).get_item("ID") +
                "&p_" +
                sortColumn +
                "=" +
                encodeURIComponent(
                  items
                    .itemAt(0)
                    .get_item(sortColumn)
                    .toJSON()
                );
            } else {
              result.previousPagingInfo =
                "PagedPrev=TRUE&Paged=TRUE&p_ID=" +
                items.itemAt(0).get_item("ID") +
                "&p_" +
                sortColumn +
                "=" +
                encodeURIComponent(items.itemAt(0).get_item(sortColumn));
            }
          }
          dfd.resolve(result);
        },
        function(sender, args) {
          console.log(args.get_message());
        }
      );
      return dfd.promise;
    };

    lib.deleteItem = function(id, site, listName) {
      var clientContext = new SP.ClientContext(
        _spPageContextInfo.webAbsoluteUrl + "/" + site
      );
      var list = clientContext
        .get_web()
        .get_lists()
        .getByTitle(listName);
      var item = list.getItemById(id);
      item.deleteObject();
      clientContext.executeQueryAsync(
        function() {
          console.log("Item #" + id + " deleted successfully!");
        },
        function(sender, args) {
          alert(args.get_message());
        }
      );
    };

    lib.getById = function(id, site, listName) {
      var clientContext = new SP.ClientContext(
        _spPageContextInfo.webAbsoluteUrl + "/" + site
      );
      var list = clientContext
        .get_web()
        .get_lists()
        .getByTitle(listName);
      var item = list.getItemById(id); // get item with ID == 1
      clientContext.load(item);
      clientContext.executeQueryAsync(
        function() {
          // onSuccess
          var title = item.get_item("Title");
          alert(title);
        },
        function(sender, args) {
          // onError
          alert(args.get_message());
        }
      );
    };

    return lib;
  }
]);

function getBinary(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.overrideMimeType("text/plain; charset=x-user-defined");
  xhr.send(null);
  return xhr.responseText;
}
function base64Encode(str) {
  var CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = "",
    i = 0,
    len = str.length,
    c1,
    c2,
    c3;
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += CHARS.charAt(c1 >> 2);
      out += CHARS.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += CHARS.charAt(c1 >> 2);
      out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
      out += CHARS.charAt((c2 & 0xf) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += CHARS.charAt(c1 >> 2);
    out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
    out += CHARS.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
    out += CHARS.charAt(c3 & 0x3f);
  }
  return out;
}
