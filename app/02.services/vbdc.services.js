"use strict";
angular.module("vbdc-app").factory("vbdcService",
  [
    "$q", "$injector", "$http",
    function ($q, $injector, $http) {
      var lib = {};

      lib.getAllUserInSites = function () {
        var dfd = $q.defer();
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers";
        $http.get(restUrl,
          {
            headers: {
              "Accept": "application/json;odata=verbose"
            }
          })
          .success(function (data) {
            dfd.resolve(_.get(data, "d.results"));
          }).error(function (error) {
            console.log(error);
            dfd.resolve(null);
          });
        return dfd.promise;
      }

      // lib.getItemsByCalm = function (strCamlQuery, position, sortColumn) {
      //   var dfd = $q.defer();
      //   var thisService = this;
      //   var sortColumn = 'Created';
      //   thisService.getAllUserInSites().then(function (data) {
      //     thisService.users = data;
      //     var items = [];
      //     var context = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl + "/vbdc");
      //     var web = context.get_web();

      //     var oList = web.get_lists().getByTitle("DocumentMetadata");

      //     var camlQuery = new SP.CamlQuery();
      //     if (position) {
      //       camlQuery.set_listItemCollectionPosition(position);
      //     }
      //     camlQuery.set_viewXml("<View><Query>" +
      //       "<Where>" +
      //       "<Eq><FieldRef Name=\"Title\"/><Value Type=\"Text\">Value</Value></Eq>" +
      //       "</Where>" +
      //       "<OrderBy><FieldRef Name=\"Modified\" Ascending=\"FALSE\"/></OrderBy>" +
      //       "</Query>" +
      //       "<RowLimit>5000</RowLimit>" +
      //       "</View>");
      //     var collListItems = oList.getItems(camlQuery);

      //     context.load(collListItems);

      //     context.executeQueryAsync(
      //       function () {
      //         var listItemEnumerator = collListItems.getEnumerator();
      //         while (listItemEnumerator.moveNext()) {
      //           var oListItem = listItemEnumerator.get_current();
      //           var row = {};
      //           _.set(row, "ID", oListItem.get_item("ID"));
      //           _.set(row, "Id", oListItem.get_item("ID"));
      //           _.set(row, "UniqueId", oListItem.get_item("UniqueId"));
      //           _.set(row, "Title", oListItem.get_item("Title"));
      //           items.push(row);
      //         }
      //         if (collListItems.get_listItemCollectionPosition()) {
      //           items.nextPagingInfo = collListItems.get_listItemCollectionPosition().get_pagingInfo();
      //         } else {
      //           items.nextPagingInfo = null;
      //         }
      //         if (collListItems.itemAt(0)) {
      //           if (_.isDate(collListItems.itemAt(0).get_item(sortColumn))) {
      //             items.previousPagingInfo = "PagedPrev=TRUE&Paged=TRUE&p_ID=" + collListItems.itemAt(0).get_item('ID') + "&p_" + sortColumn + "=" + encodeURIComponent(collListItems.itemAt(0).get_item(sortColumn).toJSON());
      //           } else {
      //             items.previousPagingInfo = "PagedPrev=TRUE&Paged=TRUE&p_ID=" + collListItems.itemAt(0).get_item('ID') + "&p_" + sortColumn + "=" + encodeURIComponent(collListItems.itemAt(0).get_item(sortColumn));
      //           }

      //         }
      //         dfd.resolve(items);
      //       },
      //       function (sender, args) {
      //         dfd.reject(args.get_message());
      //       }
      //     );
      //   })
      //   return dfd.promise;
      // };

      lib.getAllWithCaml = function (listName, arrayProperties, site, paging, camlQ) {
        var dfd = $q.defer();
        var result = [];
        var sortColumn = "Modified";
        var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl + "/" + site);
        var list = clientContext.get_web().get_lists().getByTitle(listName);
        var camlQuery = new SP.CamlQuery();
        if (paging) {
          var position = new SP.ListItemCollectionPosition();
          position.set_pagingInfo(paging);
          camlQuery.set_listItemCollectionPosition(position);
        }
        if (camlQ) {
          camlQuery.set_viewXml(camlQ)
        } else {
          camlQuery.set_viewXml(
            "<View><Query>" +
            "<OrderBy><FieldRef Name=\"Modified\" Ascending=\"FALSE\"/></OrderBy>" +
            "</Query>" +
            "<RowLimit>1</RowLimit>" +
            "</View>");
        }

        var items = list.getItems(camlQuery);
        clientContext.load(items);
        clientContext.executeQueryAsync(function () {
          var itemEnumerator = items.getEnumerator();
          while (itemEnumerator.moveNext()) {
            var row = {};
            var item = itemEnumerator.get_current();
            _.forEach(arrayProperties, (a) => {
              row["" + a] = item.get_item("" + a);
            })
            result.push(row);
          }
          if (items.get_listItemCollectionPosition()) {
            result.nextPagingInfo = items.get_listItemCollectionPosition().get_pagingInfo();
          } else {
            result.nextPagingInfo = null;
          }
          if (items.itemAt(0)) {
            if (_.isDate(items.itemAt(0).get_item(sortColumn))) {
              result.previousPagingInfo = "PagedPrev=TRUE&Paged=TRUE&p_ID=" + items.itemAt(0).get_item('ID') + "&p_" + sortColumn + "=" + encodeURIComponent(items.itemAt(0).get_item(sortColumn).toJSON());
            } else {
              result.previousPagingInfo = "PagedPrev=TRUE&Paged=TRUE&p_ID=" + items.itemAt(0).get_item('ID') + "&p_" + sortColumn + "=" + encodeURIComponent(items.itemAt(0).get_item(sortColumn));
            }
          }
          dfd.resolve(result);
        }, function (sender, args) { console.log(args.get_message()); });
        return dfd.promise;
      }
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
  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = "", i = 0, len = str.length, c1, c2, c3;
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
      out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += CHARS.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += CHARS.charAt(c1 >> 2);
    out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += CHARS.charAt(c3 & 0x3F);
  }
  return out;
}
