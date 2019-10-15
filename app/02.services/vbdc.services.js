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

      lib.getItemsByCalm = function (strCamlQuery, position, sortColumn) {
        var dfd = $q.defer();
        var thisService = this;
        var sortColumn = 'Created';
        thisService.getAllUserInSites().then(function (data) {
          thisService.users = data;
          var items = [];
          var context = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl + "/vbdc");
          var web = context.get_web();

          var oList = web.get_lists().getByTitle("DocumentMetadata");

          var camlQuery = new SP.CamlQuery();
          if (position) {
            camlQuery.set_listItemCollectionPosition(position);
          }
          camlQuery.set_viewXml(strCamlQuery);
          var collListItems = oList.getItems(camlQuery);

          context.load(collListItems);

          context.executeQueryAsync(
            function () {
              var listItemEnumerator = collListItems.getEnumerator();
              while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                var row = {};
                _.set(row, "ID", oListItem.get_item("ID"));
                _.set(row, "Id", oListItem.get_item("ID"));
                _.set(row, "UniqueId", oListItem.get_item("UniqueId"));
                _.set(row, "Title", oListItem.get_item("Title"));
                items.push(row);
              }
              if (collListItems.get_listItemCollectionPosition()) {
                items.nextPagingInfo = collListItems.get_listItemCollectionPosition().get_pagingInfo();
              } else {
                items.nextPagingInfo = null;
              }
              if (collListItems.itemAt(0)) {
                if (_.isDate(collListItems.itemAt(0).get_item(sortColumn))) {
                  items.previousPagingInfo = "PagedPrev=TRUE&Paged=TRUE&p_ID=" + collListItems.itemAt(0).get_item('ID') + "&p_" + sortColumn + "=" + encodeURIComponent(collListItems.itemAt(0).get_item(sortColumn).toJSON());
                } else {
                  items.previousPagingInfo = "PagedPrev=TRUE&Paged=TRUE&p_ID=" + collListItems.itemAt(0).get_item('ID') + "&p_" + sortColumn + "=" + encodeURIComponent(collListItems.itemAt(0).get_item(sortColumn));
                }

              }
              dfd.resolve(items);
            },
            function (sender, args) {
              dfd.reject(args.get_message());
            }
          );
        })
        return dfd.promise;
      };
      return lib;
    }
  ]);

angular.module("vbdc-app").factory("vanBanNoiBoConfigService",
  [
    "$SPList",
    function ($list) {
      var list = new $list({
        listName: "VanBanNoiBoConfig",
        siteUrl: "vanbanthamkhao",
        fields: [
          "Id",
          "Title",
          "SiteUrl",
          { name: "Configs", type: "json" },
          "Code",
          "Active"
        ]
      });
      return list;
    }
  ]);

angular.module("vbdc-app").factory("coquanbanhanhService",
  [
    "$SPList",
    function ($list) {
      var list = new $list({
        listName: "CoQuanBanHanh",
        siteUrl: "vanbanthamkhao",
        fields: [
          "Id",
          "Title",
          "ItemOrder",
          "Code",
          "Active"
        ]
      });
      return list;
    }
  ]);

angular.module("vbdc-app").factory("thethucvanbanService",
  [
    "$SPList",
    function ($list) {
      var list = new $list({
        listName: "TheThucVanBan",
        siteUrl: "vanbanthamkhao",
        fields: [
          "Id",
          "Title",
          "ItemOrder",
          "Code",
          "Active"
        ]
      });
      return list;
    }
  ]);

angular.module("vbdc-app").factory("loaivanbanService",
  [
    "$SPList",
    function ($list) {
      var list = new $list({
        listName: "LoaiVanBan",
        siteUrl: "vanbanthamkhao",
        fields: [
          "Id",
          "Title",
          "ItemOrder",
          "Code",
          "Active"
        ]
      });
      return list;
    }
  ]);

