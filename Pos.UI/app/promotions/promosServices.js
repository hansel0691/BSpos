(function () {
	'use strict';
	angular.module('promosServices', [])
	// might ngInject
	.factory('PromosFactory', ['$http', '$rootScope', 'API_URL', '$q', 'SharedFunctions', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, SharedFunctions, localStorageService) {

		var loadingTracker = {tracker: $rootScope.loadingTracker};

		var userInfo = localStorageService.get('userInfo');
		var merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword};

		var arr = [];
		// console.log(merchant);

		return {
			getPromotions: function() {

				var deferred = $q.defer();

				$http.post(API_URL + 'Promotions/GetAllPromotions', merchant, loadingTracker)
				.then(
					function (response) {
						arr = response.data.Data;
						// console.log(arr);
						deferred.resolve(arr);
					},
					function (error) {
						// console.log(error);
						deferred.reject(error);
					});
				return deferred.promise;
			}
		};
	}]);
}());
