
app.controller('AdminCtrl', ['$scope', 'localStorageService', 'MerchantFactory','CashierFactory','OrderFactory','SettingsFactory', 'AuthenticationFactory',
	function($scope, localStorageService, MerchantFactory, CashierFactory, OrderFactory, SettingsFactory, AuthenticationFactory){

	// var userInfo = localStorageService.get('userInfo');
	var userInfo = localStorageService.get('userInfo');

		 $scope.cashier ={
		 name: null,
		 password: null
		};

	$scope.merchant = {
		salesDetails: null,
		balanceDetails: null
	};


	$scope.getSalesSummary = function(){
		MerchantFactory.getSalesSummary(userInfo.merchantId, userInfo.password).then(
			function(data){
				$scope.merchant.salesDetails = data;
				 //console.log(data);
			},
			function(error){
				console.log(error);
			}
		);
	};

	$scope.getBalanceDetails = function(){
		MerchantFactory.getBalanceDetails(userInfo.merchantId, userInfo.password).then(
			function(data){
				$scope.merchant.balanceDetails = data;
				// console.log(data);
			},
			function(error){
				console.log(error);
			}
		);
	};

		$scope.getCashiers = function(){
		CashierFactory.getCashiers(userInfo.merchantId).then(
			function(data){
				$scope.cashiers = data;
				 // console.log(data);
			},
			function(error){
				console.log(error);
			}
		);
	};

	$scope.getOrders = function(){
		OrderFactory.getOrders(userInfo.merchantId).then(
			function(data){
				$scope.orders = data;
			},
			function(error){
				console.log(error);
			}
		);
	};

	$scope.getSettings = function(){
		SettingsFactory.getSettings(userInfo.merchantId).then(
			function(data){
				$scope.settings = data;
				 console.log(data);
			},
			function(error){
				console.log(error);
			}
		);
	};

	$scope.updateSettings = function(){
		SettingsFactory.updateSettings(userInfo.merchantId, $scope.settings.SmallReceipt, $scope.settings.Tax, $scope.settings.ConfirmPhone).then(
			function(data){
				$scope.updateSettingsResponse = data;
				 console.log(data);
			},
			function(error){
				console.log(error);
			}
		);
	};


	$scope.deleteCashier = function(cashierId) {
		if(confirm("Are you sure you want to delete this cashier?")) {
			CashierFactory.deleteCashier(cashierId)
			.then(
				function(data){
					var deleteCashierResponse = data;
					$scope.getCashiers();
				},
				function(error){
					console.log(error);
				}
			);
		}
	};

	$scope.saveCashier = function() {
		CashierFactory.saveCashier(userInfo.merchantId, $scope.cashier.name, $scope.cashier.password).then(
			function(data){

					var addingCashierResponse = data;
					 console.log(data);
					 $scope.getCashiers();
					 console.log($scope.newCashier);
			},
			function(error){
				console.log(error);
			}
			);
	 };

	$scope.logout = function() {
		localStorageService.remove('userInfo');

		// TODO: check logout API method
		AuthenticationFactory.logout(userInfo.merchantId).then(
			function(data){
				localStorageService.remove('userInfo');
				console.log(localStorageService.get('userInfo'));
			},
			function(error){
				console.log(error);
			}
		);
	};

	if (userInfo && userInfo.userName != null) {
		console.log(userInfo.username);
		$scope.getSalesSummary();
		$scope.getBalanceDetails();
		$scope.getCashiers();
		$scope.getOrders();
		$scope.getSettings();
	}
}]);
