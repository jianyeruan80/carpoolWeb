angular.module('starter.controllers', ['ng-sortable'])
     .filter('isShow', function() {
            return function(data, scope,customerxx) {
              
                 return (data & 3)>0;                
            }
        })

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$http,$ionicModal,$location,$ionicLoading,$ionicPopup,CONFIG) {
   $scope.appData={}; 

    $scope.appData.order={};
    $scope.appData.orders=[];
    $scope.appData.order.subTotal=0;
    $scope.appData.order.tax=0;
    $scope.appData.order.taxRate=0;
    $scope.appData.order.tip=0;
    $scope.appData.order.tipRate=0;
    $scope.appData.order.discount=0;
    $scope.appData.order.discountRate=0;
    $scope.appData.order.grandTotal=0;
    $scope.appData.order.receiveTotal=0;
        $scope.appData.order.orderDetails=[];
    
   $scope.appData.menus=[];
   
   $scope.appData.roles=[];
   $scope.appData.perms=[];
   $scope.appData.users=[];
   $scope.appData.user={};
   $scope.appData.role={};

   $scope.appData.categorys=[];
   $scope.appData.categoryGroups=[];
   $scope.appData.groups=[];
   $scope.appData.items=[];
   $scope.appData.itemGroups=[];
   
   $scope.appData.optionGroups=[];
   $scope.appData.optionGroup={};
   $scope.appData.option={};
   $scope.appData.optionSign="";

   $scope.appData.globalOptionGroups=[];
   $scope.appData.globalOptionGroup={};
   $scope.appData.globalOption={};
   $scope.appData.globalOptionSign="";
   
    
   $scope.appData.category={};
   $scope.appData.group={};
   $scope.appData.item={};
  
  $scope.appData.sortItems=[];
   $scope.appData.sortSign="";
   $scope.appData.sortId="";
   $scope.appData.sortMove=false;
   
  $scope.appData.currentPic=null;
  $scope.appData.currentOptionPic=null;

  $scope.config={};
  $scope.config.selectRoleId="";
  $scope.config.selectUserId="";
  $scope.config.selectUserPermStr="";

  var timer=null;
        $scope.getMenus=function(){
    
      var currentUrl=CONFIG.url+"items/menus";
                var method="GET";
       $http({ method:method,url: currentUrl, 
                 headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                 
                 }).success(function(data){
                    console.log(data)
                    $scope.appData.menus=data;
                    $ionicLoading.hide();


             }).error(function(err){
                 $ionicLoading.hide();
                 $scope.error(err.message);

                
             })
  } 
 $scope.error=function(message,color,title){
         var title=title ||  'Alert Info';
         var color=color ||  'red';
         
         $ionicPopup.alert({
                 title:'<b>'+title+'</b>',
                  template: '<div style="color:'+color+';font-weight:600;text-align:center;font-size:24px">'+message+'</div>'
             });

  }
  $scope.exit=function(){
    CONFIG.info={};
    $location.path("/login");
   } 
  
 $scope.uploadPicture=function(id){
      $scope.appData.currentOptionPic=id;
      
      document.getElementById(id).click();
  }

$scope.showPreview=function(o,form){
       var byId=o.id;
       var index=!!o.getAttribute("data-index")?o.getAttribute("data-index"):"";
       var pic = document.getElementById(byId+'Src');
       var file = document.getElementById(byId);
       html5Reader(file,pic);
                var oData = new FormData(document.forms.namedItem(form));
              var oDataSource = new FormData();
        for (var [key, value] of oData.entries()) { 
         if(key=="picture"){
            if(value.size>0){
               oDataSource.append('picture', value);
               
             }
           
          }
        }
                 var uploadUrl=CONFIG.url+"uploadPic";
                   function reqListener () {
                               var resData=JSON.parse(this.responseText);
                             console.log(resData)
                               if(!!resData){
                                if($scope.appData.currentOptionPic=="optionPicture"){
                                  $scope.appData.currentOptionPic=resData;
                                }else{
                                  $scope.appData.currentPic=resData;  
                                }
                                
                                
                                file.value=null;
                                 }
                             
                    }
                        var oReq = new XMLHttpRequest();
                        oReq.addEventListener("load", reqListener);
                        oReq.open("POST", uploadUrl,true);
                        oReq.setRequestHeader("Authorization", "Bearer "+CONFIG.info.accessToken);
                        oReq.send(oDataSource);
    }


  $scope.reflesh=function(data,array,sign){
         if(!!sign){
           for(var i=0;i<array.length;i++){
                  if(sign==array[i]._id){
                    array.splice(i,1);
                    array.splice(i, 0, data);
                    break;
                  }
              }
         }else{
           array.unshift(data);
         }

   }
 $scope.getPerms=function(){

    var currentUrl=CONFIG.url+"admin/perms";
        
        $http({ method:"GET",url: currentUrl, 
         headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken}
         
        }).success(function(data){
          console.log("xxxxxxxxxxxxxxxxx");
          console.log(data);
          console.log("xxxxxxxxxxxxxxxxx");
         $scope.appData.perms=data; 
          
      }).error(function(err){
           $scope.error(err.message);
     })
  }
