/**
 * ShowProductCtrl Controller
 */
app.controller('ShowProductCtrl', ['$scope', '$routeParams', '$modal', 'ProdsFactory', 'AlertService', 'localStorageService',
	function($scope, $routeParams, $modal, ProdsFactory, AlertService, localStorageService){

	// get productMainCode by $routeParams
	var productMainCode = $routeParams.id;

	// get userInfo stored on localStorageService
	var userInfo = localStorageService.get('userInfo');

	// set form visibility
	$scope.showReceipt = false;

	$scope.phoneNumber = {value: null, isFocused: false};
	$scope.amount = { value: null, isFocused: false};

	function initInputs() {
		if(!$scope.phoneNumber.value) {
			$scope.phoneNumber.value = '';
		}
		if(!$scope.amount.value) {
			$scope.amount.value = '';
		}
	};

	// method to pass an object via service from one view to another (deprecated, further deletion)
	// $scope.item = localStorageService.get('selection');

	$scope.getProduct = function(){
		ProdsFactory.getProduct(userInfo.merchantId, productMainCode).then(
			function(data){
				$scope.item = data;
				 console.log(data);
			},
			function(error){
				console.log(error);
			}
		);
	};
	$scope.getProduct();

	// complete progress bar
	ngProgress.complete();

	// Modal (ui.bootstrap.modal). In Docs (item) pass modal size, here pass the single item object
	$scope.open = function (items){
		var modalInstance = $modal.open({
			templateUrl: './app/products/_modal-product-tpl.html',
			controller: ModalInstanceCtrl,
			size: 'lg',
			windowClass: 'modal',
			resolve: {
				item: function () {
					return items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			// $log.info('Modal dismissed at: ' + new Date());
		});
	}

	$scope.editing = null;
	$scope.editItem = function(item) {
		$scope.editing = item;
		console.log(item);
	};

	$scope.onInputClick = function ($event) {
		$event.target.select();
	};

	$scope.printInfo = function() {
		window.print();
	};

	var inputModel = '';

	$scope.setKey = function(value){
		initInputs();

		if($scope.amount.isFocused) {
			setKeyAmount(value);
		} else {
			setKeyPhoneNumber(value);
		}
	}


	$scope.clearKey = function(){
		if ($scope.phoneNumber.isFocused) {
			$scope.phoneNumber.value='';
		} else {
			$scope.amount.value='';
		}
	}

	function backKeyPhoneNumber() {
		var length = $scope.phoneNumber.value.length;
		var value = $scope.phoneNumber.value;

		console.log('Value:' + value);
		console.log('Length:' + length);

		$scope.phoneNumber.value = value.substring(0, length-1);
	}

	function backKeyAmount() {
		var length = $scope.amount.value.length;

		var value = $scope.amount.value;

		console.log('Value:' + value);
		console.log('Length:' + length);

		$scope.amount.value = value.substring(0, length-1);
	}

	function setKeyPhoneNumber(key) {
		$scope.phoneNumber.value = $scope.phoneNumber.value + key;
	}

	function setKeyAmount(key) {
		$scope.amount.value = $scope.amount.value  + key;
	}

	function myKeyPress(e){
		initInputs();
		var keynum;

		if (window.event){ // IE
			keynum = e.keyCode;
		} else {
			if(e.which){ // Netscape/Firefox/Opera
				keynum = e.which;
			}
		}
		if ($scope.amount.isFocused) {
			setKeyAmount(keynum);
		} else {
			setKeyPhoneNumber(keynum);
		}
	}

	$scope.backKey = function(){
		initInputs();

		if($scope.phoneNumber.isFocused) {
			backKeyPhoneNumber();
		} else {
			backKeyAmount();
		}
	}

	$scope.setFocusedInput = function(inputName){
		if (inputName == 'amount'){
			$scope.phoneNumber.isFocused = false;
			$scope.amount.isFocused = true;
		} else if (inputName == 'phoneNumber'){
			$scope.amount.isFocused = false;
			$scope.phoneNumber.isFocused = true;
		}
	}

	$scope.leaveInputsFocus = function(){
		$scope.amount.isFocused = false;
		$scope.phoneNumber.isFocused = false;
	}

	$scope.setAmount = function (value) {
		console.log(value);

		if ($scope.amount === value) {
			$scope.amount = undefined;
		} else {
			$scope.amount = value;
		}
	};

	// Form submit handler.
	$scope.submit = function(form) {

		// Trigger validation flag.
		$scope.submitted = true;

		// If form is invalid, return and let AngularJS show validation errors.
		if (form.$invalid) {
			AlertService.clear();
			//AlertService.add('error', 'Check errors below (in red color)');
			return;

		} else {

			// start progress bar
			ngProgress.start();

			$scope.isBlocked = true;

			// remove any previous alert
			console.log(userInfo);

			var order = {
				merchantId: userInfo.merchantId,
				password: userInfo.password, // string
				operatorName: userInfo.userName, // string
				profileId: userInfo.profileId, // int
				terminalId: userInfo.terminalId, // int
				productMainCode: userInfo.productMainCode,
				amount: $scope.amount.value,
				countryCode: '53',
				PhoneNumber: $scope.phoneNumber.value,
				ProductMainCode: $scope.item.Code
			}

			console.log(order);

			ProdsFactory.doBlackstonePosOperation(order).then(
				function(response){

					console.log(response);

					if(response.Status == 200 || response.Status == 203){

					$scope.showReceipt = true;

					var orderResultText = response.Status == 200 ? 'Order processed!' : 'Order placed. Pending for further Execution!';

					AlertService.add('success', orderResultText);

					$scope.receipt = response.Data;

					console.log('from transaction:' + receipt);

					// complete progress bar
					ngProgress.complete();

					}else{
						AlertService.add('error', response.ErrorMessage);

						// complete progress bar
						ngProgress.complete();
					}


				},
				function(error){
					$scope.isBlocked = false;
					AlertService.add('error', 'Invalid Credentials');

					// complete progress bar
					ngProgress.complete();

					console.log(error);
				}
			)

			$scope.showReceipt = false;

			// AlertService.add('error', $scope.receipt.ErrorMessage);
		}
	};
}]);
