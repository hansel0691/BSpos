(function () {
	'use strict';
	angular.module('sharedServices', [])
	// Get links to external services/tools.
	.factory('ExternalFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService', 'SharedFunctions',
		function ($http, $rootScope, API_URL, $q, localStorageService, SharedFunctions) {

			var merchant;

			// http interceptor
			var loadingTracker = {tracker: $rootScope.loadingTracker};

			// get user info from localStorageService
			var userInfo = localStorageService.get('userInfo');

			if (userInfo != null || SharedFunctions.isobject(userInfo)){
				merchant = {
					MerchantId: userInfo.MerchantId,
					MerchantPassword: userInfo.MerchantPassword,
					PageNumber: null,
					PageSize: null
				};
			} else {
				merchant = {MerchantId: '834', MerchantPassword: 'm5494'};
			}
			// console.log(merchant);

			return {
				getActivationShopUrl: function(){
					var deferred = $q.defer();

					$http.post(API_URL + 'admin/GetActivationExternalLogin', merchant, loadingTracker)
					.then(
						function(response) {

							var arr = response.data.Data;
							deferred.resolve(arr);

						}, function(response) {

							deferred.reject(response);
							console.log('The request failed: ' + response);

						});

					return deferred.promise;
				},
				getVonageUrl: function(){
					var deferred = $q.defer();

					$http.post(API_URL + 'admin/GetVonageExternalLogin', merchant, loadingTracker)
						.then(function(response) {

							var arr = response.data.Data;
							deferred.resolve(arr);

						}, function(response) {

							deferred.reject(response);
							console.log('The request failed: ' + response);

						});
					return deferred.promise;
				}
			};
	}])
	// Service for interchange data between views and controllers via service.
	.factory('ItemFactory', [
		function() {

		var objSelected = [];

		return {
			/* Methods to pass an Object from one view to another via service */
			selectObject: function(newObj) {
				objSelected = newObj;
			},

			// RETURN PRODUC (get last object stored in select)
			returnObject: function(){
				return objSelected;
			}
		};
	}])
	// Service to send confirmation messages via SMS or email.
	.factory('ConfirmationFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService',
		function($http, $rootScope, API_URL, $q, localStorageService) {

		var arr = [];
		var userInfo = localStorageService.get('userInfo');
		var merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword};
		var loadingTracker = {tracker: $rootScope.loadingTracker};

		return {
			/* Methods to pass an Object from one view to another via service */
			sendConfirmationSms: function(receipt, phone) {

				var queryObj = {
					PhoneNumber: phone,
					Receipt: {
						ProductName: receipt.ProductName,
						ProductCountry: receipt.ProductCountry,
						CarrierName: receipt.CarrierName,
						ProductInstructions: receipt.ProductInstructions,
						PhoneNumber: receipt.PhoneNumber,
						PinNumber: receipt.PinNumber,
						ControlNumber: receipt.ControlNumber,
						OrderNumber: receipt.OrderNumber,
						TransactionId: receipt.TransactionId,
						UpdatedBalance: receipt.UpdatedBalance,
						MerchantName: receipt.MerchantName,
						MerchantPhoneNumber: receipt.MerchantPhoneNumber,
						CashierName: receipt.CashierName,
						MerchantAddress: receipt.MerchantAddress,
						OrderDate: receipt.OrderDate,
						Amount: receipt.Amount,
						Fee: receipt.Fee,
						Tax: receipt.Tax,
						Total: receipt.Total
					},
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword
				};
				console.log(queryObj);

				var deferred = $q.defer();

				$http.post(API_URL + 'ReceiptServices/SendConfirmationSms', queryObj, loadingTracker)
					.then(
					function(response) {
						arr = response.data;
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
			//
			sendConfirmationEmail: function(receipt, email){

				var queryObj = {
					Email: email,
					Receipt: {
						ProductName: receipt.ProductName,
						ProductCountry: receipt.ProductCountry,
						CarrierName: receipt.CarrierName,
						ProductInstructions: receipt.ProductInstructions,
						PhoneNumber: receipt.PhoneNumber,
						PinNumber: receipt.PinNumber,
						ControlNumber: receipt.ControlNumber,
						OrderNumber: receipt.OrderNumber,
						TransactionId: receipt.TransactionId,
						UpdatedBalance: receipt.UpdatedBalance,
						MerchantName: receipt.MerchantName,
						MerchantPhoneNumber: receipt.MerchantPhoneNumber,
						CashierName: receipt.CashierName,
						MerchantAddress: receipt.MerchantAddress,
						OrderDate: receipt.OrderDate,
						Amount: receipt.Amount,
						Fee: receipt.Fee,
						Tax: receipt.Tax,
						Total: receipt.Total
					},
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword
				};
				// console.log(queryObj);

				var deferred = $q.defer();

				$http.post(API_URL + 'ReceiptServices/SendConfirmationEmail', queryObj, loadingTracker)
					.then(
					function(response) {
						arr = response.data;
						// console.log(arr);
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
	}])
	// Service to handle error messages across application.
	.factory('AlertService', ['$rootScope', function($rootScope) {

		var alertService = {};

		// global `alerts` array
		$rootScope.alerts = [];

		alertService.add = function(type, msg) {
			$rootScope.alerts.push({
				'type': type,
				'msg': msg,
				'close': function(){
					alertService.closeAlert(this);
				}
			});
		};

		// close alert
		alertService.closeAlert = function(alert) {
			alertService.closeAlertIdx($rootScope.alerts.indexOf(alert));
		};

		// close alert by index
		alertService.closeAlertIdx = function(index) {
			$rootScope.alerts.splice(index, 1);
		};

		// Clear alert messages
		alertService.clear = function(){
			$rootScope.alerts = [];
		};

		// create instance of alertService
		alertService.getAlertInstance = function(baseResponse) {

			var status = baseResponse.Status;
			var message = baseResponse.ErrorMessage;

			var newAlert = {
				type: status === 200 ? 'success' : 'error',
				msg: message === '' ? 'The Operation was completed successfuly' : message
			};

			return newAlert;
		};

		return alertService;
	}]);
}());
