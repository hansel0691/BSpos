(function () {
	'use strict';
	/* MODAL INSTANCE */
	angular.module('posApp')
	.controller('ShowTermsCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService',
		function($scope, $routeParams, ProdsFactory, AlertService){

		// clear alerts from previous view
		AlertService.clear();

		// get productMainCode by $routeParams
		var productMainCode = $routeParams.id;

		console.log(productMainCode);

		// get product info
		$scope.getProductTerms = function(){
			ProdsFactory.getProductTerms(productMainCode).then(
				function(data){
					$scope.item = data;
					console.log($scope.item);
				},
				function(error){
					console.log(error);
				}
			);
		};
		$scope.getProductTerms();


		// PRINT RECEIPT
		$scope.printInfo = function() {
			window.print();
		};

	}]);
}());