$scope.getMenus();
$scope.getRoles=function(){
    var currentUrl=CONFIG.url+"admin/roles";
       var roleData={};
         $http({ method:"GET",url: currentUrl, 
         headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
         
        }).success(function(data){
        $scope.appData.roles=data; 
      }).error(function(err){
      $scope.error(err.message);
     })
  }
  $scope.getUsers=function(){
      var currentUrl=CONFIG.url+"admin/users";
       
         $http({ method:"GET",url: currentUrl, 
         headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken}
        
        }).success(function(data){
          
         
            $scope.appData.users=data; 

           
           
   }).error(function(err){
          $scope.error(err.message);
        })
  }



  $scope.orderby=function(n){
   $scope.appData.sortMove=true;
    var sortJson={}
      timer=$timeout(function(){
     
       angular.forEach($scope.sortList,function(v,e){
              sortJson[v._id]=e+1;

           })
        
          $scope.sortList=[];
  

    var currentUrl=CONFIG.url+"groups/sort";
   if($scope.appData.sortSign=="G"){
    currentUrl=CONFIG.url+"categorys/sort/"+$scope.appData.sortId;
   }else if($scope.appData.sortSign=="C"){
    currentUrl=CONFIG.url+"items/sort/"+$scope.appData.sortId;
   }

            $http({ method:"PUT",url: currentUrl, 
              headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
             data:sortJson
             }).success(function(data){
              
             });
            },n)
   
  
            
}
   $ionicModal.fromTemplateUrl('templates/modalSortMenu.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalSortMenu = modal;});
    $scope.sortableConfig = { animation: 750,
     onEnd: function(list) {
      
       $scope.sortList=list.models;
        $timeout.cancel(timer);
        if(list.newIndex !=list.oldIndex){
          $scope.orderby(2000);  
        }
        

      console.log(list)
    }
 };
  $scope.openSort = function(sign,Id) {
    $scope.appData.sortId=Id;
    $scope.appData.sortSign=sign;
    $scope.appData.sortMove=false;
     $scope.modalSortMenu.show();
  var currentUrl=CONFIG.url+"groups/merchants/id";
   if(sign=="G"){
    currentUrl=CONFIG.url+"categorys/groups/"+Id;
   }else if(sign=="C"){
    currentUrl=CONFIG.url+"items/categorys/"+Id;
   }

$http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              }).success(function(data){
              $scope.appData.sortItems=data;


              }).error(function(err){
         $scope.error(err.message);
     })


  };
  $scope.closeSort = function() {
   $ionicLoading.show();
   
   if($scope.appData.sortMove){
     $scope.appData.menus.menus=[];
     $timeout(function(){$scope.getMenus();},1500)  
   }else{
    $ionicLoading.hide();
   }
  
     
   
    
    $scope.modalSortMenu.hide();};






$scope.auth=function(){
      var authData={};
         authData.permissions=[];
         authData.roles=[];
         var tempPermissions="";
           var currentUrl=CONFIG.url+"admin/roles/"+$scope.config.selectRoleId+"/perms";
         if($location.url().indexOf("user")>=0){
            currentUrl=CONFIG.url+"admin/users/"+$scope.config.selectUserId+"/perms";
             $scope.config.selectRoleId="";
                  angular.forEach($scope.appData.roles,function(v,key){
                         if(v.key==v._id){
                              authData.roles.push(v._id);
                              tempPermissions+=v.permissions.toString();
                            }
                      
              })
          }else{
            $scope.config.selectUserId="";
          }
            
            angular.forEach($scope.appData.perms,function(value,key){
                   angular.forEach(value.perms,function(v,k){
                      
                       if(v.key==v.value && (tempPermissions.indexOf(v.value)==-1 || tempPermissions=="")){
                          authData.permissions.push(v.value);
                        }
                   })
          })
             
          
        $http({ method:"PUT",url: currentUrl, 
         headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
        data:authData
        }).success(function(data){
        if($scope.config.selectRoleId){
            $scope.getRoles();
          }else{
            
            $scope.getUsers();
          }
          $scope.error("success","green");
          
      }).error(function(err){
              $scope.error(err.message);
     })
    }
    $scope.all=function(e){
      var _id = e.target.dataset.permground;
      stopPropagation(e);

    angular.forEach($scope.appData.perms,function(value,key){
                   if(value._id==_id){
                        angular.forEach(value.perms,function(v,k){
                         // console.log(document.getElementById(checkBoxName).checked)
                              if(e.target.checked==true){
                                v.key=angular.copy(v.value);
                               
                              }else{
                                v.key="";
                               
                              }
                              
                            
                       }) 
                   }
                   
          })

    }
 
 $scope.getGroups=function(){
       var currentUrl=CONFIG.url+"groups/merchants/id";
            $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              }).success(function(data){
              $scope.appData.groups=data; 
               

              }).error(function(err){
         $scope.error(err.message);
     })
 }
 
 $scope.getCategoryGroups=function(){
         var currentUrl=CONFIG.url+"categorys/merchants/id";
            $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              
             }).success(function(data){
              $scope.appData.categoryGroups=data; 
              }).error(function(err){
         $scope.error(err.message);
     })
 }

 $scope.getCategorys=function(){
         var currentUrl=CONFIG.url+"categorys";
            $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              
             }).success(function(data){
              $scope.appData.categorys=data; 
              }).error(function(err){
         $scope.error(err.message);
     })
 }

  
