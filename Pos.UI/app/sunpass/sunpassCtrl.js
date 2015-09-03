(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// SunPasCtrl Controller
	.controller('IndexSunpassCtrl', ['$scope', 'AlertService',
		function($scope, AlertService){

		// clear alerts from previous view
		AlertService.clear();

		$scope.items = [
			{categoryName: 'sunpass', title: 'Activate or Replenish Sunpass', url: '#/sunpass/category/replenish', position: 0, icon: ''},
			{categoryName: 'sunpass', title: 'Pay Your Document', url: '#/sunpass/category/documents', position: 1, icon: ''}
		];
	}])
	// might ngInject
	.controller('ReplenishSunpassCtrl', ['$scope', '$routeParams', 'SunpassFactory', 'AlertService', 'SharedFunctions', 'ConfirmationFactory',
		function($scope, $routeParams, SunpassFactory, AlertService, SharedFunctions, ConfirmationFactory){

		// clear alerts from previous view
		AlertService.clear();

		$scope.item = {
			name: 'Activate or Replenish Sunpass Transponder',
			MaxAmount: 100
		};

		// interface elm visibility
		$scope.hasKeyPad 			= true;
		$scope.showKeypad 			= true;
		$scope.showPaymentDetails 	= false;
		$scope.showDoReplenishment 	= false;
		$scope.showReceipt 			= false;
		$scope.showToCategories 	= false;
		$scope.showToReplenish 		= false;

		// init params
		$scope.accountNumber 		= {value: null, isFocused: false};
		$scope.accountMatch 		= {value: null, isFocused: false};
		$scope.amount 				= {value: null, isFocused: false};
		$scope.submitted 			= false;



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

		//
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

		// GET TRANSPONDER INFO
		$scope.doGetInfo = function(form) {

			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				AlertService.clear();
				AlertService.add('error', 'Check errors below (in red color)');
				return;

			} else {

				var transporderNumber = $scope.accountNumber.value;

				// console.log(account);

				SunpassFactory.getSunpassTransporderInfo(transporderNumber).then(
					function(response){

						if(response.Status === 200){

							// $scope.showKeypad = false;
							$scope.isDisableInputs 		= true;
							$scope.aditionalDataRequired = response.Data;
							// console.log(response);

							// set form visibility
							$scope.showPaymentDetails 	= true;
							$scope.showDoReplenishment 	= true;
							$scope.submitted 			= false;

						} else {

							AlertService.clear();
							AlertService.add('error', response.ErrorMessage);
							$scope.isDisableInputs 		= false;

						}

					},
					function(error){
						console.log(error);
					}
				);
			}
		};

		// DO TRANSPONDER REPLENISHMENT
		$scope.doReplenishment = function(form) {

			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				AlertService.clear();
				AlertService.add('error', 'Check errors below (in red color)');
				return;

			} else {

				var obj = {
					TransporderNumber: $scope.accountNumber.value,
					PurchaseId: $scope.aditionalDataRequired.purchaseIdField,
					Amount: $scope.amount.value
				};

				console.log(obj);

				SunpassFactory.doSunpassReplenishment(obj).then(
					function(response){

						if(response.Status === 200 || response.Status === 203){

							// $scope.showKeypad = false;
							$scope.isDisableInputs 			= true;

							// console.log(data);
							$scope.receipt = response.Data;

							// set form visibility
							$scope.showPaymentDetails 	= true;
							$scope.showDoReplenishment 	= false;
							$scope.showReceipt 			= true;
							$scope.showToCategories 	= true;
							$scope.showToReplenish 		= true;

						} else {

							AlertService.clear();
							AlertService.add('error', response.ErrorMessage);
							$scope.isDisableInputs 			= false;

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

		// send receipt as sms
		$scope.sendSms = function(form) {

			// Trigger validation flag.
			$scope.submittedSms = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {

				AlertService.clear();
				AlertService.add('error', 'Check form errors');
				return;

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

		// send receipt as email
		$scope.sendEmail = function(form) {

			// Trigger validation flag.
			$scope.submittedEmail = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {

				AlertService.clear();
				AlertService.add('error', 'Check form errors');
				return;

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
	}])
	// might ngInject
	.controller('DocumentsSunpassCtrl', ['$scope', '$routeParams', 'SunpassFactory', 'AlertService', 'localStorageService', 'SharedFunctions', 'ConfirmationFactory',
		function($scope, $routeParams, SunpassFactory, AlertService, localStorageService, SharedFunctions, ConfirmationFactory){

		$scope.item = {name: 'Pay Your Documents'};

		// interface elm visibility
		$scope.showCheck	= true;
		$scope.showPaymentDetails 		= false;
		$scope.showFieldsDescription 	= true;
		$scope.showDoDocumentsPayment = false;
		$scope.showReceipt = false;
		// steps vars
		$scope.submittedCheck = false;
		$scope.submittedDoPayment = false;

		// remove
		// var nyidnumber = {value: '6225-TKK'};
		// var nyplate = {value: '241XBX'};
		// var mydocuments = {
		// 	purchaseIdField: 'sample string 1',
		// 	requestedDocumentField: {
		// 		documentIdField: 'sample string 1',
		// 		documentPaymentAmountField: 2.1
		// 	},
		// 	unpaidDocumentListField: [
		// 		{
		// 			documentIdField: 'Document 1',
		// 			documentPaymentAmountField: 2.1
		// 		},
		// 		{
		// 			documentIdField: 'Document 2',
		// 			documentPaymentAmountField: 2.1
		// 		},
		// 		{
		// 			documentIdField: 'Document 3',
		// 			documentPaymentAmountField: 2.1
		// 		}
		// 	],
		// 	unpaidDocumentListAmountField: 6.3,
		// 	unpaidDocumentListFee: 1.3,
		// 	responseMessageField: 'sample string 3',
		// 	timestampField: '2015-01-23T15:47:10.6433666-05:00',
		// 	responseCodeField: 5,
		// 	responseDescriptionField: 'sample string 6',
		// 	referenceNumberField: 7
		// };

		// init params
		$scope.idnumber 			= null;
		$scope.plate 				= null;
		$scope.total = 0;
		$scope.fee = 0;
		$scope.selectedDocuments	= [];
		$scope.submitted 			= false;

		$scope.parseFloat = function(value) {
			return parseFloat(value);
		};

		$scope.setDocument = function(obj, type) {
			$scope.selectedDocuments = obj;
			$scope.active = !$scope.active;

			var allAmount = 0;
			angular.forEach(obj, function (value) {
				allAmount = allAmount + parseFloat(value.documentPaymentAmountField);
			});

			// console.log($scope.fee);
			// console.log(allAmount);
			$scope.total = allAmount + parseFloat($scope.fee);
			$scope.paymentType = type;
			console.log(obj);
			console.log($scope.total);
			console.log(type);
		};


		// GET TRANSPONDER INFO
		$scope.doGetInfo = function(form) {

			// Trigger validation flag.
			$scope.submittedCheck = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				AlertService.clear();
				AlertService.add('error', 'Check errors below (in red color)');
				return;

			} else {

				// set query params
				var obj = {
					DocumentId: $scope.idnumber,
					LicensePlate: $scope.plate
				};

				console.log(obj);

				SunpassFactory.getSunpassDocumentsInfo(obj).then(
					function(response){
						// console.log(response);

						if(response.Status === 200){

							// console.log(response);
							$scope.documents = response.Data;
							$scope.fee = response.Data.fee;
							console.log($scope.documents);

							// set form visibility
							$scope.isDisableInputs 			= true;
							$scope.showCheck 				= false;
							$scope.showFieldsDescription 	= false;
							$scope.showPaymentDetails 		= true;
							$scope.showDoDocumentsPayment 	= true;

						} else {

							AlertService.clear();
							AlertService.add('error', response.ErrorMessage);
							$scope.isDisableInputs 	= false;
							$scope.showCheck		= true;

						}

					},
					function(error){
						console.log(error);
					}
				);
			}
		};

		// DO TRANSPONDER REPLENISHMENT
		$scope.doDocumentsPayment = function(form) {

			console.log(form);

			// Trigger validation flag.
			$scope.submittedDoPayment = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				AlertService.clear();
				AlertService.add('error', 'Check errors below (in red color)');
				return;

			} else {

				// set query params
				var obj = {
					DocumentId: $scope.idnumber,
					LicencePlate: $scope.plate,
					PaymentType: $scope.paymentType
				};

				console.log(obj);

				// console.log(account);

				SunpassFactory.doSunPassDocumentsPayment(obj).then(
					function(response){
						// console.log(response);
						if (response.Status === 200 || response.Status === 203) {
							// console.log(response);
							$scope.showReceipt = true;
							$scope.receipt = response.Data;
						} else {
							AlertService.clear();
							AlertService.add('error', response.ErrorMessage);
							$scope.isDisableInputs = false;
						}

					},
					function(error){
						console.log('error: ' + error);
					}
				);
			}
		};

		// print receipt
		$scope.printInfo = function() {
			window.print();
		};

		// send receipt as sms
		$scope.sendSms = function(form) {

			// Trigger validation flag.
			$scope.submittedSms = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {

				AlertService.clear();
				AlertService.add('error', 'Check form errors');
				return;

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
					},
					function(response){
						AlertService.add('error', response.ErrorMessage);
					}
				);
			}
		};

		// send receipt as email
		$scope.sendEmail = function(form) {

			// Trigger validation flag.
			$scope.submittedEmail = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {

				AlertService.clear();
				AlertService.add('error', 'Check form errors');
				return;

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
					},
					function(response){
						AlertService.add('error', response.ErrorMessage);
					}
				);
			}
		};
	}]);
}());
