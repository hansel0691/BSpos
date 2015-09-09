(function () {
	'use strict';
	angular.module('posApp')
	// ModalAccountCtrl CONTROLLER
	// Please note that $modalInstance represents a modal window (instance) dependency.
	.controller('ModalAccountCtrl', ['$scope', '$modalInstance', 'item', '$location', 'localStorageService', function ($scope, $modalInstance, item, $location, localStorageService) {

		$scope.merchant = item;
		//console.log();

		$scope.openAdmin = function () {
			$modalInstance.close();
			$location.path('/admin');
		};

		$scope.logout = function () {
			$modalInstance.close();
			localStorageService.clearAll();
		};

		$scope.close = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}])
	.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, item) {

		$scope.items = item;
		//console.log();

		$scope.selected = {
			item: $scope.items
		};

		$scope.modalOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'Save',
			headerText: $modalInstance.headerText
		};

		$scope.close = function () {
			$modalInstance.close($scope.selected.items);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}])
	.controller('ModalInstanceTermsCtrl', ['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, item) {
		$scope.items = item;
		//console.log();

		$scope.selected = {
			item: $scope.items
		};

		$scope.modalOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'Save',
			headerText: $modalInstance.headerText
		};

		$scope.close = function () {
			$modalInstance.close($scope.selected.items);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}])
	// MainCtrl CONTROLLER
	.controller('MainCtrl', ['$rootScope', '$scope', '$location', 'localStorageService', 'AuthenticationFactory', 'MerchantFactory', 'AdminFactory', 'AlertService', '$modal',
		function($rootScope, $scope, $location, localStorageService, AuthenticationFactory, MerchantFactory, AdminFactory, AlertService, $modal) {

		// clear alerts from previous view
		AlertService.clear();

		var merchant = {};
		merchant.userInfo = localStorageService.get('userInfo');
		// console.log(merchant.userInfo);
		merchant.salesDetails = null;
		merchant.balanceDetails = null;

		// alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		// TOP NAV INFO
		var homeInfo = function(){
			var viewInfo = {
				show: true,
				title: 'HOME',
				instruction: 'Select category'
			};
			return viewInfo;
		};

		var navInfo = function(){
			var param1 = $location.path().split( '/' ).splice(1, 1).toString();
			var param2 = $location.path().split( '/' ).splice(2, 1).toString();
			var param3 = $location.path().split( '/' ).splice(3, 1).toString();
			var param4 = $location.path().split( '/' ).splice(4, 1).toString();

			var viewInfo = {
				show: true,
				title: param1,
				instruction: 'Select' + param1.toUpperCase()
			};

			function posViewInfo(category){

				switch (category) {
					case 'longdistance':
						viewInfo = {
							show: true,
							title: 'Long Distance',
							instruction: (param4 === 'countries') ? 'Select Country' : 'Select Product'
						};
						break;
					case 'international':
						viewInfo = {
							show: true,
							title: 'International Top Up',
							instruction: (param4 === 'countries') ? 'Select Country' : 'Select Product'
						};
						break;
					case 'pinless':
						viewInfo = {
							show: true,
							title: 'Pinless',
							instruction: 'Select Product'
						};
						break;
					case 'wireless':
						viewInfo = {
							show: true,
							title: 'Wireless',
							instruction: (param4 === 'carriers') ? 'Select Carrier' : 'Select Product'
						};
						break;
					case 'promotions':
						viewInfo = {
							show: true,
							title: 'Promotions',
							instruction: 'Select Product'
						};
						break;
					default:
						viewInfo = {
							show: ($location.path() === '/login') ? false : true,
							title: param1,
							instruction: 'Select item'
						};
				}

				// console.log(category);
				return viewInfo;
			}

			switch (param1) {
				case 'pos':
					posViewInfo(param3);
					break;
				case 'sunpass':
					viewInfo = {
						show: true,
						title: param1,
						instruction: 'Select ' + param1.toUpperCase()
					};
					break;
				case 'billpayment':
					viewInfo = {
						show: true,
						title: 'Bill Payment',
						instruction: (param2 === 'categories') ? 'Select Category' : ((param2 === 'category') ? 'Select Biller' : 'Complete the form')
					};
					break;
				case 'others':
					viewInfo = {
						show: true,
						title: param1,
						instruction: 'Select item'
					};
					break;
				case 'directtv':
					viewInfo = {
						show: true,
						title: 'Direct Tv',
						instruction: (param2 === 'categories') ? 'Select Category' : ((param2 === 'category') ? 'Select Product' : 'Complete the form')
					};
					break;
				default:
					viewInfo = {
						show: ($location.path() === '/login') ? false : true,
						title: param1,
						instruction: 'Select item'
					};
			}

			return (viewInfo);
		};

		// show / hide HOME button
		var showHome = function(){
			return ($location.path() === '/' || $location.path() === '/login') ? false : true;
		};
		var showAccount = function(){
			return ($location.path() === '/login') ? false : true;
		};
		var showNav = function(){
			return ($location.path() === '/login') ? false : true;
		};

		var getUserInfo = function(){
			var userInfo = localStorageService.get('userInfo');
			return userInfo;
		};


		// view info
		if ($location.path() === '/'){
			$scope.viewInfo = homeInfo();
		} else {
			$scope.viewInfo = navInfo();
		}


		// GET SALES SUMMARY
		var getSalesSummary = function(){

			var userInfo = getUserInfo();

			MerchantFactory.getSalesSummary(userInfo.MerchantId, userInfo.MerchantPassword).then(
				function(data){
					merchant.salesDetails = data;
					//console.log(data);
				},
				function(error){
					$scope.error = error;
					console.log(error);
				}
			);
		};

		// GET BALANCE DETAILS
		var getBalanceDetails = function(){

			var userInfo = getUserInfo();
			merchant.userInfo = userInfo;
			// console.log(userInfo);

			MerchantFactory.getBalanceDetails(userInfo.MerchantId, userInfo.MerchantPassword).then(
				function(data){
					merchant.balanceDetails = data;
					// getUserInfo();
					$scope.spin = false;
					// console.log(data);
				},
				function(error){
					$scope.error = error;
					console.log(error);
				}
			);
		};

		// var getAppMainLogoUrl = function() {

		// 	var userInfo = getUserInfo();

		// 	AdminFactory.getAppMainLogoUrl(userInfo.MerchantId, userInfo.MerchantPassword).then(
		// 		function(data){
		// 			$scope.logourl =  data.Data;
		// 			localStorageService.set('logourl', data.Data);
		// 		},
		// 		function(error){
		// 			console.log(error);
		// 		}
		// 	);
		// };

		// My Account modal
		// Modal (ui.bootstrap.modal). In Docs (item) pass modal size, here pass the single item object
		$scope.openAccountModal = function() {

			var modalInstance = $modal.open({
				templateUrl: './app/admin/_modal-account-tpl.html',
				controller: 'ModalAccountCtrl',
				size: 'lg',
				windowClass: 'product-modal',
				resolve: {
					item: function() {
						getSalesSummary();
						getBalanceDetails();
						// console.log(merchantData);
						return merchant;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				// $log.info('Modal dismissed at: ' + new Date());
			});
		};


		// interface vars (show/hide) elements
		$scope.showHome = showHome();
		$scope.showAccount = showAccount();
		$scope.showNav = showNav();

		// var DEF = {title: 'Welcome', logo: '', favicon: 'favicon.png'};
		var BS = {title: 'POS', logo: 'http://mobile.blackstonepos.com/logos/pos-logo.png', favicon: 'favicon.png'};
		var FCUSA = {title: 'FCUSA', logo: 'http://mobile.blackstonepos.com/logos/fullCarga.png', favicon: 'favicon-fcusa.png'};

		if (merchant.userInfo && merchant.userInfo.IsFullCarga){
			$scope.comInfo = FCUSA;
			$scope.isFullCarga = true;
		} else {
			$scope.comInfo = BS;
			$scope.isFullCarga = false;
		}


		// update showHome & showAccount & userInfo, to control buttons display
		$scope.$watch(
			function(){
				return $location.path();
			},
			function(newValue, oldValue) {

				if (newValue === oldValue) {
					return;
				}

				$scope.showHome = showHome();
				$scope.showAccount = showAccount();
				$scope.showNav = showNav();
				$scope.userInfo = localStorageService.get('userInfo');
				$scope.isFullCarga = ($scope.userInfo && $scope.userInfo.IsFullCarga === true) ? true : false;
				$scope.comInfo = ($scope.userInfo && $scope.userInfo.IsFullCarga === true) ? FCUSA : BS;
				// console.log($scope.userInfo);

				// set title in navigation from $location.path() #/pos/category/pinless = 0/1/2/3
				if (newValue === '/'){
					$scope.viewInfo = homeInfo();
				} else {
					$scope.viewInfo = navInfo();
				}
				// console.log(newValue);
			}, true );

		// Watch if user is logged in
		$scope.$watch(

				AuthenticationFactory.isLoggedIn,

			function (value, oldValue) {

				if (!value && oldValue) {
					console.log('Disconnect');
					$location.path('/login');
				}

				if (value) {
					console.log('Connect');
				}

			}, true);

	}]);
}());