/* $scope.getCategorys=function(){
         var currentUrl=CONFIG.url+"categorys";
            $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              
             }).success(function(data){
              $scope.appData.categorys=data; 
              }).error(function(err){
         $scope.error(err.message);
     })
 }*/
 $scope.customerOptionDel=function(parentIndex,index){

   if(!!index && index>=0){

     $scope.appData.optionGroups[parentIndex].options.splice(index,1);
   }else{
   
    $scope.appData.optionGroups.splice(parentIndex,1);
   }
   $scope.customerOptionModal.remove();
 }
$scope.customerOptionSign={};
$scope.openCustomerOption=function(sign,parentIndex,index){
  $scope.customerOptionSign.sign=sign;
  $scope.customerOptionSign.parentIndex=parentIndex;
  $scope.customerOptionSign.index=index;

  $scope.appData.optionGroup={};
  // $scope.appData.optionGroups=[];
  $scope.appData.option={};
  $scope.appData.optionSign=sign;
  $scope.appData.currentOptionPic=null;
  if(parentIndex>=0){
      $scope.appData.optionGroup=$scope.appData.optionGroups[parentIndex];
      if(index>=0){
          $scope.appData.option=$scope.appData.optionGroup.options[index];
          $scope.appData.option.index=index;
      }
    }
  $ionicModal.fromTemplateUrl('templates/modalCustomerOption.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal)
 {$scope.customerOptionModal = modal;
  $scope.customerOptionModal.show();});
}

