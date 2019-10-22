angular.module("vbdc-app").controller("selectDocsCtrl",
    ["$scope", "$uibModalInstance", "metadataService", "$parent", "vbdcService",
        function ($scope, $uibModalInstance, metadataService, $parent, vbdcService) {
            $scope.vm = {};

            $scope.vm.deleteItem = function () {
                $uibModalInstance.close(true);
            }

            $scope.vm.cancel = function () {
                $uibModalInstance.dismiss();
            }
            $scope.vm.buildQuery = function () {
                var criteria = _.get($scope, "vm.searchCriteria");
                var query = "";                
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
                if (_.get(criteria, "LinhVuc.length") > 0) {
                    var temp = "";
                    var orquery = _.map(_.map(criteria.LinhVuc, "Title"), function (title) {
                      return String.format("<Eq><FieldRef Name='LinhVuc' /><Value Type='Text'>{0}</Value></Eq>",
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
                
                query = "<View><Query><OrderBy><FieldRef Name='Created' Ascending='FALSE'/></OrderBy><Where>" +
                query + "</Where></Query><RowLimit>25</RowLimit></View>";
          
                return query;
              }
            $scope.actions = {
                search: function(){
                    vbdcService.getAllWithCaml("ThuocTinhVanBan", ["ID", "Title", "SoKyHieu", "NoiDung", "SoVanBan", "NgayBanHanh", "TheThucVanBan", "TinhTrangHieuLuc", "NgayHieuLuc"],
                        "vbdc", undefined, $scope.vm.buildQuery())
                        .then(function(data){
                            $scope.vm.results = data;
                        })
                },
                resetSearch: function(){
                    _.set($scope, "vm.searchCriteria", {});
                    $scope.actions.search();
                }
            }
            $scope.actions.search();
            $scope.vm.add = function(){
                if($parent.items.length > 0){
                    $parent.items = _.uniqBy(_.concat($parent.items, _.filter($scope.vm.results, function(item){
                        return item.Checked;
                    })), "ID");
                }
                else{
                    $parent.items = _.filter($scope.vm.results, function(item){
                        return item.Checked;
                    });
                }
                $uibModalInstance.dismiss();
            }

            $scope.vm.loaiVanBanOptions = {
                dataValueField: "Title",
                dataTextField: "Title",
                dataSource:
                {
                    transport: {
                        read: function (options) {
                            metadataService.getAll("TheThucVanBan", "Active ne 0")
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

            $scope.vm.LinhVucOpt = {
                dataValueField: "Title",
                dataTextField: "Title",
                dataSource:
                {
                    transport: {
                        read: function (options) {
                            metadataService.getAll("LinhVuc", "Active ne 0")
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

        }]);