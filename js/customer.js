  // Some fake testing data
angular.module('carpool.customer',[])

.controller('CustomerCtrl', function($scope,$ionicModal,$ionicPopup,$http,$timeout,CONFIG) {
     $scope.customerData={};
     $scope.customerData.customer={};
     $scope.customerData.customers=[];
     /*$scope.storeHour={};
         $scope.tax={};
          $scope.option={};
          switch($scope.title) { 
            case "Taxs":
            if(index>=0)$scope.tax=angular.copy($scope.storeTaxLists[index]);*/
     $ionicModal.fromTemplateUrl('templates/modalCustomer.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.customerModal = modal;});
     
     $scope.openCustomer = function(id) {
       $scope.customerData.customer={};
       $scope.customerData.customer.status=true;
       if(id){
          $scope.customer=$scope.getCustomer(id);
       }
       $scope.customerModal.show();
    };
     $scope.closeCustomer = function() {$scope.customerModal.hide();};
     $scope.getCustomer=function(id){
           
            var currentUrl=CONFIG.url+"customers/"+id;
            $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              /*params:{}*/
             }).success(function(data){
              $scope.customerData.customer=data; 
              }).error(function(err){
         $scope.error(err.message);
     })
     }


     $scope.getCustomers=function(){
           
            var currentUrl=CONFIG.url+"customers/merchants/id";
            $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              /*params:{}*/
             }).success(function(data){
              $scope.customerData.customers=data; 
              }).error(function(err){
         $scope.error(err.message);
     })
     }
     $scope.customerUpdate=function(){
             var currentUrl=CONFIG.url+"customers";
                var method="POST";
                if($scope.customerData.customer && $scope.customerData.customer._id){
                  var currentUrl=CONFIG.url+"customers/"+$scope.customerData.customer._id;
                  method="PUT";
                }

                 $http({ method:method,url: currentUrl, 
                 headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                  data:$scope.customerData.customer
                 }).success(function(data){
                    $scope.getCustomers();
                    $scope.closeCustomer();
                  
                  
             }).error(function(err){
                $scope.error(err.message);
                
             })

           

     }
     $scope.searchSign=null;
     $scope.query=function(){
              $timeout.cancel( $scope.searchSign);
              $scope.searchSign=$timeout(function(){
                var currentUrl=CONFIG.url+"customers/query";
                  $http({ method:"GET",url: currentUrl, 
                   headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                   params:{"search":$scope.search}
                   }).success(function(data){
                    $scope.customerData.customers=data; 
                    console.log(data)
                    }).error(function(err){
               $scope.error(err.message);
           })
              },800)
               

     }
     $scope.getCustomers();
})