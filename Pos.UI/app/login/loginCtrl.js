(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// Return most sold products and best country rates.
	.controller('LoginCtrl', ['$scope', 'AlertService', '$location', 'AuthenticationFactory', 'localStorageService', '$rootScope', 'SITE_URL', '$modal',
		function($scope, AlertService, $location, AuthenticationFactory, localStorageService, $rootScope, SITE_URL, $modal){

		// clear alerts from previous view
		AlertService.clear();

		// Show/Hide Application form
		$scope.isApplying = false;

		function loginUser(response) {
			if(response.Status === 200) {
				var userInfo = response.UserInfo;

				localStorageService.set('userInfo', userInfo);
				// $scope.$parent.userInfo = localStorageService.get('userInfo');

				AlertService.add('success', 'Welcome!');

			} else {
				AlertService.add('error', 'Invalid Credentials!');
				console.log(response.ErrorMessage);
			}
		}

		$scope.toggleApplication = function() {
			$scope.isApplying = !$scope.isApplying;
		};

		// Alert Service example
		// AlertService.add('error', "This is an error message!");
		// $scope.addAlert = function() {
		// 	AlertService.add('success', 'Success! This is a success message!');
		// };

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		// Form submit handler.
		$scope.submitLogin = function(form) {
			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				AlertService.clear();
				AlertService.add('error', 'Check errors below');
				return;
			}

			if (form.$valid) {
				// remove any previous alert
				AlertService.clear();

				// check user authentification
				AuthenticationFactory.login(form.user.$modelValue, form.password.$modelValue).then(
					function(response) {
						// loginUser(response);

						if(response.Status === 200) {
							var userInfo = response.UserInfo;
							// store user data in session. this is used to keep live on refresh
							localStorageService.set('userInfo', userInfo);
							console.log('user info' + userInfo);

							// reditect to home page
							$location.path('/');
						} else {
							AlertService.add('error', 'Invalid Credentials!');
							// console.log(response);
						}

						// avoid log password
						// var loguser = delete response.UserInfo.MerchantPassword
						// console.log(loguser);
					},
					function(error) {
						AlertService.add('error', 'Invalid Credentials');
						console.log(error);
					}
				);
			}
		};

		$scope.loginDemo = function(category) {

			console.log(category);

			// remove any previous alert
			AlertService.clear();

			// check user authentification
			AuthenticationFactory.login(834, 'M5494').then(
				function (response) {
					loginUser(response);
					location.href = 'google.com';
					//location.href = SITE_URL + '#/category/' + category;
				},
				function (error) {
						AlertService.add('error', 'Invalid Credentials');
						console.log(error);
				}
			);
		};

		$scope.submitted = false;

		$scope.applicantSubmit = function (form) {
			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
					AlertService.clear();
					AlertService.add('error', 'Check errors below');
					return;
			}

			if (form.$valid) {

				// remove any previous alert
				AlertService.clear();

				var submissionData = {
					Name: form.user.$modelValue,
					PhoneNumber: form.phone.$modelValue,
					Email: form.email.$modelValue,
					Address: form.address.$modelValue,
					State: form.state.$modelValue,
					ZipCode: form.zip.$modelValue
				};

				// check user authentification
				AuthenticationFactory.submitApplicant(submissionData).then(
					function(response) {
						if (response.Status === 200) {
							AlertService.clear();
							AlertService.add('success', 'Application Successfully submited!');
						}

					},
					function(error) {
						AlertService.add('error', 'Problems processing your application. Try again later, please.');
						console.log(error);
					}
				);
			}
		};

		$scope.open = function (item) {
			var modalInstance = $modal.open({
				templateUrl: './app/login/_modal-demo-tpl.html',
				controller: 'ModalFormInstanceCtrl',
				size: 'sm',
				windowClass: 'demo-modal',
				resolve: {
					item: function () {
						return item;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		};

		// array of demos categories
		$scope.demoAcccess = [
			{category: 'international', categoryName: 'International Top Up', caption: 'Instantly load International wireless phones for over 200 Countries worldwide.', imageUrl: 'Images/landing/01a-bkt-POS-landing.png'},
			// {category: 'billpayment', categoryName: 'Bill Payment', caption: 'Allow customers to perform walk-in bill payments for over 5,000 local.', imageUrl: 'Images/landing/02a-bkt-POS-landing.png'},
			{category: 'wireless', categoryName: 'Wireless', caption: 'Load prepaid pay-as-you-go wireless accounts! Offer a wide variety of carriers.', imageUrl: 'Images/landing/pinless.png'},
			{category: 'longdistance', categoryName: 'Long Distance', caption: 'Load prepaid pay-as-you-go wireless accounts! Offer Variety of carriers.', imageUrl: 'Images/landing/03a-bkt-POS-landing.png'},
			{category: 'pinless', categoryName: 'Pinless', caption: 'A low-cost prepaid calling card program that does not require a PIN or scratch-off card.', imageUrl: 'Images/landing/04a-bkt-POS-landing.png'}
		];
		// states array for form
		$scope.states = [
			{'name': 'Alabama', 'abb': 'AL'},
			{'name': 'Alaska', 'abb': 'AK'},
			{'name': 'Arizona', 'abb': 'AZ'},
			{'name': 'Arkansas', 'abb': 'AR'},
			{'name': 'California', 'abb': 'CA'},
			{'name': 'Colorado', 'abb': 'CO'},
			{'name': 'Connecticut', 'abb': 'CT'},
			{'name': 'Delaware', 'abb': 'DE'},
			{'name': 'District Of Columbia', 'abb': 'DC'},
			{'name': 'Florida', 'abb': 'FL'},
			{'name': 'Georgia', 'abb': 'GA'},
			{'name': 'Hawaii', 'abb': 'HI'},
			{'name': 'Idaho', 'abb': 'ID'},
			{'name': 'Illinois', 'abb': 'IL'},
			{'name': 'Indiana', 'abb': 'IN'},
			{'name': 'Iowa', 'abb': 'IA'},
			{'name': 'Kansas', 'abb': 'KS'},
			{'name': 'Kentucky', 'abb': 'KY'},
			{'name': 'Louisiana', 'abb': 'LA'},
			{'name': 'Maine', 'abb': 'ME'},
			{'name': 'Maryland', 'abb': 'MD'},
			{'name': 'Massachusetts', 'abb': 'MA'},
			{'name': 'Michigan', 'abb': 'MI'},
			{'name': 'Minnesota', 'abb': 'MN'},
			{'name': 'Mississippi', 'abb': 'MS'},
			{'name': 'Missouri', 'abb': 'MO'},
			{'name': 'Montana', 'abb': 'MT'},
			{'name': 'Nebraska', 'abb': 'NE'},
			{'name': 'Nevada', 'abb': 'NV'},
			{'name': 'New Hampshire', 'abb': 'NH'},
			{'name': 'New Jersey', 'abb': 'NJ'},
			{'name': 'New Mexico', 'abb': 'NM'},
			{'name': 'New York', 'abb': 'NY'},
			{'name': 'North Carolina', 'abb': 'NC'},
			{'name': 'North Dakota', 'abb': 'ND'},
			{'name': 'Ohio', 'abb': 'OH'},
			{'name': 'Oklahoma', 'abb': 'OK'},
			{'name': 'Oregon', 'abb': 'OR'},
			{'name': 'Pennsylvania', 'abb': 'PA'},
			{'name': 'Rhode Island', 'abb': 'RI'},
			{'name': 'South Carolina', 'abb': 'SC'},
			{'name': 'South Dakota', 'abb': 'SD'},
			{'name': 'Tennessee', 'abb': 'TN'},
			{'name': 'Texas', 'abb': 'TX'},
			{'name': 'Utah', 'abb': 'UT'},
			{'name': 'Vermont', 'abb': 'VT'},
			{'name': 'Virginia', 'abb': 'VA'},
			{'name': 'Washington', 'abb': 'WA'},
			{'name': 'West Virginia', 'abb': 'WV'},
			{'name': 'Wisconsin', 'abb': 'WI'},
			{'name': 'Wyoming', 'abb': 'WY'}
		];
	}])

	// MODAL INSTANCE
	// Please note that $modalInstance represents a modal window (instance) dependency.
	// might ngInject
	.controller('ModalFormInstanceCtrl', ['$scope', '$location', '$modalInstance', 'item', 'SITE_URL', 'AuthenticationFactory', 'AlertService', 'localStorageService',
		function($scope, $location, $modalInstance, item, SITE_URL, AuthenticationFactory, AlertService, localStorageService){

		var category = item;
		//console.log();

		$scope.modalOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'Submit',
			headerText: $modalInstance.headerText
		};

		$scope.close = function () {
			$modalInstance.close();
		};

		$scope.guestSubmit = function (demoForm) {
			// Trigger validation flag.
			// console.log(demoForm);
			// If demoForm is invalid, return and let AngularJS show validation errors.
			if (demoForm.$invalid) {
				AlertService.clear();
				AlertService.add('error', 'Check errors below');
				return;
			}

			if (demoForm.$valid) {

				// remove any previous alert
				// AlertService.clear();

				var guestData = {
					Name: demoForm.user.$modelValue,
					Email: demoForm.email.$modelValue,
					MerchantId: 834,
					MerchantPassword: 'M5494'
				};

				// check user authentification
				AuthenticationFactory.submitGuest(guestData).then(
					function (response) {
						if (response.Status === 200) {
							AlertService.clear();
							AlertService.add('success', 'Application Successfully submited!');
						}

					},
					function (error) {
						//AlertService.add('error', 'Problems processing your application. Try again later, please.');
						console.log(error);
					}
				);

				// check user authentification
				AuthenticationFactory.login(834, 'M5494').then(
					function (response) {
						if(response.Status === 200) {
							var userInfo = response.UserInfo;
							localStorageService.set('userInfo', userInfo);
							$modalInstance.close();
							var location = SITE_URL + '#/pos/category/' + category;
							console.log(location);
							window.location = location;
							//$location.path(location);
							// console.log('Carlos');
						}
					},
					function (error) {
						AlertService.add('error', 'Invalid Credentials');
						console.log(error);
					}
				);

			}
		};
	}]);
}());
