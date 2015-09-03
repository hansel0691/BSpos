(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// list all categories
	.controller('IndexDirectTvCategoriesCtrl', ['$scope', '$routeParams', 'DirectTvFactory', 'AlertService', '$location',
		function($scope, $routeParams, DirectTvFactory, AlertService, $location){

		// clear alerts from previous view
		AlertService.clear();

		// var category = $routeParams.category;
		$scope.useMostPopular = false;
		$scope.isMostPopular = false;
		$scope.useAcronym = false;
		// $scope.showAcronym = true;
		$scope.useConfig = false;
		$scope.type = $location.path().split( '/' ).splice(1, 1).toString();
		$scope.mostpopular = 'category/popular';

		$scope.getDirectTvCategories = function(){
			DirectTvFactory.getDirectTvCategories().then(
				function(data){
					$scope.items = data;
					// console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getDirectTvCategories();
	}])
	// might ngInject
	// list products by category or all
	.controller('IndexDirectTvByCategoryCtrl', ['$scope', '$routeParams', 'DirectTvFactory', 'ProdsFactory', 'AlertService', '$location',
		function($scope, $routeParams, DirectTvFactory, ProdsFactory, AlertService, $location){

		$scope.useMostPopular = true;
		$scope.isMostPopular = true;
		$scope.useAcronym = false;
		$scope.showAcronym = true;
		$scope.useConfig = true;
		$scope.configPath = 'categories';
		$scope.configDisplay = 'Category';
		$scope.type = $location.path().split( '/' ).splice(1, 1).toString();
		$scope.mostpopular = 'popular';

		var category = $routeParams.category;

		$scope.getDirectTvProductsByCategory = function(){
			DirectTvFactory.getDirectTvProductsByCategory(category).then(
				function(data){
					$scope.items = data;
					console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getDirectTvProductsByCategory();
	}])
	// might ngInject
	.controller('showDirectTvCtrl', ['$scope', 'DirectTvFactory', 'ProdsFactory', '$routeParams', 'AlertService', 'localStorageService', 'SharedFunctions', '$modal', 'ConfirmationFactory',
		function($scope, DirectTvFactory, ProdsFactory, $routeParams, AlertService, localStorageService, SharedFunctions, $modal, ConfirmationFactory){

		var id = $routeParams.product;

		$scope.getDirectTvProduct = function(){
			DirectTvFactory.getDirectTvProduct(id).then(
				function(data){
					$scope.item = data;
					// console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getDirectTvProduct();

		// FORM SUBMIT HANDLER
		$scope.submit = function(form) {
			console.log('submited:' + form);

			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				AlertService.clear();
				AlertService.add('error', 'Check errors below (in red color)');
				return;

			} else {

				$scope.isBlocked = true;

				// remove any previous alert
				AlertService.clear();

				var userInfo = localStorageService.get('userInfo');

				var order = {
					MerchantId: userInfo.MerchantId,
					MerchantPassword: userInfo.MerchantPassword, // string
					OperatorName: userInfo.userName, // string
					ProfileId: userInfo.profileId, // int
					TerminalId: userInfo.terminalId, // int

					Amount: $scope.item.price,
					// PhoneNumber: $scope.phoneNumber.value,
					ProductMainCode: $scope.item.id
					// CountryCode: $scope.item.DialCountryCode
				};

				console.log('order:' + order);
				// console.log(userInfo);

				ProdsFactory.doBlackstonePosOperation(order).then(
					function(response){

							//console.log(response);

							if(response.Status === 200 || response.Status === 203) {

								var orderResultText = response.Status === 200 ? 'Order processed!' : 'Order placed. Pending for further Execution!';

								$scope.showReceipt = true;
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

		// SEND RECEIPT AS EMAIL
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

		// Modal (ui.bootstrap.modal). In Docs (item) pass modal size, here pass the single item object
		$scope.open = function(items) {
			var info = {firstItem: $scope.item.productName, secondItem: null, thirdItem: $scope.item.price};

			// angular.extend(dst, src);
			items = angular.extend(items, info);
			// console.log(items);
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
	}]);
}());
