  // Some fake testing data
angular.module('carpool.login',[])
 .controller('LoginCtrl', function($scope, $stateParams,$http,$location,$ionicPopup,CONFIG) {
  $scope.loginData={};
  $scope.loginData.userName="admin";
  $scope.loginData.password="admin";
  $scope.loginData.merchantId="001";
  $scope.error=function(message,title){
         var title=title ||  'Alert Info';
         $ionicPopup.alert({
                 title: title,
                  template: '<span style="color:red;font-weight:600;text-align:center">'+message+'</span>'
             });

  }
  $scope.doLogin=function(){
  var currentUrl=CONFIG.url+"admin/login";    
  $http({ method:"POST",url: currentUrl, 
       headers: { 'Content-Type': 'application/json; charset=UTF-8'},
       data:$scope.loginData
      }).success(function(data){
          CONFIG.info=data;
          CONFIG.merchantId=$scope.loginData.merchantId
          CONFIG.path=CONFIG.path+$scope.loginData.merchantId+"/";
          $location.path("app/manager");
          }).error(function(err){
        $scope.error(err.message);
  })

}
});

         