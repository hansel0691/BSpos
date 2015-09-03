'use strict';

/* services & factories */
angular.module('sharedServices', [])
	/**
	 * MerchantFactory - Factory
	 * Return merchant account details
	 */
	.factory('MerchantFactory', ['$http', 'API_URL', '$q',
		function($http, API_URL, $q){

		var merchantSales;
		var merchantBalance;

		return {
			// get merchant sales details
			getSalesSummary: function(merchantId, password){
				var deferred = $q.defer();

				// $http.get("app/data/merchant-sales.json")
				$http.post("http://bsapi.pinserve.com/api/Merchant/GetSalesSummary", { merchantId: merchantId, password: password })
				.then(
					function(response) {

					if(response.data.Status == 200){
						merchantSales = {
								todaySales: response.data.Data.TodaySales,
								dailyCreditLimit: response.data.Data.DailyCreditLimit,
								daylyBalance: response.data.Data.DaylyBalance,
								weeklyCreditLimit: response.data.Data.WeeklyCreditLimit,
								weeklyBalance: response.data.Data.WeeklyBalance
						};
					} else {
						merchantBalance = {}
					}


					//console.log(response.data);

					// console.log(JSON.stringify(response));
					deferred.resolve(merchantSales);

				}, function(response) {
					deferred.reject(response);
					console.log("The request failed: " + response);
					}
				);

				return deferred.promise;
			},

			// get merchant balance details
			getBalanceDetails: function(merchantId, password){
				var deferred = $q.defer();

				//$http.get("app/data/merchant-balance.json")
				$http.post("http://bsapi.pinserve.com/api/Merchant/GetBalanceDetails", { merchantId: merchantId, password: password })
				.then(function(response) {

					if(response.data.Status == 200){
						merchantBalance = {
							current: response.data.Data.Current,
							nextAch: response.data.Data.NextAch,
							nextAchDate: response.data.Data.NextAchDate
						};
					} else {
						merchantBalance = {}
					}

					deferred.resolve(merchantBalance);

				}, function(response){

					deferred.reject(response);
					console.log("The request failed: " + response);

				});

				return deferred.promise;
			}
		};
	}])

	.factory('AchPaymentFactory', ['$http', 'API_URL', '$q', 'localStorageService',
		function($http, API_URL, $q, localStorageService){

		var merchantSales;
		var merchantBalance;

		return {

			// get merchant balance details
			getSavedPayments: function(merchantId){
				var deferred = $q.defer();

								 var savedPaymentsUrl =  "http://bsapi.pinserve.com/api/admin/GetSavedAchPayment?merchantId=" + merchantId;

				$http.get(savedPaymentsUrl)
				.then(function(response) {

					savedPayments = response.data.Data;

					deferred.resolve(savedPayments);

				}, function(response){

					deferred.reject(response);
					console.log("The request failed: " + response);

				});

				return deferred.promise;
			}
		};
	}])


	/**
	 * CashierFactory Factory
	 * Get cachiers of merchant.
	 */
	.factory('CashierFactory', ['$http', 'API_URL', '$q',
		function($http, API_URL, $q){

		return {
			// get merchant sales details
			getCashiers: function(merchantId){
				var deferred = $q.defer();

				var cashiersUrl = API_URL + 'admin/getallcashiers?merchantid=' + merchantId;

				 $http.get(cashiersUrl)
				.then(function(response) {

					var cashiers = response.data.Data;

					deferred.resolve(cashiers);

				}, function(response) {

					deferred.reject(response);
					console.log("The request failed: " + response);

				});

				return deferred.promise;
			},

			saveCashier: function(merchantId, cashierName, cashierPassword)
			{
					var deferred = $q.defer();

				var saveCashierUrl = API_URL + 'admin/addcashier';

				 $http.post(saveCashierUrl, {MerchantId: merchantId,Name : cashierName, Password : cashierPassword})
				.then(function(response) {

					var result = response.data;

					console.log(result);

					deferred.resolve(result);

				}, function(response) {

					deferred.reject(response);
					console.log(response);
					console.log("The request failed: " + response.Status);

				});

				return deferred.promise;
			},

			deleteCashier: function(cashierId)
			{
					var deferred = $q.defer();

				var deleteCashierUrl = API_URL + 'admin/deletecashier?id=' + cashierId;

				 $http.get(deleteCashierUrl)
				.then(function(response) {

					 var result = response.data;

										console.log(result);

										 deferred.resolve(result);

				}, function(response) {

					deferred.reject(response);
					conso.log(response);
					console.log("The request failed: " + response.Status);

				});

				return deferred.promise;
			},
					editCashier: function(merchantId, cashierId, cashierName, cashierPassword)
			{
					var deferred = $q.defer();
								 console.log(cashierPassword);
				var updateCashierUrl = API_URL + 'admin/updatecashier';

				 $http.post(updateCashierUrl, {MerchantId: merchantId,Id: cashierId, Name : cashierName, password : cashierPassword})
				.then(function(response) {

								var response = response.data;
									console.log(response.data);
					deferred.resolve(response);

				}, function(response) {

					deferred.reject(response);
					conso.log(response);
					console.log("The request failed: " + response.Status);

				});

				return deferred.promise;
			},
		};
	}])

	.factory('ExternalFactory', ['$http', 'API_URL', '$q',
		function($http, API_URL, $q){

		return {

			getActivationShopUrl: function(merchantId, password){
				var deferred = $q.defer();

				var activationShopTokenUrl = API_URL + 'admin/GetActivationExternalLogin';

				 $http.post(activationShopTokenUrl, {MerchantId: merchantId, password: password})
				.then(
					function(response) {
						var arr = response.data.Data;
						deferred.resolve(arr);
					},
					function(response) {
						deferred.reject(response);
						console.log("The request failed: " + response);
					}
				);

				return deferred.promise;
			},

			makeNewPayment: function(merchantId,accountNumber, routingNumber, saveAccount, amount){

				var deferred = $q.defer();

				var makeNewPaymentUrl =  "http://bsapi.pinserve.com/api/admin/addachfunds";

				$http.post(makeNewPaymentUrl)
				.then(function(response) {

					var makeNewPaymentResult = {Status: response.data.Status, ErrorMessage : response.data.ErrorMessage}

					deferred.resolve(makeNewPaymentResult);

				}, function(response){

					deferred.reject(response);
					console.log("The request failed: " + response);

				});

				return deferred.promise;
			}
		};
	}])

	.factory('ExternalFactory', ['$http', 'API_URL', '$q',
		function($http, API_URL, $q){

		return {

			getActivationShopUrl: function(merchantId, password){
				var deferred = $q.defer();

				var activationShopTokenUrl = API_URL + 'admin/GetActivationExternalLogin';

				 $http.post(activationShopTokenUrl, {MerchantId: merchantId, password: password})
				.then(function(response) {

					var arr = response.data.Data;
					deferred.resolve(arr);

				}, function(response) {

					deferred.reject(response);
					console.log("The request failed: " + response);

				});

				return deferred.promise;
			}
		};

	}])

	.factory('SettingsFactory', ['$http', 'API_URL', '$q',
		function($http, API_URL, $q){

		return {

			getSettings: function(merchantId){
				var deferred = $q.defer();

				var settingsUrl = API_URL + 'admin/getSettings?merchantid=' + merchantId;

				 $http.get(settingsUrl)
				.then(function(response) {

					var settings = response.data.Data;
					deferred.resolve(settings);

				}, function(response) {

					deferred.reject(response);
					console.log("The request failed: " + response);

				});

				return deferred.promise;
			},

			updateSettings: function(merchantId, smallReceipt, salesTax, confirmPhone)
			{
				var deferred = $q.defer();

				var updateSettingsUrl = API_URL + 'admin/updateSettings';

				 $http.post(updateSettingsUrl, {MerchantId: merchantId, SmallReceipt: smallReceipt, Tax: salesTax, ConfirmPhone: confirmPhone})
				.then(function(response) {

					var updateSettingsResponse = response.data;
					// console.log(updateSettingsResponse);
					deferred.resolve(updateSettingsResponse);

				}, function(response) {

					deferred.reject(response);
					console.log("The request failed: " + response);

				});

				return deferred.promise;
			}
		};
	}])

	.factory('OrderFactory', ['$http', 'API_URL', '$q',
		function($http, API_URL, $q){

		return {
			// get merchant sales details
			getOrders: function(merchantId){
				var deferred = $q.defer();

				var ordersUrl = API_URL + 'admin/getallorders?merchantid=' + merchantId;

				 $http.get(ordersUrl)
				.then(function(response) {

					var orders = response.data.Data;
					deferred.resolve(orders);

				}, function(response) {

					deferred.reject(response);
					console.log("The request failed: " + response);

				});

				return deferred.promise;
			}
		};
	}])

	/**
	 * SettingsFactory Factory
	 * Get account settings for a merchant.
	 */
	.factory('SettingsFactory', ['$http', 'API_URL', '$q',
		function($http, API_URL, $q){

		return {
			getSettings: function(merchantId){
				var deferred = $q.defer();

				var settingsUrl = API_URL + 'admin/getSettings?merchantid=' + merchantId;

				 $http.get(settingsUrl)
				.then(function(response) {

					var settings = response.data.Data;

					deferred.resolve(settings);

				}, function(response) {

					deferred.reject(response);
					console.log("The request failed: " + response);

				});

				return deferred.promise;
			},

			updateSettings: function(merchantId, smallReceipt, salesTax, confirmPhone){

				var deferred = $q.defer();

				var updateSettingsUrl = API_URL + 'admin/updateSettings';

				$http.post(updateSettingsUrl, {MerchantId: merchantId, SmallReceipt: smallReceipt, Tax: salesTax, ConfirmPhone: confirmPhone})
				.then(
					function(response) {

						var updateSettingsResponse = response.data;

						deferred.resolve(updateSettingsResponse);

					},
					function(response) {
						deferred.reject(response);
						console.log("The request failed: " + response);
					}
				);
				return deferred.promise;
			}
		};
	}])

	/**
	 * OrderFactory Factory
	 * Get orders for merchant.
	 */
	.factory('OrderFactory', ['$http', 'API_URL', '$q',
		function($http, API_URL, $q){

		return {
			// get merchant sales details
			getOrders: function(merchantId){
				var deferred = $q.defer();

				var ordersUrl = API_URL + 'admin/getallorders?merchantid=' + merchantId;

				$http.get(ordersUrl)
				.then(
					function(response) {

						var orders = response.data.Data;
						// console.log(orders);
						deferred.resolve(orders);

					}, function(response) {
						deferred.reject(response);
						console.log("The request failed: " + response);
					}
				);

				return deferred.promise;
			}
		};
	}])

	/**
	 * AdminFactory Factory
	 * Admin API methods.
	 */
	.factory('AdminFactory', ['$http', 'API_URL', '$q',
		function($http, API_URL, $q){

		var serialize = function(obj) {
			var str = [];
			for(var p in obj)
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
			return str.join("&");
		}

		return {
			getSavedAchPayments: function(merchantId){

				var deferred = $q.defer();

				var ordersUrl = API_URL + 'Admin/GetSavedAchPayments?merchantId=' + merchantId;

				$http.get(ordersUrl)
				.then(
					function(response) {

						var achs = response.data.Data;
						deferred.resolve(achs);

					}, function(response) {
						deferred.reject(response);
						console.log("The request failed: " + response);
					}
				);

				return deferred.promise;
			},

			// Add funds and/or to account
			addAchFunds: function(id, accountNumber, routingNumber, merchantId, amount, saveAccount, typeChecking){

				var deferred = $q.defer();

				$http.post(API_URL + 'Admin/AddAchFunds',{Id:id, AccountNumber: accountNumber, RoutingNumber: routingNumber, MerchantId: merchantId,
																								 Amount: amount, SaveAccount: saveAccount, TypeChecking: typeChecking})
				.then(
					function(response) {


												console.log(response);
						var response = response.data;

						deferred.resolve(response);

					}, function(response) {
						console.log("The request failed: " + response);
						deferred.reject(response);
					}
				);

				return deferred.promise;
			}
		};
	}])

	/**
	 * ItemService Factory
	 * Service for interchange data between views and controllers via service.
	 */
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
		}
	}])

	/**
	 * AlertService Factory
	 * Service to handle error messages across application.
	 */
	.factory('AlertService', function($rootScope) {

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
		}


		//
		alertService.getAlertInstance = function(baseResponse) {



						 var status = baseResponse.Status;
						 var message = baseResponse.ErrorMessage;

			var newAlert = {
				type: status == 200? 'success': 'error',
				msg: message == ""? 'The Operation was completed successfuly': message
			};

			return newAlert;
		};

		return alertService;
	});
