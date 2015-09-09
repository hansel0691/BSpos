(function () {
	'use strict';
	// might ngInject

	/* services & factories */
	angular.module('billPaymentServices', [])
	// Return products collection
	.factory('BillPaymentFactory', ['$http', '$rootScope', 'API_URL', '$q', 'SharedFunctions', 'localStorageService',
		function($http, $rootScope, API_URL, $q, SharedFunctions, localStorageService) {

		var arr;
		var userInfo = localStorageService.get('userInfo');
		var merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword};
		var loadingTracker = {tracker: $rootScope.loadingTracker};

		return {
			// get BILLERS by categories
			getBillersByCategory: function(category){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CategoryId: category,
					BillerId: ''
				};

				var deferred = $q.defer();

				$http.post(API_URL + 'BillPayment/GetBillersByCategory', queryObj, loadingTracker)
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
			// get BILLERS by categories
			getBillersInitials: function(category){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CategoryId: category,
					BillerId: ''
				};

				var deferred = $q.defer();

				$http.post(API_URL + 'BillPayment/GetBillersInitials', queryObj, loadingTracker)
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
			// get CATEGORIES
			getBillPaymentCategories: function(){

				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword
				};

				var deferred = $q.defer();

				$http.post(API_URL + 'BillPayment/GetBillPaymentCategories', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data.Data;
						console.log(arr);
						// console.log(JSON.stringify(response.data));
						deferred.resolve(arr);
					},
					function(response) {
						console.log(JSON.stringify(response));
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get Biller
			getMasterBiller: function(billerId){

				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CategoryId: '',
					BillerId: billerId
				};

				var deferred = $q.defer();

				$http.post(API_URL + 'BillPayment/getMasterBiller', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data;
						// console.log(JSON.stringify(arr));
						// console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						console.log(JSON.stringify(response));
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get biller PAYMENT OPTIONS
			getBillerPaymentOptions: function(biller){

				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CategoryId: '',
					BillerId: biller
				};

				// console.log(queryObj);

				var deferred = $q.defer();

				$http.post(API_URL + 'BillPayment/GetBillerPaymentOptions', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data;
						// console.log(JSON.stringify(arr));
						// console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						console.log(JSON.stringify(response));
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// do Bill Payment NEXT STEP
			doBillPaymentNextStep: function(obj){

				var queryObj = obj;
				queryObj.MerchantId = merchant.MerchantId;
				queryObj.MerchantPassword = merchant.MerchantPassword;
				console.log(queryObj);

				var deferred = $q.defer();

				$http.post(API_URL + 'BillPayment/DoBillPaymentNextStep', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data;
						// console.log(JSON.stringify(arr));
						// console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						console.log(JSON.stringify(response));
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// do Bill Payment NEXT STEP
			doBillPayment: function(obj){

				var queryObj = obj;
				queryObj.MerchantId = merchant.MerchantId;
				queryObj.MerchantPassword = merchant.MerchantPassword;
				// console.log(queryObj);

				var deferred = $q.defer();

				$http.post(API_URL + 'BillPayment/DoBillPayment', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data;
						// console.log(JSON.stringify(arr));
						// console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						console.log(JSON.stringify(response));
						deferred.reject(response);
					}
				);
				return deferred.promise;
			}
		};
	}]);
}());
