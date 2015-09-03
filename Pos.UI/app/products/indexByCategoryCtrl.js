(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByCategoryCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'SharedFunctions', '$location',
		function($scope, $routeParams, ProdsFactory, AlertService, SharedFunctions, $location){

		// clear alerts from previous view
		AlertService.clear();

		$scope.useMostPopular 	= true;
		$scope.isMostPopular 	= true;
		$scope.showAcronym 		= false;
		$scope.useAcronym 		= true;
		$scope.useConfig 		= ($routeParams.category === 'pinless') ? false : true;
		var category 			= $routeParams.category;
		var configParam			= (category === 'longdistance' || category === 'international') ? 'countries' : 'carriers';
		$scope.configDisplay 	= (category === 'longdistance' || category === 'international') ? 'country' : 'carrier';
		$scope.configPath 		= 'category/' + category + '/' + configParam;
		$scope.type 			= $location.path().split( '/' ).splice(1, 1).toString();
		$scope.mostpopular 		= 'category/' + category;


		$scope.viewsearch = (category === 'wireless') ? 'carriers' : 'countries';

		$scope.activeClass = function (page) {
			return page === $scope.letter ? ' active' : 'cosa';
		};

		    var userInfo = localStorage.get('userInfo');

		$scope.getProductInitialsByCategory = function(){
			ProdsFactory.getProductInitialsByCategory(category, userInfo).then(
				function(data){
					$scope.alpha = data;
					// console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getAllProducts = function(){
			ProdsFactory.getAllProducts(category, userInfo).then(
				function(data){
					$scope.items = data;
					 console.log(data);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getProductInitialsByCategory();
		$scope.getAllProducts();
	}]);
}());
