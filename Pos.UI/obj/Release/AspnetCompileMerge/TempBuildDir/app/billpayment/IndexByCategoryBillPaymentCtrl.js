(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByCategoryBillPaymentCtrl', ['$scope', '$routeParams', 'BillPaymentFactory', 'Flash', '$location',
		function($scope, $routeParams, BillPaymentFactory, Flash, $location){

		// clear messages from previous view
		Flash.dismiss();

		var category = $routeParams.category;
		var param = (category === 'popular') ? '' : category;

		$scope.useMostPopular = true;
		$scope.isMostPopular = (category === 'popular') ? true : false;
		$scope.useAcronym = true;
		$scope.showAcronym = true;
		$scope.useConfig = true;
		$scope.configPath = 'categories';
		$scope.configDisplay = 'Category';
		$scope.numLimit = 25;
		$scope.type = $location.path().split( '/' ).splice(1, 1).toString();
		$scope.mostpopular = 'category/popular';


		$scope.getBillersInitials = function(){
			BillPaymentFactory.getBillersInitials(param).then(
				function(data){
					$scope.alpha = data;
					// console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getBillersByCategory = function(){
			BillPaymentFactory.getBillersByCategory(param).then(
				function(data){
					$scope.items = data;
					// console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getBillersInitials();
		$scope.getBillersByCategory();
	}]);
}());
