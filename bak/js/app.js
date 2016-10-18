// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
//value可与你修改，constant不能修改。 value不能在provider内访问，constant可以
angular.module('starter', ['ionic', 'starter.controllers','starter.test'])
.constant('CONFIG', {'url':'http://192.168.1.100:3002/api/','info':{},'merchantId':"",'path':'http://192.168.1.100:3002/'})
.run(function($ionicPlatform,$rootScope,CONFIG,$location) {
  $rootScope.CONFIG = CONFIG;
    $rootScope.$on('$locationChangeStart', function() {
          /*  console.log("-------------------");
            console.log("$locationChangeStart", arguments);*/
           console.log(arguments);
            //CONFIG.currentURL=arguments;
            //
            if(!Object.keys(CONFIG.info).length) $location.path("/login");
  });

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });

})

.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
 .state('app.manager', {
      url: '/manager',
      views: {
        'menuContent': {
          templateUrl: 'templates/manager.html',
          controller: 'ManagerCtrl'
        }
      }
    })

.state('app.user', {
      url: '/user',
      views: {
        'menuContent': {
          templateUrl: 'templates/user.html',
          controller: 'UserCtrl'
        }
      }
    })
.state('app.role', {
      url: '/role',
      views: {
        'menuContent': {
          templateUrl: 'templates/role.html',
          controller: 'RoleCtrl'
        }
      }
    })
 .state('app.group', {
      url: '/group',
      views: {
        'menuContent': {
          templateUrl: 'templates/group.html',
          controller: 'GroupCtrl'
        }
      }
    })
  .state('app.category', {
      url: '/category',
      views: {
        'menuContent': {
          templateUrl: 'templates/category.html',
          controller: 'CategoryCtrl'
        }
      }
    })
 .state('app.item', {
      url: '/item',
      views: {
        'menuContent': {
          templateUrl: 'templates/item.html',
          controller: 'ItemCtrl'
        }
      }
    })
  .state('app.globalOption', {
      url: '/globalOption',
      views: {
        'menuContent': {
          templateUrl: 'templates/globalOption.html',
          controller: 'GlobalOptionCtrl'
        }
      }
    })
  .state('app.checkmenu', {
      url: '/checkmenu',
      views: {
        'menuContent': {
          templateUrl: 'templates/checkmenu.html',
          controller: 'ItemCtrl'
        }
      }
    })
 .state('app.customer', {
      url: '/customer',
      views: {
        'menuContent': {
          templateUrl: 'templates/customer.html',
          controller: 'CustomerCtrl'
        }
      }
    })
  .state('login', {
    url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
   
  }).
   state('app.test', {
      url: '/test',
      views: {
        'menuContent': {
          templateUrl: 'templates/test.html',
          controller: 'TestCtrl'
        }
      }
    })
   .
     state('app.order', {
      url: '/order',
      views: {
        'menuContent': {
          templateUrl: 'templates/orders.html',
          controller: 'OrderCtrl'
        }
      }
    })
   .
  state('app.country', {
      url: '/country',
      views: {
        'menuContent': {
          templateUrl: 'templates/country.html',
          controller: 'CountryCtrl'
        }
      }
    })
   .state('app.state', {
      url: '/state',
      views: {
        'menuContent': {
          templateUrl: 'templates/state.html',
          controller: 'StateCtrl'
        }
      }
    })
   .state('app.city', {
      url: '/city',
      views: {
        'menuContent': {
          templateUrl: 'templates/city.html',
          controller: 'CityCtrl'
        }
      }
    })
   .state('app.town', {
      url: '/town',
      views: {
        'menuContent': {
          templateUrl: 'templates/town.html',
          controller: 'TownCtrl'
        }
      }
    })
   .state('app.village', {
      url: '/village',
      views: {
        'menuContent': {
          templateUrl: 'templates/village.html',
          controller: 'VillageCtrl'
        }
      }
    })
  ;
  
  $urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
});

/*Address: 
http://www.example.com/base/path?a=b#h


$location.protocol() = http 
$location.host() = www.example.com 
$location.port() = 80 
$location.path() = /path 
$location.search() = {"a":"b"} 
$location.hash() = h */