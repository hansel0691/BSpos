(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByPopularBillPaymentCtrl', ['$scope', '$routeParams', 'BillPaymentFactory', 'Flash',
		function($scope, $routeParams, BillPaymentFactory, Flash){

		// clear messages from previous view
		Flash.dismiss();

		$scope.useMostPopular = false;
		$scope.isMostPopular = true;
		$scope.showAcronym = false;
		$scope.useConfig = true;

		$scope.getBillPaymentCategories = function(){
			BillPaymentFactory.getBillPaymentCategories().then(
				function(data){
					$scope.items = data;
					var itemsCount = data.length;
					switch(itemsCount) {
						case 2:
							$scope.thumbWidth = 6;
							break;
						case 4:
							$scope.thumbWidth = 6;
							break;
						case 6:
							$scope.thumbWidth = 3;
							break;
						case 8:
							$scope.thumbWidth = 3;
							break;
						default:
							$scope.thumbWidth = 2;
					}
					console.log(itemsCount);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getBillPaymentCategories();
	}]);
}());
