(function () {
	'use strict';

	angular.module('posApp')
	// might ngInject
	.controller('OthersCtrl', ['$scope', 'AlertService',
		function($scope, AlertService){

			// clear alerts from previous view
			AlertService.clear();

			AlertService.add('info', 'Nothing to do...');
	}]);
}());
