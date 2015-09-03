(function () {
	'use strict';
	angular.module('posApp')
	// AdminCtrl
	.controller('AdminCtrl', ['$rootScope', '$scope', '$location', 'localStorageService', 'AuthenticationFactory', 'ExternalFactory', 'AdminFactory', 'CashierFactory', 'OrderFactory', 'SettingsFactory', 'AchPaymentFactory', 'Flash', '$modal', '$filter', '$document', '$timeout',
		function($rootScope, $scope, $location, localStorageService, AuthenticationFactory, ExternalFactory, AdminFactory, CashierFactory, OrderFactory, SettingsFactory, AchPaymentFactory, Flash, $modal, $filter, $document, $timeout) {

		// clear flash messages from previous view
		Flash.dismiss();

		// $scope.userInfo = {};
		var userInfo = localStorageService.get('userInfo');
		// console.log(userInfo);
		var MerchantId;
		var MerchantPassword;
		$scope.filename = '';

		// datepicker
		$scope.initDates = function(){
			var startDate = new Date();
			$scope.start = startDate.setMonth(startDate.getMonth());
			$scope.end = new Date();
		};
		$scope.initDates();

		$scope.todayDates = function(){
			var startDate = new Date();
			$scope.start = startDate.setDate(startDate.getDate() - 1);
			$scope.end = new Date();
		};

		$scope.tabs = [
			{title: 'Cashiers', active: null},
			{title: 'Settings', active: null},
			{title: 'Orders', active: null}
		];

		// get previous active tab index
		var activeTab = parseInt(localStorageService.get('adminTab'));
		console.log(activeTab);

		// if exist active it
		if ( activeTab && activeTab != null ){
			$scope.tabs[activeTab].active = true;
		} else {
			$scope.tabs[0].active = true;
		}
		// save current tab index
		$scope.saveState = function(tab) {
			Flash.dismiss();
			localStorageService.set('adminTab', tab);
		};

		MerchantId = userInfo.MerchantId;
		MerchantPassword = userInfo.MerchantPassword;

		function copySelectedAchPaymentObj(selectedAch) {
			if (selectedAch == null){
				return;
			}
			$scope.payment.Id = selectedAch.Id;
			$scope.payment.AccountNumber = selectedAch.AccountNumber;
			$scope.payment.RoutingNumber = selectedAch.RoutingNumber;
			$scope.payment.TypeChecking = selectedAch.TypeChecking;
			$scope.payment.SaveAccount = selectedAch.SaveAccount;
		}

		function copySelectedCashierObj(selectedCashier) {
			$scope.editcashier.id = selectedCashier.Id;
			$scope.editcashier.name = selectedCashier.Name;
			$scope.editcashier.password = selectedCashier.Password;
		}

		// payment fuctions
		var initPaymentsScope = function (){
			$scope.payment = {
				Id: 0,
				AccountNumber: null,
				RoutingNumber: null,
				TypeChecking: true,
				SaveAccount: false,
				MerchantId: userInfo.MerchantId,
				Amount: 0
			};
		};

		var initOverSession = function() {
			var adminLogged = userInfo.IsMerchant;
			localStorageService.set('adminLogged', adminLogged);
			$scope.adminLogged = adminLogged;
			// console.log();
			// console.log('admin logged: '+ adminLogged);
		};

		// init settings scope
		var initSettingsScope = function() {
			$scope.settings = {
				SmallReceipt: null,
				Tax: null,
				ConfirmPhone: null,
				PaxTerminalAsPrinter: null
			};
		};

		// init cachiers scope
		var initCashiersScope = function() {
			$scope.cashier = {
				id: null,
				name: null,
				password: null
			};
			$scope.editcashier = {
				id: null,
				name: null,
				password: null
			};
		};

		// INIT $SCOPE
		initOverSession();
		initPaymentsScope();
		initCashiersScope();
		initSettingsScope();
		initOverSession();

		// PAYMENTS
		// get saved payments method
		$scope.getSavedAchPayments = function(){
			AdminFactory.getSavedAchPayments().then(
				function(data){
					$scope.achs = data;
					$scope.spin = false;
					if(data != null && data.length > 0) {
						copySelectedAchPaymentObj(data[0]);
					}
				},
				function(error){
					console.log(error);
				}
			);
		};


		// add founds to account
		$scope.addAchFunds = function(){
			AdminFactory.addAchFunds($scope.payment.Id, $scope.payment.AccountNumber, $scope.payment.RoutingNumber, $scope.payment.MerchantId, $scope.payment.Amount, $scope.payment.SaveAccount, $scope.payment.TypeChecking)
			.then(
				function(data){
					//console.log(data);
					Flash.create('success', data, '');
					$scope.getSavedAchPayments();
				},
				function(error){
					console.log(error);
				}
			);
		};

		// select
		$scope.setSelectedCashier = function(){
			copySelectedCashierObj(this.cashier);
			$scope.editMode = true;
			// $scope.selected = item;
		};
		// get cashier
		$scope.getCashiers = function(){
			CashierFactory.getCashiers(MerchantId, MerchantPassword).then(
				function(data){
					$scope.cashiers = data;
					// console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		// delete cashier
		$scope.deleteCashier = function(cashierId) {
			if(confirm('Are you sure you want to delete this cashier?')) {
				CashierFactory.deleteCashier(cashierId)
				.then(
					function(response){
						Flash.create('success', response.ErrorMessage, '');
						$scope.getCashiers();
					},
					function(err){
						Flash.create('error', err.ErrorMessage, '');
						console.log(err);
					}
				);
			}
		};
		// save cashier
		$scope.saveCashier = function() {
			CashierFactory.saveCashier(userInfo.MerchantId, $scope.cashier.name, $scope.cashier.password)
			.then(
				function(response){
					Flash.create('success', response.ErrorMessage, '');
					$scope.getCashiers();
				},
				function(err){
					Flash.create('error', err.ErrorMessage, '');
					console.log(err);
				}
			);
		};
		// update
		$scope.updateCashier = function() {
			CashierFactory.editCashier(userInfo.MerchantId, $scope.editcashier.id, $scope.editcashier.name, $scope.editcashier.password)
			.then(
				function(response){
					Flash.create('success', response.ErrorMessage, '');
					$scope.getCashiers();
				},
				function(err){
					Flash.create('error', err.ErrorMessage, '');
					console.log(err);
				}
			);
		};


		// ORDERS
		// pagination vars
		$scope.currentPage 	= 1;
		$scope.perPage 		= 10;
		$scope.noOfPages 	= 15;
		$scope.totalItems 	= 0;
		$scope.maxSize 		= 5;

		// GET ORDERS
		$scope.getOrders = function(){

			// console.log($filter('date')($scope.start, 'shortDate', '-0500'));
			// console.log($filter('date')($scope.end, 'shortDate', '-0500'));

			var start = $filter('date')($scope.start, 'shortDate', '-0500');
			console.log(start);

			var end = $filter('date')($scope.end, 'shortDate', '-0500');
			console.log(end);

			OrderFactory.getOrders(start, end, $scope.currentPage, $scope.perPage, userInfo).then(
				function(data){
					$scope.orders = data.Data;
					$scope.totalItems = data.Count;
					$scope.spin = false;
					// console.log(data.Count);
				},
				function(err){
					Flash.create('error', err.ErrorMessage, '');
					console.log(err);
				}
			);
		};

		$scope.getAllOrdersSummary = function(){

			var start = $filter('date')($scope.start, 'shortDate', '-0500');
			var end = $filter('date')($scope.end, 'shortDate', '-0500');

			OrderFactory.getAllOrdersSummary(start, end, userInfo).then(
				function(data){
					$scope.sumary = data.Data;
					// console.log(data.Count);
				},
				function(err){
					Flash.create('error', err.ErrorMessage, '');
					console.log(err);
				}
			);
		};

		// ON CURRENT PAGE CHANGE getOrders()
		$scope.pageChanged = function(page) {
			$scope.currentPage = page;
			$scope.getOrders();
		};

		// SETTINGS
		// GET SETTINGS
		$scope.getSettings = function(){
			SettingsFactory.getSettings().then(
				function(data){
					var arr = data;
					localStorageService.set('settings', arr);
					$scope.settings = arr;
					// console.log(arr);
				},
				function(error){
					console.log(error);
				}
			);
		};
		// UPDATE SETTINGS
		$scope.updateSettings = function(form){

			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				Flash.dismiss();
				Flash.create('error', 'Check errors below (in red color)', '');
				return;
			}

			if (form.$valid) {
				SettingsFactory.updateSettings(userInfo.MerchantId, $scope.settings.SmallReceipt, $scope.settings.Tax, $scope.settings.ConfirmPhone, $scope.settings.PaxTerminalAsPrinter)
				.then(
					function(response){
						if (response.Status === 200){
							$scope.updateSettingsResponse = response;
							Flash.create('success', 'Settings successfuly updated', '');
							console.log(response.ErrorMessage);
						} else {
							Flash.create('success', response.ErrorMessage, '');
						}
					},
					function(err){
						Flash.create('error', err.ErrorMessage, '');
						console.log(err);
					}
				);
			}
		};


		$scope.loginOverSesion = function(password) {
			AuthenticationFactory.login($scope.userInfo.MerchantId, password)
			.then(
				function(response){
					// console.log(response);
					if(response.Status === 200) {
						$scope.adminLogged = response.UserInfo.isMerchant;
						console.log($scope.adminLogged);
					} else {
						Flash.create('error', 'Invalid Admin Credentials', '');
					}
				},
				function(err){
					Flash.create('error', 'Invalid Admin Credentials', '');
					console.log(err);
				}
			);
		};

		// Form submit handler.
		$scope.submit = function(form) {
			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				Flash.dismiss();
				// Flash.create('error', 'Check errors below', '');
				return;
			}

			if (form.$valid) {
				// remove any previous flash
				Flash.dismiss();

				// add founds to account
				AdminFactory.addAchFunds($scope.Id, $scope.AccountNumber, $scope.RoutingNumber, $scope.MerchantId, $scope.Amount, $scope.SaveAccount, $scope.TypeChecking)
				.then(
					function(response){
						// $scope.achs = response;
						Flash.create('success', response, '');
						// console.log(response);
					},
					function(err){
						Flash.create('error', err.ErrorMessage, '');
						console.log(err);
					}
				);
			}
		};

		// Update orders
		$scope.updateOrders = function(){
			$scope.spin = true;
			$scope.getOrders();
		};

		// GET ADMIN DATA
		$scope.getSettings();
		$scope.getCashiers();
		$scope.getOrders();
		$scope.getAllOrdersSummary();

		// set dates to today, from and to
		$scope.today = function() {
			$scope.todayDates();
			$scope.getOrders();
			$scope.getAllOrdersSummary();
			console.log('todayDates(), clear()');
		};
		// set dates to default, from 6 months to today
		$scope.clear = function() {
			$scope.initDates();
			$scope.getOrders();
			$scope.getAllOrdersSummary();
			console.log('initDates(), clear()');
		};
		// let user ask for orders by custom dates
		$scope.getOrdersByDate = function(ordersByDate){
			// update start $ end values in scope
			$scope.start = ordersByDate.start.$modelValue;
			$scope.end = ordersByDate.end.$modelValue;

			// get orders & summary
			$scope.getOrders();
			$scope.getAllOrdersSummary();
		};

		$scope.refundOrder = function(orderId){
			console.log(orderId);
			OrderFactory.refundOrder(orderId, userInfo).then(
				function(response){
					if (response.Status === 200){
						Flash.create('success', response.ErrorMessage, '');
						// update item refunded in scope, don't ask to server as
						// the Status was 200, success
						angular.forEach($scope.orders, function(item) {
							if (item.Id === orderId){
								item.IsRefundable = false;
								// console.log(orderId);
							}
						});
					} else {
						// print error error message is status isn't 200
						Flash.create('danger', response.ErrorMessage, '');
					}
				},
				function(err){
					// print error error message
					Flash.create('danger', err.ErrorMessage, '');
					console.log(err);
				}
			);
		};
		$scope.reSendOrderConfirmation = function(orderId){
			console.log(orderId);
			OrderFactory.reSendOrderConfirmation(orderId, userInfo).then(
				function(response){
					// console.log(response);
					if (response.Status === 200){
						Flash.create('success', response.ErrorMessage, '');
					} else {
						Flash.create('danger', response.ErrorMessage, '');
					}
				},
				function(err){
					Flash.create('danger', err.ErrorMessage, '');
					console.log(err);
				}
			);
		};

		// download as CSV.
		$scope.downloadAsCvs = function(ordersByDate){
			console.log(ordersByDate);

			var start = $filter('date')(ordersByDate.start.$modelValue, 'MM/dd/yy', '-0500');
			var end = $filter('date')(ordersByDate.end.$modelValue, 'MM/dd/yy', '-0500');

			console.log(start + ' / ' + end);

			OrderFactory.downloadAsCvs(start, end, userInfo).then(
				function(response){

					// console.log(response);
					var csvHeader = [];
					var headers = '';
					var rows = '';
					var orders = '';
					// take header from object keys
					angular.forEach(response.Data[0], function(value, key) {
						csvHeader.push('"' + key + '"');
					});

					headers = csvHeader.toString();
					// take each object and make a row
					angular.forEach(response.Data, function(item) {
						var csvRow = [];

						angular.forEach(item, function(value) {
							csvRow.push('"' + value + '"');
						});

						rows = rows.concat(csvRow.toString());
						rows = rows.concat('\n');
					});
					// compose data
					orders = orders.concat(headers);
					orders = orders.concat('\n');
					orders = orders.concat(rows);
					// construc file name using dates
					$scope.doFilename = function (){
						return 'orders-from-' + start.replace(/[^0-9\.]+/g, '') + '-to-' + end.replace(/[^0-9\.]+/g, '') + '.csv';
					};
					// start building csv file
					var charset = $scope.charset || 'utf-8';
						var blob = new Blob([orders], {
						type: 'text/csv;charset=' + charset + ';'
					});
					// construc link & download it
					if (window.navigator.msSaveOrOpenBlob) {
						navigator.msSaveBlob(blob, $scope.doFilename());
					} else {
						var downloadLink = angular.element('<a></a>');
						downloadLink.attr('href', window.URL.createObjectURL(blob));
						downloadLink.attr('download', $scope.doFilename());
						downloadLink.attr('target', '_blank');

						$document.find('body').append(downloadLink);

						$timeout(function () {
							downloadLink[0].click();
							downloadLink.remove();
						}, null);
					}

				},
				function(err){
					console.log(err);
				}
			);
		};
		// send CSV via email
		$scope.sendAsEmail = function(ordersByDate){
			// setup params
			var start = $filter('date')(ordersByDate.start.$modelValue, 'MM/dd/yy', '-0500');
			var end = $filter('date')(ordersByDate.end.$modelValue, 'MM/dd/yy', '-0500');
			var email = ordersByDate.email.$modelValue;

			OrderFactory.sendAsEmail(start, end, email, userInfo).then(
				function(response){
					console.log(response);

					if (response.Status === 200){
						Flash.create('success', response.ErrorMessage, '');
						// $scope.email = '';
					}
				},
				function(err){
					// success, info, warning, danger
					Flash.create('danger', err.ErrorMessage, '');
					console.log(err);
				}
			);
		};
	}]);
}());
