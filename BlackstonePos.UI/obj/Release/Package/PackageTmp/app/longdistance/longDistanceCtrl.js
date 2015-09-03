/**
 * LogDistanceCardItemController
 */
app.controller('LogDistanceItemCtrl', ['$scope', 'LongdistanceService', '$stateParams',
	function($scope, LongdistanceService, $stateParams){
		this.ldcId = $stateParams.ldcId;
}]);
