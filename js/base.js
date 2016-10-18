  // Some fake testing data
angular.module('carpool.base',[])
 .controller('CountryCtrl', function($scope, $ionicModal,$stateParams,$http,$location,$ionicPopup,CONFIG,api) {
  $ionicModal.fromTemplateUrl('templates/modalMenu.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalMenu = modal;});
  $scope.openMenu=function(){
           var currentUrl="countrys/menus",method="GET";
           
             api.request(method,currentUrl).then(function(data){
              
                  $scope.appData.menus=data;
                  $scope.modalMenu.show();
           })
  }
  $scope.closeMenu=function(){
    $scope.modalMenu.hide();
    
  }

  $ionicModal.fromTemplateUrl('templates/modalCountry.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalCountry = modal;});
  $scope.openCountry = function(index) {
    $scope.appData.country={};
     if(index>=0){
        $scope.appData.country=$scope.appData.countrys[index];
      }
     $scope.modalCountry.show();
  };
  $scope.closeCountry = function() {$scope.modalCountry.hide();};
         $scope.deleteCountry=function(){
          var currentUrl="countrys/"+$scope.appData.country._id,method="DELETE";
           api.request(method,currentUrl).then(function(data){
                  $scope.closeCountry();
                  $scope.getCountrys();
           })
        }
        $scope.countryUpdate=function(){
          
          var currentUrl="countrys",method="POST";
        if($scope.appData.country._id){
            currentUrl="countrys/"+$scope.appData.country._id;
            method="PUT";
          }
         api.request(method,currentUrl,$scope.appData.country).then(function(data){
              $scope.closeCountry();
              $scope.getCountrys();
         })
        }
$scope.getCountrys();
})
  .controller('StateCtrl', function($scope,$ionicModal, $stateParams,$http,$location,$ionicPopup,CONFIG,api) {
  $ionicModal.fromTemplateUrl('templates/modalState.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalState = modal;});
  $scope.openState = function(parentIndex,index) {
  $scope.appData.state={};
   if(parentIndex>=0){ $scope.appData.state=$scope.appData.countrys[parentIndex].states[index];
    }else{$scope.appData.state.country=$scope.appData.countrys[0]._id;}
    $scope.modalState.show();
  };
  $scope.closeState = function() {$scope.modalState.hide();};
    
        $scope.deleteState=function(parentIndex,index){
            var currentUrl="states/"+$scope.appData.state._id,method="DELETE";
           
             api.request(method,currentUrl).then(function(data){
                  $scope.closeState();
                  $scope.getCountrys();
           })
        }
        $scope.stateUpdate=function(){
          
          var currentUrl="states",method="POST";
        if($scope.appData.state._id){
            currentUrl="states/"+$scope.appData.state._id;
            method="PUT";
          }
         api.request(method,currentUrl,$scope.appData.state).then(function(data){
              $scope.closeState();
              $scope.getCountrys();
         })
        }
       

  
      $scope.getCountrys();


})
   .controller('CityCtrl', function($scope,$ionicModal, $stateParams,$http,$location,$ionicPopup,CONFIG,api) {
  $ionicModal.fromTemplateUrl('templates/modalCity.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalCity = modal;});
    $scope.openCity = function(parentIndex,index) {

   $scope.appData.city={};
   if(parentIndex>=0){ $scope.appData.city=$scope.appData.states[parentIndex].citys[index];
    }else{$scope.appData.city.state=$scope.appData.states[0]._id;}
    $scope.modalCity.show();
  };
  $scope.closeCity = function() {$scope.modalCity.hide();};
      
$scope.deleteCity=function(parentIndex,index){
                 var currentUrl="citys/"+$scope.appData.city._id,method="DELETE";
           
             api.request(method,currentUrl,{}).then(function(data){
                  $scope.closeCity();
                  $scope.getStates();
           })
        }
        $scope.cityUpdate=function(){
          
          var currentUrl="citys",method="POST";
        if($scope.appData.city._id){
            currentUrl="citys/"+$scope.appData.city._id;
            method="PUT";
          }
         api.request(method,currentUrl,$scope.appData.city).then(function(data){
              $scope.closeCity();
              $scope.getStates();
         })
        }
       

  
      $scope.getStates();



})
.controller('TownCtrl', function($scope, $ionicModal,$stateParams,$http,$location,$ionicPopup,CONFIG,api) {
  $ionicModal.fromTemplateUrl('templates/modalTown.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalTown = modal;});
    $scope.openTown = function(parentIndex,index) {

   $scope.appData.town={};
   if(parentIndex>=0){ $scope.appData.town=$scope.appData.citys[parentIndex].towns[index];
    }else{$scope.appData.town.city=$scope.appData.citys[0]._id;}
    $scope.modalTown.show();
  };
  $scope.closeTown = function() {$scope.modalTown.hide();};
      
$scope.deleteTown=function(){
                 var currentUrl="towns/"+$scope.appData.town._id,method="DELETE";
           
             api.request(method,currentUrl,{}).then(function(data){
                  $scope.closeTown();
                  $scope.getCitys();
           })
        }
        $scope.townUpdate=function(){
          
          var currentUrl="towns",method="POST";
        if($scope.appData.town._id){
            currentUrl="towns/"+$scope.appData.town._id;
            method="PUT";
          }
         api.request(method,currentUrl,$scope.appData.town).then(function(data){
              $scope.closeTown();
              $scope.getCitys();
         })
        }
       $scope.getCitys();

})
.controller('VillageCtrl', function($scope,$ionicModal,$stateParams,$http,$location,$ionicPopup,CONFIG,api) {
  $ionicModal.fromTemplateUrl('templates/modalVillage.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalVillage = modal;});
    $scope.openVillage = function(parentIndex,index) {

   $scope.appData.village={};
   if(parentIndex>=0){ $scope.appData.village=$scope.appData.towns[parentIndex].villages[index];
    }else{$scope.appData.village.town=$scope.appData.towns[0]._id;}
    $scope.modalVillage.show();
  };
  $scope.closeVillage = function() {$scope.modalVillage.hide();};
      
$scope.deleteVillage=function(){
                 var currentUrl="villages/"+$scope.appData.village._id,method="DELETE";
           
             api.request(method,currentUrl,{}).then(function(data){
                  $scope.closeVillage();
                  $scope.getTowns();
           })
        }
        $scope.villageUpdate=function(){
          
          var currentUrl="villages",method="POST";
        if($scope.appData.village._id){
            currentUrl="villages/"+$scope.appData.village._id;
            method="PUT";
          }
         api.request(method,currentUrl,$scope.appData.village).then(function(data){
              $scope.closeVillage();
              $scope.getTowns();
         })
        }
       $scope.getTowns();
});

         