$scope.closeCustomerOption=function(){
  $scope.customerOptionModal.remove();
}
$scope.cutomerOptionGroupUpdate=function(){

    if($scope.appData.optionSign=="P"){
      $scope.appData.optionGroups.push($scope.appData.optionGroup);
              }else{
               

                   $scope.appData.optionGroup.options= $scope.appData.optionGroup.options || [];
                  if($scope.appData.currentOptionPic){
                   $scope.appData.option.picture=$scope.appData.currentOptionPic;
                   $scope.appData.currentOptionPic=null;
                   }   
                   if($scope.appData.option.index>=0){
                    $scope.appData.optionGroup.options[$scope.appData.option.index]=$scope.appData.option;
                   }else{
                   $scope.appData.optionGroup.options.push($scope.appData.option); 
                   }
                   

              }
    $scope.customerOptionModal.remove();
}

  $scope.getGlobalOptionGroups=function(){
        var currentUrl=CONFIG.url+"globaloptiongroups/merchants/id";
           $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
           }).success(function(data){
             $scope.appData.globalOptionGroups=data;
  }).error(function(err){
             $scope.error(err.message);
           })
  }
 $scope.getGlobalOptionGroups();
 
})
.controller('GlobalOptionCtrl', function($scope,$ionicModal, $ionicLoading,$timeout,$ionicPopup,$http,CONFIG) {
  $scope.globalOptionDel=function(id,subId){
          
          var currentUrl=CONFIG.url+"globaloptiongroups/"+id;
                $http({ method:"DELETE",url: currentUrl, 
                 headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                 data:{subId:subId}
               }).success(function(data){
                 $scope.getGlobalOptionGroups();
                 $scope.claseGlobalOption();
      }).error(function(err){
                 $scope.error(err.message);
               })
  }
  $scope.openGlobalOption=function(sign,parentIndex,index){
    $scope.subSign=index;
    $scope.appData.globalOptionGroup={};
    $scope.appData.globalOption={};
    $scope.appData.globalOptionSign=sign;
    $scope.appData.currentPic=null;
    if(parentIndex>=0){
      $scope.appData.globalOptionGroup=$scope.appData.globalOptionGroups[parentIndex];
      if(index>=0){
          $scope.appData.globalOption=$scope.appData.globalOptionGroups[parentIndex].options[index];
          $scope.appData.globalOption.index=index;
      }
    }
    $ionicModal.fromTemplateUrl('templates/modalGlobalOption.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.optionModal = modal;$scope.optionModal.show();});
  }
  $scope.claseGlobalOption = function() {$scope.optionModal.remove();};


  $scope.globalOptionGroupUpdate=function(){
          
              var currentUrl=CONFIG.url+"globalOptiongroups";
              var method="POST";
             
              if($scope.appData.globalOptionGroup._id){
                var currentUrl=CONFIG.url+"globalOptiongroups/"+$scope.appData.globalOptionGroup._id;
                method="PUT";
              }
              if($scope.appData.globalOptionSign=="P"){

              }else{
                 if($scope.appData.currentOptionPic){
                   $scope.appData.globalOption.picture=$scope.appData.currentOptionPic;
                   $scope.appData.currentOptionPic=null;
                   }   
                   $scope.appData.globalOptionGroup.options= $scope.appData.globalOptionGroup.options || [];
                   if($scope.appData.globalOption.index>=0){
                    $scope.appData.globalOptionGroup.options[$scope.appData.globalOption.index]=$scope.appData.globalOption;
                   }else{
                   $scope.appData.globalOptionGroup.options.push($scope.appData.globalOption); 
                   }
                   

              }
              console.log($scope.appData.globalOptionGroup);
              
               $http({ method:method,url: currentUrl, 
               headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
               data:$scope.appData.globalOptionGroup
               }).success(function(data){
                  $scope.getGlobalOptionGroups();
                  $scope.claseGlobalOption();
                
                
           }).error(function(err){
              
              $scope.error(err.message);
           })
     }
      
})
.controller('ManagerCtrl', function($scope,$ionicModal, $ionicLoading,$timeout,$ionicPopup,$http,CONFIG) {
  $scope.managerData={};
  $scope.managerData.title="Store Info";

  $scope.managerData.store={};
  $scope.managerData.store.tax=0;
  $scope.managerData.store.addressInfo={};
  
 //$scope.managerData.store.addressInfo.location.coordinates="xxxxxxxxxxxx";

  $scope.managerData.storeHours=[];
  $scope.managerData.storeHour={};
  
  $scope.managerData.settings=[];
  $scope.managerData.setting={};
 

  $scope.showDate=[{"key":"Mon","value":""},{"key":"Tue","value":""},{"key":"Web","value":""},{"key":"Thu","value":""},{"key":"Fri","value":""},{"key":"Sat","value":""},{"key":"Sun","value":""}];

  
$scope.getCoordinates=function(){
  $scope.managerData.store.addressInfo.location={};
  $scope.managerData.store.addressInfo.location.coordinates="";
       if($scope.managerData.store.addressInfo.address){
                var currentUrl=CONFIG.url+"ext";
               $http({ method:"GET",url: currentUrl, 
                 headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                 params:{"address":$scope.managerData.store.addressInfo.address}
               }).success(function(data){

                  $scope.managerData.store.addressInfo.address=data.formatted_address;
                  
                  console.log($scope.managerData.store);
                  $scope.managerData.store.addressInfo.location.coordinates=data.geometry.location.lat+","+data.geometry.location.lng;
                 }).error(function(err){
                 $scope.error(err.message);
               })
       }
}


  $ionicModal.fromTemplateUrl('templates/modalStoreHour.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.hourModal = modal;});
  $scope.openHourModal = function() {$scope.hourModal.show();};
  $scope.closeHourModal = function() {$scope.hourModal.hide();};

 $ionicModal.fromTemplateUrl('openSetting.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.settingModal = modal;});
  $scope.openSettingModal = function() {$scope.settingModal.show();};
  $scope.closeSettingModal = function() {$scope.settingModal.hide();};

  $scope.goToLink=function(title){
         $scope.managerData.title=title;
          switch($scope.title) { 
           case "Store Info":
           $scope.getStore();
           break;
           case "Setting":
           $scope.getSettings();
           break;
           case "Store Hours":
            $scope.getHours();
           break;}
         }


  $scope.getStore=function(){
          var currentUrl=CONFIG.url+"stores/merchants/id";
           $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
           }).success(function(data){
             $scope.managerData.store=data;

           }).error(function(err){
             $scope.error(err.message);
           })
            
}
   
      $scope.getHours=function(){
           var currentUrl=CONFIG.url+"storehours/merchants/id";
           $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
           }).success(function(data){
             $scope.managerData.storeHours=data;
             console.log("=========AAAAAAAAAA=");
             console.log($scope.managerData.storeHours);
            console.log("=========BBBBB=");
           }).error(function(err){
             $scope.error(err.message);
           })

      }

     $scope.hourUpdate=function(){
              var currentUrl=CONFIG.url+"storehours";
              var method="POST";
              $scope.managerData.storeHour.date=[];
              if(!!$scope.managerData.storeHour._id){
                var currentUrl=CONFIG.url+"storehours/"+$scope.managerData.storeHour._id;
                method="PUT";
              }
              angular.forEach($scope.showDate,function(v,k){
                  if(v.key==v.value){
                     $scope.managerData.storeHour.date.push(v.key);
                  }
              })
            console.log($scope.managerData.storeHour)
            $http({ method:method,url: currentUrl, 
               headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
               data:$scope.managerData.storeHour
               }).success(function(data){
                  $scope.getHours();
                  $scope.closeHourModal();
                
                
           }).error(function(err){
              
              $scope.error(err.message);
           })

       }



      $scope.getHour=function(index){
              $scope.storeHour=angular.copy($scope.storeHourLists[index]);
               var temp=$scope.storeHour.date.toString();
              angular.forEach($scope.showDate,function(v,k){
                   if(temp.indexOf(v.key)>=0){
                      v.value=v.key;
                   }else{
                     v.value="";
                   }
              })

      }
       $scope.openManager=function(index){
          alert(index);
          switch($scope.managerData.title) { 
            case "Taxs":
        
           $scope.openTaxModal();break;
            case "Store Hours":
            $scope.managerData.storeHour={};
                angular.forEach($scope.showDate,function(v,k){v.value="";});
                if(index>=0){$scope.managerData.storeHour=angular.copy($scope.managerData.storeHours[index])
                $scope.managerData.storeHour.fromTime=new Date($scope.managerData.storeHour.fromTime);
                $scope.managerData.storeHour.toTime=new Date($scope.managerData.storeHour.toTime);
                };
                console.log($scope.managerData.storeHours);

                $scope.openHourModal();
                break;
            case "Setting":
            if(index>=0){$scope.setting=angular.copy($scope.settingLists[index])};
           // if(index>=0){$scope.getHour(index)};
            $scope.openSettingModal();break;

          }

       }

    




       $scope.storeUpdate=function(){
         
              if($scope.appData.currentPic){
                $scope.managerData.store.picture=$scope.appData.currentPic;
              }   
              
                console.log($scope.managerData.store)
                var currentUrl=CONFIG.url+"stores";
                var method="POST";
                if($scope.managerData.store && $scope.managerData.store._id){
                  var currentUrl=CONFIG.url+"stores/"+$scope.managerData.store._id;
                  method="PUT";
                }
                $http({ method:method,url: currentUrl, 
                 headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                  data:$scope.managerData.store
                 }).success(function(data){
                   $scope.managerData.store=data;
                   $scope.appData.currentPic=null;
                    $scope.error("success","green");
             }).error(function(err){
                 $scope.error(err.message);
                
             })

   
       
}

 $scope.getStore();
 $timeout(function() {
    $scope.getHours(); 
 }, 0);
 

  })
