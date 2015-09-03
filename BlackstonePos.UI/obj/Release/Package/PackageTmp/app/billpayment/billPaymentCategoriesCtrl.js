/**
 * billPaymentCategoriesCtrl Controller
 * list all products by category
 */
app.controller('billPaymentCategoriesCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions',
	function($scope, $routeParams, ProdsFactory, AlertService, localStorageService, SharedFunctions){

	// get merchantId stored on localStorageService
	var userInfo = localStorageService.get('userInfo');

	// $scope.isMostPopular = false;
	// $scope.showAcronymFilter = false;
	// $scope.useConfig = ($routeParams.category == 'pinless') ? false : true;
	// $scope.viewsearch = (category == 'wireless') ? 'carriers' : 'countries';

	$scope.setFilter = function(value){
		$scope.letter = value;
	}

	$scope.showFilter = function(){
		$scope.showAcronymFilter = !$scope.showAcronymFilter;
		$scope.letter = '';
	}

	$scope.getBillPaymentCategories = function(){
		ProdsFactory.getBillPaymentCategories(userInfo.merchantId).then(
			function(data){
				$scope.items = data.categoriesField;

				var arr = [];
				// make a new array with first leter of each element.name
				for (var i = 0; i < data.length; i++) {
					arr.push(data[i].descriptionField.charAt(0));
				}

				// save array with unique elements value
				$scope.alpha = SharedFunctions.unique(arr);

				// set useAcronymFilter button visibility
				$scope.useAcronymFilter = (data.length > 24) ? true : false;
			},
			function(error){
				console.log(error);
			}
		);
	};
	$scope.getBillPaymentCategories();
}]);
