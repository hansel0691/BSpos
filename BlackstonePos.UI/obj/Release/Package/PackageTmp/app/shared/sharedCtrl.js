/**
 * MainCtrl Controller
 * description: nav bars, side bars, etc
 */
app.controller('MainCtrl', ['$rootScope', '$scope', '$rootScope', '$location', 'localStorageService', 'snapRemote', 'AuthenticationFactory','ExternalFactory',
	function($rootScope, $scope, $rootScope, $location, localStorageService, snapRemote, AuthenticationFactory, ExternalFactory) {

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};


	// open drawer by snap-id
	$scope.openSide = function(snapId) {
		snapRemote.getSnapper(snapId).then(function(snapper) {
			snapper.open('right');
			console.log(snapId);
		});
	};

	// close side drawer by snap-id
	$scope.closeSide = function(snapId) {
		snapRemote.close(snapId);
		console.log(snapId);
	};

	// drawer confi options
	$scope.opts = {
		maxPosition: 738,
		minPosition: -738,
		addBodyClasses: true,
	};

	// set drawer with
	localStorageService.set('drawerWidth', 286);
	$scope.drawerWidth = localStorageService.get('drawerWidth');

	var userInfo = localStorageService.get('userInfo');

	if (userInfo === null || userInfo.merchantID === null){
		userInfo = [
			{ 'merchantId' : 834, 'Name' : 'Guess' }
		]
	}

	$scope.userInfo = userInfo;
	// console.log(userInfo);

	$scope.$watch('userInfo', function(newValue, oldValue) {
		if (newValue === oldValue) { return; }
		// console.log(newValue);
	}, true);

	$scope.isHome = ($location.path() == '/') ? true : false;
	$scope.showHome = ($location.path() == '/login' || $location.path() == '/') ? false : true;
	if ($scope.isHome){
		$scope.title = 'HOME';
		$scope.type = 'CATEGORY';
	}

	// update isHome & showHome to control buttons display
	$scope.$watch(
		function(){
			return $location.path()
		},
		function(newValue, oldValue) {
			if (newValue === oldValue) { return; }

			console.log(newValue);
			$scope.isHome =  (newValue == '/') ? true: false;
			$scope.showHome = (newValue == '/login' || newValue == '/') ? false : true;

			// set title in navigation from $location.path() #/pos/category/pinless = 0/1/2/3
			if ($scope.isHome){
				$scope.title = 'HOME';
			} else {
				$scope.title = $location.path().split( '/' ).splice(3, 1).toString();
			}

			$scope.type = ($location.path().split( '/' ).splice(4, 1).toString() != '' ) ? $location.path().split( '/' ).splice(4, 1).toString().toUpperCase() : 'PRODUCT';
		}, true
	);


	// NAVIGATION
	//
	$scope.isCurrentPath = function(path){
		var currentRoute = $location.path();
		return path === currentRoute ? 'disabled' : '';
	}


	$scope.menuClass = function (page) {
		// var currentRoute = $location.path().substring(1);
		var segments = $location.path().split( '/' );
		var cat = segments[3];
		var id = segments[4];
		return page === cat ? 'active' : cat;
	};

	$scope.logout = function() {
		localStorageService.remove('userInfo');
		snapRemote.close('');

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
}]);


/**
 * MerchantCtrl Controller
 * Return merchant account details (day credit limit, weekly credit limit, sales, etc... )
 */
app.controller('MerchantCtrl', ['$scope', 'localStorageService', 'MerchantFactory','CashierFactory','OrderFactory','SettingsFactory','AchPaymentFactory',
	function($scope, localStorageService, MerchantFactory, CashierFactory, OrderFactory, SettingsFactory, AchPaymentFactory){

	// var userInfo = localStorageService.get('userInfo');
	var userInfo = $scope.$parent.userInfo;
	// console.log(userInfo);

	$scope.merchant = {
		salesDetails: null,
		balanceDetails: null
	};

	$scope.updateMerchant = function() {
		$scope.spin = true;
		$scope.getSalesSummary();
		$scope.getBalanceDetails();
	}

	$scope.getSalesSummary = function(){
		MerchantFactory.getSalesSummary(userInfo.merchantId, userInfo.password).then(
			function(data){
				$scope.merchant.salesDetails = data;
				 //console.log(data);
			},
			function(error){
				$scope.error = error;
				console.log(error);
			}
		);
	};

	$scope.getBalanceDetails = function(){
		MerchantFactory.getBalanceDetails(userInfo.merchantId, userInfo.password).then(
			function(data){
				$scope.merchant.balanceDetails = data;
				$scope.spin = false;
				// console.log(data);
			},
			function(error){
				$scope.error = error;
				console.log(error);
			}
		);
	};



	$scope.$parent.$watch('userInfo', function(newValue, oldValue) {
		if (newValue === oldValue) { return; }
		userInfo = newValue;
		$scope.getSalesSummary();
		$scope.getBalanceDetails();
		// console.log(newValue);
	}, true);

	// $scope.getSalesSummary();
	// $scope.getBalanceDetails();

	if ($scope.userInfo) {
		// console.log(userInfo);
		$scope.getSalesSummary();
		$scope.getBalanceDetails();
	}
}]);



