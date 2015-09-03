(function () {
	'use strict';

	/* MODAL INSTANCE */
	angular.module('posApp')
	// might ngInject
	.controller('ShowProductCtrl', ['$scope', '$routeParams', '$modal', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions', 'ConfirmationFactory',
		function($scope, $routeParams, $modal, ProdsFactory, AlertService, localStorageService, SharedFunctions, ConfirmationFactory){

		// clear alerts from previous view
		AlertService.clear();

		// get productMainCode by $routeParams
		var productMainCode = $routeParams.id;

		// get userInfo stored on localStorageService
		var userInfo = localStorageService.get('userInfo');

		// get merchant settings (confirm phone)
		$scope.settings = localStorageService.get('settings');
		//console.log($scope.settings);

		// set form visibility
		$scope.showReceipt = false;
		// detect if devise is mobile to set input to readonly
		$scope.isMobile = SharedFunctions.isMobile();

		// product details accordion
		$scope.oneAtATime = true;
		$scope.status = {
			isFirstOpen: !SharedFunctions.isMobile(),
			isFirstDisabled: false
			// open = !$scope.isMobile
		};

		console.log($scope.isMobile);


		function initInputs() {
			if(!$scope.phoneNumber.value) {
				$scope.phoneNumber.value = '';
			}
			if(!$scope.amount.value) {
				$scope.amount.value = '';
			}
			if (!$scope.phoneMatch.value) {
				$scope.phoneMatch.value = '';
			}
		}

		// get product info
		$scope.getProduct = function(){
			ProdsFactory.getProduct(productMainCode).then(
				function(data){
					$scope.item = data;
					$scope.phoneNumber.value = $scope.phoneMatch.value = data.DialCountryCode;
					$scope.hasKeyPad = !data.UseFixedDenominations || data.IsTopUp;
					console.log($scope.item);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getProduct();


		// init inputs values and state
		$scope.phoneNumber = {value: null, isFocused: false};
		$scope.phoneMatch = {value: null, isFocused: false};
		$scope.amount = {value: null, isFocused: false};
		// $scope.item = { UseFixedDenominations: true};


		// Modal (ui.bootstrap.modal). In Docs (item) pass modal size, here pass the single item object
		$scope.open = function(items) {
			var info = {firstItem: $scope.item.Name, secondItem: $scope.item.CountryName, thirdItem: $scope.item.CarrierName};

			// angular.extend(dst, src);
			items = angular.extend(items, info);
			console.log('test merge' + items);

			// console.log(JSON.stringify(items));

			var modalInstance = $modal.open({
				templateUrl: './app/products/_modal-product-tpl.html',
				controller: 'ModalInstanceCtrl',
				size: 'lg',
				windowClass: 'product-modal',
				resolve: {
					item: function() {
						return items;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				// $log.info('Modal dismissed at: ' + new Date());
			});
		};

		// PRODUCT RATES
		// get product rates
		function getProductRates(maincode){
			var myResult = ProdsFactory.getProductRates(maincode).then(
				function(data){
					var info = {
						Name: $scope.item.Name,
						CountryName: $scope.item.CountryName,
						CarrierName: $scope.item.CarrierName
					};

					var itemsMerged = angular.extend(data, info);
					return itemsMerged;
				},
				function(error){
					console.log(error);
				}
			);
			console.log(myResult);
			return myResult;
		}

		// call get product rates and show it into modal window
		$scope.openRates = function (obj){
			var mydata = getProductRates(obj);

			var modalInstance = $modal.open({
				templateUrl: './app/products/_modal-product-tpl.html',
				controller: 'ModalInstanceCtrl',
				size: 'lg',
				windowClass: 'product-modal',
				resolve: {
					item: function() {
						return mydata;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				// $log.info('Modal dismissed at: ' + new Date());
			});
		};

		// ACCESS NUMBERS
		// get product access numbers
		function getProductAccessNumbers(maincode){
			var myResult = ProdsFactory.getProductAccessNumbers(maincode).then(
				function(data){

					var info = {
						Name: $scope.item.Name,
						CountryName: $scope.item.CountryName,
						CarrierName: $scope.item.CarrierName
					};

					return angular.extend(data, info);
				},
				function(error){
					console.log(error);
				}
			);
			// console.log(myResult);
			return myResult;
		}
		// call get product access numbers and show it into modal window
		$scope.openAccessNumbers = function (maincode){

			var mydata = getProductAccessNumbers(maincode);

			// var accessData = data.Data;
			for(var i = 0; i < mydata.length; i++) {
				delete mydata.languageField;
			}

			var modalInstance = $modal.open({
				templateUrl: './app/products/_modal-product-tpl.html',
				controller: 'ModalInstanceCtrl',
				size: 'lg',
				windowClass: 'product-modal',
				resolve: {
					item: function() {
						return mydata;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				// $log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Modal (ui.bootstrap.modal).
		$scope.openTerms = function(items) {

			var modalInstance = $modal.open({
				templateUrl: './app/shared/_modal-product-terms-tpl.html',
				controller: 'ModalInstanceTermsCtrl',
				size: 'lg',
				windowClass: 'product-modal',
				resolve: {
					item: function() {
						return items;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				// $log.info('Modal dismissed at: ' + new Date());
			});
		};

		function setKeyConfirmPhoneNumber(key) {
			console.log(key);
			$scope.phoneMatch.value = $scope.phoneMatch.value + key;
		}

		function setKeyPhoneNumber(key) {
			$scope.phoneNumber.value = $scope.phoneNumber.value + key;
		}

		function setKeyAmount(key) {
			$scope.amount.value = $scope.amount.value + key;
		}

		function setAmount(keynum) {
			console.log(keynum);

			if($scope.amount.isFocused) {
				setKeyAmount(keynum);
			} else if ($scope.phoneNumber.isFocused) {
				setKeyPhoneNumber(keynum);
			} else {
				setKeyConfirmPhoneNumber(keynum);
			}
		}

		function backKeyPhoneNumber() {
			var length = $scope.phoneNumber.value.length;

			var value = $scope.phoneNumber.value;

			$scope.phoneNumber.value = value.substring(0, length - 1);
		}

		function backKeyPhoneMatch() {
			var length = $scope.phoneMatch.value.length;

			var value = $scope.phoneMatch.value;

			console.log('Value:' + value);
			console.log('Length:' + length);

			$scope.phoneMatch.value = value.substring(0, length - 1);
		}

		function backKeyAmount() {
			var length = $scope.amount.value.length;

			var value = $scope.amount.value;

			console.log('Value:' + value);
			console.log('Length:' + length);

			$scope.amount.value = value.substring(0, length - 1);
		}

		$scope.editing = null;
		$scope.editItem = function(item) {
			$scope.editing = item;
			console.log(item);
		};

		$scope.onInputClick = function ($event) {
			$event.target.select();
		};

		$scope.setKey = function(value) {
			initInputs();
			setAmount(value);
		};

		$scope.clearKey = function() {
			if ($scope.phoneNumber.isFocused) {
				$scope.phoneNumber.value = '';
			} else {
				$scope.amount.value = '';
			}
		};



		// function myKeyPress(e){
		// 	initInputs();

		// 	var keynum;

		// 	if (window.event){ // IE
		// 		keynum = e.keyCode;
		// 	} else {
		// 		if(e.which){ // Netscape/Firefox/Opera
		// 			keynum = e.which;
		// 		}
		// 	}
		// 	setAmount(keynum);
		// }


		$scope.backKey = function() {
			initInputs();

			if ($scope.phoneNumber.isFocused) {
				backKeyPhoneNumber();
			} else if ($scope.amount.isFocused) {
				backKeyAmount();
			} else {
				backKeyPhoneMatch();
			}
		};

		$scope.setFocusedInput = function(inputName) {
			if (inputName === 'amount') {
				$scope.phoneNumber.isFocused = false;
				$scope.phoneMatch.isFocused = false;
				$scope.amount.isFocused = true;
			} else if (inputName === 'phoneNumber') {
				$scope.amount.isFocused = false;
				$scope.phoneMatch.isFocused = false;
				$scope.phoneNumber.isFocused = true;
			} else if (inputName === 'phoneMatch') {
				$scope.amount.isFocused = false;
				$scope.phoneNumber.isFocused = false;
				$scope.phoneMatch.isFocused = true;
				console.log('I\'m focusing Phone Match');
			}
		};

		$scope.leaveInputsFocus = function() {
			$scope.amount.isFocused = false;
			$scope.phoneNumber.isFocused = false;
			$scope.phoneMatch.isFocused = false;
		};

		$scope.setAmount = function (value) {
			console.log(value);

			if ($scope.amount === value) {
				$scope.amount = undefined;
			} else {
				$scope.amount = value;
			}
		};

		// FORM SUBMIT HANDLER
		$scope.submit = function(form) {

			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				AlertService.clear();
				//AlertService.add('error', 'Check errors below (in red color)');
				return;

			} else {

				$scope.isBlocked = true;

				// remove any previous alert
				AlertService.clear();

				var order = {
						MerchantId: userInfo.MerchantId,
						MerchantPassword: userInfo.MerchantPassword, // string
						OperatorName: userInfo.userName, // string
						ProfileId: userInfo.profileId, // int
						TerminalId: userInfo.terminalId, // int
						Amount: $scope.amount.value,
						PhoneNumber: $scope.phoneNumber.value,
						ProductMainCode: $scope.item.Code,
						CountryCode: $scope.item.DialCountryCode
				};

				// console.log(order);
				// console.log(userInfo);

				ProdsFactory.doBlackstonePosOperation(order).then(
					function(response){

							//console.log(response);

							if(response.Status === 200 || response.Status === 203) {

								var orderResultText = response.Status === 200 ? 'Order processed!' : 'Order placed. Pending for further Execution!';

								$scope.showReceipt = true;

								console.log($scope.settings);

								$scope.submitted = false;
								AlertService.add('success', orderResultText);

								$scope.receipt = response.Data;

							//console.log('from transaction:' + receipt);

						} else {
							AlertService.add('error', response.ErrorMessage);
							// Trigger validation flag.
							$scope.isBlocked = false;
						}


					},
					function(error){
						$scope.isBlocked = false;
						AlertService.add('error', 'Invalid Credentials');
						console.log(error);
					}
				);

				$scope.showReceipt = false;
				// AlertService.add('error', $scope.receipt.ErrorMessage);
			}
		};

		// PRINT RECEIPT
		$scope.printInfo = function() {
			window.print();
		};

		// SEND RECEIPT AS SMS
		$scope.sendSms = function(form) {

			// Trigger validation flag.
			$scope.submittedSms = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {

				AlertService.clear();
				AlertService.add('error', 'Check form errors');
				return false;

			} else {

				// remove any previous alert
				AlertService.clear();

				var receipt = $scope.receipt;
				var phone = $scope.phoneToSend;

				ConfirmationFactory.sendConfirmationSms(receipt, phone).then(
					function(response){

						AlertService.clear();
						$scope.submittedSms = false;

						if (response.Status === 200){
							AlertService.add('success', 'The Receipt has been sent as sms successfully!');
						} else {
							AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
						}
						console.log(response);
					},
					function(response){
						AlertService.add('error', response.ErrorMessage);
						console.log(response);
					}
				);
			}
		};

		// SEND RECEIPT AS EMAIL
		$scope.sendEmail = function(form) {

			// Trigger validation flag.
			$scope.submittedEmail = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {

				AlertService.clear();
				AlertService.add('error', 'Check form errors');
				return false;

			} else {

				// remove any previous alert
				AlertService.clear();

				var receipt = $scope.receipt;
				var email = $scope.emailToSend;

				ConfirmationFactory.sendConfirmationEmail(receipt, email).then(
					function(response){

						AlertService.clear();
						$scope.submittedEmail = false;

						if (response.Status === 200){
							AlertService.add('success', 'The Receipt has been sent as email successfully!');
						} else {
							AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
						}
						console.log(response);
					},
					function(response){
						AlertService.add('error', response.ErrorMessage);
						console.log(response);
					}
				);
			}
		};

	}]);
}());

