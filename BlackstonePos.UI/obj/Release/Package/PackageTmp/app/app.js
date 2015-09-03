'use strict';

var app = angular.module('posApp', ['ngRoute', 'snap', 'ngResource', 'ui.bootstrap', 'loginServices', 'sharedServices', 'prodsServices', 'LocalStorageModule', 'appFilters', 'customFunctions', 'promosServices']);

// api url constant
app.constant('API_URL', 'http://bsapi.pinserve.com/api/');
app.constant('API_DEV_URL', 'http://demos.pinserve.com/');

/**
 * Routes config
 */
app.config(['$routeProvider',
	function($routeProvider) {

	$routeProvider
		.when( "/", {
			controller: "HomeCtrl",
			templateUrl: "app/home/_home.html",
			resolve: {
				auth: function ($q, AuthenticationFactory) {

					var userInfo = AuthenticationFactory.getUserInfo();

					if (userInfo && userInfo.userName != null) {
						return $q.when(userInfo);
					} else {
						return $q.reject({ authenticated: false });
					}
				}
			}
		})
		.when("/login", {
			controller: "LoginCtrl",
			templateUrl: "app/login/_login.html"
		})
		// categories
		.when( "/pos/category/:category", {
			controller: "IndexByCategoryCtrl",
			templateUrl: "app/products/_index-products.html"
		})
		.when( "/pos/category/:category/amount/:amount", {
			controller: "IndexByCategoryCtrl",
			templateUrl: "app/products/_index-products.html"
		})
		// countries
		.when( "/pos/category/:category/countries", {
			controller: "IndexByCountriesCtrl",
			templateUrl: "app/products/_index-countries.html"
		})
		.when( "/pos/category/:category/country/:country", {
			controller: "IndexByCategoryByCountryCtrl",
			templateUrl: "app/products/_index-products.html"
		})
		// carriers
		.when( "/pos/category/:category/carriers", {
			controller: "IndexByCarriersCtrl",
			templateUrl: "app/products/_index-carriers.html"
		})
		.when( "/pos/category/:category/carrier/:carrier", {
			controller: "IndexByCategoryByCarrierCtrl",
			templateUrl: "app/products/_index-products.html"
		})
		// product
		.when( "/pos/promotions", {
			controller: "PromosCtrl",
			templateUrl: "app/promotions/_index-promos.html"
		})
		.when( "/pos/category/:category/product/:id", {
			controller: "ShowProductCtrl",
			templateUrl: "app/products/_show-product.html"
		})
		// sunpass
		.when( "/sunpass", {
			controller: "SunPassCtrl",
			templateUrl: "app/sunpass/_index-sunpass.html"
		})
		// billpayment
		.when( "/pos/billpayment", {
			controller: "BillPaymentCategoriesCtrl",
			templateUrl: "app/billpayment/_index-billpayment.html"
		})
		.otherwise( { redirectTo: "/" });
		// $locationProvider.html5Mode(true);
}]);

app.run(["$rootScope", "$location", "AlertService", function ($rootScope, $location, AlertService) {

	$rootScope.$on("$routeChangeSuccess", function (userInfo) {
		// console.log(userInfo);
		// $rootScope.userInfo = userInfo;
		// clear messagess on route change (controller change)
		AlertService.clear();
	});

	$rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
		if (eventObj.authenticated === false) {
			$location.path("/login");
		}
	});
}]);

/**
 * Method to go back on navigation
 */
app.run(["$rootScope", "$location", function ($rootScope, $location) {
	var history = [];
	$rootScope.$on('$routeChangeSuccess', function() {
		history.push($location.$$path);
	});

	$rootScope.back = function () {
		var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
		$location.path(prevUrl);
	};
}]);

/**
 * Scrolling To An Element By ID With Routing
 * Will route and then scroll to foo. Pass a parameters into $routeParams via a faux-querystring. example: <a href="#/test/123/?scrollTo=foo">Test id=123, scroll to #foo</a>
 */
app.run(function($rootScope, $location, $anchorScroll, $routeParams) {
	$rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
		$location.hash($routeParams.scrollTo);
		$anchorScroll();
	});
});


/**
 * Config xeditable
 */
// app.run(function(editableOptions) {
// 	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
// });


/**
 * Config snapRemoteProvider
 */
app.config(function(snapRemoteProvider) {
	snapRemoteProvider.globalOptions = {
		tapToClose: false,
		touchToDrag: false,
		maxPosition: 286,
		minPosition: -286,
	}
});

/**
 * Config localStorageServiceProvider
 */
app.config(function (localStorageServiceProvider) {
	localStorageServiceProvider
		.setPrefix('pos')
		// .setStorageType('sessionStorage')
		// .setNotify(true, true)
});

/**
 * Config $httpProvider
 */
app.config(['$httpProvider', function ($httpProvider) {

	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function (data) {
		/**
		 * The workhorse; converts an object to x-www-form-urlencoded serialization.
		 * @param {Object} obj
		 * @return {String}
		 */
		var param = function (obj) {
			var query = '';
			var name, value, fullSubName, subName, subValue, innerObj, i;
			for (name in obj) {
				value = obj[name];
				if (value instanceof Array) {
					for (i = 0; i < value.length; ++i) {
						subValue = value[i];
						fullSubName = name + '[' + i + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if (value instanceof Object) {
					for (subName in value) {
						subValue = value[subName];
						fullSubName = name + '[' + subName + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if (value !== undefined && value !== null) {
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
				}
			}
			return query.length ? query.substr(0, query.length - 1) : query;
		};
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
}]);
