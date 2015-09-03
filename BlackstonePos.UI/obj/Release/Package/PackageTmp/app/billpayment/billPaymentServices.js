'use strict';

/* services & factories */
angular.module('billPaymentServices', [])
	/**
	 * ProdFactory - Factory
	 * Return products collection
	 * @return { object array }
	 */
	.factory('ProdsFactory', ['$http', 'API_URL', '$q', 'SharedFunctions',
		function($http, API_URL, $q, SharedFunctions) {

		var arr= [];

		return {
			// GET MOST SOLD PRODUCTS
			getBillPaymentCategories: function(merchantId){
				var params = SharedFunctions.serialize({'merchantId': merchantId});
				var deferred = $q.defer();
				$http.get(API_URL + "BillPayment/GetBillPaymentCategories?" + params)
				.then(
					function(response) {
						arr = response.data.Data;
						// console.log(JSON.stringify(arr));
						console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						console.log(JSON.stringify(response));
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// GET BILLERS BY CATEGORY
			getBillersByCategory: function(merchantId, categoryId){
				// serialize object to url params
				var params = SharedFunctions.serialize({'merchantId': merchantId, 'categoryId':categoryId});
				// console.log(params);
				var deferred = $q.defer();
				$http.get(API_URL + "BillPayment/GetBillersByCategory?" + params)
				.then(function(response) {
					arr = response.data.Data;
					// console.log(arr);
					deferred.resolve(arr);
				}, function(response) {
					console.log(response)
					deferred.reject(response);
				});
				return deferred.promise;
			}
		}
	}])
