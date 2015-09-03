/**
 * IndexProductsByCategoryCtrl Controller
 * list all products by category
 */
app.controller('IndexByCategoryByCarrierCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService',
	function($scope, $routeParams, ProdsFactory, AlertService, localStorageService){

	// get merchantId stored on localStorageService
	var userInfo = localStorageService.get('userInfo');

	// get category and country by $routeParams
	var category = $routeParams.category;
	var carrier = $routeParams.carrier;

	// show button to wireless carriers
	$scope.useConfig = true;
	$scope.viewsearch = 'carriers';

	// console.log(category +' '+ carrier );

	$scope.getWirelessCarrierDetails = function(){
		ProdsFactory.getWirelessCarrierDetails(userInfo.merchantId, carrier).then(
			function(data){
				$scope.details = data;
			},
			function(error){
				console.log(error);
			}
		);
	}
	$scope.getWirelessProductsByCarrier = function(){
		ProdsFactory.getWirelessProductsByCarrier(userInfo.merchantId, carrier).then(
			function(data){
				$scope.items = data;
			},
			function(error){
				console.log(error);
			}
		);
	}
	$scope.getWirelessCarrierDetails();
	$scope.getWirelessProductsByCarrier();
}]);
