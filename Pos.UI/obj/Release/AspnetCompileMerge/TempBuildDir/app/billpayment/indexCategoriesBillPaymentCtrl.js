(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexCategoriesBillPaymentCtrl', ['$scope', '$routeParams', 'BillPaymentFactory', 'Flash', '$location',
		function($scope, $routeParams, BillPaymentFactory, Flash, $location){

		// clear messages from previous view
		Flash.dismiss();

		// var category = $routeParams.category;
		// var param = (category == 'popular') ? '' : category;
		$scope.useMostPopular = true;
		$scope.isMostPopular = false;
		$scope.useAcronym = false;
		// $scope.showAcronym = false;
		$scope.useConfig = false;
		// $scope.configPath = 'categories';
		// $scope.configDisplay = 'Category';
		$scope.type = $location.path().split( '/' ).splice(1, 1).toString();
		$scope.mostpopular = 'category/popular';


		$scope.setFilter = function(value){
			$scope.letter = value;
		};

		$scope.showFilter = function(){
			$scope.showAcronymFilter = !$scope.showAcronymFilter;
		};

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
					// console.log(itemsCount);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getBillPaymentCategories();

	}]);
}());
