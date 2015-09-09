(function () {
	'use strict';
	angular.module('directTvServices', [])
	// might ngInject
	/* DIRECT TV */
	.factory('DirectTvFactory', ['$http', '$rootScope', 'API_URL', '$q', 'SharedFunctions', 'localStorageService',
		function($http, $rootScope, API_URL, $q, SharedFunctions, localStorageService) {

		var arr = [];
		var userInfo = localStorageService.get('userInfo');
		var merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword};
		var loadingTracker = {tracker: $rootScope.loadingTracker};

		return {
			// GET DIRECT TV CATEGORIES
			getDirectTvAllProducts: function(category){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CategoryId: category
				};

				var deferred = $q.defer();

				// $http.get('./app/data/pos-directtv-products.json', loadingTracker)
				$http.post(API_URL + 'DirectTv/GetDirectTvAllProducts', queryObj, loadingTracker)
					.then(
					function(response) {
						arr = response.data.Data;
						// console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						console.log(response);
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// GET DIRECT TV CATEGORIES
			getDirectTvCategories: function(){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword
				};

				var deferred = $q.defer();

				// $http.get('./app/data/pos-directtv-categories.json', loadingTracker)
				$http.post(API_URL + 'DirectTv/GetDirectTvCategories', queryObj, loadingTracker)
					.then(
					function(response) {
						arr = response.data.Data;
						console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						// console.log(response);
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// GET DIRECT TV PRODUCTS BY CATEGORY
			getDirectTvProductsByCategory: function(category){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					Category: category
				};

				var deferred = $q.defer();

				// $http.get('./app/data/pos-directtv-prod-by-category.json', loadingTracker)
				$http.post(API_URL + 'DirectTv/GetDirectTvProductsByCategory', queryObj, loadingTracker)
					.then(
					function(response) {
						arr = response.data.Data;
						// console.log(response);
						deferred.resolve(arr);
					},
					function(response) {
						console.log(response);
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			getDirectTvProduct: function(id){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					ProductMainCode: id
				};
				// console.log(queryObj);

				var deferred = $q.defer();

				$http.post(API_URL + 'DirectTv/GetDirectTvProduct', queryObj, loadingTracker)
					.then(
					function(response) {
						arr = response.data.Data;
						console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						console.log(response);
						deferred.reject(response);
					}
				);
				return deferred.promise;
			}
		};
	}]);
}());
