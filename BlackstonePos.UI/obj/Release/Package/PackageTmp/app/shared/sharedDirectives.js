'use strict';

/**
 * TopMenu Directive
 * [description]
 * @return {[type]} [description]
 */
app.directive('topMenu', function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'app/partials/top-menu.html',
		link: function (scope, elem, attrs) {
			var menuItems = elem.find("a");
			menuItems.on('click', function () {
				menuItems.removeClass('active');
				// $(this).addClass('active');
			});

			// scope.$on('logOff', function () {
			// 	scope.isAuthenticated = false;
			// });

			// scope.$on('logOn', function () {
			// 	scope.isAuthenticated = true;
			// });
		}
	};
});

/**
 * productCaption Directive
 * [description]
 * @return {[type]}
 */
app.directive('productCaption', function(){
	return{
		restrict: 'E',
		templateUrl: 'app/directives/product-caption.html'
	};
});

/**
 * productCaption Directive
 * [description]
 * @return {[type]}
 */
app.directive('salesDetails', function(){
	return{
		restrict: 'A',
		templateUrl: 'app/shared/_sales-details.html'
	};
});

/**
 * productCaption Directive
 * [description]
 * @return {[type]}
 */
app.directive('balanceDetails', function(){
	return{
		restrict: 'A',
		templateUrl: 'app/shared/_balance-details.html'
	};
});

app.directive('cashiersGrid', function(){
	return{
		restrict: 'A',
		templateUrl: 'app/shared/_cashiers-grid.html'
	};
});

app.directive('ordersGrid', function(){
	return{
		restrict: 'A',
		templateUrl: 'app/shared/_orders-grid.html'
	};
});

app.directive('merchantPayments', function(){
	return{
		restrict: 'A',
		templateUrl: 'app/shared/_merchant-payments.html'
	};
});

app.directive('merchantSettings', function(){
	return{
		restrict: 'A',
		templateUrl: 'app/shared/_merchant-settings.html'
	};
});

app.directive('adminLogin', function(){
	return{
		restrict: 'A',
		templateUrl: 'app/shared/_admin-login.html'
	};
});

app.directive('homeItem', function(){
	return{
		restrict: 'A',
		templateUrl: 'app/shared/_home-item.html'
	};
});

/**
 * countryFlag Directive
 * [description]
 * @return {[type]}
 */
app.directive('countryFlag', function(){
	return{
		restrict: 'E',
		replace: true,
		template: '<span class="f24"> <span class="flag {{country.countryCode}}" data-cc="{{country.countryCode}}" data-country_name="{{country.countryCode}}"></span></span>',
		link: function(scope, elem, attrs){
		}
	};
});

/**
 * countryFlag Directive
 * [description]
 * @return {[type]}
 */
// app.directive('searchModel', function(){
// 	return{
// 		restrict: 'E',
// 		replace: true,
// 		scope: {
// 			customerInfo: '=model'
// 		},
// 		template: function (element, attrs ){
// 			return '<div class="form-horizontal"> <div class="form-group"> <label for="countryName" class="col-sm-2 control-label">Search:</label> <div class="col-sm-10"> <div class="input-group"> <span class="input-group-addon"><i class="fa fa-search"></i></span> <input class="form-control" type="text" ng-model="' + attrs.ngModel + ' id="countryName" placeholder="by Country Name"> </div> </div></div></div>'
// 		},
// 		link: function(scope, elem, attrs){
// 		}
// 	};
// });

/**
 * phoneMatch Directive
 * Match phone confirm input field (pinless recharge)
 * @return {boolean}
 */
app.directive('match', function () {
		return {
				require: '^ngModel',
				restrict: 'A',
				scope: {
						match: '='
				},
				link: function(scope, elem, attrs, ctrl) {
						scope.$watch(function() {
								return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
						}, function(currentValue) {
								ctrl.$setValidity('match', currentValue);
						});
				}
		};
});

/**
 * withkeypad Directive
 */
app.directive('withkeypad', function () {
		return {
			require: 'ngModel',
			restrict: 'A',
			scope: {
					match: '='
			},
			link: function(scope, elem, attrs, ctrl) {
				var focusedElement;
				elem.on('click', function () {
					if (focusedElement != this) {
						this.select();
						focusedElement = this;
					}
				});
				elem.on('blur', function () {
					focusedElement = null;
				});
			}
		};
});


/**
 * Confirm Alert Directive
 */
app.directive('ngAlertConfirm', [function(){
	return {
		link: function (scope, element, attr) {
			var msg = attr.ngConfirmClick || "Are you sure?";
			var clickAction = attr.confirmedClick;
			element.bind('click',function (event) {
				if ( window.confirm(msg) ) {
					scope.$eval(clickAction)
				}
			});
		}
	};
}])

/**
 * validate numeric formats allowed
 * set a array of regular expresión defining validation rules.
 */
app.directive('numberFormatValidator', function() {

	var REQUIRED_PATTERNS = [
		/\d+/,    //numeric values
		/^\S+$/   //no whitespace allowed
		// /[a-z]+/, //lowercase values
		// /[A-Z]+/, //uppercase values
		// /\W+/,    //special characters
	];

	return {
		require : 'ngModel',
		link : function($scope, elem, attrs, ngModel) {
			ngModel.$validators.numberFormat = function(value) {
				var status = true;
				angular.forEach(REQUIRED_PATTERNS, function(pattern) {
					status = status && pattern.test(value);
					// console.log(status, pattern);
				});
				return status;
			};
		}
	}
})
//
/*app.directive('phoneMatch', function() {
	return {
		restrict: 'A',
		scope:true,
		require: 'ngModel',
		link: function (scope, elem , attrs, ctrl) {
			var checker = function () {
				//get the value of the re-enter phone
				var e1 = scope.$eval(attrs.ngModel);

				//get the value of the first phone
				var e2 = scope.$eval(attrs.phoneMatch);
				return e1 == e2;
			};
			scope.$watch(checker, function (n) {
				//set the form ctrl to valid if both phone are the same, else invalid
				ctrl.$setValidity("phonematch", n);
			});
		}
	};
});*/
