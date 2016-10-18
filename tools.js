
(function(document){
var tools;
var jsPath="../js/mi_";
var cssPath="../css/mi_";
var obj = {
 test:function(){alert("ede")},
 addHandler: function (element, type, handler) {  //tools.addHandler(window, "online", function () { alert("Online"); }); 
             if(element.addEventListener) { 
                element.addEventListener(type, handler, false); 
               }else if (element.attachEvent) {
                 element.attachEvent("on" + type, handler); 
             }else{element["on" + type] = handler;}
			 },
 stopBubble:function(event){
            var e = event || window.event;
            if (e && e.stopPropagation ) 
            e.stopPropagation(); 
            else
            window.event.cancelBubble = true; 
            },
stopDefault:function(event){
            var e = event || window.event;
            if(e && e.preventDefault) { 
             e.preventDefault(); 
            } else { 
            window.event.returnValue = false; 
            } 
            return false;
          },
 toFixed:function(num, s) {
          var times = Math.pow(10, s)
          var des = num * times + 0.5;
          des = parseInt(des, 10) / times;
          return des + ''
          },
uniqueArray:function(array){
         var r = [];
          for(var i = 0, l = array.length; i < l; i++) {
            for(var j = i + 1; j < l; j++)
              if (array[i] === array[j]) j = ++i;
            r.push(array[i]);
          }
          return r;
        },
orderby:function(name){
                return function(o, p){ var a, b;
                  if (typeof o === "object" && typeof p === "object" && o && p) {
                      a = o[name];b = p[name];
                      if (a === b) {
                          return 0;
                      } if (typeof a === typeof b) {
                          return a < b ? -1 : 1;
                      }   return typeof a < typeof b ? -1 : 1;  }  else { throw ("error"); }} },  
 by:function(name,minor){
            return function(o,p){
                var a,b;
                if(o && p && typeof o === 'object' && typeof p ==='object'){
                    a = o[name];
                    b = p[name];
                    if(a === b){
                        return typeof minor === 'function' ? minor(o,p):0;
                    }
                    if(typeof a === typeof b){
                        return a < b ? -1:1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                }else{
                    thro("error");
                }
            }
        } , 
visibleY:function(el){
                var top = el.getBoundingClientRect().top, rect, el = el.parentNode;
                do {
                    rect = el.getBoundingClientRect();
                    if (top <= rect.bottom === false)
                        return false;
                    el = el.parentNode;
                } while (el != document.body);
                 return top <= document.documentElement.clientHeight;
               }, 
getRect:function(element) {
           var rect = element.getBoundingClientRect();
           var top = document.documentElement.clientTop;
           var left= document.documentElement.clientLeft; 
            return{top    :   rect.top - top,bottom :   rect.bottom - top,left   :   rect.left - left, right  :   rect.right - left }
 },
replace:function(input,regExp){
         var reg = new RegExp(regExp, "g");
            if (!!input) {
                return input.replace(reg, "");
            } else {
                return "";
            }

   },
 getRegExp:function(input,regExp){
  
           var reg = new RegExp('\\[(.*?)\\]', "g");
           reg.exec(input);
           return RegExp.$1;
   },
   toggleFullScreen:function () {
   if (!document.fullscreenElement && 
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }}} 

}
window.tools = obj;
})(document);
