  // Some fake testing data
angular.module('starter.test',[])
 .filter('TOTAL', function() {
            
                return function(data,scope) {
                  
                 scope.appData.order.subTotal=0;
                 var tax=scope.appData.menus.store.tax || 0;
                 scope.appData.order.taxRate=tax;
                 angular.forEach(scope.appData.order.orderDetails,function(v,k){
                  		    var price=v.price || 0;
                            var qty=v.qty || 1;
    
                  		 	angular.forEach(v.options,function(v2,k2){
                  		 			var optionPrice= v2.price || 0;
                  		 		       price+=optionPrice;
                  		 		
                  		 	})
                  		 	v.currentPrice=price;
                  		 	scope.appData.order.subTotal+=v.currentPrice*qty;


                  		

                 })
                 

                 	scope.appData.order.subTotal=toFixed(scope.appData.order.subTotal,2)
                  scope.appData.order.tax=toFixed(scope.appData.order.subTotal*tax,2);


                      angular.forEach(scope.appData.order.orderDetails,function(v,k){
                            if(v.discount>0){
                              scope.appData.order.subTotal-=v.discount;
                            }

                        })


                  angular.forEach(scope.testData.tipLists,function(v,k){
         
                      if(scope.appData.order.tip>0 && scope.appData.order.tip==v.value){

                        v.value=toFixed(scope.appData.order.subTotal*v.key,2);
                        scope.appData.order.tip=v.value;
                        scope.appData.order.tipRate=v.key;
                        if(typeof  scope.appData.order.tip ===String){
                                      scope.appData.order.tipRate=0;
                                      scope.appData.order.tip=parseFloat(scope.appData.order.tip);
                                    }

                      }else{
                        v.value=toFixed(scope.appData.order.subTotal*v.key,2);
                      }
                      
                  })

                    angular.forEach(scope.testData.discountLists,function(v,k){
                      
                      if(scope.appData.order.discount>0 && scope.appData.order.discount==v.value){

                        v.value=toFixed(scope.appData.order.subTotal*v.key,2);
                         scope.appData.order.discount=v.value;
                         scope.appData.order.discountRate=v.key;
                                 if(typeof  scope.appData.order.discount ===String){
                                      scope.testData.discountRate=0;
                                      scope.appData.order.discount=parseFloat(scope.appData.order.discount);
                                    }

                      }else{
                        v.value=toFixed(scope.appData.order.subTotal*v.key,2);
                      }

                  })


                    angular.forEach(scope.testData.itemDiscountLists,function(v,k){
                      scope.testData.selectOrderDetailIndex=scope.testData.selectOrderDetailIndex || 0;
                    //  console.log(scope.testData.selectOrderDetailIndex)
                       var item=scope.appData.order.orderDetails[scope.testData.selectOrderDetailIndex];
                          if(item){
                                    if(item.discount>0 && item.discount==v.value){
                                    v.value=toFixed(item.currentPrice*v.key*item.qty,2);
                                    item.discount=v.value;
                                    item.discountRate=v.key;
                                    if(typeof item.discount ===String){
                                      item.discountRate=0;
                                      item.discount=parseFloat(item.discount);
                                    }
                                    

                              }else{
                                   v.value=toFixed(item.currentPrice*v.key*item.qty,2);
                              }

                          }
                      

                      })
 if(scope.appData.order.grandTotal>0){
                  scope.testData.payList=scope.formatPayList(scope.appData.order.grandTotal);  }


                    scope.appData.order.grandTotal=toFixed(scope.appData.order.subTotal+scope.appData.order.tip-scope.appData.order.discount,2);



                 

                  
                  return scope.appData.order.subTotal;                
                            
            }
    })
  .controller('OrderCtrl', function($scope, $ionicModal, $timeout,$http,$ionicModal,$location,$ionicLoading,$ionicPopup,CONFIG) {
         

                    $scope.getOrders=function(){

          var currentUrl=CONFIG.url+"orders";
                  $http({ method:"GET",url: currentUrl, 
                   headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                 
                     }).success(function(data){
                  $scope.appData.orders=data;
                    
                    }).error(function(err){
               $scope.error(err.message);
           })
                    }
              $scope.$on("$ionicView.enter", function(event, data){
                $scope.getOrders();
                });

              $scope.openOrder=function(id){
                   var currentUrl=CONFIG.url+"orders/"+id;
                   $http({ method:"GET",url: currentUrl, 
                    headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken}
                    
                     }).success(function(data){
                   if(data){
                    
                    $timeout(function(){ $scope.appData.order=data; 
                   $location.path("app/test");},10);
                  
                   }
                       }).error(function(err){
               $scope.error(err.message);
           })

              }
  })