.controller('GroupCtrl', function($scope,$ionicModal,$ionicPopup,$ionicLoading,$http,CONFIG) {
  $scope.getGroups();
  $ionicModal.fromTemplateUrl('templates/modalGroup.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalGroup = modal;});
  $scope.openGroup=function(index){
   $scope.appData.optionGroups=[];
   $scope.appData.group={};
       $scope.appData.group.status=true;
    if(index>=0){
       $scope.appData.group=angular.copy($scope.appData.groups[index]);
       $scope.appData.optionGroups =angular.copy($scope.appData.group.customerOptions);
    }


               try{
               var temp=$scope.appData.group.globalOptions.length>0?$scope.appData.group.globalOptions.join(","):'';
                 angular.forEach($scope.appData.globalOptionGroups,function(v,k){
                 
                    if(temp.indexOf(v._id)!=-1){
                      $scope.appData.group.globalOptions[k]=v._id;
                    }else{
                      $scope.appData.group.globalOptions[k]=null;
                    }
                   
                })
               }catch(ex){}

              
              
     $scope.modalGroup.show();
  };

  $scope.closeGroup=function(){
   

    $scope.modalGroup.hide()
  };

    $scope.groupUpdate=function(){
        
          if($scope.appData.currentPic){
                $scope.appData.group.picture=$scope.appData.currentPic;
              }   
              $scope.appData.group.customerOptions=$scope.appData.optionGroups;
               var currentUrl=CONFIG.url+"groups";
                var method="POST";
                if($scope.appData.group && $scope.appData.group._id){
                  var currentUrl=CONFIG.url+"groups/"+$scope.appData.group._id;
                  method="PUT";
                }
                var temp=angular.copy($scope.appData.group.globalOptions);
                $scope.appData.group.globalOptions=[];
                for(var key in temp){
                if(!!temp[key]){
                  $scope.appData.group.globalOptions.push(temp[key]);
                }
         
               }
                

                $http({ method:method,url: currentUrl, 
                 headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                  data:$scope.appData.group
                 }).success(function(data){
                   $scope.getGroups();
                   $scope.appData.currentPic=null;
                   $scope.closeGroup();

             }).error(function(err){
                 $scope.error(err.message);
                
             })
   }  

})
.controller('CategoryCtrl', function($scope,$ionicModal,$ionicPopup,$ionicLoading,$http,CONFIG) {
  $scope.getGroups();
  $ionicModal.fromTemplateUrl('templates/modalCategory.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalCategory = modal;});
   
   $scope.openCategory=function(id){
   
     $scope.appData.optionGroups=[];
      $scope.appData.category={};
    $scope.appData.category.status=true;
    try{
      $scope.appData.category.group=$scope.appData.groups[0]._id;  
    }catch(ex){}
    
    if(!!id){

      var p1= $scope.getCategory(id);
       p1.then(function(data){
       $scope.appData.category=angular.copy(data);
       $scope.appData.optionGroups =angular.copy($scope.appData.category.customerOptions);
       try{
               var temp=$scope.appData.category.globalOptions.length>0?$scope.appData.category.globalOptions.join(","):'';
                 angular.forEach($scope.appData.globalOptionGroups,function(v,k){
                 
                    if(temp.indexOf(v._id)!=-1){
                      $scope.appData.category.globalOptions[k]=v._id;
                    }else{
                      $scope.appData.category.globalOptions[k]=null;
                    }
                   
                })
               }catch(ex){}
}).catch(function(reason) {
          console.log(reason)
  });
      
    }


              
     $scope.modalCategory.show();
    
   };
  $scope.closeCategory=function(){$scope.modalCategory.hide()};
   

$scope.deleteCategory=function(id){
                  var currentUrl=CONFIG.url+"categorys/"+id;
                        $http({ method:"DELETE",url: currentUrl, 
                         headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                          
                         }).success(function(data){
                           $scope.closeCategory();
                        
                           $scope.getCategorys();
                           $scope.getCategoryGroups();
                          }).error(function(err){
                        $scope.error(err.message);
                        //reject(err.message)
                      })
} 
      $scope.getCategory=function(id){
             return new Promise(function(resolve, reject) {
        //resolve("OK");
       
                     
                        var currentUrl=CONFIG.url+"categorys/"+id;
                        $http({ method:"GET",url: currentUrl, 
                         headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                          
                         }).success(function(data){
                          $scope.appData.category=data; 
                          resolve(data);
                          }).error(function(err){
                        $scope.error(err.message);
                        reject(err.message)
                      })
              }); 
     
      }

   $scope.categoryUpdate=function(){
            if($scope.appData.currentPic){
                $scope.appData.category.picture=$scope.appData.currentPic;
              }   

        
              $scope.appData.category.customerOptions=$scope.appData.optionGroups;
               var currentUrl=CONFIG.url+"categorys";
                var method="POST";
                if($scope.appData.category && $scope.appData.category._id){
                  var currentUrl=CONFIG.url+"categorys/"+$scope.appData.category._id;
                  method="PUT";
                }
                 var temp=angular.copy($scope.appData.category.globalOptions);
                $scope.appData.category.globalOptions=[];
                for(var key in temp){
                if(!!temp[key]){
                  $scope.appData.category.globalOptions.push(temp[key]);
                }
         
               }
               console.log($scope.appData.category)
                $http({ method:method,url: currentUrl, 
                 headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                  data:$scope.appData.category
                 }).success(function(data){
                   $scope.closeCategory();
                   $scope.appData.currentPic=null;
                   $scope.getCategorys();
                   $scope.getCategoryGroups();

             }).error(function(err){
                 $scope.error(err.message);
                
             })
   }
   $scope.getCategorys=function(){
        
           var currentUrl=CONFIG.url+"categorys";
            $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              
             }).success(function(data){
              $scope.appData.categorys=data; 
              console.log(data)
              }).error(function(err){
         $scope.error(err.message);
     })
 }
 $scope.getCategorys();
 $scope.getCategoryGroups();
})
.controller('ItemCtrl', function($scope,$location,$ionicModal,$ionicPopup,$timeout,$http,CONFIG) {
  $scope.getCategorys();




$scope.deleteItem=function(id){
                  var currentUrl=CONFIG.url+"items/"+id;
                        $http({ method:"DELETE",url: currentUrl, 
                         headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                          
                         }).success(function(data){
                           $scope.closeItem();
                        
                           $scope.getItems();
                          }).error(function(err){
                        $scope.error(err.message);
                        //reject(err.message)
                      })
} 
$ionicModal.fromTemplateUrl('templates/modalMenu.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalMenu = modal;});
 $scope.openMenu=function(){
  $scope.modalMenu.show();
  $scope.getMenus();
 }
 $scope.closeMenu=function(){
  $scope.modalMenu.hide();
 }
 $ionicModal.fromTemplateUrl('templates/modalItem.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalItem = modal;}); 
$scope.getItem=function(id){
         return new Promise(function(resolve, reject) {
          var currentUrl=CONFIG.url+"items/"+id;
            $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              
             }).success(function(data){
              $scope.appData.item=data; 
              resolve(data);
              }).error(function(err){
         $scope.error(err.message);
      reject(err.message);
     })
            })
            }
 $scope.openItem=function(id){
   $scope.appData.optionGroups=[];
   $scope.appData.item={};
   $scope.appData.item.status=true;
   try{
   $scope.appData.item.category=$scope.appData.categorys[0]._id; 
 }catch(ex){}
   
    if(!!id){
      var p1=$scope.getItem(id);
        p1.then(function(data){
       $scope.appData.item=angular.copy(data);
       $scope.appData.optionGroups =angular.copy($scope.appData.item.customerOptions);

               try{
        var temp=$scope.appData.item.globalOptions.length>0?$scope.appData.item.globalOptions.join(","):'';
         angular.forEach($scope.appData.globalOptionGroups,function(v,k){
                        if(temp.indexOf(v._id)!=-1){
                            $scope.appData.item.globalOptions[k]=v._id;
                          }else{
                            $scope.appData.item.globalOptions[k]=null;
                          }
                         
         })}catch(ex){}
}).catch(function(reason) {
          console.log(reason)
  });
   }
  

     $scope.modalItem.show();
    
   };
  


  $scope.closeItem=function(){$scope.modalItem.hide()};
  $scope.itemUpdate=function(){
           if($scope.appData.currentPic){
                $scope.appData.item.picture=$scope.appData.currentPic;
              }   
              $scope.appData.item.customerOptions=$scope.appData.optionGroups;
               var currentUrl=CONFIG.url+"items";
                var method="POST";
                if($scope.appData.item && $scope.appData.item._id){
                  var currentUrl=CONFIG.url+"items/"+$scope.appData.item._id;
                  method="PUT";
                }
                 var temp=angular.copy($scope.appData.item.globalOptions);
                $scope.appData.item.globalOptions=[];
                for(var key in temp){
                if(!!temp[key]){
                  $scope.appData.item.globalOptions.push(temp[key]);
                }
         
               }
                $http({ method:method,url: currentUrl, 
                 headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                  data:$scope.appData.item
                 }).success(function(data){
                   $scope.getItems();
                   $scope.appData.currentPic=null;
                   $scope.closeItem();

             }).error(function(err){
                 $scope.error(err.message);
                
             })
   }
   $scope.getItems=function(){
         var currentUrl=CONFIG.url+"items/merchants/id";
            $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
              
             }).success(function(data){
              $scope.appData.itemGroups=data; 
              console.log(data)
              }).error(function(err){
         $scope.error(err.message);
     })
 }
 $scope.getItems();
})
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

