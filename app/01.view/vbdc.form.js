angular.module("vbdc-app").controller("vbdc.form.controller", function($scope, metadataService) {
  $scope.vm = {
    document: {
      Nam: new Date().getFullYear()
    },
    departments: [],
    isEdit: true,
    dataLoaded: true,
    form : {
      isNew: function(){
        return true;
      }
    },
    actions : {
      canUpdateRequestDetail: function(){
        return true;
      }
    }
  }; 
  $scope.vm.optLoaiVanBan = {
    dataValueField: "Id",
    dataTextField: "Title",
    dataSource:
      {
          transport: {
              read: function (options) {
                metadataService.getAll("TheThucVanBan","Active ne 0")
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
  },
  $scope.vm.optThamQuyenKy = {
    dataValueField: "Id",
    dataTextField: "Title",
    dataSource:
      {
          transport: {
              read: function (options) {
                metadataService.getAll("ThamQuyenBanHanh","Active ne 0")
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
  },
  $scope.vm.optTinhTrangHieuLuc = {
    dataValueField: "Id",
    dataTextField: "Title",
    dataSource:
      {
          transport: {
              read: function (options) {
                metadataService.getAll("TinhTrangHieuLuc","Active ne 0")
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
  },
  $scope.vm.optSoVanBan = {
    autoBind: false,
    valuePrimitive: true,
    dataSource: [        
        "Sổ văn bản thường",
        "Sổ văn bản mật"
    ]
  }  
});
