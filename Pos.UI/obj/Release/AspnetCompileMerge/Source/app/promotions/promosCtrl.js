(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	.controller('PromosCtrl', ['$scope', '$routeParams', 'PromosFactory', 'AlertService',
		function($scope, $routeParams, PromosFactory, AlertService){

		// clear alerts from previous view
		AlertService.clear();

		// console.log('cosa');

		$scope.getPromotions = function(){
			PromosFactory.getPromotions().then(
				function(data){
					$scope.items = data;
					// console.log(data);
				},
				function(error){
					AlertService.add('error', error);
					console.log(error);
				}
			);
		};
		$scope.getPromotions();
	}]);
}());
