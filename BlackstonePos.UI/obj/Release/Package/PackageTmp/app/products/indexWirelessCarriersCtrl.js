/**
 * Controller
 * list all products by category
 */
app.controller('IndexByCarriersCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', 'ngProgress', 'SharedFunctions',
	function($scope, $routeParams, ProdsFactory, AlertService, localStorageService, ngProgress, SharedFunctions){

	// start progress bar
	ngProgress.start();

	// get userInfo stored on localStorageService
	var userInfo = localStorageService.get('userInfo');
	$scope.isMostPopular = true;

	// get category by $routeParams
	var category		= $routeParams.category;
	var countryCode	= '';
	$scope.category = category;
	$scope.showAcronymFilter = true;

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

	$scope.getWirelessCarriers = function(){
		ProdsFactory.getWirelessCarriers(userInfo.merchantId, countryCode).then(
			function(data){
				$scope.items = data;

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
	$scope.getWirelessCarriers();

	// complete progress bar
	ngProgress.complete();
}]);
