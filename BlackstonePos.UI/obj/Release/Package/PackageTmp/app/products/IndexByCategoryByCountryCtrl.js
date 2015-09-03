/**
 * IndexProductsByCategoryCtrl Controller
 * list all products by category
 */
app.controller('IndexByCategoryByCountryCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService',
	function($scope, $routeParams, ProdsFactory, AlertService, localStorageService){

	// get merchantId stored on localStorageService
	var userInfo = localStorageService.get('userInfo');

	// get category and country by $routeParams
	var category = $routeParams.category;
	var country = $routeParams.country;

	// show button to wireless carriers
	$scope.useConfig = true;
	$scope.viewsearch = 'countries';

	// console.log($scope.country);

	$scope.getLongDistanceCountryDetails = function(){
		ProdsFactory.getLongDistanceCountryDetails(userInfo.merchantId, country).then(
			function(data){
				$scope.details = data;
			},
			function(error){
				console.log(error);
			}
		);
	}
	$scope.getLongDistanceProductsByCountry = function(){
		ProdsFactory.getLongDistanceProductsByCountry(userInfo.merchantId, country).then(
			function(data){
				$scope.items = data;
			},
			function(error){
				console.log(error);
			}
		);
	}
	$scope.getLongDistanceCountryDetails();
	$scope.getLongDistanceProductsByCountry();
}]);