.controller('UserCtrl', function($scope,$ionicModal,$ionicPopup,$http,CONFIG) {
     $scope.userData={};
     $scope.userData.password="";
     $scope.$on('$destroy', function() {
     $scope.userModal.remove();
    
   });

   
    $ionicModal.fromTemplateUrl('templates/modalUser.html', {
      scope: $scope,
      animation: 'slide-in-up'
      }).then(function(modal) {
      $scope.userModal = modal;
   });

   $scope.openUserModal = function() {
       $scope.appData.user={};
       $scope.appData.user.status=true;
       $scope.userModal.show();

   };
   $scope.closeUserModal = function() {
    
      $scope.userModal.hide();
   };
    $scope.userUpdate=function(){
         var currentUrl=CONFIG.url+"admin/users";
        var method="POST";
        if($scope.appData.user._id){
         
         var currentUrl=CONFIG.url+"admin/users/"+$scope.appData.user._id;
          method="PUT";
          if($scope.userData.password==$scope.appData.user.password){
                delete $scope.appData.user["password"];
          }
        }
       $http({ method:method,url: currentUrl, 
         headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
          data:$scope.appData.user
         }).success(function(data){
          $scope.closeUserModal();
          $scope.getUsers();
      }).error(function(err){
          $scope.error(err.message);
     })

   }
   $scope.getSelectRolePerms=function(){
    
         var rolePermStr="";
           angular.forEach($scope.appData.roles,function(v,k){
                 if(v._id==v.key){
                    rolePermStr+=v.permissions.toString();
                 }

           })
             rolePermStr+=$scope.config.selectUserPermStr;
            angular.forEach($scope.appData.perms,function(value,key){
              document.getElementById("allCheckboxUser"+value._id).checked=false;
              angular.forEach(value.perms,function(v,k){
                       if(rolePermStr.indexOf(v.value)>=0){
                         v.key=angular.copy(v.value);
                       }else{
                         
                        v.key=""; 

                       }
                   })
          })

   }
   $scope.getUserPerm=function(e){
       stopPropagation(e);
      var selectRoleStr="";
      $scope.config.selectUserPermStr="";
     for(var i=0;i<$scope.appData.users.length;i++){
       if($scope.appData.users[i]._id==$scope.config.selectUserId){
            selectRoleStr=$scope.appData.users[i].roles.toString();
            $scope.config.selectUserPermStr=$scope.appData.users[i].permissions.toString();
            break;
       }
     }

       angular.forEach($scope.appData.roles,function(v,k){
                 if(selectRoleStr.indexOf(v._id)!=-1){

                    v.key=v._id;
        }else{
                    v.key="";
                 }

           })


       $scope.getSelectRolePerms();



   }
   $scope.getUser=function(index){
    $scope.appData.user=angular.copy($scope.appData.users[index]);
    $scope.userData.password=$scope.appData.user.password;
    $scope.userModal.show();
     
   }
   $scope.getUsers();
   $scope.getRoles();
   $scope.getPerms();
})
.controller('RoleCtrl', function($scope,$ionicModal,$http,$ionicPopup,CONFIG) {
   $scope.$on('$destroy', function() {
      $scope.roleModal.remove();
    });
   $scope.getRoles();
   $scope.getPerms();

  $scope.roleEdit=function(index){
         $scope.appData.role=angular.copy($scope.appData.roles[index]);
         $scope.roleModal.show(); 

  }
  $ionicModal.fromTemplateUrl('templates/modalRole.html', {
      scope: $scope,
      animation: 'slide-in-up'
      }).then(function(modal) {
      $scope.roleModal = modal;
   });

   $scope.openRoleModal = function() {
       $scope.appData.role={};
       $scope.appData.role.status=true;
       $scope.roleModal.show();

   };
   $scope.closeRoleModal = function() {
    $scope.roleModal.hide();
   };
   $scope.roleUpdate=function(){
    var currentUrl=CONFIG.url+"admin/roles";
        var method="POST";
        if($scope.appData.role._id){
          var currentUrl=CONFIG.url+"admin/roles/"+$scope.appData.role._id;
          method="PUT";
        }
        $http({ method:method,url: currentUrl, 
         headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
          data:$scope.appData.role
         }).success(function(data){
             $scope.closeRoleModal();
             $scope.getRoles();
         
          
     }).error(function(err){
        
        $scope.error(err.message);
     })

   }

   $scope.getSelectRolePerms=function(e,id){
    $scope.config.selectRoleId=id;
    stopPropagation(e);
    
     //$scope.config.selectRoleId=id;
      stopPropagation(e);
      var rolePermStr="";
      
      for(var i=0;i<$scope.appData.roles.length;i++){
                       if($scope.appData.roles[i]._id==$scope.config.selectRoleId){
                          rolePermStr=$scope.appData.roles[i].permissions;
                          break;
                       }

     }
                
      angular.forEach($scope.appData.perms,function(value,key){
              document.getElementById("allCheckbox"+value._id).checked=false;
              angular.forEach(value.perms,function(v,k){
                       if(rolePermStr.indexOf(v.value)>=0){
                         v.key=angular.copy(v.value);
                       }else{
                         
                        v.key=""; 

                       }
                   })
          })


 }
 
})
.controller('LoginCtrl', function($scope, $stateParams,$http,$location,$ionicPopup,CONFIG) {
  $scope.loginData={};
  $scope.loginData.merchantId="";
  $scope.loginData.licenseKey="";
  /*http://173.244.222.167:3002/api/licenses/active/3XaE5tlj3mUeKNOT8O7Kk1WBUUCRkeferIXucyl1gqmwo0^9r3i20n^eMJpEcTKL2SJZ2eOHTMBKZhLZwFriFA==*/
  $scope.licenseActive=function(){

         var currentUrl="http://173.244.222.167:3002/api/licenses/active/"+$scope.loginData.licenseKey;
        
           $http({ method:"PUT",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8'},
           }).success(function(data){
             console.log(data);
            var store={};
            store.merchantId=data.merchantId;
            store.licenseKey=data.licenseKey;
            store.expires=data.expires;

                                   currentUrl=CONFIG.url+"stores/active";
                                   $http({ method:"POST",url: currentUrl, 
                                     headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                                     data:store
                                   }).success(function(data){
                                    alert("active success");
                                    $scope.getLicense();
                                  

                                   }).error(function(err){
                                     $scope.error(err.message);
                                   }) 
           }).error(function(err){
             $scope.error(err.message);
           })
  }
  $scope.getLicense=function(){

           var currentUrl=CONFIG.url+"stores";
           $http({ method:"GET",url: currentUrl, 
             headers: { 'Content-Type': 'application/json; charset=UTF-8'},
           }).success(function(data){
                          if(data){
                              currentUrl=CONFIG.url+"stores/decrypt";
                                         $http({ method:"POST",url: currentUrl, 
                                           headers: { 'Content-Type': 'application/json; charset=UTF-8'},
                                           data:data
                                         }).success(function(data){
                                          
                                          if(data){
                                           $scope.loginData=data;  
                                           //$scope.loginData.expiresTotal=data.expiresTotal;  
                                          }
                                          console.log($scope.loginData);
                                        

                                         }).error(function(err){
                                              //$scope.loginData.merchantId=data.merchantId; 
                                             $scope.error(err.message); 
                                            
                                             
                                         }) 
                          }
                                       
                 
           

           }).error(function(err){
             $scope.error(err.message);
           })
            

  }
  $scope.getLicense();
  
 /// $scope.loginData.userName="admin";
  $scope.loginData.password="admin";
  //$scope.loginData.merchantId="101";
  //$scope.loginData.loginType="2";
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
         
           console.log(data);
           CONFIG.info=data;
          CONFIG.merchantId=$scope.loginData.merchantId
          CONFIG.path=CONFIG.path+$scope.loginData.merchantId+"/";
        
          $location.path("app/manager");
          
          console.log(data);
        
   }).error(function(err){
    
      
       $scope.error(err.message);
       
   })

}
});

 var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                              -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                              -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
                                              58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
                                              7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                                              25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                                              37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
                                              -1, -1);
