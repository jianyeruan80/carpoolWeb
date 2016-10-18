angular.module('carpool.controllers', []) /*['ng-sortable']*/
     .filter('isShow', function() {
            return function(data, scope,customerxx) {
              
                 return (data & 3)>0;                
            }
        })
.controller('AppCtrl', function($scope, $ionicModal, $timeout,$http,$ionicModal,$location,$ionicLoading,$ionicPopup,CONFIG,api) {
  $scope.appData={};
  $scope.appData.menus=[];
  $scope.appData.countrys=[];
  $scope.appData.states=[];
  $scope.appData.citys=[];
  $scope.appData.towns=[];
  $scope.appData.villages=[];
  $scope.appData.country={};
  $scope.appData.state={};
  $scope.appData.city={};
  $scope.appData.town={};
  $scope.appData.village={};
$scope.getCountrys=function(){
     var currentUrl="countrys",method="GET";
       api.request(method,currentUrl,{}).then(function(data){
           $scope.appData.countrys=data;
           console.log(data)
       })
    
}
$scope.getStates=function(){
   var currentUrl="states",method="GET";
       api.request(method,currentUrl,{}).then(function(data){
           $scope.appData.states=data;
       })
}
$scope.getCitys=function(){
   var currentUrl="citys",method="GET";
       api.request(method,currentUrl,{}).then(function(data){
           $scope.appData.citys=data;
       })
}
$scope.getTowns=function(){
   var currentUrl="towns",method="GET";
       api.request(method,currentUrl,{}).then(function(data){
           $scope.appData.towns=data;
       })
}
/*$scope.getTowns=function(){
   var currentUrl="villages",method="GET";
       api.request(method,currentUrl,{}).then(function(data){
           $scope.appData.villages=data;
       })
}
*/


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
   var currentUrl="admin/perms",method="GET";
       api.request(method,currentUrl,{}).then(function(data){
           $scope.appData.perms=data;
       })
 }

$scope.getRoles=function(){
  var currentUrl="admin/roles",method="GET";
       api.request(method,currentUrl,{}).then(function(data){
           $scope.appData.roles=data;
       })
    
  }
  $scope.getUsers=function(){
     var currentUrl="admin/users",method="GET";
       api.request(method,currentUrl,{}).then(function(data){
           $scope.appData.users=data;
       })
     
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
 

 $scope.getPerms();
 $scope.getRoles();
 $scope.getUsers();
/* $scope.getCountrys();
 $scope.getStates();
 $scope.getCitys();
 $scope.getTowns();
 */
 
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
      var currentUrl="admin/users",method="POST";
      if($scope.appData.user._id){
          currentUrl="admin/users/"+$scope.appData.user._id;
          method="PUT";
        }
       api.request(method,currentUrl,$scope.appData.user).then(function(data){
            $scope.closeUserModal();
            $scope.getUsers();
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
.controller('RoleCtrl', function($scope,$ionicModal,$http,$ionicPopup,CONFIG,api) {
   $scope.$on('$destroy', function() {
      $scope.roleModal.remove();
    });


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
     var currentUrl="admin/roles",method="POST";
      if($scope.appData.role._id){
          currentUrl="admin/roles/"+$scope.appData.role._id;
          method="PUT";
        }
       api.request(method,currentUrl,$scope.appData.role).then(function(data){
            $scope.closeRoleModal();
            $scope.getRoles();
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