.controller('TestCtrl', function($scope, $ionicModal, $timeout,$http,$ionicModal,$location,$ionicLoading,$ionicPopup,CONFIG) {
  
  $ionicModal.fromTemplateUrl('templates/modalPay.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalPay = modal;});
   $scope.openPay = function() {$scope.modalPay.show();};
   $scope.closePay = function() {$scope.modalPay.hide();};

     $ionicModal.fromTemplateUrl('templates/modalChange.html', {scope: $scope,animation: 'slide-in-up'}).then(function(modal) {$scope.modalChange = modal;});
   $scope.openChange = function(pay) {
    
    $scope.appData.order.receiveTotal=pay || $scope.appData.order.receiveTotal;
    if($scope.appData.order.change=$scope.appData.order.receiveTotal-$scope.appData.order.grandTotal>=0){
       $scope.appData.order.change=$scope.appData.order.receiveTotal-$scope.appData.order.grandTotal;
      $scope.modalChange.show();
     }else{
alert("不能少于");
     }
    
   
  
  };
   $scope.paySubmit=function(){
        

        var currentUrl=CONFIG.url+"orders";
              var method="POST";
              
              if(!!$scope.appData.order._id){
                var currentUrl=CONFIG.url+"orders/"+$scope.appData.order._id;
                method="PUT";
              }

              $scope.appData.order.sign="Pay";
       
            $http({ method:method,url: currentUrl, 
               headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
               data:$scope.appData.order
               }).success(function(data){
               $scope.appData.order=data;
               alert("OK");
               $scope.closeChange();
                $scope.closePay();
           }).error(function(err){
              
              $scope.error(err.message);
           })
   }
   $scope.closeChange = function() {$scope.modalChange.hide();};

    $scope.getMenus();

    $scope.testData={};

/*    $scope.getOrder=function(){
    
         var currentUrl=CONFIG.url+"orders/status";
                   $http({ method:"GET",url: currentUrl, 
                    headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
                    params:{"status":"unpaid"}
                     }).success(function(data){
                   if(data){
                   $scope.appData.order=data; 
                   }
                       }).error(function(err){
               $scope.error(err.message);
           })

    }
 $scope.getOrder();*/
 $scope.$on('$ionicView.leave', function(){
       $scope.appData.order={
                                    subTotal:0,
                                    tax:0,
                                     taxRate:0,
                                     tip:0,
                                     tipRate:0,
                                     discount:0,
                                     discountRate:0,
                                     grandTotal:0,
                                    receiveTotal:0,
                                    orderDetails:[]
                                  };
    });
    
/*    $scope.$on("$ionicNavView.leave", function(){
      alert("OK")
               $scope.appData.order={
                                    subTotal:0,
                                    tax:0,
                                     taxRate:0,
                                     tip:0,
                                     tipRate:0,
                                     discount:0,
                                     discountRate:0,
                                     grandTotal:0,
                                    receiveTotal:0,
                                    orderDetails:[]
                                  };
});*/
    /*$scope.$on("$ionicView.enter", function(event, data){
                
                });*/
    
    $scope.testData.payList=[];
    $scope.testData.categorys=[];
    $scope.testData.items=[];
    $scope.testData.selectGroupIndex=0; 
    $scope.testData.selectCategoryIndex=0; 
    $scope.testData.selectOrderDetailIndex=0;
    $scope.testData.item={};

    
    
/*var values = {name: 'misko', gender: 'male'};
var log = [];
angular.forEach(values, function(value, key) {
  this.push(key + ': ' + value);
}, log);
*/
    $scope.testData.tipLists=[
    	{key:0.1,value:0,show:"10%",active:false},
    	{key:0.15,value:0,show:"15%",active:false},
    ];
    
     $scope.testData.discountLists=[
      {key:0.1,value:0,show:"10%",active:false},
      {key:0.15,value:0,show:"15%",active:false},
      {key:0.25,value:0,show:"25%",active:false},
    ];

   $scope.testData.itemDiscountLists=[
      {key:0.1,value:0,show:"10%",active:false},
      {key:0.15,value:0,show:"15%",active:false},
      {key:0.25,value:0,show:"25%",active:false},
    ];


    $scope.selectGroup=function(index){
     	$scope.testData.selectGroupIndex=index;
     	$scope.testData.categorys=[];
     	$scope.testData.categorys=$scope.appData.menus.menus[$scope.testData.selectGroupIndex].categorys;
     	
     	$scope.selectCategory(0);
     }	
      $scope.selectCategory=function(index){
        $scope.testData.items=[];
      	$scope.testData.selectCategoryIndex=index;
        $scope.testData.items=$scope.appData.menus.menus[$scope.testData.selectGroupIndex].categorys[$scope.testData.selectCategoryIndex].items;
     }	
      $scope.selectItem=function(item){

      	 item=angular.copy(item);
         delete item.operator;
         delete item.customerOptions;
         delete item.globalOptions;
      	 item.qty=1;
      	 var len=$scope.appData.order.orderDetails.length;
      	 var sign=true;
         
      	 for(var i=0;i<len;i++){
      	 	  if($scope.appData.order.orderDetails[i]._id==item._id &&  (!$scope.appData.order.orderDetails[i].options || $scope.appData.order.orderDetails[i].options.length<1) ){
      	 		$scope.appData.order.orderDetails[i].qty++;
            $scope.testData.selectOrderDetailIndex=i;
            //$scope.testData.item=$scope.appData.order.orderDetails[$scope.testData.selectOrderDetailIndex];
      	 		sign=false;
      	 		break;
      	 	}
      	 }
      	 if(sign){
      	 	       $scope.appData.order.orderDetails[len]=item;
      	         $scope.testData.selectOrderDetailIndex=len;
                // $scope.testData.item=$scope.appData.order.orderDetails[len];
      	 }

      	 
      	 console.log($scope.appData.order.orderDetails)
      	 

        

     }
   $scope.clearDiscount=function(){
    $scope.appData.order.orderDetails[$scope.testData.selectOrderDetailIndex].discountRate=0;
    $scope.appData.order.orderDetails[$scope.testData.selectOrderDetailIndex].discount=0;
   
   }
   $scope.deleteOrderDetail=function(){
    
     $scope.appData.order.orderDetails.splice($scope.testData.selectOrderDetailIndex,1);
   }
    $scope.saveOrder=function(){
  
        var currentUrl=CONFIG.url+"orders";
              var method="POST";
              
              if(!!$scope.appData.order._id){
                var currentUrl=CONFIG.url+"orders/"+$scope.appData.order._id;
                method="PUT";
              }

              $scope.appData.order.sign="saveOrder";
       
            $http({ method:method,url: currentUrl, 
               headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: "Bearer "+CONFIG.info.accessToken},
               data:$scope.appData.order
               }).success(function(data){
               $scope.appData.order=data;
                alert("success")
           }).error(function(err){
              
              $scope.error(err.message);
           })
    	

    }
    $scope.selectOrderDetailItem=function(index){

    $scope.testData.selectOrderDetailIndex=index;

    }

    $scope.selectOption=function(optionItem){

          angular.forEach($scope.appData.order.orderDetails, function(value, key) {
  				
            if($scope.testData.selectOrderDetailIndex==key){
  						value.options=value.options || [];
  						value.options.push(optionItem);
  					}
        });


    }


     $timeout(function(){
     $scope.selectGroup(0);

     },200)
    //$scope.openPay=function(){
      
      /* if($scope.appData.order.grandTotal>0){
                  $scope.testData.payList=$scope.formatPayList($scope.appData.order.grandTotal);  

                  console.log($scope.testData.payList)
                  }*/
    //  }
     
    $scope.formatPayListUnique=function(array,hundred){
  var r = [];
  for(var i = 0, l = array.length; i < l; i++) {
    for(var j = i + 1; j < l; j++)
      if (array[i] === array[j]) j = ++i;
       if(hundred>=0){
       r.push(hundred*100+100*array[i]);  
       }else{
         r.push(array[i]);  
     }
 }
return r;} 
$scope.formatPayList=function(n){
var originArray=[5,10,20,50,100];
var array=[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100];
var intNumberList=[];
var hundred=0;
var pointList=[];
var payList=[];
    var intNumber=parseInt(n);
    var point=parseInt(100*n)%100;
     hundred=Math.floor(n/100)*100;
    intNumber=intNumber-hundred;
    for(var i=0;i<array.length;i++){
         if(intNumber<array[i]){
             intNumberList.push(intNumber);
             intNumberList.push(array[i]);
             if(array[i]%10){
                if(array[i]+5<=100){
                intNumberList.push(array[i]+5);
                }
                if(array[i]+15<=100){
                intNumberList.push(array[i]+15);
                }
             }else{
                 if(array[i]+10<=100){
                  intNumberList.push(array[i]+10);  
                }
                
             }
            break;
        }
  }
  
  for(j=0;j<originArray.length;j++){
     if(intNumber<originArray[j]){intNumberList.push(originArray[j]);}
   }
  
 intNumberList.sort(function(a, b){return a-b});
 intNumberList=$scope.formatPayListUnique(intNumberList,hundred);  
 if(point>0){
        var count=0;
     for(var k=0;k<array.length;k++)  {
          if(point<=array[k]){
            pointList.push(point);
            pointList.push(array[k]);
            count++;
            if(count>=2){break;}
         }
     }
   var l=Math.ceil(point/25)*25;
  if(l<=100){pointList.push(l)} 
  //add 65 
 if(point>=51 && point<=55){
      pointList.push(65);
   }    
  pointList.push(100);
  pointList.sort(function(a, b){return a-b})
  pointList=$scope.formatPayListUnique(pointList);  
  if(point>=6 && point<=10){
           //delete point[15];
     pointList.splice(2,1);
     }
     }else{
       pointList.push(0);
     }
  if(intNumber>=11 && intNumber<=19){
            //delete point[15];
           // intNumberList.splice(2,1);
           for(var kk=0;kk<intNumberList.length;kk++){
             if(intNumberList[kk]==3000){
                 intNumberList.splice(kk,1);
             }
           }
     }
  for(var m=0;m<intNumberList.length;m++){
          if(m==0){
             for(var mm=0;mm<pointList.length;mm++){
               payList.push((intNumberList[m]+pointList[mm])/100);
             }
          }else{
            payList.push(intNumberList[m]/100);
          }
  }
  
  payList=$scope.formatPayListUnique(payList);
  return payList;
}
})


var toFixed=function(s,num) {
/* var times = Math.pow(10, s)
var des = num * times + 0.5;
des = parseInt(des, 10) / times;
return des+"" */
  var tempnum = s.toFixed(num+4);
	 return Number(Math.round(tempnum+'e'+num)+'e-'+num);
}

