(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByCategoryByCountryCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions', '$location',
	function($scope, $routeParams, ProdsFactory, AlertService, localStorageService, SharedFunctions, $location){

		// clear alerts from previous view
		AlertService.clear();

		// get category and country by $routeParams
		var category = $routeParams.category;
		var CountryCode = $routeParams.country;

		// show button to wireless carriers
		$scope.useMostPopular 		= true;
		$scope.isMostPopular 		= false;
		$scope.useConfig 			= true;
		$scope.useAcronymFilter 	= true;
		$scope.showAcronymFilter 	= true;
		$scope.selectdisplay 		= 'country';
		$scope.configDisplay 		= 'Country';
		$scope.configPath 			= 'category/' + category + '/' + 'countries';
		$scope.viewsearch 			= 'countries';
		$scope.type 				= $location.path().split('/').splice(1, 1).toString();
		$scope.category 			= category;
		$scope.mostpopular 			= 'category/' + category;



		// console.log($scope.country);

		$scope.getCountryDetails = function() {
			ProdsFactory.getCountryDetails(category, CountryCode).then(
				function(data) {
					$scope.details = data;
				},
				function(error) {
					console.log(error);
				}
			);
		};
		$scope.getProductInitialsByCategoryByCountry = function(){
			ProdsFactory.getProductInitialsByCategoryByCountry(category, CountryCode).then(
				function(data){
					$scope.alpha = data;
					// console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getProductsByCategoryByCountry = function() {
			ProdsFactory.getProductsByCategoryByCountry(category, CountryCode).then(
				function(data) {
					$scope.items = data;
				},
				function(error) {
					console.log(error);
				}
			);
		};
		//$scope.getCountryDetails();
		//$scope.getProductInitialsByCategoryByCountry();
		$scope.getProductsByCategoryByCountry();
	}]);
}());
