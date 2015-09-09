(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// Return most sold products and best country rates.
	.controller('HomeCtrl', ['$scope', '$location', 'AlertService', 'ProdsFactory', 'localStorageService', 'ExternalFactory',
	function($scope, $location, AlertService, ProdsFactory, localStorageService, ExternalFactory){

		// clear alert messages from previous view
		AlertService.clear();

		var userInfo = localStorageService.get('userInfo');

	    console.log(userInfo);

		// $scope.$parent.isHome = ($location.path() === '/home') ? true : false;

		$scope.getActivationShopUrl = function () {
			ExternalFactory.getActivationShopUrl(userInfo.merchantId, userInfo.password).then(
				function(data){

					var url = data;
					$scope.activationShopUrl = url;
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getActivationShopUrl();


		$scope.getVonageUrl = function(){
			ExternalFactory.getVonageUrl(userInfo.merchantId, userInfo.password).then(
				function(data){

					var url = data;
					// window.open(url);
					//window.location = url;
					$scope.vonageUrl = url;
				},
				function(error){
					console.log(error);
				}
			);
		};
		//$scope.getVonageUrl();

		var homeItems = [
			{categoryName: 'billpayment', title: 'Bill Payment', url: '#/billpayment/categories', position: 1, icon: ''},
			{categoryName: 'international', title: 'Int\'l Top Up', url: '#/pos/category/international/countries', position: 2, icon: ''},
			{categoryName: 'pinless', title: 'Pinless Recharge', url: '#/pos/category/pinless', position: 4, icon: ''},
			{categoryName: 'longdistance', title: 'Long Distance', url: '#/pos/category/longdistance/countries', position: 3, icon: ''},
			{categoryName: 'wireless', title: 'Wireless Recharge', url: '#/pos/category/wireless/carriers', position: 6, icon: ''},
			{categoryName: 'sunPass', title: 'SunPass', url: '#/sunpass', position: 5, icon: ''},
			{categoryName: 'promotions', title: 'Specials', url: '#/pos/category/promotions', position: 8, icon: 'star'},
			{categoryName: 'directtv', title: 'Direct TV', url: '#/directtv/categories', position: 9, icon: ''}
			// {categoryName: 'MySmsCuba', title: 'MySmsCuba', url: '#/mysmscuba', position: 10, icon: ''}
			// {categoryName: 'activationShop', title: 'Activation Shop', url: '#/activationshop', position: 11, icon: ''}
			// {categoryName: 'Others', url: '#/pos/others', position: 12},
		];


		$scope.getMainProducts = function(itemsCollection) {

			$scope.items = [];

			var mainProducts = [];

			ProdsFactory.getPosMainProducts(userInfo.MerchantId, userInfo.MerchantPassword).then(
				function (data) {
					mainProducts = data;

					// console.log('main products: ' + mainProducts);
					// console.log(data);

					for (var i = 0; i < itemsCollection.length; i++) {
						if (mainProducts.indexOf(itemsCollection[i].categoryName) >= 0) {
							$scope.items.push(itemsCollection[i]);
						}
					}
					//$scope.items.push(itemsCollection[5]);
				},
				function (error) {
					console.log(error);
				}
			);
		};

		$scope.getMainProducts(homeItems);


		// Add message to Alert
		$scope.addAlert = function() {
			// user triggered event
				AlertService.add('success', 'Welcome!' + userInfo.Name + 'This is a success message!');
		};

		// select tag to filter products
		$scope.filterables = [
			{name: 'Rate', value: 'rate'},
			{name: 'Country', value: 'countryName'},
			{name: 'Category', value: 'category'}
		];

		// $scope.items = $scope.filterables[0].value;

		$scope.selectProduct = function(item){
			localStorageService.set('selection', item);
		};

	}]);
}());
