(function () {
	'use strict';
	angular.module('adminServices', [])
	.factory('MerchantFactory', ['$http', '$rootScope', 'API_URL', '$q',
		function ($http, $rootScope, API_URL, $q) {
		// Return merchant account details
		var merchant;

		// http interceptor
		var loadingTracker = {tracker: $rootScope.loadingMerchantTracker};

		// get user info from localStorageService
		// var userInfo = localStorageService.get('userInfo');
		// console.log(userInfo);

		// if (userInfo){
		// 	merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword};
		// } else {
		// 	console.log('fail to get userInfo on sharedServices.js')
		// }

		return {
			// get merchant sales details
			getSalesSummary: function(MerchantId, MerchantPassword){
				var deferred = $q.defer();

				merchant = {MerchantId: MerchantId, MerchantPassword: MerchantPassword};

				$http.post(API_URL + 'Merchant/GetSalesSummary', merchant, loadingTracker)
				.then(
					function(response) {

					if(response.data.Status === 200){
						var merchantSales = {
							todaySales: response.data.Data.TodaySales,
							dailyCreditLimit: response.data.Data.DailyCreditLimit,
							daylyBalance: response.data.Data.DaylyBalance,
							weeklyCreditLimit: response.data.Data.WeeklyCreditLimit,
							weeklyBalance: response.data.Data.WeeklyBalance
						};
					} else {
						console.log('status != 200, status: ' + response.data.Status);
					}
					// console.log(JSON.stringify(response));
					deferred.resolve(merchantSales);

				}, function(response) {
					deferred.reject(response);
					console.log('The request failed: ' + response);
					}
				);

				return deferred.promise;
			},
			// get merchant balance details
			getBalanceDetails: function(MerchantId, MerchantPassword){
				var deferred = $q.defer();

				merchant = {'MerchantId': MerchantId, 'MerchantPassword': MerchantPassword};

				$http.post(API_URL + 'Merchant/GetBalanceDetails', merchant, loadingTracker)
				.then(
					function(response) {

						if(response.data.Status === 200){
							var merchantBalance = {
								current: response.data.Data.Current,
								nextAch: response.data.Data.NextAch,
								nextAchDate: response.data.Data.NextAchDate
							};
						} else {
							console.log('status != 200, status: ' + response.data.Status);
						}

						deferred.resolve(merchantBalance);
					},
					function(response){

						deferred.reject(response);
						console.log('The request failed: ' + response);
				});

				return deferred.promise;
			}
		};
	}])
	.factory('AchPaymentFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService',
		function($http, $rootScope, API_URL, $q, localStorageService){

			var merchant;
			var userInfo = localStorageService.get('userInfo');
			var loadingTracker = {tracker: $rootScope.loadingAdminTracker};

			if (userInfo != null){
				merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.password};
			}

			return {
				// get merchant balance details
				getSavedPayments: function(){
					var deferred = $q.defer();

					$http.post(API_URL + 'admin/GetSavedAchPayment', merchant, loadingTracker)
					.then(
						function(response) {

							var results = response.data.Data;
							deferred.resolve(results);

						}, function(response){

							deferred.reject(response);
							console.log('The request failed: ' + response);

						});
					return deferred.promise;
				}
			};
	}])
	// Get cachiers of merchant.
	.factory('CashierFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService',
		function($http, $rootScope, API_URL, $q, localStorageService) {

			var merchant;

			// http interceptor
			var loadingTracker = {tracker: $rootScope.loadingAdminTracker};

			// get user info from localStorageService
			var userInfo = localStorageService.get('userInfo');

			if (userInfo != null){
				merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword};
			}
			// console.log(merchant);

			return {
				// get merchant sales details
				getCashiers: function(MerchantId, MerchantPassword){
					var deferred = $q.defer();
					$http.post(API_URL + 'admin/getallcashiers', {MerchantId: MerchantId, MerchantPassword: MerchantPassword}, loadingTracker)
					.then(
						function(response) {

							var cashiers = response.data.Data;
							deferred.resolve(cashiers);

						}, function(response) {

							deferred.reject(response);
							console.log('The request failed: ' + response);

						}
					);
					return deferred.promise;
				},
				// save CASHIER
				saveCashier: function(MerchantId, cashierName, cashierPassword) {
					var deferred = $q.defer();

					$http.post(API_URL + 'admin/addcashier', {MerchantId: MerchantId, MerchantPassword: merchant.MerchantPassword, Name: cashierName, Password: cashierPassword}, loadingTracker)
					.then(
						function(response) {

							var result = response.data;
							// console.log(result);
							deferred.resolve(result);

						}, function(response) {

							deferred.reject(response);
							// console.log(response);
							console.log('The request failed: ' + response.Status);

						});
					return deferred.promise;
				},
				// delete CASHIER
				deleteCashier: function(cashierId) {
					var deferred = $q.defer();

					$http.post(API_URL + 'admin/deletecashier', {MerchantId: merchant.MerchantId, MerchantPassword: merchant.MerchantPassword, Id: cashierId}, loadingTracker)
					.then(
						function(response) {

							var result = response.data;
							console.log(result);
							deferred.resolve(result);

						}, function(response) {

							deferred.reject(response);
							console.log('The request failed: ' + response.Status);

						});
					return deferred.promise;
				},
				// edit CASHIER
				editCashier: function(MerchantId, cashierId, cashierName, cashierPassword) {
					var deferred = $q.defer();
					// console.log(cashierPassword);

					$http.post(API_URL + 'admin/updatecashier', {MerchantId: MerchantId, MerchantPassword: merchant.MerchantPassword, Id: cashierId, Name: cashierName, password: cashierPassword}, loadingTracker)
					.then(
						function(response) {

							var result = response.data;
							// console.log(response.data);
							deferred.resolve(result);

						}, function(response) {

							deferred.reject(response);
							console.log('The request failed: ' + response.Status);

						});
					return deferred.promise;
				}
			};
	}])
	// Get account settings for a merchant.
	.factory('SettingsFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService', 'SharedFunctions',
		function ($http, $rootScope, API_URL, $q, localStorageService, SharedFunctions) {

			var merchant;

			// http interceptor
			var loadingTracker = {tracker: $rootScope.loadingAdminTracker};

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
				// get SETTINGS
				getSettings: function(){
					var deferred = $q.defer();

					$http.post(API_URL + 'admin/getSettings', merchant, loadingTracker)
					.then(
						function(response) {

							var settings = response.data.Data;
							deferred.resolve(settings);

						}, function(response) {

							deferred.reject(response);
							console.log('The request failed: ' + response);

						});
					return deferred.promise;
				},
				// update SETTINGS
				updateSettings: function(MerchantId, smallReceipt, salesTax, confirmPhone, paxTerminalAsPrinter) {
					var deferred = $q.defer();

					$http.post(API_URL + 'admin/updateSettings', {MerchantId: MerchantId, MerchantPassword: merchant.MerchantPassword, SmallReceipt: smallReceipt, Tax: salesTax, ConfirmPhone: confirmPhone, PaxTerminalAsPrinter: paxTerminalAsPrinter}, loadingTracker)
					.then(
						function(response) {

							var updateSettingsResponse = response.data;
							// console.log(updateSettingsResponse);
							deferred.resolve(updateSettingsResponse);

						}, function(response) {

							deferred.reject(response);
							console.log('The request failed: ' + response);

						});
					return deferred.promise;
				}
			};
	}])
	// get merchant orders
	.factory('OrderFactory', ['$http', '$rootScope', 'API_URL', '$q',
		function ($http, $rootScope, API_URL, $q) {

			var params = {};

			// http interceptor
			var loadingTracker = {tracker: $rootScope.loadingTracker};

			// console.log(merchant);
			return {
				// get ORDERS
				getOrders: function(StartDate, EndDate, PageNumber, PageSize, MerchantInfo){

					params = {
						StartDate: StartDate,
						EndDate: EndDate,
						PageNumber: PageNumber,
						PageSize: PageSize,
						MerchantId: MerchantInfo.MerchantId,
						MerchantPassword: MerchantInfo.MerchantPassword
					};

					var deferred = $q.defer();

					$http.post(API_URL + 'admin/getallorders', params, loadingTracker) .then(
						function(response) {
							var orders = response.data;
							// console.log(response.data.Data)
							deferred.resolve(orders);
						},
						function(err) {
							deferred.reject(err);
							console.log('The request failed: ' + err);
						}
					);
					return deferred.promise;
				},
				getAllOrdersSummary: function(StartDate, EndDate, MerchantInfo){

					params = {
						StartDate: StartDate,
						EndDate: EndDate,
						MerchantId: MerchantInfo.MerchantId,
						MerchantPassword: MerchantInfo.MerchantPassword
					};

					var deferred = $q.defer();

					$http.post(API_URL + 'admin/GetAllOrdersSummary', params, loadingTracker) .then(
						function(response) {
							var orders = response.data;
							// console.log(response.data.Data)
							deferred.resolve(orders);
						},
						function(err) {
							deferred.reject(err);
							console.log('The request failed: ' + err);
						}
					);
					return deferred.promise;
				},
				refundOrder: function(orderId, MerchantInfo){

					var deferred = $q.defer();

					params = {
						MerchantId: MerchantInfo.MerchantId,
						MerchantPassword: MerchantInfo.MerchantPassword,
						OrderId: orderId
					};

					$http.post(API_URL + 'admin/RefundOrder', params, loadingTracker).then(
						function(response) {
							var orders = response.data;
							// console.log(response.data.Data)
							deferred.resolve(orders);
						},
						function(response) {
							deferred.reject(response);
							console.log('The request failed: ' + response);
						}
					);
					return deferred.promise;
				},
				reSendOrderConfirmation: function(orderId, MerchantInfo){

					var deferred = $q.defer();

					params = {
						MerchantId: MerchantInfo.MerchantId,
						MerchantPassword: MerchantInfo.MerchantPassword,
						OrderId: orderId
					};

					$http.post(API_URL + 'admin/ReSendOrderConfirmation', params, loadingTracker).then(
						function(response) {
							var orders = response.data;
							// console.log(response.data.Data)
							deferred.resolve(orders);
						},
						function(response) {
							deferred.reject(response);
							console.log('The request failed: ' + response);
						}
					);
					return deferred.promise;
				},
				downloadAsCvs: function(Start, End, MerchantInfo){
					params = {
						StartDate: Start,
						EndDate: End,
						MerchantId: MerchantInfo.MerchantId,
						MerchantPassword: MerchantInfo.MerchantPassword
					};

					var deferred = $q.defer();

					$http.post(API_URL + 'admin/GetAllOrdersToExport', params, loadingTracker) .then(
						function(response) {
							var orders = response.data;
							// console.log(response.data.Data)
							deferred.resolve(orders);
						},
						function(err) {
							deferred.reject(err);
							console.log('The request failed: ' + err);
						}
					);
					return deferred.promise;
				},
				sendAsEmail: function(Start, End, Email, MerchantInfo){

					var deferred = $q.defer();

					params = {
						StartDate: Start,
						EndDate: End,
						Email: Email,
						MerchantId: MerchantInfo.MerchantId,
						MerchantPassword: MerchantInfo.MerchantPassword
					};

					$http.post(API_URL + 'ReceiptServices/SendOrdersByEmail', params, loadingTracker).then(
						function(response) {
							var orders = response.data;
							// console.log(response.data.Data)
							deferred.resolve(orders);
						},
						function(response) {
							deferred.reject(response);
							console.log('The request failed: ' + response);
						}
					);
					return deferred.promise;
				}
			};
	}])
	// get saved payments, add arch funds (admin)
	.factory('AdminFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService', 'SharedFunctions',
		function ($http, $rootScope, API_URL, $q, localStorageService, SharedFunctions) {

			var merchant;

			// http interceptor
			var loadingTracker = {tracker: $rootScope.loadingAdminTracker};

			// get user info from localStorageService
			var userInfo = localStorageService.get('userInfo');

			if (userInfo != null || SharedFunctions.isobject(userInfo)){
				merchant = {
					MerchantId: userInfo.MerchantId,
					MerchantPassword: userInfo.MerchantPassword
				};
			} else {
				merchant = {MerchantId: '834', MerchantPassword: 'm5494'};
			}
			// console.log(merchant);

			return {
				getSavedAchPayments: function(){
					var deferred = $q.defer();

					var ordersUrl = API_URL + 'Admin/GetSavedAchPayments';

					$http.post(ordersUrl, merchant, loadingTracker)
					.then(
						function(response) {

							var achs = response.data.Data;
							deferred.resolve(achs);

						}, function(response) {

							deferred.reject(response);
							console.log('The request failed: ' + response);
						}
					);
					return deferred.promise;
				},
				// Add funds and/or to account
				addAchFunds: function(id, accountNumber, routingNumber, MerchantId, amount, saveAccount, typeChecking){

					var deferred = $q.defer();

					$http.post(API_URL + 'Admin/AddAchFunds', {Id: id, AccountNumber: accountNumber, RoutingNumber: routingNumber, MerchantId: MerchantId, MerchantPassword: merchant.MerchantPassword, Amount: amount, SaveAccount: saveAccount, TypeChecking: typeChecking}, loadingTracker)
					.then(
						function(response) {

							var arr = response.data;
							// console.log(response);
							deferred.resolve(arr);

						}, function(response) {

							console.log('The request failed: ' + response);
							deferred.reject(response);

						}
					);
					return deferred.promise;
				},
				getAppMainLogoUrl: function(MerchantId, Password) {

					var deferred = $q.defer();

					$http.post(API_URL + 'admin/GetAppMainLogoUrl', {MerchantId: MerchantId, MerchantPassword: Password}, loadingTracker)
					.then(
						function(response){

							var data = response.data;
							console.log(data);
							deferred.resolve(data);

						},
						function(response){

							deferred.reject(response);

						}
					);
					return deferred.promise;
				}
			};
	}]);
}());
