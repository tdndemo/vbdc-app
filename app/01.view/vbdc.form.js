angular.module("vbdc-app").controller("vbdc.form.controller", function($scope) {
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
});
