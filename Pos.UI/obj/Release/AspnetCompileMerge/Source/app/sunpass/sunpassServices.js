(function () {
	'use strict';

	/* services & factories */
	angular.module('sunpassServices', [])
	// might ngInject
	.factory('SunpassFactory', ['$http', '$rootScope', 'API_URL', '$q', 'SharedFunctions', 'localStorageService',
		function($http, $rootScope, API_URL, $q, SharedFunctions, localStorageService) {

		var arr = [];
		var userInfo = localStorageService.get('userInfo');
		var merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword};
		var loadingTracker = {tracker: $rootScope.loadingTracker};

		return {
			// get BILLERS by categories
			getSunpassTransporderInfo: function(transponder){

				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					TransporderNumber: transponder
				};
				// console.log(queryObj);

				var deferred = $q.defer();

				$http.post(API_URL + 'SunPass/GetSunpassTransporderInfo', queryObj, loadingTracker)
					.then(
					function(response) {
						arr = response.data;
						deferred.resolve(arr);
					},
					function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get BILLERS by categories
			doSunpassReplenishment: function(obj) {
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					TransporderNumber: obj.TransporderNumber,
					PurchaseId: obj.PurchaseId,
					Amount: obj.Amount
				};

				var deferred = $q.defer();

				$http.post(API_URL + 'SunPass/DoSunpassReplenishment', queryObj, loadingTracker)
					.then(
					function(response) {
						arr = response.data;
						deferred.resolve(arr);
					},
					function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get CATEGORIES
			getSunpassDocumentsInfo: function(obj) {

				var queryObj = {
					LicensePlate: obj.LicensePlate,
					DocumentId: obj.DocumentId,
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword
				};

				var deferred = $q.defer();

				$http.post(API_URL + 'SunPass/GetSunpassDocumentsInfo', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data;
						// console.log(JSON.stringify(arr));
						deferred.resolve(arr);
					},
					function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get Biller
			doSunPassDocumentsPayment: function(obj){

				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					PaymentType: obj.PaymentType,
					DocumentId: obj.DocumentId,
					LicensePlate: obj.LicencePlate
				};

				var deferred = $q.defer();

				$http.post(API_URL + 'SunPass/DoSunPassDocumentsPayment', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data;
						deferred.resolve(arr);
					},
					function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			}
		};
	}]);
}());
