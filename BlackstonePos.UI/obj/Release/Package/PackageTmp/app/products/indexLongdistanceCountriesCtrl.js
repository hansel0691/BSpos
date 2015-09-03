/**
 * IndexProductsByCategoryCtrl Controller
 * list all products by category
 */
app.controller('IndexByCountriesCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions', 'ItemFactory',
	function($scope, $routeParams, ProdsFactory, AlertService, localStorageService, SharedFunctions, ItemFactory){

	// get userInfo stored on localStorageService
	var userInfo = localStorageService.get('userInfo');

	// get category by $routeParams
	var country = $routeParams.country;
	$scope.category = $routeParams.category;
	$scope.isMostPopular = false;
	$scope.showAcronymFilter = false;

	$scope.setFilter = function(value){
		$scope.letter = value;
	}

	$scope.showFilter = function(){
		$scope.showAcronymFilter = !$scope.showAcronymFilter;
		$scope.letter = '';
	}

	$scope.activeClass = function (page) {
		return page === $scope.letter ? ' active' : 'cosa';
	};

	$scope.getLongDistanceCountries = function(){
		ProdsFactory.getLongDistanceCountries(userInfo.merchantId).then(
			function(data){
				$scope.items = data;
				// console.log(data);

				var arr = [];
				// make a new array with first leter of each element.name
				for (var i = 0; i < data.length; i++) {
					arr.push(data[i].Name.charAt(0));
				}
				// save array with unique elements value
				$scope.alpha = SharedFunctions.unique(arr);
			},
			function(error){
				console.log(error);
			}
		);
	}
	$scope.getLongDistanceCountries();
}]);
