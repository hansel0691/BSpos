(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByCategoryByCarrierCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', '$location',
	function($scope, $routeParams, ProdsFactory, AlertService, localStorageService, $location){

		// clear alerts from previous view
		AlertService.clear();

		// get category and country by $routeParams
		var carrier = $routeParams.carrier;

		$scope.useMostPopular 		= true;
		$scope.isMostPopular 		= false;
		$scope.useConfig 			= true;
		$scope.useAcronymFilter 	= true;
		$scope.showAcronymFilter 	= true;
		$scope.viewsearch 			= 'carriers';
		$scope.selectdisplay 		= 'carrier';
		$scope.type 				= $location.path().split( '/' ).splice(1, 1).toString();
		$scope.category 			= $routeParams.category;
		$scope.mostpopular 			= 'category/' + $scope.category;

		// console.log(category +' '+ carrier );

		$scope.getWirelessCarrierDetails = function() {
			ProdsFactory.getWirelessCarrierDetails(carrier).then(
					function(data) {
					$scope.details = data;
				},
					function(error) {
					console.log(error);
				}
			);
		};
		$scope.getWirelessProductsByCarrier = function() {
			ProdsFactory.getWirelessProductsByCarrier(carrier).then(
					function(data) {
					$scope.items = data;
					// console.log(data);
				},
					function(error) {
					console.log(error);
				}
			);
		};

		//$scope.getWirelessCarrierDetails();
		$scope.getWirelessProductsByCarrier();
	}]);
}());