function stopDefault( e ) { 
if ( e && e.preventDefault ) 
   e.preventDefault(); 
    else 
   window.event.returnValue = false; 

    return false; 
} 

function stopPropagation(e) {
 var e=(e)?e:window.event;
 if (window.event) {
  e.cancelBubble=true;
 } else {
  e.stopPropagation();
 }
}
  function base64encode(str)
                {
                var out, i, len;
                var c1, c2, c3;
                len = str.length;
                i = 0;
                out = "";

                while (i < len)
                    {
                    c1 = str.charCodeAt(i++) & 0xff;

                    if (i == len)
                        {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        out += "==";
                        break
                        }

                    c2 = str.charCodeAt(i++);

                    if (i == len)
                        {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        out += "=";
                        break
                        }

                    c3 = str.charCodeAt(i++);
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    out += base64EncodeChars.charAt(c3 & 0x3F)
                    }

                return out
                }

            function base64decode(str)
                {
                var c1, c2, c3, c4;
                var i, len, out;
                len = str.length;
                i = 0;
                out = "";

                while (i < len)
                    {
                    do
                        {
                        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
                        } while (i < len && c1 == -1);

                    if (c1 == -1)
                        break;

                    do
                        {
                        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
                        } while (i < len && c2 == -1);

                    if (c2 == -1)
                        break;

                    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

                    do
                        {
                        c3 = str.charCodeAt(i++) & 0xff;

                        if (c3 == 61)
                            return out;

                        c3 = base64DecodeChars[c3]
                        } while (i < len && c3 == -1);

                    if (c3 == -1)
                        break;

                    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

                    do
                        {
                        c4 = str.charCodeAt(i++) & 0xff;

                        if (c4 == 61)
                            return out;

                        c4 = base64DecodeChars[c4]
                        } while (i < len && c4 == -1);

                    if (c4 == -1)
                        break;

                    out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
                    }

                return out
                }


                /*     .filter('format3', function() {
            return function(data, scope,customerxx) {
               if(parseFloat(scope.config.data.orderTipAmount)>0){
                return toFixed(parseFloat(data.amount, 2) - parseFloat(data.extraTipAmount), 2);    
               }else{
                return toFixed(parseFloat(data.amount, 2) - parseFloat(data.extraTipAmount)-parseFloat(data.tipAmount), 2);   
                }
                
            }
        })

{{config.data | format2:this:"amount"}}*/



/*    function showPreview(previewImg,myfile){
       
      var pic = document.getElementById(previewImg);
      var file = document.getElementById(myfile);
      html5Reader(file,pic);
    }*/


function html5Reader(file,pic)
    {
          var file = file.files[0];
          var reader = new FileReader();
          reader.readAsDataURL(file);
            reader.onload = function(e){
            pic.src=this.result;
        }
       }
function defaultImg(){
var img=event.srcElement;
img.src="img/default.png";
img.onerror=null; 
}       
