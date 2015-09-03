/**
 * HomeCtrl Controller
 * Return most sold products and best country rates.
 */
app.controller('HomeCtrl', ['$scope', '$location', 'auth', 'AlertService', 'ProdsFactory', 'ExternalFactory', 'localStorageService',
	function($scope, $location, auth, AlertService, ProdsFactory, ExternalFactory, localStorageService){

	$scope.userInfo = auth;

	var userInfo = localStorageService.get('userInfo');

	$scope.$parent.isHome = ($location.path() === '/') ? true : false;

	var amount = 5;
	var categories = ['international', 'pinless', 'longdistance', 'wireless'];


	$scope.getActivationShopUrl = function(){
		ExternalFactory.getActivationShopUrl(userInfo.merchantId, userInfo.password).then(
			function(data){

				var url = data;

				window.open(url);
				//window.location = url;
			},
			function(error){
				console.log(error);
			}
		);
	};

	$scope.items = [
		{categoryName: 'Bill Payment', url: '#/pos/billpayment', position: 1, icon: ''},
		{categoryName: 'International Topup', url: '#/pos/category/international', position: 2, icon: ''},
		{categoryName: 'Pinless Recharge', url: '#/pos/category/pinless', position: 4, icon: ''},
		{categoryName: 'Long Distance', url: '#/pos/category/longdistance', position: 3, icon: ''},
		{categoryName: 'Wireless Recharge', url: '#/pos/category/wireless', position: 6, icon: ''},
		// {categoryName: 'SunPass', url: '#/pos/sunpass', position: 5, icon: ''},
		{categoryName: 'Specials', url: '#/pos/promotions', position: 8, icon: 'star'},
		// {categoryName: 'Others', url: activationUrl, position: 9},
	];

	// Add message to Alert
	AlertService.add('info', 'Select a product to begin!');

	$scope.addAlert = function() {
		// user triggered event
		AlertService.add('success', 'Welcome!'+ userName + 'This is a success message!');
	};


	$scope.getMostSoldProducts = function(){
		ProdsFactory.getMostSoldProducts(userInfo.merchantId, categories, amount).then(
			function(data){
				$scope.items = data;
			},
			function(error){
				$scope.items = [];
				$scope.error = error;
				console.log(error);
			}
		);
	};
	// $scope.getMostSoldProducts();

	ngProgress.complete();

	// select tag to filter products
	$scope.filterables = [
		{ name: 'Rate', value: 'rate' },
		{ name: 'Country', value: 'countryName' },
		{ name: 'Category', value: 'category' }
	];

	// $scope.items = $scope.filterables[0].value;

	$scope.selectProduct = function(item){
		localStorageService.set('selection', item);
	};
}]);
