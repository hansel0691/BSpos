(function () {
	'use strict';

	var app = angular.module('posApp', ['ngRoute', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'loginServices', 'adminServices', 'sharedServices', 'prodsServices', 'LocalStorageModule', 'appFilters', 'customFunctions', 'promosServices', 'billPaymentServices', 'sunpassServices', 'directTvServices', 'ajoslin.promise-tracker', 'datePicker', 'flash']);
// 720kb.datepicker
	// api url constant
	app.constant('API_URL', 'http://bsapi.pinserve.com/api/');
	app.constant('SITE_URL', 'http://mobile.blackstonepos.com/');
	//app.constant('SITE_URL', 'file:///D:/Projects/BlackstonePOSAngularJs/BlackstonePos.UI/index.html#');
//	 app.constant('API_URL', 'http://localhost:50230/api/');

	// Routes config
	app.config(['$routeProvider',
		function($routeProvider) {

		$routeProvider
			.when('/login', {
				controller: 'LoginCtrl',
				templateUrl: './app/login/_login.html'
			})
			.when( '/', {
				controller: 'HomeCtrl',
				templateUrl: 'app/home/_home.html'
			})
			.when('/admin', {
				controller: 'AdminCtrl',
				templateUrl: './app/admin/_admin.html'
			})
			// PROMOTIONS
			.when( '/pos/category/promotions', {
				controller: 'PromosCtrl',
				templateUrl: 'app/promotions/_index-promos.html'
			})
			// categories
			.when( '/pos/category/:category', {
				controller: 'IndexByCategoryCtrl',
				templateUrl: 'app/products/_index-products.html'
			})
			.when( '/pos/category/:category/amount/:amount', {
				controller: 'IndexByCategoryCtrl',
				templateUrl: 'app/products/_index-products.html'
			})
			// countries
			.when( '/pos/category/:category/countries', {
				controller: 'IndexCountriesByCategoryCtrl',
				templateUrl: 'app/products/_index-countries.html'
			})
			.when( '/pos/category/:category/country/:country', {
				controller: 'IndexByCategoryByCountryCtrl',
				templateUrl: 'app/products/_index-products.html'
			})
			// carriers
			.when( '/pos/category/:category/carriers', {
				controller: 'IndexByCarriersCtrl',
				templateUrl: 'app/products/_index-carriers.html'
			})
			.when( '/pos/category/:category/carrier/:carrier', {
				controller: 'IndexByCategoryByCarrierCtrl',
				templateUrl: 'app/products/_index-products.html'
			})
			.when( '/pos/category/:category/product/:id', {
				controller: 'ShowProductCtrl',
				templateUrl: 'app/products/_show-product.html'
			})
			// BILL PAYMENT
			.when( '/billpayment/categories', {
				controller: 'IndexCategoriesBillPaymentCtrl',
				templateUrl: 'app/billpayment/_index-categories.html'
			})
			.when( '/billpayment/category/:category', {
				controller: 'IndexByCategoryBillPaymentCtrl',
				templateUrl: 'app/billpayment/_index-billers.html'
			})
			.when( '/billpayment/popular', {
				controller: 'IndexByPopularBillPaymentCtrl',
				templateUrl: 'app/billpayment/_index-categories.html'
			})
			.when( '/billpayment/biller/:biller', {
				controller: 'ShowBillPaymentCtrl',
				templateUrl: 'app/billpayment/_show-biller.html'
			})
			// sunpass
			.when( '/sunpass/category/documents', {
				controller: 'DocumentsSunpassCtrl',
				templateUrl: 'app/sunpass/_documents-sunpass.html'
			})
			.when( '/sunpass/category/replenish', {
				controller: 'ReplenishSunpassCtrl',
				templateUrl: 'app/sunpass/_replenish-sunpass.html'
			})
			.when( '/sunpass', {
				controller: 'IndexSunpassCtrl',
				templateUrl: 'app/sunpass/_index-sunpass.html'
			})
			// DIRECT TV
			.when( '/directtv/categories', {
				controller: 'IndexDirectTvCategoriesCtrl',
				templateUrl: 'app/directtv/_index-categories-dtv.html'
			})
			.when( '/directtv/category/:category', {
				controller: 'IndexDirectTvByCategoryCtrl',
				templateUrl: 'app/directtv/_index-dtv.html'
			})
			.when( '/directtv/product/:product', {
				controller: 'showDirectTvCtrl',
				templateUrl: 'app/directtv/_show-dtv.html'
			})
			.when( '/terms/:id', {
				controller: 'ShowTermsCtrl',
				templateUrl: 'app/products/_show-terms.html'
			})
			// others
			.when( '/others', {
				controller: 'directTvCtrl',
				templateUrl: 'app/directtv/_index-directtv.html'
			})
			.otherwise( {redirectTo: '/login'});
			// $locationProvider.html5Mode(true);
	}]);

	// watch when the route changes with success check if the user is allowed to access the requested url.
	app.run(['$rootScope', '$location', 'AuthenticationFactory', function ($rootScope, $location, AuthenticationFactory) {
		$rootScope.$on('$routeChangeSuccess', function (event) {

			if (!AuthenticationFactory.isLoggedIn()) {

				console.log('DENY');
				$location.path('/login');

			} else {

				console.log('ALLOW');
				// $location.path('/');

			}
		});
	}]);

	// app.run(['$rootScope', '$location', 'AlertService', function ($rootScope, $location, AlertService) {
	// 	$rootScope.$on('$routeChangeSuccess', function (userInfo) {
	// 		// console.log(userInfo);
	// 		// $rootScope.userInfo = userInfo;
	// 		// clear messagess on route change (controller change)
	// 		AlertService.clear();
	// 	});

	// 	$rootScope.$on('$routeChangeError', function (event, current, previous, eventObj) {
	// 		if (eventObj.authenticated === false) {
	// 			$location.path('/login');
	// 		}
	// 	});
	// }]);

	// Method to go back on navigation
	// might ngInject
	app.run(['$rootScope', '$location', function ($rootScope, $location) {
		var history = [];
		$rootScope.$on('$routeChangeSuccess', function() {
			history.push($location.$$path);
		});

		$rootScope.back = function () {
			var prevUrl = history.length > 1 ? history.splice(-2)[0] : '/';
			$location.path(prevUrl);
		};
	}]);

	// make loadingTracker available on any view.
	// might ngInject
	app.run(['$rootScope', 'promiseTracker', function($rootScope, promiseTracker) {
		$rootScope.loadingTracker = promiseTracker({activationDelay: 100, minDuration: 350});
		$rootScope.loadingMerchantTracker = promiseTracker({activationDelay: 100, minDuration: 350});
		$rootScope.loadingAdminTracker = promiseTracker({activationDelay: 100, minDuration: 350});
	}]);

	// Scrolling To An Element By ID With Routing. Will route and then scroll to foo.
	// Pass a parameters into $routeParams via a faux-querystring.
	// example: <a href='#/test/123/?scrollTo=foo'>Test id=123, scroll to #foo
	// might ngInject
	// TODO: scroll to
	// app.run(['$rootScope', '$location', '$anchorScroll', '$routeParams', function($rootScope, $location, $anchorScroll, $routeParams) {
	// 	$rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
	// 		$location.hash($routeParams.scrollTo);
	// 		$anchorScroll();

	// 	});
	// }]);

	// Config snapRemoteProvider
	// app.config(['snapRemoteProvider', function(snapRemoteProvider) {
	// 	snapRemoteProvider.globalOptions = {
	// 		disable: 'left',
	// 		tapToClose: false,
	// 		touchToDrag: false,
	// 		maxPosition: 300,
	// 		minPosition: -300
	// 	};
	// }]);

	// Config localStorageServiceProvider
	app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('pos');
	}]);

	// Config $httpProvider
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
					} else if (value instanceof Object) {
						for (subName in value) {
							subValue = value[subName];
							fullSubName = name + '[' + subName + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if (value !== undefined && value !== null) {
						query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
					}
				}
				return query.length ? query.substr(0, query.length - 1) : query;
			};
			return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		}];
	}]);
}());