angular.module("vbdc-app").factory("tailieuhuongdanVBTKService",
  [
    "$SPDocumentLibrary", "spUserService", "$q",
    function ($lib, $fxUser, $q) {
      var lib = new $lib({
        listName: "TaiLieuHuongDan",
        siteUrl: "vanbanthamkhao",
        fields: [
          { name: "File", type: "lookup", expand: ["Name"], readonly: true },
          "Id",
          { name: "Created", type: "datetime" },
        ]
      });
      return lib;
    }
  ]);

angular.module("vbdc-app").factory("VanBanDinhCheTaskService",
  [
    "$SPList",
    function ($list) {
      var list = new $list({
        listName: "CongViec",
        siteUrl: "/",
        fields: [
          "Id",
          "UniqueId",
          "Title",
          "MoTa",
          "IdNhomPhoiHop",
          "TenNhomPhoiHop",
          "VanBanDinhChe",//Document luu số UNID
          "TenDonViPhoiHop",// "AssignedToDepartmentName",
          "MaDonViPhoiHop",//"AssignedToDepartmentCode",
          { name: "HanXuLy", type: "datetime" },//Duedate
          "TinhTrang",//Status
          "SoKyHieu",
          "SoVanBanText",
          "SoDen",
          "TheThucVanBan",
          "NgayDen",
          { name: "CoQuanBanHanh", type: "json" },
          "IdVanBan",
          "IdNguoiXuLyChinh",
          "TenNguoiXuLyChinh",
          "IdNguoiPhoiHop",
          "TenNguoiPhoiHop",
          "DanhSachIdNguoiHoanThanh",
          "DanhSachIdNhomHoanThanh",
          { name: "YKien", type: "json" },
          { name: "TaiLieuDinhKem", type: "json" },//RequestAttachment
          { name: "DanhSachDaDoc", type: "json" },
          { name: "Created", type: "datetime" },
          { name: "Author", type: "person", expand: ["Id", "Title"] },
          { name: "DanhSachNguoiHoanThanh", type: "json" },
          { name: "DanhSachNhomHoanThanh", type: "json" },
        ]
      });
      return list;
    }
  ]);
angular.module("vbdc-app").factory("DanhSachThongTinVBNBService",
  [
    "$SPList",
    function ($list) {
      var list = new $list({
        listName: "DanhSachThongTin",
        siteUrl: "vanbanthamkhao",
        fields: [
          "Id",
          "Title",
          "SoNoiBo",
          "SoKyHieu",
          "Nam",
          "GuidVanBan",
          "MaCoQuanBanHanh",
          "TheThucVanBan",
        ]
      });
      return list;
    }
  ]);

angular.module("vbdc-app").factory("branchService",
  [
    "$SPList",
    function ($list) {
      var list = new $list({
        listName: "Branch",
        siteUrl: "updb",
        fields: [
          "Id",
          "Title",
          "Code",
          { name: "AdminManagerGroup", type: "person", expand: ["Id", "Title"] },
          "IsHO",
          { name: "BanLanhDao", type: "person", expand: ["Id", "Title"] },
        ]
      });
      return list;
    }
  ]);

angular.module("vbdc-app").factory("dpmService",
  [
    "$SPList",
    function ($list) {
      var list = new $list({
        listName: "Departments",
        siteUrl: "updb",
        fields: [
          "Id",
          "Title",
          "Code",
          "ParentCode",
          { name: "ManagerGroup", type: "person", expand: ["Id", "Title"] },
          { name: "MemberGroup", type: "person", expand: ["Id", "Title"] },
          "Active",
          "TitleEN",
          { name: "ReceiverGroup", type: "person", expand: ["Id", "Title"] },
          "ItemOrder",
          "BusinessCode",
          "HRISCode",
          { name: "Manager", type: "person", expand: ["Id", "Title"] },
          "Level",
          "HRCode",
        ]
      });
      return list;
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
