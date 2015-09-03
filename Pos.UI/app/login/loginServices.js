(function () {
	'use strict';

	angular.module('loginServices', [])
	// might ngInject
	// Return merchant account details
	.factory('AuthenticationFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService',
		function($http, $rootScope, API_URL, $q, localStorageService) {

		var arr;
		var userInfo;
		var loadingTracker = {tracker: $rootScope.loadingTracker};

		return {
			// LOGIN (use GetMerchantDetails API method), save user details into storage service
			login: function(merchantId, password) {
				var deferred = $q.defer();

				$http.post(API_URL + 'Merchant/GetMerchantDetails', {MerchantId: merchantId, MerchantPassword: password}, loadingTracker)
				.then(
					function(response) {
						if(response.data.Data != null) {
							userInfo = {
								Name: response.data.Data.Name, // string
								MerchantId: response.data.Data.MerchantId, // int
								MerchantPassword: response.data.Data.MerchantPassword, // string
								ProfileId: response.data.Data.MerchantProfileId, // int
								TerminalId: response.data.Data.MerchantTerminalId, // int
								Status: response.data.Data.Status, // boolean
								Id: response.data.Data.Id, // int
								TimeStamp: response.data.Data.TimeStamp, // string: 2014-11-06T12:45:04.7515803-05:00
								IsMerchant: response.data.Data.IsMerchant, // string
								BusinessName: response.data.Data.MerchantBusinessName, // string
								IsFullCarga: response.data.Data.IsFullCarga
							};
						}

						arr = {Status: response.data.Status, UserInfo: userInfo};

						deferred.resolve(arr);

					}, function(response) {
						deferred.reject(response);
					}
				); // .then()

				return deferred.promise;
			},
			isLoggedIn: function(){
				userInfo = localStorageService.get('userInfo');
				var result = (userInfo != null && userInfo.Status ) ? userInfo : false;
				return result;
			},
			// GET USER INFO
			getUserInfo: function() {
				if(localStorageService.get('userInfo')){
					userInfo = localStorageService.get('userInfo');
				}
				// console.log(userInfo);
				return userInfo;
			},
			// SUBMIT APPLICANT (apply today form on /login view)
			submitApplicant: function (applicant) {
				// console.log(applicant);
				var deferred = $q.defer();
				$http.post(API_URL + 'guest/submitapplication', applicant)
				.then(
					function (response) {
						arr = response.data;
						deferred.resolve(arr);
					},
					function (response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// SUBMIT APPLICANT (apply today form on /login view)
			submitGuest: function (guest) {
				var deferred = $q.defer();
				$http.post(API_URL + 'guest/submitguest', guest)
				.then(
					function (response) {
						arr = response.data;
						deferred.resolve(arr);
					},
					function (response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			}
		};
	}]);
}());