/**
 * AdminCtrl Controller
 * Return merchant account details (day credit limit, weekly credit limit, sales, etc... )
 */
app.controller('AdminCtrl', ['$scope', 'AlertService', 'localStorageService', 'AdminFactory', 'CashierFactory','OrderFactory','SettingsFactory','AuthenticationFactory', 'snapRemote',
	function($scope, AlertService, localStorageService, AdminFactory, CashierFactory, OrderFactory, SettingsFactory, AuthenticationFactory, snapRemote){

	// var userInfo = localStorageService.get('userInfo');
	var userInfo = $scope.$parent.userInfo;

	$scope.userInfo = userInfo;

	$scope.settingsAlerts = [];

	$scope.adminLoginAlerts = [];

		initPaymentsScope();
		initCashiersScope();
		initOverSession();


	// PAYMENTS

	$scope.closePaymentAlerts = function(){
		$scope.paymentAlerts = [];
	 }
	$scope.setSelectedPayment = function() {
		 copySelectedAchPaymentObj(this.ach);
	 };
	function initPaymentsScope() {
		 $scope.payment = {
		Id: 0,
		AccountNumber: null,
		RoutingNumber: null,
		TypeChecking: true,
		SaveAccount: false,
		MerchantId: userInfo.merchantId,
		Amount: 0
	 }

	 $scope.paymentAlerts = [];
	 }

	function copySelectedAchPaymentObj(selectedAch) {
			 $scope.payment.Id = selectedAch.Id;
			 $scope.payment.AccountNumber = selectedAch.AccountNumber;
			 $scope.payment.RoutingNumber = selectedAch.RoutingNumber;
			 $scope.payment.TypeChecking = selectedAch.TypeChecking;
			 $scope.payment.SaveAccount = selectedAch.SaveAccount;
	 };

	// get saved payments method
	$scope.getSavedAchPayments = function(){
		AdminFactory.getSavedAchPayments(userInfo.merchantId).then(
			function(data){
				$scope.achs = data;

				if(data.length > 0) {
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
				console.log(data);
				var newAlert = AlertService.getAlertInstance(data);
				console.log(newAlert);
				$scope.paymentAlerts.push(newAlert);
				$scope.getSavedAchPayments();
			},
			function(error){
				console.log(error);
			}
		);
	};


	// CACHIERS
	// init
	function initCashiersScope() {
		$scope.cashierAlerts = [];
		$scope.cashier ={
			id: null,
			name: null,
			password: null
		};
		$scope.editcashier ={
			id: null,
			name: null,
			password: null
		};
	}
	// close side drawer by snap-id
	$scope.closeAdminSection = function(snapId) {
		snapRemote.getSnapper(snapId)
		.then(
			function(snapper) {
				snapper.close();
			}
		);
		$scope.adminLogged = $scope.userInfo.isMerchant;
	};
	// close cashier alerts
	$scope.closeCashierAlerts = function() {
		$scope.cashierAlerts = [];
	}
	// close admin alerts
	$scope.closeAdminLoginAlerts = function()
	{
		$scope.adminLoginAlerts = [];
	};
	// select
	$scope.setSelectedCashier = function(){
		copySelectedCashierObj(this.cashier);
		$scope.editMode = true;
		// $scope.selected = item;
	}
	// get
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
	// delete
	$scope.deleteCashier = function(cashierId) {
		if(confirm("Are you sure you want to delete this cashier?")) {
			CashierFactory.deleteCashier(cashierId)
			.then(
				function(data){
					var deleteCashierResponse = data;
					var newAlert = AlertService.getAlertInstance(data);
					$scope.cashierAlerts.push(newAlert);
					var newAlert = AlertService.getAlertInstance(data);
					$scope.cashierAlerts.push(newAlert);
					$scope.getCashiers();
				},
				function(error){
					console.log(error);
				}
			);
		}
	};
	// save
	$scope.saveCashier = function() {
		CashierFactory.saveCashier(userInfo.merchantId, $scope.cashier.name, $scope.cashier.password)
		.then(
			function(data){
				var newAlert = AlertService.getAlertInstance(data);
				$scope.cashierAlerts= [newAlert]
				$scope.getCashiers();
			},
			function(error){
				console.log(error);
			}
		);
	};
	// update
	$scope.updateCashier = function() {
		CashierFactory.editCashier(userInfo.merchantId, $scope.editcashier.id, $scope.editcashier.name, $scope.editcashier.password)
		.then(
			function(data){
				var newAlert = AlertService.getAlertInstance(data);
				$scope.cashierAlerts= [newAlert];
				$scope.getCashiers();
			},
			function(error){
				console.log(error);
			}
		);
	};
	function copySelectedCashierObj(selectedCashier) {
		$scope.editcashier.id = selectedCashier.Id;
		$scope.editcashier.name = selectedCashier.Name;
		$scope.editcashier.password = selectedCashier.Password;
	};


	// ORDERS
	// get orders
	$scope.getOrders = function(){
		OrderFactory.getOrders(userInfo.merchantId).then(
			function(data){
				$scope.orders = data;
				// console.log(data);
			},
			function(error){
				console.log(error);
			}
		);
	};


	// SETTINGS
	// get settings
	$scope.getSettings = function(){
		SettingsFactory.getSettings(userInfo.merchantId).then(
			function(data){
				$scope.settings = data;
				// console.log(data);
			},
			function(error){
				console.log(error);
			}
		);
	};
	// update
	$scope.updateSettings = function(){
		SettingsFactory.updateSettings(userInfo.merchantId, $scope.settings.SmallReceipt, $scope.settings.Tax, $scope.settings.ConfirmPhone)
		.then(
			function(data){
				$scope.updateSettingsResponse = data;
				var newAlert = AlertService.getAlertInstance(data);
				$scope.settingsAlerts.push(newAlert);
			},
			function(error){
				console.log(error);
			}
		);
	};

	$scope.closeSettingsAlerts = function() {
		$scope.settingsAlerts = [];
	};

	$scope.loginOverSesion = function(password) {

		var merchantId = $scope.userInfo;
		// console.log(merchantId);

		AuthenticationFactory.login(merchantId, password)
		.then(
			function(data){
				// console.log(data);

				if(data.Status == 200) {
					$scope.adminLogged = data.UserInfo.isMerchant;
				} else {
					var newAlert = {type:'error', msg: 'Invalid Admin Credentials'};
					$scope.adminLoginAlerts=[newAlert];
					console.log($scope.adminLoginAlerts);
				}
			},
			function(error){
				console.log(error);
				var newAlert = {type:'error', msg: 'Invalid Admin Credentials'}
				$scope.adminLoginAlerts.push(newAlert);
			}
		);
	};

	function initOverSession() {
		var adminLogged = $scope.userInfo.isMerchant;
		localStorageService.set('adminLogged', adminLogged);
		$scope.adminLogged = adminLogged;
		console.log(adminLogged);
	}

	$scope.$parent.$watch('userInfo', function(newValue, oldValue) {
		if (newValue === oldValue) { return; }
		userInfo = newValue;
		// $scope.getSalesSummary();
		// $scope.getBalanceDetails();
		//$scope.getMerchants();
		// console.log(newValue);
	}, true);

	$scope.getCashiers();
	$scope.getOrders();
	$scope.getSettings();
	$scope.getSavedAchPayments();

	if ($scope.userInfo && $scope.userInfo.Name != null) {
		// console.log(userInfo);
		$scope.getCashiers();
		$scope.getOrders();
		$scope.getSettings();
		$scope.getSavedAchPayments();
	}

	// Form submit handler.
	$scope.submit = function(form) {

		// Trigger validation flag.
		$scope.submitted = true;

		// If form is invalid, return and let AngularJS show validation errors.
		if (form.$invalid) {
			// AlertService.clear();
			// AlertService.add('error', 'Check errors below');
			return;
		}

		if (form.$valid) {
			// remove any previous alert
			AlertService.clear();

			// add founds to account
			AdminFactory.addAchFunds($scope.Id, $scope.AccountNumber, $scope.RoutingNumber, $scope.MerchantId, $scope.Amount, $scope.SaveAccount, $scope.TypeChecking)
			.then(
				function(response){
					// $scope.achs = response;
					AlertService.add('success', response);
					// console.log(response);
				},
				function(error){
					console.log(error);
					AlertService.add('error', error);
				}
			);
		}
	};
}]);


/**
 * MODAL INSTANCE
 */
// Please note that $modalInstance represents a modal window (instance) dependency.
var ModalInstanceCtrl = function ($scope, $modalInstance, item) {
	$scope.items = item;
	console.log();

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
};
