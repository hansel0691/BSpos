(function () {
	'use strict';
	// module
	angular.module('posApp')
	// keypadNumeric
	.directive('keypadNumeric', function () {
		return {
			restrict: 'AE',
			replace: true,
			templateUrl: 'app/shared/_keypad-numeric.html',
			link: function (scope, elem) {


				var menuItems = elem.find('a');
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
	})
	// TopMenu Directive
	.directive('topMenu', function () {
		return {
			restrict: 'AE',
			replace: true,
			templateUrl: 'app/partials/top-menu.html',
			link: function (scope, elem) {
				var menuItems = elem.find('a');
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
	})
	// productCaption Directive
	.directive('productCaption', function(){
		return {
			restrict: 'E',
			templateUrl: 'app/directives/product-caption.html'
		};
	})
	// productCaption Directive
	.directive('salesDetails', function(){
		return {
			restrict: 'A',
			templateUrl: 'app/shared/_sales-details.html'
		};
	})
	// work in progress template
	.directive('workInProgress', function(){
		return {
			restrict: 'A',
			templateUrl: 'app/shared/_work-in-progress.html'
		};
	})
	// countryFlag Directive to template country flags
	.directive('countryFlag', function(){
		return {
			restrict: 'E',
			replace: true,
			template: '<span class="f24"> <span class="flag {{country.countryCode}}" data-cc="{{country.countryCode}}" data-country_name="{{country.countryCode}}"></span></span>'
			// link: function(scope, elem, attrs){}
		};
	})
	// phoneMatch Directive
	.directive('match', function () {
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
	})
	// withkeypad Directive
	.directive('withkeypad', function () {
		return {
			require: 'ngModel',
			restrict: 'A',
			scope: {
					match: '='
			},
			link: function(scope, elem) {
				var focusedElement;
				elem.on('click', function () {
					if (focusedElement !== this) {
						this.select();
						focusedElement = this;
					}
				});
				elem.on('blur', function () {
					focusedElement = null;
				});
			}
		};
	})
	// Confirm Alert Directive
	.directive('ngAlertConfirm', [function(){
		return {
			link: function(scope, element, attr) {
				var msg = attr.ngConfirmClick || 'Are you sure?';
				var clickAction = attr.confirmedClick;

				// element.bind('click', function (event) {
				element.bind('click', function () {
					if ( window.confirm(msg) ) {
						scope.$eval(clickAction);
					}
				});
			}
		};
	}])
	// validate numeric formats allowed
	.directive('numberFormatValidator', function() {
		// set a array of regular expresión defining validation rules.
		var REQUIRED_PATTERNS = [
			/\d+/,    //numeric values
			/^\S+$/   //no whitespace allowed
			// /[a-z]+/, //lowercase values
			// /[A-Z]+/, //uppercase values
			// /\W+/,    //special characters
		];

		return {
			require: 'ngModel',
			link: function($scope, elem, attrs, ngModel) {
				ngModel.$validators.numberFormat = function(value) {
					var status = true;
					angular.forEach(REQUIRED_PATTERNS, function(pattern) {
						status = status && pattern.test(value);
						// console.log(status, pattern);
					});
					return status;
				};
			}
		};
	})
	.directive('money', function () {

		var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

		function link(scope, el, attrs, ngModelCtrl) {
			var min = parseFloat(attrs.min || 0);
			var precision = parseFloat(attrs.precision || 2);
			var lastValidValue;

			function round(num) {
				var d = Math.pow(10, precision);
				return Math.round(num * d) / d;
			}

			function formatPrecision(value) {
				return parseFloat(value).toFixed(precision);
			}

			function formatViewValue(value) {
				return ngModelCtrl.$isEmpty(value) ? '' : '' + value;
			}


			ngModelCtrl.$parsers.push(function (value) {
				if (angular.isUndefined(value)) {
					value = '';
				}

				// Handle leading decimal point, like '.5'
				if (value.indexOf('.') === 0) {
					value = '0' + value;
				}

				// Allow '-' inputs only when min < 0
				if (value.indexOf('-') === 0) {
					if (min >= 0) {
						value = null;
						ngModelCtrl.$setViewValue('');
						ngModelCtrl.$render();
					} else if (value === '-') {
						value = '';
					}
				}

				var empty = ngModelCtrl.$isEmpty(value);
				if (empty || NUMBER_REGEXP.test(value)) {
					lastValidValue = (value === '')
						? null
						: (empty ? value : parseFloat(value));
				} else {
					// Render the last valid input in the field
					ngModelCtrl.$setViewValue(formatViewValue(lastValidValue));
					ngModelCtrl.$render();
				}

				ngModelCtrl.$setValidity('number', true);
				return lastValidValue;
			});
			ngModelCtrl.$formatters.push(formatViewValue);

			var minValidator = function(value) {
				if (!ngModelCtrl.$isEmpty(value) && value < min) {
					ngModelCtrl.$setValidity('min', false);
					return undefined;
				} else {
					ngModelCtrl.$setValidity('min', true);
					return value;
				}
			};
			ngModelCtrl.$parsers.push(minValidator);
			ngModelCtrl.$formatters.push(minValidator);

			// if (attrs.max) {
				var max = '';
				attrs.$observe('max', function(value){
					max = parseFloat(value);
				});
				// var max = parseFloat(attrs.max);
				var maxValidator = function(value) {
					if (!ngModelCtrl.$isEmpty(value) && value > max) {
						ngModelCtrl.$setValidity('max', false);
						return undefined;
					} else {
						ngModelCtrl.$setValidity('max', true);
						return value;
					}
				};
				ngModelCtrl.$parsers.push(maxValidator);
				ngModelCtrl.$formatters.push(maxValidator);
			// }

			// Round off
			if (precision > -1) {
				ngModelCtrl.$parsers.push(function (value) {
					return value ? round(value) : value;
				});
				ngModelCtrl.$formatters.push(function (value) {
					return value ? formatPrecision(value) : value;
				});
			}

			el.bind('blur', function () {
				var value = ngModelCtrl.$modelValue;
				if (value) {
					ngModelCtrl.$viewValue = formatPrecision(value);
					ngModelCtrl.$render();
				}
			});
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: link
		};
	})
	// validate email format
	.directive('emailValidator', function() {

		// set a array of regular expresión defining validation rules.
		var REQUIRED_PATTERNS = [
			/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,    //numeric values
			/^\S+$/   //no whitespace allowed
		];

		return {
			require: 'ngModel',
			link: function($scope, elem, attrs, ngModel) {
				ngModel.$validators.emailFormat = function(value) {
					var status = true;
					angular.forEach(REQUIRED_PATTERNS, function(pattern) {
						status = status && pattern.test(value);
						// console.log(status, pattern);
					});
					return status;
				};
			}
		};
	})
	// validate phone number format
	.directive('phoneValidator', function() {

		var REQUIRED_PATTERNS = [
			/^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/, //no whitespace allowed
			/^[0-9]{10}$/	//numeric values
		];

		return {
			require: 'ngModel',
			link: function($scope, elem, attrs, ngModel) {
				ngModel.$validators.phoneFormat = function(value) {
					var status = true;
					angular.forEach(REQUIRED_PATTERNS, function(pattern) {
						status = status && pattern.test(value);
						// console.log(status, pattern);
					});
					return status;
				};
			}
		};
	})
	// validate password match
	.directive('phoneMatch', function() {
		return {
			restrict: 'A',
			scope: true,
			require: 'ngModel',
			link: function(scope, elem, attrs, ctrl) {
				var checker = function () {
					//get the value of the re-enter phone
					var e1 = scope.$eval(attrs.ngModel);

					//get the value of the first phone
					var e2 = scope.$eval(attrs.phoneMatch);
					return e1 === e2;
				};
				scope.$watch(checker, function (n) {
					//set the form ctrl to valid if both phone are the same, else invalid
					ctrl.$setValidity('phonematch', n);
				});
			}
		};
	})
	// validate account match
	.directive('accountMatch', function() {
		return {
			restrict: 'A',
			scope: true,
			require: 'ngModel',
			link: function(scope, elem, attrs, ctrl) {
				var checker = function () {
					//get the value of the re-enter account
					var e1 = scope.$eval(attrs.ngModel);

					//get the value of the first account
					var e2 = scope.$eval(attrs.accountMatch);
					return e1 === e2;
				};
				scope.$watch(checker, function (n) {
					//set the form ctrl to valid if both account are the same, else invalid
					ctrl.$setValidity('accountmatch', n);
				});
			}
		};
	})
	// select directive to return USA states list as options
	.directive('usaStates', function() {
		return {
			restrict: 'E',
			templateUrl: '<select ng-options="state.abb as state.name for state in states"> <option value="">{{ emptyName }}</option> </select>',
			replace: true,
			scope: true,

			link: function ($scope, element, attributes) {
				$scope.emptyName = attributes.emptyname || 'Select State';
			},

			controller: ['$scope', function ($scope) {
				$scope.selectedState = '';

				$scope.states = [
					{'name': 'Alabama', 'abb': 'AL'},
					{'name': 'Alaska', 'abb': 'AK'},
					{'name': 'Arizona', 'abb': 'AZ'},
					{'name': 'Arkansas', 'abb': 'AR'},
					{'name': 'California', 'abb': 'CA'},
					{'name': 'Colorado', 'abb': 'CO'},
					{'name': 'Connecticut', 'abb': 'CT'},
					{'name': 'Delaware', 'abb': 'DE'},
					{'name': 'District Of Columbia', 'abb': 'DC'},
					{'name': 'Florida', 'abb': 'FL'},
					{'name': 'Georgia', 'abb': 'GA'},
					{'name': 'Hawaii', 'abb': 'HI'},
					{'name': 'Idaho', 'abb': 'ID'},
					{'name': 'Illinois', 'abb': 'IL'},
					{'name': 'Indiana', 'abb': 'IN'},
					{'name': 'Iowa', 'abb': 'IA'},
					{'name': 'Kansas', 'abb': 'KS'},
					{'name': 'Kentucky', 'abb': 'KY'},
					{'name': 'Louisiana', 'abb': 'LA'},
					{'name': 'Maine', 'abb': 'ME'},
					{'name': 'Maryland', 'abb': 'MD'},
					{'name': 'Massachusetts', 'abb': 'MA'},
					{'name': 'Michigan', 'abb': 'MI'},
					{'name': 'Minnesota', 'abb': 'MN'},
					{'name': 'Mississippi', 'abb': 'MS'},
					{'name': 'Missouri', 'abb': 'MO'},
					{'name': 'Montana', 'abb': 'MT'},
					{'name': 'Nebraska', 'abb': 'NE'},
					{'name': 'Nevada', 'abb': 'NV'},
					{'name': 'New Hampshire', 'abb': 'NH'},
					{'name': 'New Jersey', 'abb': 'NJ'},
					{'name': 'New Mexico', 'abb': 'NM'},
					{'name': 'New York', 'abb': 'NY'},
					{'name': 'North Carolina', 'abb': 'NC'},
					{'name': 'North Dakota', 'abb': 'ND'},
					{'name': 'Ohio', 'abb': 'OH'},
					{'name': 'Oklahoma', 'abb': 'OK'},
					{'name': 'Oregon', 'abb': 'OR'},
					{'name': 'Pennsylvania', 'abb': 'PA'},
					{'name': 'Rhode Island', 'abb': 'RI'},
					{'name': 'South Carolina', 'abb': 'SC'},
					{'name': 'South Dakota', 'abb': 'SD'},
					{'name': 'Tennessee', 'abb': 'TN'},
					{'name': 'Texas', 'abb': 'TX'},
					{'name': 'Utah', 'abb': 'UT'},
					{'name': 'Vermont', 'abb': 'VT'},
					{'name': 'Virginia', 'abb': 'VA'},
					{'name': 'Washington', 'abb': 'WA'},
					{'name': 'West Virginia', 'abb': 'WV'},
					{'name': 'Wisconsin', 'abb': 'WI'},
					{'name': 'Wyoming', 'abb': 'WY'}
				];
			}]
		};
	})
	.directive('img', function () {
		return {
			restrict: 'E',
			link: function (scope, element) {
				// show an image-missing image
				element.bind('error', function () {
					var w = element.offsetWidth;
					var h = element.offsetHeight;
					// using 20 here because it seems even a missing image will have ~18px width
					// after this error function has been called
					if (w <= 20) {
						w = 100;
					}
					if (h <= 20) {
						h = 100;
					}
					var url = 'http://placehold.it/50x31?text=Image+not+found'; // or change for a default image
					element.prop('src', url);
					// element.css('border', 'double 3px #cccccc'); optionally we can add custom styles, etc
				});
			}
		};
	})
	// most popular / filter buttons /
	.directive('innerNavFilters', function() {
		return {
			restrict: 'AE',
			replace: true,
			templateUrl: 'app/shared/_inner-nav.html',
			// scope:true,
			// require: 'ngModel',
			link: function($scope) {

				var acronymText = {
					show: 'Show Filter',
					hide: 'Hide Filter'
				};

				$scope.acronymText = ($scope.showAcronym === true) ? acronymText.hide : acronymText.show;
				$scope.clearDisabled = true;

				$scope.showFilter = function() {
					$scope.showAcronym = !$scope.showAcronym;
					$scope.acronymText = ($scope.showAcronym === true) ? acronymText.hide : acronymText.show;
				};

				$scope.clearFilter = function(){
					$scope.letter = '';
					$scope.acronymDisabled = false;
					$scope.clearDisabled = true;
				};

				$scope.setFilter = function(value) {
					$scope.letter = value;
					$scope.clearDisabled = false;
				};
			}
		};
	});
}());
