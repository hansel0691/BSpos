(function () {
	'use strict';
	angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('ShowBillPaymentCtrl', ['$scope', '$routeParams', 'BillPaymentFactory', 'Flash',
		function($scope, $routeParams, BillPaymentFactory, Flash){

		// clear messages from previous view
		Flash.dismiss();

		$scope.isMostPopular = false;
		$scope.showAcronymFilter = false;
		$scope.useAcronymFilter = false;
		$scope.useConfig = false;
		$scope.numLimit = 25;

		var biller = $routeParams.biller;

		// set form visibility
		$scope.showPaymentOptions = true;
		$scope.showPaymentDetails = false;
		$scope.hasKeyPad = true;
		$scope.showKeypad = true;
		$scope.showAdditionalDataForm = false;
		$scope.showReceipt = false;
		$scope.isDisableInputs = false;

		// init params
		$scope.accountNumber = {value: null, isFocused: false};
		$scope.accountMatch = {value: null, isFocused: false};
		$scope.amount = {value: null, isFocused: false};
		$scope.paymentType = {value: null};

		$scope.date = new Date();

		function initInputs() {
			if(!$scope.accountNumber.value) {
				$scope.accountNumber.value = '';
			}
			if (!$scope.accountMatch.value) {
				$scope.accountMatch.value = '';
			}
			if(!$scope.amount.value) {
				$scope.amount.value = '';
			}
		}

		// undo function from keypad for account value
		function backKeyAccountNumber() {
			var length = $scope.accountNumber.value.length;
			var value = $scope.accountNumber.value;
			$scope.accountNumber.value = value.substring(0, length - 1);
		}

		// undo function from keypad for confirm account value
		function backKeyAccountMatch() {
			var length = $scope.accountMatch.value.length;
			var value = $scope.accountMatch.value;
			console.log('Value:' + value);
			console.log('Length:' + length);
			$scope.accountMatch.value = value.substring(0, length - 1);
		}

		// undo function from keypad for amount value
		function backKeyAmount() {
			var length = $scope.amount.value.length;
			var value = $scope.amount.value;
			console.log('Value:' + value);
			console.log('Length:' + length);
			$scope.amount.value = value.substring(0, length - 1);
		}

		// set value for account input
		function setKeyAccountNumber(key) {
			$scope.accountNumber.value = $scope.accountNumber.value + key;
		}

		// set value for onfirm account input
		function setKeyConfirmAccountNumber(key) {
			console.log(key);
			$scope.accountMatch.value = $scope.accountMatch.value + key;
		}

		// set value for amount input
		function setKeyAmount(key) {
			$scope.amount.value = $scope.amount.value + key;
		}
		//
		function setAmount(keynum) {
			console.log(keynum);
			if($scope.amount.isFocused) {
				setKeyAmount(keynum);
			} else if ($scope.accountNumber.isFocused) {
				setKeyAccountNumber(keynum);
			} else {
				setKeyConfirmAccountNumber(keynum);
			}
		}

		//
		// function myKeyPress(e){
		// 	initInputs();
		// 	var keynum;

		// 	if (window.event){ // IE
		// 		keynum = e.keyCode;
		// 	} else {
		// 		if (e.which){ // Netscape/Firefox/Opera
		// 			keynum = e.which;
		// 		}
		// 	}
		// 	setAmount(keynum);
		// }

		$scope.editing = null;
		$scope.editItem = function(item) {
			$scope.editing = item;
			console.log(item);
		};

		$scope.onInputClick = function ($event) {
			$event.target.select();
		};

		// set input value from keypad
		$scope.setKey = function(value) {
			initInputs();
			setAmount(value);
		};
		// clear input value from keypad
		$scope.clearKey = function() {
			if ($scope.accountNumber.isFocused) {
				$scope.accountNumber.value = '';
			} else {
				$scope.amount.value = '';
			}
		};

		//
		$scope.backKey = function() {
			initInputs();

			if ($scope.accountNumber.isFocused) {
				backKeyAccountNumber();
			} else if ($scope.amount.isFocused) {
				backKeyAmount();
			} else {
				backKeyAccountMatch();
			}
		};

		//
		$scope.setFocusedInput = function(inputName) {
			if (inputName === 'amount') {
				$scope.accountNumber.isFocused = false;
				$scope.accountMatch.isFocused = false;
				$scope.amount.isFocused = true;
				console.log('I\'m focusing Amount');
			} else if (inputName === 'accountNumber') {
				$scope.accountMatch.isFocused = false;
				$scope.accountNumber.isFocused = true;
				$scope.amount.isFocused = false;
				console.log('I\'m focusing Account Number');
			} else if (inputName === 'accountMatch') {
				$scope.accountNumber.isFocused = false;
				$scope.accountMatch.isFocused = true;
				$scope.amount.isFocused = false;
				console.log('I\'m focusing Account Match');
			}
		};

		// set focus
		$scope.leaveInputsFocus = function() {
			$scope.accountNumber.isFocused = false;
			$scope.accountMatch.isFocused = false;
			$scope.amount.isFocused = false;
		};

		$scope.setAmount = function (value) {
			console.log(value);

			if ($scope.amount === value) {
				$scope.amount = undefined;
			} else {
				$scope.amount = value;
			}
		};

		// get biller from service
		$scope.getMasterBiller = function(){
			BillPaymentFactory.getMasterBiller(biller).then(
				function(response){
					if (response.Status === 201){
						Flash.create('error', response.ErrorMessage + ' for ' + biller, '');
						console.log(response.ErrorMessage);
					} else {
						$scope.item = response.Data;
					}
					// console.log(data);
				},
				function(err){
					console.log(err);
				}
			);
		};
		// get options from biller
		$scope.getBillerPaymentOptions = function(){
			BillPaymentFactory.getBillerPaymentOptions(biller).then(
				function(response){
					$scope.paymentOptions = response.Data;
					// console.log('getBillerPaymentOptions: ' + JSON.stringify(response));
				},
				function(err){
					console.log(err);
				}
			);
		};
		$scope.getBillerPaymentOptions();
		$scope.getMasterBiller();

		$scope.parseFloat = function(value) {
			return parseFloat(value);
		};

		$scope.fee = '0';
		$scope.paymentType = null;

		$scope.setPaymentOption = function(obj){
			$scope.fee = obj.FeeAmount;
			$scope.paymentType = obj.PaymentType;
			$scope.showPaymentDetails = true;
			// console.log(obj);
		};

		// DO BILL PAYMENT NEXT STEP.
		$scope.doBillPaymentNextStep = function(form) {

			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				Flash.create('error', 'Check errors below (in red color)', '');
				return;

			} else {

				var account = {
					CategoryId: '',
					BillerId: biller,
					AccountNumber: $scope.accountNumber.value,
					Amount: $scope.amount.value,
					PaymentFee: $scope.fee
				};

				BillPaymentFactory.doBillPaymentNextStep(account).then(
					function(response){
						if(response.Status === 200){
							$scope.showKeypad = false;
							$scope.isDisableInputs = true;
							// console.log(data);
							$scope.aditionalDataRequired = response.Data;
							// set form visibility
							$scope.showAdditionalDataForm = true;
							// response.Data.SenderNameRequired || response.Data.CustomerNameRequired || response.Data.AddInfoLabel1Required || response.Data.AddInfoLabel2Required || response.Data.AltLookUpRequired
						} else {
							Flash.create('error', response.ErrorMessage, '');
							$scope.isDisableInputs = false;
							// $scope.isBlocked = false;
						}
					},
					function(error){
						console.log(error);
					}
				);
			}
		};

		// set defaults fields for additionalDataForm
		$scope.setDefaults = function(){
			$scope.customer = '';
			$scope.sender = '';
			$scope.altLookUp = '';
			$scope.addInfo1 = '';
			$scope.addInfo2 = '';
		};

		$scope.setDefaults();

		// DO BILL PAYMENT.
		$scope.doBillPayment = function(form) {

			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				Flash.create('error', 'Check errors below (in red color)', '');
				return false;
			} else {
				// setup params
				var billpayment = {
					CategoryId: '',
					BillerId: biller,
					AccountNumber: $scope.accountNumber.value,
					Amount: $scope.amount.value,
					PaymentFee: $scope.fee,
					CustomerName: $scope.customer,
					SenderName: $scope.sender,
					AltLookUp: $scope.altLookUp,
					AddInfo1: $scope.addInfo1,
					AddInfo2: $scope.addInfo2
				};

				console.log(billpayment);

				BillPaymentFactory.doBillPayment(billpayment).then(
					function(response){
						if (response.Status === 200 || response.Status === 203) {
							$scope.showPaymentOptions = false;
							$scope.showAdditionalDataForm = false;
							$scope.showReceipt = true;
							$scope.receipt = response.Data;
							//console.log('from transaction:' + receipt);
						} else {
							Flash.create('error', response.ErrorMessage, '');
							$scope.showKeypad = true;
							$scope.isDisableInputs = false;
							$scope.showAdditionalDataForm = false;
							console.log('error: response status not 200, status: ' + response.Status);
						}
					},
					function(error){
						console.log(error);
					}
				);
			}
		};

		// print receipt
		$scope.printInfo = function() {
			window.print();
		};

		$scope.termsOfPersonalData = 'Customer accepts to receive transaction confirmation and other important account messages';
	}]);
}());
