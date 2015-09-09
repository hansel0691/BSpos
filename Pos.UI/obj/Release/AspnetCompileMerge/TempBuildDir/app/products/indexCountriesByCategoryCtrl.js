(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexCountriesByCategoryCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions', '$location',
		function($scope, $routeParams, ProdsFactory, AlertService, localStorageService, SharedFunctions, $location){

		// clear alerts from previous view
		AlertService.clear();

		var category = $routeParams.category;

		$scope.useMostPopular 	= true;
		$scope.isMostPopular 	= false;
		$scope.useAcronym 		= true;
		$scope.showAcronym 		= true;
		$scope.useConfig 		= false;
		$scope.type 			= $location.path().split( '/' ).splice(1, 1).toString();
		$scope.category 		= category;
		$scope.mostpopular 		= 'category/' + category;


		$scope.activeClass = function (page) {
			return page === $scope.letter ? ' active' : 'cosa';
		};
		$scope.getCountryInitialsByCategory = function(){
			ProdsFactory.getCountryInitialsByCategory(category)
			.then(
				function(data){
					$scope.alpha = data;
					// console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getCountriesByCategory = function(){
			ProdsFactory.getCountriesByCategory(category)
			.then(
				function(data){
					$scope.items = data;
					// console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getCountryInitialsByCategory();
		$scope.getCountriesByCategory();
	}]);
}());
