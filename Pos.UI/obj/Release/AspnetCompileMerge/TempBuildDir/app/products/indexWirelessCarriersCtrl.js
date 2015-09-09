(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// list all products by carrier
	.controller('IndexByCarriersCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions', '$location',
		function($scope, $routeParams, ProdsFactory, AlertService, localStorageService, SharedFunctions, $location){

		// clear alerts from previous view
		AlertService.clear();

		$scope.letter = '';
		$scope.useMostPopular 		= true;
		$scope.isMostPopular 		= false;
		$scope.useConfig 			= false;
		$scope.useAcronym 			= true;
		$scope.showAcronym 			= true;
		$scope.viewsearch 			= 'carriers';
		$scope.selectdisplay 		= 'carrier';
		$scope.type 				= $location.path().split( '/' ).splice(1, 1).toString();
		var category = $routeParams.category;
		$scope.mostpopular 			= 'category/' + category;

		var countryCode				= 'USA';

		$scope.activeClass = function (page) {
			return page === $scope.letter ? ' active' : 'cosa';
		};
		$scope.getWirelessCarrierInitials = function(){
			ProdsFactory.getWirelessCarrierInitials(countryCode).then(
				function(data){
					$scope.alpha = data;
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getWirelessCarriers = function(){
			ProdsFactory.getWirelessCarriers(countryCode).then(
				function(data){
					$scope.items = data;
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getWirelessCarrierInitials();
		$scope.getWirelessCarriers();
	}]);
}());
