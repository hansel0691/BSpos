'use strict';

/* services & factories */
angular.module('customFunctions', [])
	.factory('SharedFunctions', [
		function(){
			return {
				// make array unique
				unique: function (arr) {
					var o = {}, i, r = [];
					for(i = 0; i < arr.length; i++) o[arr[i]] = arr[i];
					for(i in o) r.push(o[i]);
					return r;
				},
				serialize: function(obj) {
					var str = [];
					for(var p in obj)
					if (obj.hasOwnProperty(p)) {
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					}
					return str.join("&");
				},
				// check if
				isobject: function(a) {
					return (!!a) && (a.constructor === Object);
				},
				alpha: function(){
					return ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
				}
			};
	}]);
