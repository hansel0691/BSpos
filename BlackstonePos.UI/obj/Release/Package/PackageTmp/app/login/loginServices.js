'use strict';

/* services & factories */
angular.module('loginServices', [])
	/**
	 * Authentication - Factory
	 * Return merchant account details
	 */
	.factory("AuthenticationFactory", [ '$http', 'API_URL', '$q', 'localStorageService',
		function($http, API_URL, $q, localStorageService) {

		var userInfo;

		return {

			// LOGIN (use GetMerchantDetails API method), save user details into storage service
			login: function(merchantId, password) {

			    var deferred = $q.defer();

				 $http.post(API_URL + "Merchant/GetMerchantDetails", {MerchantId: merchantId, Password: password})
				.then(

					function(response) {

					if(response.data.Data != null) {

						userInfo = {
							userName: response.data.Data.Name, // string
							merchantId: response.data.Data.MerchantId, // int
							password: response.data.Data.Password, // string
							profileId: response.data.Data.MerchantProfileId, // int
							terminalId: response.data.Data.MerchantTerminalId, // int
							isLogIn: response.data.Data.Status, // boolean
							id: response.data.Data.Id, // int
							timeStamp: response.data.Data.TimeStamp, // string: 2014-11-06T12:45:04.7515803-05:00
							isMerchant: response.data.Data.IsMerchant // string
						};
					}

					var loginResponse = {Status : response.data.Status, UserInfo: userInfo};

						deferred.resolve(loginResponse);

					}, function(response) {
						deferred.reject(response);
					}
				);

				return deferred.promise;
			},
			// LOGOUT
			logout: function(merchantId) {

				var deferred = $q.defer();

				$http.get("app/data/merchant-logout.json")
				// $http.post("http://bsapi.pinserve.com/api/Merchant/Logout", {merchantId: merchantId})
				.then(function (response) {

					userInfo = {};

					deferred.resolve(userInfo);

				}, function (response) {

					deferred.reject(response);

				});

				return deferred.promise;
			},
			// GET USE RINFO
			getUserInfo: function() {
				if(localStorageService.get('userInfo')){
					userInfo = localStorageService.get('userInfo');
				}
				// console.log(userInfo);
				return userInfo;
			},

			submitApplicant: function (applicant) {

			    var deferred = $q.defer();

			    $http.post(API_URL + "admin/submitapplication",applicant)
               .then(

                   function (response) {
                       var submitResponse = response.data;

                       deferred.resolve(submitResponse);

                   }, function (response) {
                       deferred.reject(response);
                   }
               );
			    return deferred.promise;
			}
		};
	}]);

