(function () {
	'use strict';
	angular.module('customFunctions', [])
	// might ngInject
	.factory('SharedFunctions', [
		function(){
			return {
				// make array unique
				unique: function (arr) {
					var o = {}, i, r = [];
					for(i = 0; i < arr.length; i++) {
						o[arr[i]] = arr[i];
					}
					for(i in o) {
						r.push(o[i]);
					}
					return r;
				},
				serialize: function(obj) {
					var str = [];
					for(var p in obj)
					if (obj.hasOwnProperty(p)) {
						str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
					}
					return str.join('&');
				},
				// check if
				isobject: function(a) {
					return (!!a) && (a.constructor === Object);
				},
				alpha: function(){
					return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
				},
				// merge: function(target, source){
				// 	/* Merges two (or more) objects, giving the last one precedence */
				// 	for (var p in source) {
				// 		try {
				// 			// Property in destination object set; update its value.
				// 			if ( source[p].constructor === Object ) {
				// 				target[p] = merge(target[p], source[p]);
				// 			} else {
				// 				target[p] = source[p];
				// 			}
				// 		} catch(e) {
				// 			// Property in destination object not set; create it and set its value.
				// 			target[p] = source[p];
				// 		}
				// 	}
				// 	return target;
				// },
				firstleter: function(data){
					var arr = [];
					for (var i = 0; i < data.length; i++) {
						arr.push(data[i].Name.charAt(0));
					}
					return arr;
				},
				isMobile: function(){
					// return $window.document.width < 700 ? true : false;
					return navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ? true : false;
					// other solution: http://detectmobilebrowsers.com/
					// other solution: https://github.com/kaimallea/isMobile
				}
			};
	}]);
}());
