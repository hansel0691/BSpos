(function () {
    'use strict';

    var app = angular.module('posApp', ['ngRoute', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'loginServices', 'adminServices', 'sharedServices', 'prodsServices', 'LocalStorageModule', 'appFilters', 'customFunctions', 'promosServices', 'billPaymentServices', 'sunpassServices', 'directTvServices', 'ajoslin.promise-tracker', 'datePicker', 'flash']);
    // 720kb.datepicker
    // api url constant
    app.constant('API_URL', 'http://bsapi.pinserve.com/api/');
    app.constant('SITE_URL', 'http://mobile.blackstonepos.com/');
//    app.constant('SITE_URL', 'file:///D:/Projects/BlackstonePOSAngularJs/Pos.UI/index.html#');
//    app.constant('API_URL', 'http://localhost:50230/api/');

    // Routes config
    app.config(['$routeProvider',
		function ($routeProvider) {

		    $routeProvider
                .when('/login', {
                    controller: 'LoginCtrl',
                    templateUrl: './app/login/_login.html'
                })
                .when('/', {
                    controller: 'HomeCtrl',
                    templateUrl: 'app/home/_home.html'
                })
                .when('/admin', {
                    controller: 'AdminCtrl',
                    templateUrl: './app/admin/_admin.html'
                })
                // PROMOTIONS
                .when('/pos/category/promotions', {
                    controller: 'PromosCtrl',
                    templateUrl: 'app/promotions/_index-promos.html'
                })
                // categories
                .when('/pos/category/:category', {
                    controller: 'IndexByCategoryCtrl',
                    templateUrl: 'app/products/_index-products.html'
                })
                .when('/pos/category/:category/amount/:amount', {
                    controller: 'IndexByCategoryCtrl',
                    templateUrl: 'app/products/_index-products.html'
                })
                // countries
                .when('/pos/category/:category/countries', {
                    controller: 'IndexCountriesByCategoryCtrl',
                    templateUrl: 'app/products/_index-countries.html'
                })
                .when('/pos/category/:category/country/:country', {
                    controller: 'IndexByCategoryByCountryCtrl',
                    templateUrl: 'app/products/_index-products.html'
                })
                // carriers
                .when('/pos/category/:category/carriers', {
                    controller: 'IndexByCarriersCtrl',
                    templateUrl: 'app/products/_index-carriers.html'
                })
                .when('/pos/category/:category/carrier/:carrier', {
                    controller: 'IndexByCategoryByCarrierCtrl',
                    templateUrl: 'app/products/_index-products.html'
                })
                .when('/pos/category/:category/product/:id', {
                    controller: 'ShowProductCtrl',
                    templateUrl: 'app/products/_show-product.html'
                })
                // BILL PAYMENT
                .when('/billpayment/categories', {
                    controller: 'IndexCategoriesBillPaymentCtrl',
                    templateUrl: 'app/billpayment/_index-categories.html'
                })
                .when('/billpayment/category/:category', {
                    controller: 'IndexByCategoryBillPaymentCtrl',
                    templateUrl: 'app/billpayment/_index-billers.html'
                })
                .when('/billpayment/popular', {
                    controller: 'IndexByPopularBillPaymentCtrl',
                    templateUrl: 'app/billpayment/_index-categories.html'
                })
                .when('/billpayment/biller/:biller', {
                    controller: 'ShowBillPaymentCtrl',
                    templateUrl: 'app/billpayment/_show-biller.html'
                })
                // sunpass
                .when('/sunpass/category/documents', {
                    controller: 'DocumentsSunpassCtrl',
                    templateUrl: 'app/sunpass/_documents-sunpass.html'
                })
                .when('/sunpass/category/replenish', {
                    controller: 'ReplenishSunpassCtrl',
                    templateUrl: 'app/sunpass/_replenish-sunpass.html'
                })
                .when('/sunpass', {
                    controller: 'IndexSunpassCtrl',
                    templateUrl: 'app/sunpass/_index-sunpass.html'
                })
                // DIRECT TV
                .when('/directtv/categories', {
                    controller: 'IndexDirectTvCategoriesCtrl',
                    templateUrl: 'app/directtv/_index-categories-dtv.html'
                })
                .when('/directtv/category/:category', {
                    controller: 'IndexDirectTvByCategoryCtrl',
                    templateUrl: 'app/directtv/_index-dtv.html'
                })
                .when('/directtv/product/:product', {
                    controller: 'showDirectTvCtrl',
                    templateUrl: 'app/directtv/_show-dtv.html'
                })
                .when('/terms/:id', {
                    controller: 'ShowTermsCtrl',
                    templateUrl: 'app/products/_show-terms.html'
                })
                // others
                .when('/others', {
                    controller: 'directTvCtrl',
                    templateUrl: 'app/directtv/_index-directtv.html'
                })
                .otherwise({ redirectTo: '/login' });
		    // $locationProvider.html5Mode(true);
		}]);

    // watch when the route changes with success check if the user is allowed to access the requested url.
    app.run(['$rootScope', '$location', 'AuthenticationFactory', function ($rootScope, $location, AuthenticationFactory) {
        $rootScope.$on('$routeChangeSuccess', function (event) {

            if (!AuthenticationFactory.isLoggedIn()) {

                console.log('OUT!');

                void 0;
                $location.path('/login');

            } else {

                void 0;
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
        $rootScope.$on('$routeChangeSuccess', function () {
            history.push($location.$$path);
        });

        $rootScope.back = function () {
            var prevUrl = history.length > 1 ? history.splice(-2)[0] : '/';
            $location.path(prevUrl);
        };
    }]);

    // make loadingTracker available on any view.
    // might ngInject
    app.run(['$rootScope', 'promiseTracker', function ($rootScope, promiseTracker) {
        $rootScope.loadingTracker = promiseTracker({ activationDelay: 100, minDuration: 350 });
        $rootScope.loadingMerchantTracker = promiseTracker({ activationDelay: 100, minDuration: 350 });
        $rootScope.loadingAdminTracker = promiseTracker({ activationDelay: 100, minDuration: 350 });
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



(function () {
    'use strict';
    angular.module('posApp')
	// AdminCtrl
	.controller('AdminCtrl', ['$rootScope', '$scope', '$location', 'localStorageService', 'AuthenticationFactory', 'ExternalFactory', 'AdminFactory', 'CashierFactory', 'OrderFactory', 'SettingsFactory', 'AchPaymentFactory', 'Flash', '$modal', '$filter', '$document', '$timeout',
		function ($rootScope, $scope, $location, localStorageService, AuthenticationFactory, ExternalFactory, AdminFactory, CashierFactory, OrderFactory, SettingsFactory, AchPaymentFactory, Flash, $modal, $filter, $document, $timeout) {

		    // clear flash messages from previous view
		    Flash.dismiss();

		    // $scope.userInfo = {};
		    var userInfo = localStorageService.get('userInfo');
		    // console.log(userInfo);
		    var MerchantId;
		    var MerchantPassword;
		    $scope.filename = '';

		    // datepicker
		    $scope.initDates = function () {
		        var startDate = new Date();
		        $scope.start = startDate.setMonth(startDate.getMonth());
		        $scope.end = new Date();
		    };
		    $scope.initDates();

		    $scope.todayDates = function () {
		        var startDate = new Date();
		        $scope.start = startDate.setDate(startDate.getDate() - 1);
		        $scope.end = new Date();
		    };

		    $scope.tabs = [
                { title: 'Cashiers', active: null },
                { title: 'Settings', active: null },
                { title: 'Orders', active: null }
		    ];

		    // get previous active tab index
		    var activeTab = parseInt(localStorageService.get('adminTab'));
		    void 0;

		    // if exist active it
		    if (activeTab && activeTab != null) {
		        $scope.tabs[activeTab].active = true;
		    } else {
		        $scope.tabs[0].active = true;
		    }
		    // save current tab index
		    $scope.saveState = function (tab) {
		        Flash.dismiss();
		        localStorageService.set('adminTab', tab);
		    };

		    MerchantId = userInfo.MerchantId;
		    MerchantPassword = userInfo.MerchantPassword;

		    function copySelectedAchPaymentObj(selectedAch) {
		        if (selectedAch == null) {
		            return;
		        }
		        $scope.payment.Id = selectedAch.Id;
		        $scope.payment.AccountNumber = selectedAch.AccountNumber;
		        $scope.payment.RoutingNumber = selectedAch.RoutingNumber;
		        $scope.payment.TypeChecking = selectedAch.TypeChecking;
		        $scope.payment.SaveAccount = selectedAch.SaveAccount;
		    }

		    function copySelectedCashierObj(selectedCashier) {
		        $scope.editcashier.id = selectedCashier.Id;
		        $scope.editcashier.name = selectedCashier.Name;
		        $scope.editcashier.password = selectedCashier.Password;
		    }

		    // payment fuctions
		    var initPaymentsScope = function () {
		        $scope.payment = {
		            Id: 0,
		            AccountNumber: null,
		            RoutingNumber: null,
		            TypeChecking: true,
		            SaveAccount: false,
		            MerchantId: userInfo.MerchantId,
		            Amount: 0
		        };
		    };

		    var initOverSession = function () {
		        var adminLogged = userInfo.IsMerchant;
		        localStorageService.set('adminLogged', adminLogged);
		        $scope.adminLogged = adminLogged;
		        // console.log();
		        // console.log('admin logged: '+ adminLogged);
		    };

		    // init settings scope
		    var initSettingsScope = function () {
		        $scope.settings = {
		            SmallReceipt: null,
		            Tax: null,
		            ConfirmPhone: null,
		            PaxTerminalAsPrinter: null
		        };
		    };

		    // init cachiers scope
		    var initCashiersScope = function () {
		        $scope.cashier = {
		            id: null,
		            name: null,
		            password: null
		        };
		        $scope.editcashier = {
		            id: null,
		            name: null,
		            password: null
		        };
		    };

		    // INIT $SCOPE
		    initOverSession();
		    initPaymentsScope();
		    initCashiersScope();
		    initSettingsScope();
		    initOverSession();

		    // PAYMENTS
		    // get saved payments method
		    $scope.getSavedAchPayments = function () {
		        AdminFactory.getSavedAchPayments().then(
                    function (data) {
                        $scope.achs = data;
                        $scope.spin = false;
                        if (data != null && data.length > 0) {
                            copySelectedAchPaymentObj(data[0]);
                        }
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };


		    // add founds to account
		    $scope.addAchFunds = function () {
		        AdminFactory.addAchFunds($scope.payment.Id, $scope.payment.AccountNumber, $scope.payment.RoutingNumber, $scope.payment.MerchantId, $scope.payment.Amount, $scope.payment.SaveAccount, $scope.payment.TypeChecking)
                .then(
                    function (data) {
                        //console.log(data);
                        Flash.create('success', data, '');
                        $scope.getSavedAchPayments();
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };

		    // select
		    $scope.setSelectedCashier = function () {
		        copySelectedCashierObj(this.cashier);
		        $scope.editMode = true;
		        // $scope.selected = item;
		    };
		    // get cashier
		    $scope.getCashiers = function () {
		        CashierFactory.getCashiers(MerchantId, MerchantPassword).then(
                    function (data) {
                        $scope.cashiers = data;
                        // console.log(data);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    // delete cashier
		    $scope.deleteCashier = function (cashierId) {
		        if (confirm('Are you sure you want to delete this cashier?')) {
		            CashierFactory.deleteCashier(userInfo.MerchantId, userInfo.MerchantPassword, cashierId)
                    .then(
                        function (response) {
                            Flash.create('success', response.ErrorMessage, '');
                            $scope.getCashiers();
                        },
                        function (err) {
                            Flash.create('error', err.ErrorMessage, '');
                            void 0;
                        }
                    );
		        }
		    };
		    // save cashier
		    $scope.saveCashier = function () {
		        CashierFactory.saveCashier(userInfo.MerchantId, userInfo.MerchantPassword, $scope.cashier.name, $scope.cashier.password)
                .then(
                    function (response) {
                        if (response.Status == 200) {
                            Flash.create('success', 'Cashier Successfully Added!', '');

                        } else {
                            Flash.create('error', response.ErrorMessage, '');
                        }
                        initCashiersScope();
                        $scope.getCashiers();
                    },
                    function (err) {
                        Flash.create('error', err.ErrorMessage, '');
                        void 0;
                    }
                );
		    };
		    // update
		    $scope.updateCashier = function () {
		        CashierFactory.editCashier(userInfo.MerchantId, userInfo.MerchantPassword, $scope.editcashier.id, $scope.editcashier.name, $scope.editcashier.password)
                .then(
                    function (response) {
                        if (response.Status == 200) {
                            Flash.create('success', 'Cashier Successfully Updated!', '');
                        } else {
                            Flash.create('error', response.ErrorMessage, '');
                        }
                        initCashiersScope();
                        $scope.editMode = false;
                        $scope.getCashiers();
                    },
                    function (err) {
                        Flash.create('error', err.ErrorMessage, '');
                        void 0;
                    }
                );
		    };

		    $scope.cancelEditCashier = function () {
		        $scope.editMode = false;
		    };
		    // ORDERS
		    // pagination vars
		    $scope.currentPage = 1;
		    $scope.perPage = 10;
		    $scope.noOfPages = 15;
		    $scope.totalItems = 0;
		    $scope.maxSize = 5;

		    // GET ORDERS
		    $scope.getOrders = function () {

		        // console.log($filter('date')($scope.start, 'shortDate', '-0500'));
		        // console.log($filter('date')($scope.end, 'shortDate', '-0500'));

		        var start = $filter('date')($scope.start, 'shortDate', '-0500');
		        void 0;

		        var end = $filter('date')($scope.end, 'shortDate', '-0500');
		        void 0;

		        OrderFactory.getOrders(start, end, $scope.currentPage, $scope.perPage, userInfo).then(
                    function (data) {
                        $scope.orders = data.Data;
                        $scope.totalItems = data.Count;
                        $scope.spin = false;
                        // console.log(data.Count);
                    },
                    function (err) {
                        Flash.create('error', err.ErrorMessage, '');
                        void 0;
                    }
                );
		    };

		    $scope.getAllOrdersSummary = function () {

		        var start = $filter('date')($scope.start, 'shortDate', '-0500');
		        var end = $filter('date')($scope.end, 'shortDate', '-0500');

		        OrderFactory.getAllOrdersSummary(start, end, userInfo).then(
                    function (data) {
                        $scope.sumary = data.Data;
                        // console.log(data.Count);
                    },
                    function (err) {
                        Flash.create('error', err.ErrorMessage, '');
                        void 0;
                    }
                );
		    };

		    // ON CURRENT PAGE CHANGE getOrders()
		    $scope.pageChanged = function (page) {
		        $scope.currentPage = page;
		        $scope.getOrders();
		    };

		    // SETTINGS
		    // GET SETTINGS
		    $scope.getSettings = function () {
		        SettingsFactory.getSettings().then(
                    function (data) {
                        var arr = data;
                        localStorageService.set('settings', arr);
                        $scope.settings = arr;
                        // console.log(arr);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    // UPDATE SETTINGS
		    $scope.updateSettings = function (form) {

		        // Trigger validation flag.
		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            Flash.dismiss();
		            Flash.create('error', 'Check errors below (in red color)', '');
		            return;
		        }

		        if (form.$valid) {
		            SettingsFactory.updateSettings(userInfo.MerchantId, $scope.settings.SmallReceipt, $scope.settings.Tax, $scope.settings.ConfirmPhone, $scope.settings.PaxTerminalAsPrinter)
                    .then(
                        function (response) {
                            if (response.Status === 200) {
                                $scope.updateSettingsResponse = response;
                                localStorageService.set('settings', response.Data);

                                Flash.create('success', 'Settings successfuly updated!', '');
                                void 0;
                            } else {
                                Flash.create('success', response.ErrorMessage, '');
                            }
                        },
                        function (err) {
                            Flash.create('error', err.ErrorMessage, '');
                            void 0;
                        }
                    );
		        }
		    };


		    $scope.loginOverSesion = function (password) {
		        AuthenticationFactory.login(userInfo.MerchantId, password)
                .then(
                    function (response) {
                        // console.log(response);
                        if (response.Status === 200) {
                            $scope.adminLogged = response.UserInfo.IsMerchant;
                            void 0;
                        } else {
                            Flash.create('error', 'Invalid Admin Credentials!', '');
                        }
                    },
                    function (err) {
                        Flash.create('error', 'Invalid Admin Credentials', '');
                        void 0;
                    }
                );
		    };

		    // Form submit handler.
		    $scope.submit = function (form) {
		        // Trigger validation flag.
		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            Flash.dismiss();
		            // Flash.create('error', 'Check errors below', '');
		            return;
		        }

		        if (form.$valid) {
		            // remove any previous flash
		            Flash.dismiss();

		            // add founds to account
		            AdminFactory.addAchFunds($scope.Id, $scope.AccountNumber, $scope.RoutingNumber, $scope.MerchantId, $scope.Amount, $scope.SaveAccount, $scope.TypeChecking)
                    .then(
                        function (response) {
                            // $scope.achs = response;
                            Flash.create('success', response, '');
                            // console.log(response);
                        },
                        function (err) {
                            Flash.create('error', err.ErrorMessage, '');
                            void 0;
                        }
                    );
		        }
		    };

		    // Update orders
		    $scope.updateOrders = function () {
		        $scope.spin = true;
		        $scope.getOrders();
		    };

		    // GET ADMIN DATA
		    $scope.getSettings();
		    $scope.getCashiers();
		    $scope.getOrders();
		    $scope.getAllOrdersSummary();

		    // set dates to today, from and to
		    $scope.today = function () {
		        $scope.todayDates();
		        $scope.getOrders();
		        $scope.getAllOrdersSummary();
		        void 0;
		    };
		    // set dates to default, from 6 months to today
		    $scope.clear = function () {
		        $scope.initDates();
		        $scope.getOrders();
		        $scope.getAllOrdersSummary();
		        void 0;
		    };
		    // let user ask for orders by custom dates
		    $scope.getOrdersByDate = function (ordersByDate) {
		        // update start $ end values in scope
		        $scope.start = ordersByDate.start.$modelValue;
		        $scope.end = ordersByDate.end.$modelValue;

		        // get orders & summary
		        $scope.getOrders();
		        $scope.getAllOrdersSummary();
		    };

		    $scope.refundOrder = function (orderId) {
		        void 0;
		        OrderFactory.refundOrder(orderId, userInfo).then(
                    function (response) {
                        if (response.Status === 200) {
                            Flash.create('success', response.ErrorMessage, '');
                            // update item refunded in scope, don't ask to server as
                            // the Status was 200, success
                            angular.forEach($scope.orders, function (item) {
                                if (item.Id === orderId) {
                                    item.IsRefundable = false;
                                    // console.log(orderId);
                                }
                            });
                        } else {
                            // print error error message is status isn't 200
                            Flash.create('danger', response.ErrorMessage, '');
                        }
                    },
                    function (err) {
                        // print error error message
                        Flash.create('danger', err.ErrorMessage, '');
                        void 0;
                    }
                );
		    };
		    $scope.reSendOrderConfirmation = function (orderId) {
		        void 0;
		        OrderFactory.reSendOrderConfirmation(orderId, userInfo).then(
                    function (response) {
                        // console.log(response);
                        if (response.Status === 200) {
                            //Open modal with info about billing order...the obj response should have receipt
                            $modal.open({
                                templateUrl: './app/admin/_modal-receipt.html',
                                controller: 'ModalReceiptCtrl',
                                size: 'lg',
                                windowClass: 'product-modal',
                                resolve: {
                                    receipt: function () {
                                        return response.Data;
                                    },
                                    item : function() {
                                        return null;
                                    }
                                }
                            });
                            

                        } else {
                            Flash.create('danger', response.ErrorMessage, 'Error');
                        }
                    },
                    function (err) {
                        Flash.create('danger', err.ErrorMessage, '');
                        void 0;
                    }
                );
		    };

		    // download as CSV.
		    $scope.downloadAsCvs = function (ordersByDate) {
		        void 0;

		        var start = $filter('date')(ordersByDate.start.$modelValue, 'MM/dd/yy', '-0500');
		        var end = $filter('date')(ordersByDate.end.$modelValue, 'MM/dd/yy', '-0500');

		        void 0;

		        OrderFactory.downloadAsCvs(start, end, userInfo).then(
                    function (response) {

                        // console.log(response);
                        var csvHeader = [];
                        var headers = '';
                        var rows = '';
                        var orders = '';
                        // take header from object keys
                        angular.forEach(response.Data[0], function (value, key) {
                            csvHeader.push('"' + key + '"');
                        });

                        headers = csvHeader.toString();
                        // take each object and make a row
                        angular.forEach(response.Data, function (item) {
                            var csvRow = [];

                            angular.forEach(item, function (value) {
                                csvRow.push('"' + value + '"');
                            });

                            rows = rows.concat(csvRow.toString());
                            rows = rows.concat('\n');
                        });
                        // compose data
                        orders = orders.concat(headers);
                        orders = orders.concat('\n');
                        orders = orders.concat(rows);
                        // construc file name using dates
                        $scope.doFilename = function () {
                            return 'orders-from-' + start.replace(/[^0-9\.]+/g, '') + '-to-' + end.replace(/[^0-9\.]+/g, '') + '.csv';
                        };
                        // start building csv file
                        var charset = $scope.charset || 'utf-8';
                        var blob = new Blob([orders], {
                            type: 'text/csv;charset=' + charset + ';'
                        });
                        // construc link & download it
                        if (window.navigator.msSaveOrOpenBlob) {
                            navigator.msSaveBlob(blob, $scope.doFilename());
                        } else {
                            var downloadLink = angular.element('<a></a>');
                            downloadLink.attr('href', window.URL.createObjectURL(blob));
                            downloadLink.attr('download', $scope.doFilename());
                            downloadLink.attr('target', '_blank');

                            $document.find('body').append(downloadLink);

                            $timeout(function () {
                                downloadLink[0].click();
                                downloadLink.remove();
                            }, null);
                        }

                    },
                    function (err) {
                        void 0;
                    }
                );
		    };
		    // send CSV via email
		    $scope.sendAsEmail = function (ordersByDate) {
		        // setup params
		        var start = $filter('date')(ordersByDate.start.$modelValue, 'MM/dd/yy', '-0500');
		        var end = $filter('date')(ordersByDate.end.$modelValue, 'MM/dd/yy', '-0500');
		        var email = ordersByDate.email.$modelValue;

		        OrderFactory.sendAsEmail(start, end, email, userInfo).then(
                    function (response) {
                        void 0;

                        if (response.Status === 200) {
                            Flash.create('success', response.ErrorMessage, '');
                            // $scope.email = '';
                        }
                    },
                    function (err) {
                        // success, info, warning, danger
                        Flash.create('danger', err.ErrorMessage, '');
                        void 0;
                    }
                );
		    };
		}]);
}());

(function () {
    'use strict';
    angular.module('adminServices', [])
	.factory('MerchantFactory', ['$http', '$rootScope', 'API_URL', '$q',
		function ($http, $rootScope, API_URL, $q) {
		    // Return merchant account details
		    var merchant;

		    // http interceptor
		    var loadingTracker = { tracker: $rootScope.loadingMerchantTracker };

		    // get user info from localStorageService
		    // var userInfo = localStorageService.get('userInfo');
		    // console.log(userInfo);

		    // if (userInfo){
		    // 	merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword};
		    // } else {
		    // 	console.log('fail to get userInfo on sharedServices.js')
		    // }

		    return {
		        // get merchant sales details
		        getSalesSummary: function (MerchantId, MerchantPassword) {
		            var deferred = $q.defer();

		            merchant = { MerchantId: MerchantId, MerchantPassword: MerchantPassword };

		            $http.post(API_URL + 'Merchant/GetSalesSummary', merchant, loadingTracker)
                    .then(
                        function (response) {

                            if (response.data.Status === 200) {
                                var merchantSales = {
                                    todaySales: response.data.Data.TodaySales,
                                    dailyCreditLimit: response.data.Data.DailyCreditLimit,
                                    daylyBalance: response.data.Data.DaylyBalance,
                                    weeklyCreditLimit: response.data.Data.WeeklyCreditLimit,
                                    weeklyBalance: response.data.Data.WeeklyBalance
                                };
                            } else {
                                void 0;
                            }
                            // console.log(JSON.stringify(response));
                            deferred.resolve(merchantSales);

                        }, function (response) {
                            deferred.reject(response);
                            void 0;
                        }
                    );

		            return deferred.promise;
		        },
		        // get merchant balance details
		        getBalanceDetails: function (MerchantId, MerchantPassword) {
		            var deferred = $q.defer();

		            merchant = { 'MerchantId': MerchantId, 'MerchantPassword': MerchantPassword };

		            $http.post(API_URL + 'Merchant/GetBalanceDetails', merchant, loadingTracker)
                    .then(
                        function (response) {

                            if (response.data.Status === 200) {
                                var merchantBalance = {
                                    current: response.data.Data.Current,
                                    nextAch: response.data.Data.NextAch,
                                    nextAchDate: response.data.Data.NextAchDate
                                };
                            } else {
                                void 0;
                            }

                            deferred.resolve(merchantBalance);
                        },
                        function (response) {

                            deferred.reject(response);
                            void 0;
                        });

		            return deferred.promise;
		        }
		    };
		}])
	.factory('AchPaymentFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, localStorageService) {

		    var merchant;
		    var userInfo = localStorageService.get('userInfo');
		    var loadingTracker = { tracker: $rootScope.loadingAdminTracker };

		    if (userInfo != null) {
		        merchant = { MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.password };
		    }

		    return {
		        // get merchant balance details
		        getSavedPayments: function () {
		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/GetSavedAchPayment', merchant, loadingTracker)
					.then(
						function (response) {

						    var results = response.data.Data;
						    deferred.resolve(results);

						}, function (response) {

						    deferred.reject(response);
						    void 0;

						});
		            return deferred.promise;
		        }
		    };
		}])
	// Get cachiers of merchant.
	.factory('CashierFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, localStorageService) {

		    // http interceptor
		    var loadingTracker = { tracker: $rootScope.loadingAdminTracker };

		    // get user info from localStorageService
		    var userInfo = localStorageService.get('userInfo');

		    return {
		        // get merchant sales details
		        getCashiers: function (MerchantId, MerchantPassword) {
		            var deferred = $q.defer();
		            $http.post(API_URL + 'admin/getallcashiers', { MerchantId: MerchantId, MerchantPassword: MerchantPassword }, loadingTracker)
					.then(
						function (response) {

						    var cashiers = response.data.Data;
						    deferred.resolve(cashiers);

						}, function (response) {

						    deferred.reject(response);
						    void 0;

						}
					);
		            return deferred.promise;
		        },
		        // save CASHIER
		        saveCashier: function (MerchantId, merchantPassword, cashierName, cashierPassword) {
		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/addcashier', { MerchantId: MerchantId, MerchantPassword: merchantPassword, Name: cashierName, Password: cashierPassword }, loadingTracker)
					.then(
						function (response) {

						    var result = response.data;
						    // console.log(result);
						    deferred.resolve(result);

						}, function (response) {

						    deferred.reject(response);
						    // console.log(response);
						    void 0;

						});
		            return deferred.promise;
		        },
		        // delete CASHIER
		        deleteCashier: function (merchantId, merchantPassword, cashierId) {
		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/deletecashier', { MerchantId: merchantId, MerchantPassword: merchantPassword, Id: cashierId }, loadingTracker)
					.then(
						function (response) {

						    var result = response.data;
						    void 0;
						    deferred.resolve(result);

						}, function (response) {

						    deferred.reject(response);
						    void 0;

						});
		            return deferred.promise;
		        },
		        // edit CASHIER
		        editCashier: function (MerchantId, merchantPassword, cashierId, cashierName, cashierPassword) {
		            var deferred = $q.defer();
		            // console.log(cashierPassword);

		            $http.post(API_URL + 'admin/updatecashier', { MerchantId: MerchantId, MerchantPassword: merchantPassword, Id: cashierId, Name: cashierName, password: cashierPassword }, loadingTracker)
					.then(
						function (response) {

						    var result = response.data;
						    // console.log(response.data);
						    deferred.resolve(result);

						}, function (response) {

						    deferred.reject(response);
						    void 0;

						});
		            return deferred.promise;
		        }
		    };
		}])
	// Get account settings for a merchant.
	.factory('SettingsFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService', 'SharedFunctions',
		function ($http, $rootScope, API_URL, $q, localStorageService, SharedFunctions) {

		    var merchant;

		    // http interceptor
		    var loadingTracker = { tracker: $rootScope.loadingAdminTracker };

		    // get user info from localStorageService
		    var userInfo = localStorageService.get('userInfo');

		    if (userInfo != null || SharedFunctions.isobject(userInfo)) {
		        merchant = {
		            MerchantId: userInfo.MerchantId,
		            MerchantPassword: userInfo.MerchantPassword,
		            PageNumber: null,
		            PageSize: null
		        };
		    } else {
		        merchant = { MerchantId: '834', MerchantPassword: 'm5494' };
		    }
		    // console.log(merchant);

		    return {
		        // get SETTINGS
		        getSettings: function () {
		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/getSettings', merchant, loadingTracker)
					.then(
						function (response) {

						    var settings = response.data.Data;
						    deferred.resolve(settings);

						}, function (response) {

						    deferred.reject(response);
						    void 0;

						});
		            return deferred.promise;
		        },
		        // update SETTINGS
		        updateSettings: function (MerchantId, smallReceipt, salesTax, confirmPhone, paxTerminalAsPrinter) {
		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/updateSettings', { MerchantId: MerchantId, MerchantPassword: merchant.MerchantPassword, SmallReceipt: smallReceipt, Tax: salesTax, ConfirmPhone: confirmPhone, PaxTerminalAsPrinter: paxTerminalAsPrinter }, loadingTracker)
					.then(
						function (response) {

						    var updateSettingsResponse = response.data;
						    // console.log(updateSettingsResponse);
						    deferred.resolve(updateSettingsResponse);

						}, function (response) {

						    deferred.reject(response);
						    void 0;

						});
		            return deferred.promise;
		        }
		    };
		}])
	// get merchant orders
	.factory('OrderFactory', ['$http', '$rootScope', 'API_URL', '$q',
		function ($http, $rootScope, API_URL, $q) {

		    var params = {};

		    // http interceptor
		    var loadingTracker = { tracker: $rootScope.loadingTracker };

		    // console.log(merchant);
		    return {
		        // get ORDERS
		        getOrders: function (StartDate, EndDate, PageNumber, PageSize, MerchantInfo) {

		            params = {
		                StartDate: StartDate,
		                EndDate: EndDate,
		                PageNumber: PageNumber,
		                PageSize: PageSize,
		                MerchantId: MerchantInfo.MerchantId,
		                MerchantPassword: MerchantInfo.MerchantPassword
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/getallorders', params, loadingTracker).then(
						function (response) {
						    var orders = response.data;
						    // console.log(response.data.Data)
						    deferred.resolve(orders);
						},
						function (err) {
						    deferred.reject(err);
						    void 0;
						}
					);
		            return deferred.promise;
		        },
		        getAllOrdersSummary: function (StartDate, EndDate, MerchantInfo) {

		            params = {
		                StartDate: StartDate,
		                EndDate: EndDate,
		                MerchantId: MerchantInfo.MerchantId,
		                MerchantPassword: MerchantInfo.MerchantPassword
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/GetAllOrdersSummary', params, loadingTracker).then(
						function (response) {
						    var orders = response.data;
						    // console.log(response.data.Data)
						    deferred.resolve(orders);
						},
						function (err) {
						    deferred.reject(err);
						    void 0;
						}
					);
		            return deferred.promise;
		        },
		        refundOrder: function (orderId, MerchantInfo) {

		            var deferred = $q.defer();

		            params = {
		                MerchantId: MerchantInfo.MerchantId,
		                MerchantPassword: MerchantInfo.MerchantPassword,
		                OrderId: orderId
		            };

		            $http.post(API_URL + 'admin/RefundOrder', params, loadingTracker).then(
						function (response) {
						    var orders = response.data;
						    // console.log(response.data.Data)
						    deferred.resolve(orders);
						},
						function (response) {
						    deferred.reject(response);
						    void 0;
						}
					);
		            return deferred.promise;
		        },
		        reSendOrderConfirmation: function (orderId, MerchantInfo) {

		            var deferred = $q.defer();

		            params = {
		                MerchantId: MerchantInfo.MerchantId,
		                MerchantPassword: MerchantInfo.MerchantPassword,
		                OrderId: orderId
		            };

		            //this function actually return the receipt from the order, the logic after this is display that info
		            //dont resend anything, just return receipt info
		            $http.post(API_URL + 'admin/ReSendOrderConfirmation', params, loadingTracker).then(
						function (response) {
						    var orders = response.data;
						    // console.log(response.data.Data)
						    deferred.resolve(orders);
						},
						function (response) {
						    deferred.reject(response);
						    void 0;
						}
					);
		            return deferred.promise;
		        },
		        downloadAsCvs: function (Start, End, MerchantInfo) {
		            params = {
		                StartDate: Start,
		                EndDate: End,
		                MerchantId: MerchantInfo.MerchantId,
		                MerchantPassword: MerchantInfo.MerchantPassword
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/GetAllOrdersToExport', params, loadingTracker).then(
						function (response) {
						    var orders = response.data;
						    // console.log(response.data.Data)
						    deferred.resolve(orders);
						},
						function (err) {
						    deferred.reject(err);
						    void 0;
						}
					);
		            return deferred.promise;
		        },
		        sendAsEmail: function (Start, End, Email, MerchantInfo) {

		            var deferred = $q.defer();

		            params = {
		                StartDate: Start,
		                EndDate: End,
		                Email: Email,
		                MerchantId: MerchantInfo.MerchantId,
		                MerchantPassword: MerchantInfo.MerchantPassword
		            };

		            $http.post(API_URL + 'ReceiptServices/SendOrdersByEmail', params, loadingTracker).then(
						function (response) {
						    var orders = response.data;
						    // console.log(response.data.Data)
						    deferred.resolve(orders);
						},
						function (response) {
						    deferred.reject(response);
						    void 0;
						}
					);
		            return deferred.promise;
		        }
		    };
		}])
	// get saved payments, add arch funds (admin)
	.factory('AdminFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService', 'SharedFunctions',
		function ($http, $rootScope, API_URL, $q, localStorageService, SharedFunctions) {

		    var merchant;

		    // http interceptor
		    var loadingTracker = { tracker: $rootScope.loadingAdminTracker };

		    // get user info from localStorageService
		    var userInfo = localStorageService.get('userInfo');

		    if (userInfo != null || SharedFunctions.isobject(userInfo)) {
		        merchant = {
		            MerchantId: userInfo.MerchantId,
		            MerchantPassword: userInfo.MerchantPassword
		        };
		    } else {
		        merchant = { MerchantId: '834', MerchantPassword: 'm5494' };
		    }
		    // console.log(merchant);

		    return {
		        getSavedAchPayments: function () {
		            var deferred = $q.defer();

		            var ordersUrl = API_URL + 'Admin/GetSavedAchPayments';

		            $http.post(ordersUrl, merchant, loadingTracker)
					.then(
						function (response) {

						    var achs = response.data.Data;
						    deferred.resolve(achs);

						}, function (response) {

						    deferred.reject(response);
						    void 0;
						}
					);
		            return deferred.promise;
		        },
		        // Add funds and/or to account
		        addAchFunds: function (id, accountNumber, routingNumber, MerchantId, amount, saveAccount, typeChecking) {

		            var deferred = $q.defer();

		            $http.post(API_URL + 'Admin/AddAchFunds', { Id: id, AccountNumber: accountNumber, RoutingNumber: routingNumber, MerchantId: MerchantId, MerchantPassword: merchant.MerchantPassword, Amount: amount, SaveAccount: saveAccount, TypeChecking: typeChecking }, loadingTracker)
					.then(
						function (response) {

						    var arr = response.data;
						    // console.log(response);
						    deferred.resolve(arr);

						}, function (response) {

						    void 0;
						    deferred.reject(response);

						}
					);
		            return deferred.promise;
		        },
		        getAppMainLogoUrl: function (MerchantId, Password) {

		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/GetAppMainLogoUrl', { MerchantId: MerchantId, MerchantPassword: Password }, loadingTracker)
					.then(
						function (response) {

						    var data = response.data;
						    void 0;
						    deferred.resolve(data);

						},
						function (response) {

						    deferred.reject(response);

						}
					);
		            return deferred.promise;
		        }
		    };
		}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByCategoryBillPaymentCtrl', ['$scope', '$routeParams', 'BillPaymentFactory', 'Flash', '$location',
		function ($scope, $routeParams, BillPaymentFactory, Flash, $location) {

		    // clear messages from previous view
		    Flash.dismiss();

		    var category = $routeParams.category;
		    var param = (category === 'popular') ? '' : category;

		    $scope.useMostPopular = true;
		    $scope.isMostPopular = (category === 'popular') ? true : false;
		    $scope.useAcronym = true;
		    $scope.showAcronym = true;
		    $scope.useConfig = true;
		    $scope.configPath = 'categories';
		    $scope.configDisplay = 'Category';
		    $scope.numLimit = 25;
		    $scope.type = $location.path().split('/').splice(1, 1).toString();
		    $scope.mostpopular = 'category/popular';


		    $scope.getBillersInitials = function () {
		        BillPaymentFactory.getBillersInitials(param).then(
                    function (data) {
                        $scope.alpha = data;
                        // console.log(data);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getBillersByCategory = function () {
		        BillPaymentFactory.getBillersByCategory(param).then(
                    function (data) {
                        $scope.items = data;
                        // console.log(data);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getBillersInitials();
		    $scope.getBillersByCategory();
		}]);
}());

(function () {
    'use strict';
    // might ngInject

    /* services & factories */
    angular.module('billPaymentServices', [])
	// Return products collection
	.factory('BillPaymentFactory', ['$http', '$rootScope', 'API_URL', '$q', 'SharedFunctions', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, SharedFunctions, localStorageService) {

		    var arr;
		    var userInfo = localStorageService.get('userInfo');
		    var merchant = { MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword };
		    var loadingTracker = { tracker: $rootScope.loadingTracker };

		    return {
		        // get BILLERS by categories
		        getBillersByCategory: function (category) {
		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                CategoryId: category,
		                BillerId: ''
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'BillPayment/GetBillersByCategory', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get BILLERS by categories
		        getBillersInitials: function (category) {
		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                CategoryId: category,
		                BillerId: ''
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'BillPayment/GetBillersInitials', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get CATEGORIES
		        getBillPaymentCategories: function () {

		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'BillPayment/GetBillPaymentCategories', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            void 0;
                            // console.log(JSON.stringify(response.data));
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get Biller
		        getMasterBiller: function (billerId) {

		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                CategoryId: '',
		                BillerId: billerId
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'BillPayment/getMasterBiller', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data;
                            // console.log(JSON.stringify(arr));
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get biller PAYMENT OPTIONS
		        getBillerPaymentOptions: function (biller) {

		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                CategoryId: '',
		                BillerId: biller
		            };

		            // console.log(queryObj);

		            var deferred = $q.defer();

		            $http.post(API_URL + 'BillPayment/GetBillerPaymentOptions', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data;
                            // console.log(JSON.stringify(arr));
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // do Bill Payment NEXT STEP
		        doBillPaymentNextStep: function (obj) {

		            var queryObj = obj;
		            queryObj.MerchantId = merchant.MerchantId;
		            queryObj.MerchantPassword = merchant.MerchantPassword;
		            void 0;

		            var deferred = $q.defer();

		            $http.post(API_URL + 'BillPayment/DoBillPaymentNextStep', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data;
                            // console.log(JSON.stringify(arr));
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // do Bill Payment NEXT STEP
		        doBillPayment: function (obj) {

		            var queryObj = obj;
		            queryObj.MerchantId = merchant.MerchantId;
		            queryObj.MerchantPassword = merchant.MerchantPassword;
		            // console.log(queryObj);

		            var deferred = $q.defer();

		            $http.post(API_URL + 'BillPayment/DoBillPayment', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data;
                            // console.log(JSON.stringify(arr));
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        }
		    };
		}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByPopularBillPaymentCtrl', ['$scope', '$routeParams', 'BillPaymentFactory', 'Flash',
		function ($scope, $routeParams, BillPaymentFactory, Flash) {

		    // clear messages from previous view
		    Flash.dismiss();

		    $scope.useMostPopular = false;
		    $scope.isMostPopular = true;
		    $scope.showAcronym = false;
		    $scope.useConfig = true;

		    $scope.getBillPaymentCategories = function () {
		        BillPaymentFactory.getBillPaymentCategories().then(
                    function (data) {
                        $scope.items = data;
                        var itemsCount = data.length;
                        switch (itemsCount) {
                            case 2:
                                $scope.thumbWidth = 6;
                                break;
                            case 4:
                                $scope.thumbWidth = 6;
                                break;
                            case 6:
                                $scope.thumbWidth = 3;
                                break;
                            case 8:
                                $scope.thumbWidth = 3;
                                break;
                            default:
                                $scope.thumbWidth = 2;
                        }
                        void 0;
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getBillPaymentCategories();
		}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexCategoriesBillPaymentCtrl', ['$scope', '$routeParams', 'BillPaymentFactory', 'Flash', '$location',
		function ($scope, $routeParams, BillPaymentFactory, Flash, $location) {

		    // clear messages from previous view
		    Flash.dismiss();

		    // var category = $routeParams.category;
		    // var param = (category == 'popular') ? '' : category;
		    $scope.useMostPopular = true;
		    $scope.isMostPopular = false;
		    $scope.useAcronym = false;
		    // $scope.showAcronym = false;
		    $scope.useConfig = false;
		    // $scope.configPath = 'categories';
		    // $scope.configDisplay = 'Category';
		    $scope.type = $location.path().split('/').splice(1, 1).toString();
		    $scope.mostpopular = 'category/popular';


		    $scope.setFilter = function (value) {
		        $scope.letter = value;
		    };

		    $scope.showFilter = function () {
		        $scope.showAcronymFilter = !$scope.showAcronymFilter;
		    };

		    $scope.getBillPaymentCategories = function () {
		        BillPaymentFactory.getBillPaymentCategories().then(
                    function (data) {
                        $scope.items = data;
                        var itemsCount = data.length;
                        switch (itemsCount) {
                            case 2:
                                $scope.thumbWidth = 6;
                                break;
                            case 4:
                                $scope.thumbWidth = 6;
                                break;
                            case 6:
                                $scope.thumbWidth = 3;
                                break;
                            case 8:
                                $scope.thumbWidth = 3;
                                break;
                            default:
                                $scope.thumbWidth = 2;
                        }
                        // console.log(itemsCount);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getBillPaymentCategories();

		}]);
}());

(function () {
    'use strict';
    angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('ShowBillPaymentCtrl', ['$scope', '$routeParams', 'BillPaymentFactory', 'Flash',
		function ($scope, $routeParams, BillPaymentFactory, Flash) {

		    // clear messages from previous view
		    Flash.dismiss();

		    $scope.isMostPopular = false;
		    $scope.showAcronymFilter = false;
		    $scope.useAcronymFilter = false;
		    $scope.useConfig = false;
		    $scope.numLimit = 25;

		    var biller = $routeParams.biller;

		    // set form visibility
		    $scope.showPaymentOptions = true;
		    $scope.showPaymentDetails = false;
		    $scope.hasKeyPad = true;
		    $scope.showKeypad = true;
		    $scope.showAdditionalDataForm = false;
		    $scope.showReceipt = false;
		    $scope.isDisableInputs = false;

		    // init params
		    $scope.accountNumber = { value: null, isFocused: false };
		    $scope.accountMatch = { value: null, isFocused: false };
		    $scope.amount = { value: null, isFocused: false };
		    $scope.paymentType = { value: null };

		    $scope.date = new Date();

		    function initInputs() {
		        if (!$scope.accountNumber.value) {
		            $scope.accountNumber.value = '';
		        }
		        if (!$scope.accountMatch.value) {
		            $scope.accountMatch.value = '';
		        }
		        if (!$scope.amount.value) {
		            $scope.amount.value = '';
		        }
		    }

		    // undo function from keypad for account value
		    function backKeyAccountNumber() {
		        var length = $scope.accountNumber.value.length;
		        var value = $scope.accountNumber.value;
		        $scope.accountNumber.value = value.substring(0, length - 1);
		    }

		    // undo function from keypad for confirm account value
		    function backKeyAccountMatch() {
		        var length = $scope.accountMatch.value.length;
		        var value = $scope.accountMatch.value;
		        void 0;
		        void 0;
		        $scope.accountMatch.value = value.substring(0, length - 1);
		    }

		    // undo function from keypad for amount value
		    function backKeyAmount() {
		        var length = $scope.amount.value.length;
		        var value = $scope.amount.value;
		        void 0;
		        void 0;
		        $scope.amount.value = value.substring(0, length - 1);
		    }

		    // set value for account input
		    function setKeyAccountNumber(key) {
		        $scope.accountNumber.value = $scope.accountNumber.value + key;
		    }

		    // set value for onfirm account input
		    function setKeyConfirmAccountNumber(key) {
		        void 0;
		        $scope.accountMatch.value = $scope.accountMatch.value + key;
		    }

		    // set value for amount input
		    function setKeyAmount(key) {
		        $scope.amount.value = $scope.amount.value + key;
		    }
		    //
		    function setAmount(keynum) {
		        void 0;
		        if ($scope.amount.isFocused) {
		            setKeyAmount(keynum);
		        } else if ($scope.accountNumber.isFocused) {
		            setKeyAccountNumber(keynum);
		        } else {
		            setKeyConfirmAccountNumber(keynum);
		        }
		    }

		    //
		    // function myKeyPress(e){
		    // 	initInputs();
		    // 	var keynum;

		    // 	if (window.event){ // IE
		    // 		keynum = e.keyCode;
		    // 	} else {
		    // 		if (e.which){ // Netscape/Firefox/Opera
		    // 			keynum = e.which;
		    // 		}
		    // 	}
		    // 	setAmount(keynum);
		    // }

		    $scope.editing = null;
		    $scope.editItem = function (item) {
		        $scope.editing = item;
		        void 0;
		    };

		    $scope.onInputClick = function ($event) {
		        $event.target.select();
		    };

		    // set input value from keypad
		    $scope.setKey = function (value) {
		        initInputs();
		        setAmount(value);
		    };
		    // clear input value from keypad
		    $scope.clearKey = function () {
		        if ($scope.accountNumber.isFocused) {
		            $scope.accountNumber.value = '';
		        } else {
		            $scope.amount.value = '';
		        }
		    };

		    //
		    $scope.backKey = function () {
		        initInputs();

		        if ($scope.accountNumber.isFocused) {
		            backKeyAccountNumber();
		        } else if ($scope.amount.isFocused) {
		            backKeyAmount();
		        } else {
		            backKeyAccountMatch();
		        }
		    };

		    //
		    $scope.setFocusedInput = function (inputName) {
		        if (inputName === 'amount') {
		            $scope.accountNumber.isFocused = false;
		            $scope.accountMatch.isFocused = false;
		            $scope.amount.isFocused = true;
		            void 0;
		        } else if (inputName === 'accountNumber') {
		            $scope.accountMatch.isFocused = false;
		            $scope.accountNumber.isFocused = true;
		            $scope.amount.isFocused = false;
		            void 0;
		        } else if (inputName === 'accountMatch') {
		            $scope.accountNumber.isFocused = false;
		            $scope.accountMatch.isFocused = true;
		            $scope.amount.isFocused = false;
		            void 0;
		        }
		    };

		    // set focus
		    $scope.leaveInputsFocus = function () {
		        $scope.accountNumber.isFocused = false;
		        $scope.accountMatch.isFocused = false;
		        $scope.amount.isFocused = false;
		    };

		    $scope.setAmount = function (value) {
		        void 0;

		        if ($scope.amount === value) {
		            $scope.amount = undefined;
		        } else {
		            $scope.amount = value;
		        }
		    };

		    // get biller from service
		    $scope.getMasterBiller = function () {
		        BillPaymentFactory.getMasterBiller(biller).then(
                    function (response) {
                        if (response.Status === 201) {
                            Flash.create('error', response.ErrorMessage + ' for ' + biller, '');
                            void 0;
                        } else {
                            $scope.item = response.Data;
                        }
                        // console.log(data);
                    },
                    function (err) {
                        void 0;
                    }
                );
		    };
		    // get options from biller
		    $scope.getBillerPaymentOptions = function () {
		        BillPaymentFactory.getBillerPaymentOptions(biller).then(
                    function (response) {
                        $scope.paymentOptions = response.Data;
                        // console.log('getBillerPaymentOptions: ' + JSON.stringify(response));
                    },
                    function (err) {
                        void 0;
                    }
                );
		    };
		    $scope.getBillerPaymentOptions();
		    $scope.getMasterBiller();

		    $scope.parseFloat = function (value) {
		        return parseFloat(value);
		    };

		    $scope.fee = '0';
		    $scope.paymentType = null;

		    $scope.setPaymentOption = function (obj) {
		        $scope.fee = obj.FeeAmount;
		        $scope.paymentType = obj.PaymentType;
		        $scope.showPaymentDetails = true;
		        // console.log(obj);
		    };

		    // DO BILL PAYMENT NEXT STEP.
		    $scope.doBillPaymentNextStep = function (form) {

		        // Trigger validation flag.
		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            Flash.create('error', 'Check errors below (in red color)', '');
		            return;

		        } else {

		            var account = {
		                CategoryId: '',
		                BillerId: biller,
		                AccountNumber: $scope.accountNumber.value,
		                Amount: $scope.amount.value,
		                PaymentFee: $scope.fee
		            };

		            BillPaymentFactory.doBillPaymentNextStep(account).then(
                        function (response) {
                            if (response.Status === 200) {
                                $scope.showKeypad = false;
                                $scope.isDisableInputs = true;
                                // console.log(data);
                                $scope.aditionalDataRequired = response.Data;
                                // set form visibility
                                $scope.showAdditionalDataForm = true;
                                // response.Data.SenderNameRequired || response.Data.CustomerNameRequired || response.Data.AddInfoLabel1Required || response.Data.AddInfoLabel2Required || response.Data.AltLookUpRequired
                            } else {
                                Flash.create('error', response.ErrorMessage, '');
                                $scope.isDisableInputs = false;
                                // $scope.isBlocked = false;
                            }
                        },
                        function (error) {
                            void 0;
                        }
                    );
		        }
		    };

		    // set defaults fields for additionalDataForm
		    $scope.setDefaults = function () {
		        $scope.customer = '';
		        $scope.sender = '';
		        $scope.altLookUp = '';
		        $scope.addInfo1 = '';
		        $scope.addInfo2 = '';
		    };

		    $scope.setDefaults();

		    // DO BILL PAYMENT.
		    $scope.doBillPayment = function (form) {

		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            Flash.create('error', 'Check errors below (in red color)', '');
		            return false;
		        } else {
		            // setup params
		            var billpayment = {
		                CategoryId: '',
		                BillerId: biller,
		                AccountNumber: $scope.accountNumber.value,
		                Amount: $scope.amount.value,
		                PaymentFee: $scope.fee,
		                CustomerName: $scope.customer,
		                SenderName: $scope.sender,
		                AltLookUp: $scope.altLookUp,
		                AddInfo1: $scope.addInfo1,
		                AddInfo2: $scope.addInfo2
		            };

		            void 0;

		            BillPaymentFactory.doBillPayment(billpayment).then(
                        function (response) {
                            if (response.Status === 200 || response.Status === 203) {
                                $scope.showPaymentOptions = false;
                                $scope.showAdditionalDataForm = false;
                                $scope.showReceipt = true;
                                $scope.receipt = response.Data;
                                //console.log('from transaction:' + receipt);
                            } else {
                                Flash.create('error', response.ErrorMessage, '');
                                $scope.showKeypad = true;
                                $scope.isDisableInputs = false;
                                $scope.showAdditionalDataForm = false;
                                void 0;
                            }
                        },
                        function (error) {
                            void 0;
                        }
                    );
		        }
		    };

		    // print receipt
		    $scope.printInfo = function () {
		        window.print();
		    };

		    $scope.termsOfPersonalData = 'Customer accepts to receive transaction confirmation and other important account messages';
		}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// list all categories
	.controller('IndexDirectTvCategoriesCtrl', ['$scope', '$routeParams', 'DirectTvFactory', 'AlertService', '$location',
		function ($scope, $routeParams, DirectTvFactory, AlertService, $location) {

		    // clear alerts from previous view
		    AlertService.clear();

		    // var category = $routeParams.category;
		    $scope.useMostPopular = false;
		    $scope.isMostPopular = false;
		    $scope.useAcronym = false;
		    // $scope.showAcronym = true;
		    $scope.useConfig = false;
		    $scope.type = $location.path().split('/').splice(1, 1).toString();
		    $scope.mostpopular = 'category/popular';

		    $scope.getDirectTvCategories = function () {
		        DirectTvFactory.getDirectTvCategories().then(
                    function (data) {
                        $scope.items = data;
                        // console.log(data);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getDirectTvCategories();
		}])
	// might ngInject
	// list products by category or all
	.controller('IndexDirectTvByCategoryCtrl', ['$scope', '$routeParams', 'DirectTvFactory', 'ProdsFactory', 'AlertService', '$location',
		function ($scope, $routeParams, DirectTvFactory, ProdsFactory, AlertService, $location) {

		    $scope.useMostPopular = true;
		    $scope.isMostPopular = true;
		    $scope.useAcronym = false;
		    $scope.showAcronym = true;
		    $scope.useConfig = true;
		    $scope.configPath = 'categories';
		    $scope.configDisplay = 'Category';
		    $scope.type = $location.path().split('/').splice(1, 1).toString();
		    $scope.mostpopular = 'popular';

		    var category = $routeParams.category;

		    $scope.getDirectTvProductsByCategory = function () {
		        DirectTvFactory.getDirectTvProductsByCategory(category).then(
                    function (data) {
                        $scope.items = data;
                        void 0;
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getDirectTvProductsByCategory();
		}])
	// might ngInject
	.controller('showDirectTvCtrl', ['$scope', 'DirectTvFactory', 'ProdsFactory', '$routeParams', 'AlertService', 'localStorageService', 'SharedFunctions', '$modal', 'ConfirmationFactory',
		function ($scope, DirectTvFactory, ProdsFactory, $routeParams, AlertService, localStorageService, SharedFunctions, $modal, ConfirmationFactory) {

		    var id = $routeParams.product;

		    $scope.getDirectTvProduct = function () {
		        DirectTvFactory.getDirectTvProduct(id).then(
                    function (data) {
                        $scope.item = data;
                        // console.log(data);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getDirectTvProduct();

		    // FORM SUBMIT HANDLER
		    $scope.submit = function (form) {
		        void 0;

		        // Trigger validation flag.
		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            AlertService.clear();
		            AlertService.add('error', 'Check errors below (in red color)');
		            return;

		        } else {

		            $scope.isBlocked = true;

		            // remove any previous alert
		            AlertService.clear();

		            var userInfo = localStorageService.get('userInfo');

		            var order = {
		                MerchantId: userInfo.MerchantId,
		                MerchantPassword: userInfo.MerchantPassword, // string
		                OperatorName: userInfo.userName, // string
		                ProfileId: userInfo.profileId, // int
		                TerminalId: userInfo.terminalId, // int

		                Amount: $scope.item.price,
		                // PhoneNumber: $scope.phoneNumber.value,
		                ProductMainCode: $scope.item.id
		                // CountryCode: $scope.item.DialCountryCode
		            };

		            void 0;
		            // console.log(userInfo);

		            ProdsFactory.doBlackstonePosOperation(order).then(
                        function (response) {

                            //console.log(response);

                            if (response.Status === 200 || response.Status === 203) {

                                var orderResultText = response.Status === 200 ? 'Order processed!' : 'Order placed. Pending for further Execution!';

                                $scope.showReceipt = true;
                                $scope.submitted = false;
                                AlertService.add('success', orderResultText);

                                $scope.receipt = response.Data;

                                //console.log('from transaction:' + receipt);

                            } else {
                                AlertService.add('error', response.ErrorMessage);
                                // Trigger validation flag.
                                $scope.isBlocked = false;
                            }


                        },
                        function (error) {
                            $scope.isBlocked = false;
                            AlertService.add('error', 'Invalid Credentials');
                            void 0;
                        }
                    );

		            $scope.showReceipt = false;
		            // AlertService.add('error', $scope.receipt.ErrorMessage);
		        }
		    };

		    // PRINT RECEIPT
		    $scope.printInfo = function () {
		        window.print();
		    };

		    // SEND RECEIPT AS SMS
		    $scope.sendSms = function (form) {

		        // Trigger validation flag.
		        $scope.submittedSms = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {

		            AlertService.clear();
		            AlertService.add('error', 'Check form errors');
		            return;

		        } else {

		            // remove any previous alert
		            AlertService.clear();

		            var receipt = $scope.receipt;
		            var phone = $scope.phoneToSend;

		            ConfirmationFactory.sendConfirmationSms(receipt, phone).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedSms = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as sms successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                            void 0;
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                            void 0;
                        }
                    );
		        }
		    };

		    // SEND RECEIPT AS EMAIL
		    $scope.sendEmail = function (form) {

		        // Trigger validation flag.
		        $scope.submittedEmail = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {

		            AlertService.clear();
		            AlertService.add('error', 'Check form errors');
		            return;

		        } else {

		            // remove any previous alert
		            AlertService.clear();

		            var receipt = $scope.receipt;
		            var email = $scope.emailToSend;

		            ConfirmationFactory.sendConfirmationEmail(receipt, email).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedEmail = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as email successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                            void 0;
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                            void 0;
                        }
                    );
		        }
		    };

		    // Modal (ui.bootstrap.modal). In Docs (item) pass modal size, here pass the single item object
		    $scope.open = function (items) {
		        var info = { firstItem: $scope.item.productName, secondItem: null, thirdItem: $scope.item.price };

		        // angular.extend(dst, src);
		        items = angular.extend(items, info);
		        // console.log(items);
		        // console.log(JSON.stringify(items));

		        var modalInstance = $modal.open({
		            templateUrl: './app/products/_modal-product-tpl.html',
		            controller: 'ModalInstanceCtrl',
		            size: 'lg',
		            windowClass: 'product-modal',
		            resolve: {
		                item: function () {
		                    return items;
		                }
		            }
		        });

		        modalInstance.result.then(function (selectedItem) {
		            $scope.selected = selectedItem;
		        }, function () {
		            // $log.info('Modal dismissed at: ' + new Date());
		        });
		    };
		}]);
}());

(function () {
    'use strict';
    angular.module('directTvServices', [])
	// might ngInject
	/* DIRECT TV */
	.factory('DirectTvFactory', ['$http', '$rootScope', 'API_URL', '$q', 'SharedFunctions', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, SharedFunctions, localStorageService) {

		    var arr = [];
		    var userInfo = localStorageService.get('userInfo');
		    var merchant = { MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword };
		    var loadingTracker = { tracker: $rootScope.loadingTracker };

		    return {
		        // GET DIRECT TV CATEGORIES
		        getDirectTvAllProducts: function (category) {
		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                CategoryId: category
		            };

		            var deferred = $q.defer();

		            // $http.get('./app/data/pos-directtv-products.json', loadingTracker)
		            $http.post(API_URL + 'DirectTv/GetDirectTvAllProducts', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // GET DIRECT TV CATEGORIES
		        getDirectTvCategories: function () {
		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword
		            };

		            var deferred = $q.defer();

		            // $http.get('./app/data/pos-directtv-categories.json', loadingTracker)
		            $http.post(API_URL + 'DirectTv/GetDirectTvCategories', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data.Data;
                            void 0;
                            deferred.resolve(arr);
                        },
                        function (response) {
                            // console.log(response);
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // GET DIRECT TV PRODUCTS BY CATEGORY
		        getDirectTvProductsByCategory: function (category) {
		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                Category: category
		            };

		            var deferred = $q.defer();

		            // $http.get('./app/data/pos-directtv-prod-by-category.json', loadingTracker)
		            $http.post(API_URL + 'DirectTv/GetDirectTvProductsByCategory', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(response);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        getDirectTvProduct: function (id) {
		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                ProductMainCode: id
		            };
		            // console.log(queryObj);

		            var deferred = $q.defer();

		            $http.post(API_URL + 'DirectTv/GetDirectTvProduct', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data.Data;
                            void 0;
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        }
		    };
		}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// Return most sold products and best country rates.
	.controller('HomeCtrl', ['$scope', '$location', 'AlertService', 'ProdsFactory', 'localStorageService', 'ExternalFactory',
	function ($scope, $location, AlertService, ProdsFactory, localStorageService, ExternalFactory) {

	    // clear alert messages from previous view
	    AlertService.clear();

	    var userInfo = localStorageService.get('userInfo');

	    // $scope.$parent.isHome = ($location.path() === '/home') ? true : false;

	    $scope.getActivationShopUrl = function () {
	        ExternalFactory.getActivationShopUrl(userInfo.merchantId, userInfo.password).then(
				function (data) {

				    var url = data;
				    $scope.activationShopUrl = url;
				},
				function (error) {
				    void 0;
				}
			);
	    };
	    $scope.getActivationShopUrl();


	    $scope.getVonageUrl = function () {
	        ExternalFactory.getVonageUrl(userInfo.merchantId, userInfo.password).then(
				function (data) {

				    var url = data;
				    // window.open(url);
				    //window.location = url;
				    $scope.vonageUrl = url;
				},
				function (error) {
				    void 0;
				}
			);
	    };
	    //$scope.getVonageUrl();

	    var homeItems = [
			{ categoryName: 'billpayment', title: 'Bill Payment', url: '#/billpayment/categories', position: 1, icon: '' },
			{ categoryName: 'international', title: 'Int\'l Top Up', url: '#/pos/category/international/countries', position: 2, icon: '' },
			{ categoryName: 'pinless', title: 'Pinless Recharge', url: '#/pos/category/pinless', position: 4, icon: '' },
			{ categoryName: 'longdistance', title: 'Long Distance', url: '#/pos/category/longdistance/countries', position: 3, icon: '' },
			{ categoryName: 'wireless', title: 'Wireless Recharge', url: '#/pos/category/wireless/carriers', position: 6, icon: '' },
			{ categoryName: 'sunPass', title: 'SunPass', url: '#/sunpass', position: 5, icon: '' },
			{ categoryName: 'promotions', title: 'Promotions', url: '#/pos/category/promotions', position: 8, icon: 'star' },
			{ categoryName: 'directtv', title: 'Direct TV', url: '#/directtv/categories', position: 9, icon: '' }
			// {categoryName: 'MySmsCuba', title: 'MySmsCuba', url: '#/mysmscuba', position: 10, icon: ''}
			// {categoryName: 'activationShop', title: 'Activation Shop', url: '#/activationshop', position: 11, icon: ''}
			// {categoryName: 'Others', url: '#/pos/others', position: 12},
	    ];


	    $scope.getMainProducts = function (itemsCollection) {

	        $scope.items = [];

	        var mainProducts = [];

	        ProdsFactory.getPosMainProducts(userInfo.MerchantId, userInfo.MerchantPassword).then(
				function (data) {
				    mainProducts = data;

				    // console.log('main products: ' + mainProducts);
				    // console.log(data);

				    for (var i = 0; i < itemsCollection.length; i++) {
				        if (mainProducts.indexOf(itemsCollection[i].categoryName) >= 0) {
				            $scope.items.push(itemsCollection[i]);
				        }
				    }
				    //$scope.items.push(itemsCollection[5]);
				},
				function (error) {
				    void 0;
				}
			);
	    };

	    $scope.getMainProducts(homeItems);


	    // Add message to Alert
	    $scope.addAlert = function () {
	        // user triggered event
	        AlertService.add('success', 'Welcome!' + userInfo.Name + 'This is a success message!');
	    };

	    // select tag to filter products
	    $scope.filterables = [
			{ name: 'Rate', value: 'rate' },
			{ name: 'Country', value: 'countryName' },
			{ name: 'Category', value: 'category' }
	    ];

	    // $scope.items = $scope.filterables[0].value;

	    $scope.selectProduct = function (item) {
	        localStorageService.set('selection', item);
	    };

	}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// Return most sold products and best country rates.
	.controller('LoginCtrl', ['$scope', 'AlertService', '$location', 'AuthenticationFactory', 'localStorageService', '$rootScope', 'SITE_URL', '$modal',
		function ($scope, AlertService, $location, AuthenticationFactory, localStorageService, $rootScope, SITE_URL, $modal) {

		    // clear alerts from previous view
		    AlertService.clear();

		    // Show/Hide Application form
		    $scope.isApplying = false;

		    function loginUser(response) {
		        if (response.Status === 200) {
		            var userInfo = response.UserInfo;
		            console.log(userInfo);
		            localStorageService.set('userInfo', userInfo);
		            // $scope.$parent.userInfo = localStorageService.get('userInfo');

		            AlertService.add('success', 'Welcome!');

		        } else {
		            AlertService.add('error', 'Invalid Credentials!');
		            void 0;
		        }
		    }

		    $scope.toggleApplication = function () {
		        $scope.isApplying = !$scope.isApplying;
		    };

		    // Alert Service example
		    // AlertService.add('error', "This is an error message!");
		    // $scope.addAlert = function() {
		    // 	AlertService.add('success', 'Success! This is a success message!');
		    // };

		    $scope.closeAlert = function (index) {
		        $scope.alerts.splice(index, 1);
		    };

		    // Form submit handler.
		    $scope.submitLogin = function (form) {
		        // Trigger validation flag.
		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            AlertService.clear();
		            AlertService.add('error', 'Check errors below');
		            return;
		        }

		        if (form.$valid) {
		            // remove any previous alert
		            AlertService.clear();

		            // check user authentification
		            AuthenticationFactory.login(form.user.$modelValue, form.password.$modelValue).then(
                        function (response) {
                            // loginUser(response);

                            if (response.Status === 200) {
                                var userInfo = response.UserInfo;
                                // store user data in session. this is used to keep live on refresh
                                localStorageService.set('userInfo', userInfo);
                                void 0;

                                console.log(userInfo);
                                // reditect to home page
                                $location.path('/');
                            } else {
                                AlertService.add('error', 'Invalid Credentials!');
                                // console.log(response);
                            }

                            // avoid log password
                            // var loguser = delete response.UserInfo.MerchantPassword
                            // console.log(loguser);
                        },
                        function (error) {
                            AlertService.add('error', 'Invalid Credentials');
                            void 0;
                        }
                    );
		        }
		    };

		    $scope.loginDemo = function (category) {

		        void 0;

		        // remove any previous alert
		        AlertService.clear();

		        // check user authentification
		        AuthenticationFactory.login(834, 'M5494').then(
                    function (response) {
                        loginUser(response);
                        location.href = 'google.com';
                        //location.href = SITE_URL + '#/category/' + category;
                    },
                    function (error) {
                        AlertService.add('error', 'Invalid Credentials');
                        void 0;
                    }
                );
		    };

		    $scope.submitted = false;

		    $scope.applicantSubmit = function (form) {
		        // Trigger validation flag.
		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            AlertService.clear();
		            AlertService.add('error', 'Check errors below');
		            return;
		        }

		        if (form.$valid) {

		            // remove any previous alert
		            AlertService.clear();

		            var submissionData = {
		                Name: form.user.$modelValue,
		                PhoneNumber: form.phone.$modelValue,
		                Email: form.email.$modelValue,
		                Address: form.address.$modelValue,
		                State: form.state.$modelValue,
		                ZipCode: form.zip.$modelValue
		            };

		            // check user authentification
		            AuthenticationFactory.submitApplicant(submissionData).then(
                        function (response) {
                            if (response.Status === 200) {
                                AlertService.clear();
                                AlertService.add('success', 'Application Successfully submited!');
                            }

                        },
                        function (error) {
                            AlertService.add('error', 'Problems processing your application. Try again later, please.');
                            void 0;
                        }
                    );
		        }
		    };

		    $scope.open = function (item) {
		        var modalInstance = $modal.open({
		            templateUrl: './app/login/_modal-demo-tpl.html',
		            controller: 'ModalFormInstanceCtrl',
		            size: 'sm',
		            windowClass: 'demo-modal',
		            resolve: {
		                item: function () {
		                    return item;
		                }
		            }
		        });

		        modalInstance.result.then(function (selectedItem) {
		            $scope.selected = selectedItem;
		        }, function () {
		            void 0;
		        });
		    };

		    // array of demos categories
		    $scope.demoAcccess = [
                { category: 'international', categoryName: 'International Top Up', caption: 'Instantly load International wireless phones for over 200 Countries worldwide.', imageUrl: 'Images/landing/01a-bkt-POS-landing.png' },
                // {category: 'billpayment', categoryName: 'Bill Payment', caption: 'Allow customers to perform walk-in bill payments for over 5,000 local.', imageUrl: 'Images/landing/02a-bkt-POS-landing.png'},
                { category: 'wireless', categoryName: 'Wireless', caption: 'Load prepaid pay-as-you-go wireless accounts! Offer a wide variety of carriers.', imageUrl: 'Images/landing/pinless.png' },
                { category: 'longdistance', categoryName: 'Long Distance', caption: 'Load prepaid pay-as-you-go wireless accounts! Offer Variety of carriers.', imageUrl: 'Images/landing/03a-bkt-POS-landing.png' },
                { category: 'pinless', categoryName: 'Pinless', caption: 'A low-cost prepaid calling card program that does not require a PIN or scratch-off card.', imageUrl: 'Images/landing/04a-bkt-POS-landing.png' }
		    ];
		    // states array for form
		    $scope.states = [
                { 'name': 'Alabama', 'abb': 'AL' },
                { 'name': 'Alaska', 'abb': 'AK' },
                { 'name': 'Arizona', 'abb': 'AZ' },
                { 'name': 'Arkansas', 'abb': 'AR' },
                { 'name': 'California', 'abb': 'CA' },
                { 'name': 'Colorado', 'abb': 'CO' },
                { 'name': 'Connecticut', 'abb': 'CT' },
                { 'name': 'Delaware', 'abb': 'DE' },
                { 'name': 'District Of Columbia', 'abb': 'DC' },
                { 'name': 'Florida', 'abb': 'FL' },
                { 'name': 'Georgia', 'abb': 'GA' },
                { 'name': 'Hawaii', 'abb': 'HI' },
                { 'name': 'Idaho', 'abb': 'ID' },
                { 'name': 'Illinois', 'abb': 'IL' },
                { 'name': 'Indiana', 'abb': 'IN' },
                { 'name': 'Iowa', 'abb': 'IA' },
                { 'name': 'Kansas', 'abb': 'KS' },
                { 'name': 'Kentucky', 'abb': 'KY' },
                { 'name': 'Louisiana', 'abb': 'LA' },
                { 'name': 'Maine', 'abb': 'ME' },
                { 'name': 'Maryland', 'abb': 'MD' },
                { 'name': 'Massachusetts', 'abb': 'MA' },
                { 'name': 'Michigan', 'abb': 'MI' },
                { 'name': 'Minnesota', 'abb': 'MN' },
                { 'name': 'Mississippi', 'abb': 'MS' },
                { 'name': 'Missouri', 'abb': 'MO' },
                { 'name': 'Montana', 'abb': 'MT' },
                { 'name': 'Nebraska', 'abb': 'NE' },
                { 'name': 'Nevada', 'abb': 'NV' },
                { 'name': 'New Hampshire', 'abb': 'NH' },
                { 'name': 'New Jersey', 'abb': 'NJ' },
                { 'name': 'New Mexico', 'abb': 'NM' },
                { 'name': 'New York', 'abb': 'NY' },
                { 'name': 'North Carolina', 'abb': 'NC' },
                { 'name': 'North Dakota', 'abb': 'ND' },
                { 'name': 'Ohio', 'abb': 'OH' },
                { 'name': 'Oklahoma', 'abb': 'OK' },
                { 'name': 'Oregon', 'abb': 'OR' },
                { 'name': 'Pennsylvania', 'abb': 'PA' },
                { 'name': 'Rhode Island', 'abb': 'RI' },
                { 'name': 'South Carolina', 'abb': 'SC' },
                { 'name': 'South Dakota', 'abb': 'SD' },
                { 'name': 'Tennessee', 'abb': 'TN' },
                { 'name': 'Texas', 'abb': 'TX' },
                { 'name': 'Utah', 'abb': 'UT' },
                { 'name': 'Vermont', 'abb': 'VT' },
                { 'name': 'Virginia', 'abb': 'VA' },
                { 'name': 'Washington', 'abb': 'WA' },
                { 'name': 'West Virginia', 'abb': 'WV' },
                { 'name': 'Wisconsin', 'abb': 'WI' },
                { 'name': 'Wyoming', 'abb': 'WY' }
		    ];
		}])

	// MODAL INSTANCE
	// Please note that $modalInstance represents a modal window (instance) dependency.
	// might ngInject
	.controller('ModalFormInstanceCtrl', ['$scope', '$location', '$modalInstance', 'item', 'SITE_URL', 'AuthenticationFactory', 'AlertService', 'localStorageService',
		function ($scope, $location, $modalInstance, item, SITE_URL, AuthenticationFactory, AlertService, localStorageService) {

		    var category = item;
		    //console.log();

		    $scope.modalOptions = {
		        closeButtonText: 'Close',
		        actionButtonText: 'Submit',
		        headerText: $modalInstance.headerText
		    };

		    $scope.close = function () {
		        $modalInstance.close();
		    };

		    $scope.guestSubmit = function (demoForm) {
		        // Trigger validation flag.
		        // console.log(demoForm);
		        // If demoForm is invalid, return and let AngularJS show validation errors.
		        if (demoForm.$invalid) {
		            AlertService.clear();
		            AlertService.add('error', 'Check errors below');
		            return;
		        }

		        if (demoForm.$valid) {

		            // remove any previous alert
		            // AlertService.clear();

		            var guestData = {
		                Name: demoForm.user.$modelValue,
		                Email: demoForm.email.$modelValue,
		                MerchantId: 834,
		                MerchantPassword: 'M5494'
		            };

		            // check user authentification
		            AuthenticationFactory.submitGuest(guestData).then(
                        function (response) {
                            if (response.Status === 200) {
                                AlertService.clear();
                                AlertService.add('success', 'Application Successfully submited!');
                            }

                        },
                        function (error) {
                            //AlertService.add('error', 'Problems processing your application. Try again later, please.');
                            void 0;
                        }
                    );

		            // check user authentification
		            AuthenticationFactory.login(834, 'M5494').then(
                        function (response) {
                            if (response.Status === 200) {
                                var userInfo = response.UserInfo;
                                localStorageService.set('userInfo', userInfo);
                                $modalInstance.close();
                                var location = SITE_URL + '#/pos/category/' + category;
                                void 0;
                                window.location = location;
                                //$location.path(location);
                                // console.log('Carlos');
                            }
                        },
                        function (error) {
                            AlertService.add('error', 'Invalid Credentials');
                            void 0;
                        }
                    );

		        }
		    };
		}]);
}());

(function () {
    'use strict';

    angular.module('loginServices', [])
	// might ngInject
	// Return merchant account details
	.factory('AuthenticationFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, localStorageService) {

		    var arr;
		    var userInfo;
		    var loadingTracker = { tracker: $rootScope.loadingTracker };

		    return {
		        // LOGIN (use GetMerchantDetails API method), save user details into storage service
		        login: function (merchantId, password) {
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Merchant/GetMerchantDetails', { MerchantId: merchantId, MerchantPassword: password }, loadingTracker)
                    .then(
                        function (response) {
                            if (response.data.Data != null) {
                                userInfo = {
                                    Name: response.data.Data.Name, // string
                                    MerchantId: response.data.Data.MerchantId, // int
                                    MerchantPassword: response.data.Data.MerchantPassword, // string
                                    ProfileId: response.data.Data.MerchantProfileId, // int
                                    TerminalId: response.data.Data.MerchantTerminalId, // int
                                    Status: response.data.Data.Status, // boolean
                                    Id: response.data.Data.Id, // int
                                    TimeStamp: response.data.Data.TimeStamp, // string: 2014-11-06T12:45:04.7515803-05:00
                                    IsMerchant: response.data.Data.IsMerchant, // string
                                    BusinessName: response.data.Data.MerchantBusinessName, // string
                                    IsFullCarga: response.data.Data.IsFullCarga,
                                    CustomerService: response.data.Data.CustomerService
                                };
                            }

                            arr = { Status: response.data.Status, UserInfo: userInfo };

                            deferred.resolve(arr);

                        }, function (response) {
                            deferred.reject(response);
                        }
                    ); // .then()

		            return deferred.promise;
		        },
		        isLoggedIn: function () {
		            userInfo = localStorageService.get('userInfo');
		            var result = (userInfo != null) ? userInfo : false;
		            return result;
		        },
		        // GET USER INFO
		        getUserInfo: function () {
		            if (localStorageService.get('userInfo')) {
		                userInfo = localStorageService.get('userInfo');
		            }
		            // console.log(userInfo);
		            return userInfo;
		        },
		        // SUBMIT APPLICANT (apply today form on /login view)
		        submitApplicant: function (applicant) {
		            // console.log(applicant);
		            var deferred = $q.defer();
		            $http.post(API_URL + 'guest/submitapplication', applicant)
                    .then(
                        function (response) {
                            arr = response.data;
                            deferred.resolve(arr);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // SUBMIT APPLICANT (apply today form on /login view)
		        submitGuest: function (guest) {
		            var deferred = $q.defer();
		            $http.post(API_URL + 'guest/submitguest', guest)
                    .then(
                        function (response) {
                            arr = response.data;
                            deferred.resolve(arr);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        }
		    };
		}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	.controller('OthersCtrl', ['$scope', 'AlertService',
		function ($scope, AlertService) {

		    // clear alerts from previous view
		    AlertService.clear();

		    AlertService.add('info', 'Nothing to do...');
		}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByCategoryByCarrierCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', '$location',
	function ($scope, $routeParams, ProdsFactory, AlertService, localStorageService, $location) {

	    // clear alerts from previous view
	    AlertService.clear();

	    // get category and country by $routeParams
	    var carrier = $routeParams.carrier;

	    $scope.useMostPopular = true;
	    $scope.isMostPopular = false;
	    $scope.useConfig = true;
	    $scope.useAcronymFilter = true;
	    $scope.showAcronymFilter = true;
	    $scope.viewsearch = 'carriers';
	    $scope.selectdisplay = 'carrier';
	    $scope.type = $location.path().split('/').splice(1, 1).toString();
	    $scope.category = $routeParams.category;
	    $scope.mostpopular = 'category/' + $scope.category;

	    // console.log(category +' '+ carrier );
	    var userInfo = localStorageService.get('userInfo');
	    $scope.getWirelessCarrierDetails = function () {
	        ProdsFactory.getWirelessCarrierDetails(carrier, userInfo).then(
					function (data) {
					    $scope.details = data;
					},
					function (error) {
					    void 0;
					}
			);
	    };
	    $scope.getWirelessProductsByCarrier = function () {
	        ProdsFactory.getWirelessProductsByCarrier(carrier, userInfo).then(
					function (data) {
					    $scope.items = data;
					    // console.log(data);
					},
					function (error) {
					    void 0;
					}
			);
	    };

	    //$scope.getWirelessCarrierDetails();
	    $scope.getWirelessProductsByCarrier();
	}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByCategoryByCountryCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions', '$location',
	function ($scope, $routeParams, ProdsFactory, AlertService, localStorageService, SharedFunctions, $location) {

	    // clear alerts from previous view
	    AlertService.clear();

	    // get category and country by $routeParams
	    var category = $routeParams.category;
	    var CountryCode = $routeParams.country;

	    // show button to wireless carriers
	    $scope.useMostPopular = true;
	    $scope.isMostPopular = false;
	    $scope.useConfig = true;
	    $scope.useAcronymFilter = true;
	    $scope.showAcronymFilter = true;
	    $scope.selectdisplay = 'country';
	    $scope.configDisplay = 'Country';
	    $scope.configPath = 'category/' + category + '/' + 'countries';
	    $scope.viewsearch = 'countries';
	    $scope.type = $location.path().split('/').splice(1, 1).toString();
	    $scope.category = category;
	    $scope.mostpopular = 'category/' + category;



	    // console.log($scope.country);
	    var userInfo = localStorageService.get('userInfo');
	    $scope.getCountryDetails = function () {
	        ProdsFactory.getCountryDetails(category, CountryCode, userInfo).then(
				function (data) {
				    $scope.details = data;
				},
				function (error) {
				    void 0;
				}
			);
	    };
	    $scope.getProductInitialsByCategoryByCountry = function () {
	        ProdsFactory.getProductInitialsByCategoryByCountry(category, CountryCode, userInfo).then(
				function (data) {
				    $scope.alpha = data;
				    // console.log(data);
				},
				function (error) {
				    void 0;
				}
			);
	    };
	    $scope.getProductsByCategoryByCountry = function () {
	        ProdsFactory.getProductsByCategoryByCountry(category, CountryCode, userInfo).then(
				function (data) {
				    $scope.items = data;
				},
				function (error) {
				    void 0;
				}
			);
	    };
	    //$scope.getCountryDetails();
	    //$scope.getProductInitialsByCategoryByCountry();
	    $scope.getProductsByCategoryByCountry();
	}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexByCategoryCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'SharedFunctions', '$location', 'localStorageService',
		function ($scope, $routeParams, ProdsFactory, AlertService, SharedFunctions, $location, localStorageService) {

		    // clear alerts from previous view
		    AlertService.clear();

		    $scope.useMostPopular = true;
		    $scope.isMostPopular = true;
		    $scope.showAcronym = false;
		    $scope.useAcronym = true;
		    $scope.useConfig = ($routeParams.category === 'pinless') ? false : true;
		    var category = $routeParams.category;
		    var configParam = (category === 'longdistance' || category === 'international') ? 'countries' : 'carriers';
		    $scope.configDisplay = (category === 'longdistance' || category === 'international') ? 'country' : 'carrier';
		    $scope.configPath = 'category/' + category + '/' + configParam;
		    $scope.type = $location.path().split('/').splice(1, 1).toString();
		    $scope.mostpopular = 'category/' + category;


		    var userInfo = localStorageService.get('userInfo');
		    $scope.viewsearch = (category === 'wireless') ? 'carriers' : 'countries';

		    $scope.activeClass = function (page) {
		        return page === $scope.letter ? ' active' : 'cosa';
		    };

		    $scope.getProductInitialsByCategory = function () {
		        ProdsFactory.getProductInitialsByCategory(category, userInfo).then(
                    function (data) {
                        $scope.alpha = data;
                        // console.log(data);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getAllProducts = function () {
		        ProdsFactory.getAllProducts(category, userInfo).then(
                    function (data) {
                        $scope.items = data;
                        // console.log(data);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getProductInitialsByCategory();
		    $scope.getAllProducts();
		}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// list all products by category
	.controller('IndexCountriesByCategoryCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions', '$location',
		function ($scope, $routeParams, ProdsFactory, AlertService, localStorageService, SharedFunctions, $location) {

		    // clear alerts from previous view
		    AlertService.clear();

		    var category = $routeParams.category;

		    $scope.useMostPopular = true;
		    $scope.isMostPopular = false;
		    $scope.useAcronym = true;
		    $scope.showAcronym = true;
		    $scope.useConfig = false;
		    $scope.type = $location.path().split('/').splice(1, 1).toString();
		    $scope.category = category;
		    $scope.mostpopular = 'category/' + category;

		    var userInfo = localStorageService.get('userInfo');
		    $scope.activeClass = function (page) {
		        return page === $scope.letter ? ' active' : 'cosa';
		    };
		    $scope.getCountryInitialsByCategory = function () {
		        ProdsFactory.getCountryInitialsByCategory(category, userInfo)
                .then(
                    function (data) {
                        $scope.alpha = data;
                        // console.log(data);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getCountriesByCategory = function () {
		        ProdsFactory.getCountriesByCategory(category, userInfo)
                .then(
                    function (data) {
                        $scope.items = data;
                        // console.log(data);
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getCountryInitialsByCategory();
		    $scope.getCountriesByCategory();
		}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// list all products by carrier
	.controller('IndexByCarriersCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions', '$location',
		function ($scope, $routeParams, ProdsFactory, AlertService, localStorageService, SharedFunctions, $location) {

		    // clear alerts from previous view
		    AlertService.clear();

		    $scope.letter = '';
		    $scope.useMostPopular = true;
		    $scope.isMostPopular = false;
		    $scope.useConfig = false;
		    $scope.useAcronym = true;
		    $scope.showAcronym = true;
		    $scope.viewsearch = 'carriers';
		    $scope.selectdisplay = 'carrier';
		    $scope.type = $location.path().split('/').splice(1, 1).toString();
		    var category = $routeParams.category;
		    $scope.mostpopular = 'category/' + category;

		    var countryCode = 'USA';
		    var userInfo = localStorageService.get('userInfo');
		    $scope.activeClass = function (page) {
		        return page === $scope.letter ? ' active' : 'cosa';
		    };
		    $scope.getWirelessCarrierInitials = function () {
		        ProdsFactory.getWirelessCarrierInitials(countryCode, userInfo).then(
                    function (data) {
                        $scope.alpha = data;
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getWirelessCarriers = function () {
		        ProdsFactory.getWirelessCarriers(countryCode, userInfo).then(
                    function (data) {
                        $scope.items = data;
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getWirelessCarrierInitials();
		    $scope.getWirelessCarriers();
		}]);
}());

(function () {
    'use strict';

    // might ngInject
    // products services (internationals, wireless, long distance, )
    angular.module('prodsServices', [])
	// Return products collection
	.factory('ProdsFactory', ['$http', '$rootScope', 'API_URL', '$q', 'SharedFunctions', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, SharedFunctions, localStorageService) {

		    var arr;
		    var product;
		    var products;
		    var countries;
		    var merchant;
		    var loadingTracker = { tracker: $rootScope.loadingTracker };

		    this.initialize = function () {
		        var userInfo = localStorageService.get('userInfo');
		        if (SharedFunctions.isobject(userInfo)) {
		            merchant = { MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword };
		        }
		    };

		    // console.log(merchant);

		    return {
		        // get PRODUCTS by category & country
		        getProductsByCategoryByCountry: function (category, countryCode, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                Category: category,
		                CountryCode: countryCode
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetProductsByCategoryByCountry', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            products = response.data.Data;
                            // console.log(JSON.stringify(products));
                            deferred.resolve(products);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get PRODUCT
		        getProduct: function (productMainCode, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                ProductMainCode: productMainCode
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();


		            $http.post(API_URL + 'Products/GetProduct', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            product = response.data.Data;
                            // console.log(response);
                            deferred.resolve(product);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get PRODUCT TERMS
		        getProductTerms: function (productMainCode, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                ProductMainCode: productMainCode
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetProduct', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            product = response.data.Data;
                            // console.log(response);
                            deferred.resolve(product);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get product RATES
		        getProductRates: function (productMainCode, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                ProductMainCode: productMainCode
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetProductRates', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            var rates = response.data.Data;
                            // console.log(rates);
                            deferred.resolve(rates);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get product ACCESS NUMBERS
		        getProductAccessNumbers: function (productMainCode, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                ProductMainCode: productMainCode
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetProductAccessNumbers', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            var accessnumbers = response.data.Data;
                            // console.log(accessPhones);
                            deferred.resolve(accessnumbers);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get all PRODUCTS by category
		        getAllProducts: function (category, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                Category: category
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetAllProducts', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            products = response.data.Data;
                            // console.log(products);
                            deferred.resolve(products);
                        },
                        function (response) {
                            deferred.reject(response);
                            void 0;
                        }
                    );
		            return deferred.promise;
		        },
		        // get PRODUCTS INITIALS by category
		        getProductInitialsByCategory: function (category, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                Category: category
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetProductInitialsByCategory', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            deferred.reject(response);
                            void 0;
                        }
                    );
		            return deferred.promise;
		        },
		        // get PRODUCTS INITIALS by category
		        getProductInitialsByCategoryByCountry: function (category, country, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                Category: category,
		                CountryCode: country
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetProductInitialsByCategoryByCountry', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            deferred.reject(response);
                            void 0;
                        }
                    );
		            return deferred.promise;
		        },
		        // get CARRIERS by category
		        getCarriers: function (category, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                Category: category
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetCarriers', queryObj, loadingTracker)
                    .then(function (response) {
                        arr = response.data.Data;
                        void 0;
                        deferred.resolve(arr);
                    }, function (response) {
                        void 0;
                        deferred.reject(response);
                    });
		            return deferred.promise;
		        },
		        // get COUNTRIES by category
		        getCountriesByCategory: function (category, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                Category: category
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetCountriesByCategory', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(JSON.stringify(arr));
                            deferred.resolve(arr);
                        }, function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get COUNTRIES INITIALS by category
		        getCountryInitialsByCategory: function (category, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                Category: category
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetCountryInitialsByCategory', queryObj)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(JSON.stringify(arr));
                            deferred.resolve(arr);
                        }, function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get RATES by country
		        getRates: function (maincode, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                ProductMainCode: maincode
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetProductRates', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data;
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );

		            return deferred.promise;
		        },
		        // get LONGDISTANCE countries
		        getLongDistanceCountries: function (user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetLongDistanceCountries', queryObj, loadingTracker)
                    .then(function (response) {
                        countries = response.data.Data;
                        // console.log(JSON.stringify(countries));
                        deferred.resolve(countries);
                    }, function (response) {
                        deferred.reject(response);
                    });
		            return deferred.promise;
		        },
		        // get LONGDISTANCE products by country
		        getLongDistanceProductsByCountry: function (countryName, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                CountryName: countryName
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetLongDistanceProductsByCountry', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        }, function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get LONGDISTANCE country details
		        getCountryDetails: function (category, countryCode, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                Category: category,
		                CountryCode: countryCode
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetCountryDetailsByCategory', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        }, function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // GET WIRELESS CARRIERS
		        getWirelessCarriers: function (countryCode, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                CountryCode: countryCode
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetWirelessCarriers', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            deferred.resolve(arr);
                            // console.log(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.resolve(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // GET WIRELESS PRODUCTS BY CARRIER
		        getWirelessProductsByCarrier: function (carrierId, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                CarrierId: carrierId
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetWirelessProductsByCarrier', queryObj, loadingTracker)
                    .then(function (response) {
                        arr = response.data.Data;
                        void 0;
                        deferred.resolve(arr);
                    }, function (response) {
                        void 0;
                        deferred.reject(response);
                    });
		            return deferred.promise;
		        },
		        // GET WIRELESS CARRIER DETAILS
		        getWirelessCarrierDetails: function (carrierId, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                CarrierId: carrierId
		            };
		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetWirelessCarrierDetails', queryObj, loadingTracker)
                    .then(function (response) {
                        arr = response.data.Data;
                        deferred.resolve(arr);
                    }, function (response) {
                        void 0;
                        deferred.reject(response);
                    });
		            return deferred.promise;
		        },
		        // GET WIRELESS CARRIER INITIALS
		        getWirelessCarrierInitials: function (countryCode, user) {
		            var queryObj = {
		                MerchantId: user.MerchantId,
		                MerchantPassword: user.MerchantPassword,
		                CountryCode: countryCode
		            };

		            // console.log(queryObj);
		            var deferred = $q.defer();

		            $http.post(API_URL + 'products/GetWirelessCarrierInitials', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            void 0;
                            deferred.resolve(arr);
                        }, function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // DO BLACKSTONE POS OPERATION
		        doBlackstonePosOperation: function (order) {
		            void 0;
		            var deferred = $q.defer();



		            $http.post(API_URL + 'Products/DoBlackstonePosOperation', order, loadingTracker)
                    .then(
                        function (response) {
                            var brokerResponse = response.data;
                            // console.log(brokerResponse);
                            deferred.resolve(brokerResponse);
                        },
                        function (error) {
                            void 0;
                            deferred.reject(error);
                        }
                    );
		            return deferred.promise;
		        },
		        // POS MAIN PRODUCTS
		        getPosMainProducts: function (user, pass) {

		            user = {
		                MerchantId: user,
		                MerchantPassword: pass
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'Products/GetPosMainProducts', user, loadingTracker)
                    .then(
                        function (response) {

                            var mainProductsResponse = response.data.Data;

                            deferred.resolve(mainProductsResponse);
                        },
                        function (error) {
                            void 0;
                            deferred.reject(error);
                        }
                    );
		            return deferred.promise;
		        }
		    };
		}]);
}());

(function () {
    'use strict';

    /* MODAL INSTANCE */
    angular.module('posApp')
	// might ngInject
	.controller('ShowProductCtrl', ['$scope', '$routeParams', '$modal', 'ProdsFactory', 'AlertService', 'localStorageService', 'SharedFunctions', 'ConfirmationFactory', 'SettingsFactory',
		function ($scope, $routeParams, $modal, ProdsFactory, AlertService, localStorageService, SharedFunctions, ConfirmationFactory, SettingsFactory) {

		    // clear alerts from previous view
		    AlertService.clear();

		    // get productMainCode by $routeParams
		    var productMainCode = $routeParams.id;

		    // get userInfo stored on localStorageService
		    var userInfo = localStorageService.get('userInfo');



		    // set form visibility
		    $scope.showReceipt = false;
		    // detect if devise is mobile to set input to readonly
		    $scope.isMobile = SharedFunctions.isMobile();

		    // product details accordion
		    $scope.oneAtATime = true;
		    $scope.status = {
		        isFirstOpen: !SharedFunctions.isMobile(),
		        isFirstDisabled: false
		        // open = !$scope.isMobile
		    };

		    void 0;


		    // GET SETTINGS

		    SettingsFactory.getSettings().then(
				function (data) {
				    var arr = data;
				    localStorageService.set('settings', arr);
				    $scope.settings = arr;
				    // console.log(arr);
				},
				function (error) {
				    void 0;
				}
			);
		    //// get merchant settings (confirm phone)
		    //$scope.settings = localStorageService.get('settings');

		    //console.log($scope.settings);

		    function initInputs() {
		        if (!$scope.phoneNumber.value) {
		            $scope.phoneNumber.value = '';
		        }
		        if (!$scope.amount.value) {
		            $scope.amount.value = '';
		        }
		        if (!$scope.phoneMatch.value) {
		            $scope.phoneMatch.value = '';
		        }
		    }

		    // get product info
		    $scope.getProduct = function () {
		        ProdsFactory.getProduct(productMainCode, userInfo).then(
                    function (data) {
                        $scope.item = data;
                        $scope.phoneNumber.value = $scope.phoneMatch.value = data.DialCountryCode;
                        $scope.hasKeyPad = !data.UseFixedDenominations || data.IsTopUp;
                        void 0;
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getProduct();


		    // init inputs values and state
		    $scope.phoneNumber = { value: null, isFocused: false };
		    $scope.phoneMatch = { value: null, isFocused: false };
		    $scope.amount = { value: null, isFocused: false };
		    // $scope.item = { UseFixedDenominations: true};


		    //this statement need to be changed when other merchant add additional phones to its product. Till now is ok cuz there is only one, "Siempre Cerca" and the extention 
		    //of the additional phones is only 502 - Guatemala 
		    $scope.additionalPhones = [{ value: '502', isFocused: false }, { value: '502', isFocused: false }, { value: '502', isFocused: false }];


		    $scope.additionalPhoneNumbersAmount = function () {
		        if ($scope.item && $scope.item.AcceptAdditionalPhones && $scope.amount.value && $scope.item.DenominationsConfig) {
		            var index = $scope.item.DenominationsConfig.indexOf($scope.amount, 0, function (e, a) { return e.Denomination == a.value; });
		            return $scope.item.DenominationsConfig[index].AdditionalPhonesQuantity;
		        }
		        return 0;
		    };

		    $scope.timeRates = function(value) {
		        var index = $scope.item.TimeDenominations.indexOf(value, 0, function (e, a) { return e.Denomination == a; });
		        return $scope.item.TimeDenominations[index].Time;
		    };

		    // Modal (ui.bootstrap.modal). In Docs (item) pass modal size, here pass the single item object
		    $scope.open = function (items) {
		        var info = { firstItem: $scope.item.Name, secondItem: $scope.item.CountryName, thirdItem: $scope.item.CarrierName };

		        // angular.extend(dst, src);
		        items = angular.extend(items, info);
		        void 0;

		        // console.log(JSON.stringify(items));

		        var modalInstance = $modal.open({
		            templateUrl: './app/products/_modal-product-tpl.html',
		            controller: 'ModalInstanceCtrl',
		            size: 'lg',
		            windowClass: 'product-modal',
		            resolve: {
		                item: function () {
		                    return items;
		                }
		            }
		        });

		        modalInstance.result.then(function (selectedItem) {
		            $scope.selected = selectedItem;
		        }, function () {
		            // $log.info('Modal dismissed at: ' + new Date());
		        });
		    };

		    // PRODUCT RATES
		    // get product rates
		    function getProductRates(maincode) {
		        var myResult = ProdsFactory.getProductRates(maincode, userInfo).then(
                    function (data) {
                        var info = {
                            Name: $scope.item.Name,
                            CountryName: $scope.item.CountryName,
                            CarrierName: $scope.item.CarrierName
                        };

                        var itemsMerged = angular.extend(data, info);
                        return itemsMerged;
                    },
                    function (error) {
                        void 0;
                    }
                );
		        void 0;
		        return myResult;
		    }

		    // call get product rates and show it into modal window
		    $scope.openRates = function (obj) {
		        var mydata = getProductRates(obj);

		        var modalInstance = $modal.open({
		            templateUrl: './app/products/_modal-product-tpl.html',
		            controller: 'ModalInstanceCtrl',
		            size: 'lg',
		            windowClass: 'product-modal',
		            resolve: {
		                item: function () {
		                    return mydata;
		                }
		            }
		        });

		        modalInstance.result.then(function (selectedItem) {
		            $scope.selected = selectedItem;
		        }, function () {
		            // $log.info('Modal dismissed at: ' + new Date());
		        });
		    };

		    // ACCESS NUMBERS
		    // get product access numbers
		    function getProductAccessNumbers(maincode) {
		        var myResult = ProdsFactory.getProductAccessNumbers(maincode, userInfo).then(
                    function (data) {

                        var info = {
                            Name: $scope.item.Name,
                            CountryName: $scope.item.CountryName,
                            CarrierName: $scope.item.CarrierName
                        };

                        return angular.extend(data, info);
                    },
                    function (error) {
                        void 0;
                    }
                );
		        // console.log(myResult);
		        return myResult;
		    }
		    // call get product access numbers and show it into modal window
		    $scope.openAccessNumbers = function (maincode) {

		        var mydata = getProductAccessNumbers(maincode);

		        // var accessData = data.Data;
		        for (var i = 0; i < mydata.length; i++) {
		            delete mydata.languageField;
		        }

		        var modalInstance = $modal.open({
		            templateUrl: './app/products/_modal-product-tpl.html',
		            controller: 'ModalInstanceCtrl',
		            size: 'lg',
		            windowClass: 'product-modal',
		            resolve: {
		                item: function () {
		                    return mydata;
		                }
		            }
		        });

		        modalInstance.result.then(function (selectedItem) {
		            $scope.selected = selectedItem;
		        }, function () {
		            // $log.info('Modal dismissed at: ' + new Date());
		        });
		    };

		    // Modal (ui.bootstrap.modal).
		    $scope.openTerms = function (items) {

		        var modalInstance = $modal.open({
		            templateUrl: './app/shared/_modal-product-terms-tpl.html',
		            controller: 'ModalInstanceTermsCtrl',
		            size: 'lg',
		            windowClass: 'product-modal',
		            resolve: {
		                item: function () {
		                    return items;
		                }
		            }
		        });

		        modalInstance.result.then(function (selectedItem) {
		            $scope.selected = selectedItem;
		        }, function () {
		            // $log.info('Modal dismissed at: ' + new Date());
		        });
		    };


		    function focused() {
		        if ($scope.amount.isFocused)
		            return $scope.amount;
		        else if ($scope.phoneNumber.isFocused)
		            return $scope.phoneNumber;
		        else if ($scope.phoneMatch.isFocused)
		            return $scope.phoneMatch;
		        else {
		            for (var i = 0; i < $scope.additionalPhones.length; i++) {
		                var phone = $scope.additionalPhones[i];
		                if (phone.isFocused)
		                    return phone;
		            }
		        }
		        return null;
		    }

		    $scope.setKey = function (value) {
		        initInputs();

		        void 0;
		        var obj = focused();
		        if (!obj.val)
		            obj.val = '';
		        obj.value += value;
		    };

		    $scope.backKey = function () {
		        initInputs();
		        var obj = focused();

		        var length = obj.value.length;
		        var value = obj.value;

		        void 0;
		        void 0;

		        obj.value = value.substring(0, length - 1);
		    };

		    $scope.clearKey = function () {
		        var obj = focused();
		        obj.value = '';

		    };


		    $scope.setFocusedInput = function (inputName, additionalPhoneIndex) {
		        $scope.phoneNumber.isFocused = false;
		        $scope.phoneMatch.isFocused = false;
		        $scope.amount.isFocused = false;
		        for (var i = 0; i < $scope.additionalPhones.length; i++) {
		            $scope.additionalPhones[i].isFocused = false;
		        }

		        var obj = (additionalPhoneIndex != null ? $scope[inputName][additionalPhoneIndex] : $scope[inputName]);
		        obj.isFocused = true;
		        void 0;
		    };


		    $scope.editing = null;
		    $scope.editItem = function (item) {
		        $scope.editing = item;
		        void 0;
		    };

		    $scope.onInputClick = function ($event) {
		        $event.target.select();
		    };


		    $scope.leaveInputsFocus = function () {
		        $scope.amount.isFocused = false;
		        $scope.phoneNumber.isFocused = false;
		        $scope.phoneMatch.isFocused = false;
		    };

		    $scope.setAmount = function (value) {
		        void 0;

		        if ($scope.amount === value) {
		            $scope.amount = undefined;
		        } else {
		            $scope.amount = value;
		        }
		    };

		    // FORM SUBMIT HANDLER
		    $scope.submit = function (form) {

		        // Trigger validation flag.
		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            AlertService.clear();
		            //AlertService.add('error', 'Check errors below (in red color)');
		            return;

		        } else {

		            $scope.isBlocked = true;

		            // remove any previous alert
		            AlertService.clear();

		            var order = {
		                AdditionalPhones: null,
		                MerchantId: userInfo.MerchantId,
		                MerchantPassword: userInfo.MerchantPassword, // string
		                OperatorName: userInfo.userName, // string
		                ProfileId: userInfo.profileId, // int
		                TerminalId: userInfo.terminalId, // int
		                Amount: $scope.amount.value,
		                PhoneNumber: $scope.phoneNumber.value,
		                ProductMainCode: $scope.item.Code,
		                CountryCode: $scope.item.DialCountryCode
		            };

		            if ($scope.item.AcceptAdditionalPhones) {
		                order.AdditionalPhones = [];
		                var additionalPhoneQuantity = $scope.additionalPhoneNumbersAmount();

		                for (var i = 0; i < additionalPhoneQuantity; i++) {
		                    order.AdditionalPhones.push($scope.additionalPhones[i].value);
		                }
		            }



		            // console.log(order);
		            // console.log(userInfo);

		            ProdsFactory.doBlackstonePosOperation(order).then(
                        function (response) {

                            //console.log(response);

                            if (response.Status === 200 || response.Status === 203) {

                                var orderResultText = response.Status === 200 ? 'Order processed!' : 'Order placed. Pending for further Execution!';

                                $scope.showReceipt = true;

                                void 0;

                                $scope.submitted = false;
                                AlertService.add('success', orderResultText);

                                $scope.receipt = response.Data;

                                //console.log('from transaction:' + receipt);

                            } else {
                                AlertService.add('error', response.ErrorMessage);
                                // Trigger validation flag.
                                $scope.isBlocked = false;
                            }


                        },
                        function (error) {
                            $scope.isBlocked = false;
                            AlertService.add('error', 'Invalid Credentials');
                            void 0;
                        }
                    );

		            $scope.showReceipt = false;
		            // AlertService.add('error', $scope.receipt.ErrorMessage);
		        }
		    };

		    // PRINT RECEIPT
		    $scope.printInfo = function () {
		        window.print();
		    };

		    // SEND RECEIPT AS SMS
		    $scope.sendSms = function (form) {

		        // Trigger validation flag.
		        $scope.submittedSms = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {

		            AlertService.clear();
		            AlertService.add('error', 'Check form errors');
		            return false;

		        } else {

		            // remove any previous alert
		            AlertService.clear();

		            var receipt = $scope.receipt;
		            var phone = $scope.phoneToSend;

		            ConfirmationFactory.sendConfirmationSms(receipt, phone).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedSms = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as sms successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                            void 0;
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                            void 0;
                        }
                    );
		        }
		    };

		    // SEND RECEIPT AS EMAIL
		    $scope.sendEmail = function (form) {

		        // Trigger validation flag.
		        $scope.submittedEmail = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {

		            AlertService.clear();
		            AlertService.add('error', 'Check form errors');
		            return false;

		        } else {

		            // remove any previous alert
		            AlertService.clear();

		            var receipt = $scope.receipt;
		            var email = $scope.emailToSend;

		            ConfirmationFactory.sendConfirmationEmail(receipt, email).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedEmail = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as email successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                            void 0;
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                            void 0;
                        }
                    );
		        }
		    };

		}]);
}());

(function () {
    'use strict';
    /* MODAL INSTANCE */
    angular.module('posApp')
	.controller('ShowTermsCtrl', ['$scope', '$routeParams', 'ProdsFactory', 'AlertService', 'localStorageService',
		function ($scope, $routeParams, ProdsFactory, AlertService, localStorageService) {

		    // clear alerts from previous view
		    AlertService.clear();

		    // get productMainCode by $routeParams
		    var productMainCode = $routeParams.id;

		    void 0;
		    var userInfo = localStorageService.get('userInfo');
		    // get product info
		    $scope.getProductTerms = function () {
		        ProdsFactory.getProductTerms(productMainCode, userInfo).then(
                    function (data) {
                        $scope.item = data;
                        void 0;
                    },
                    function (error) {
                        void 0;
                    }
                );
		    };
		    $scope.getProductTerms();


		    // PRINT RECEIPT
		    $scope.printInfo = function () {
		        window.print();
		    };

		}])
	.filter('range', function () {
	    return function (val, range) {
	        range = parseInt(range);
	        for (var i = 0; i < range; i++)
	            val.push(i);
	        return val;
	    };
	});
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	.controller('PromosCtrl', ['$scope', '$routeParams', 'PromosFactory', 'AlertService',
		function ($scope, $routeParams, PromosFactory, AlertService) {

		    // clear alerts from previous view
		    AlertService.clear();

		    // console.log('cosa');

		    $scope.getPromotions = function () {
		        PromosFactory.getPromotions().then(
                    function (data) {
                        $scope.items = data;
                        // console.log(data);
                    },
                    function (error) {
                        AlertService.add('error', error);
                        void 0;
                    }
                );
		    };
		    $scope.getPromotions();
		}]);
}());

(function () {
    'use strict';
    angular.module('promosServices', [])
	// might ngInject
	.factory('PromosFactory', ['$http', '$rootScope', 'API_URL', '$q', 'SharedFunctions', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, SharedFunctions, localStorageService) {

		    var loadingTracker = { tracker: $rootScope.loadingTracker };

		    var userInfo = localStorageService.get('userInfo');
		    var merchant = { MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword };

		    var arr = [];
		    // console.log(merchant);

		    return {
		        getPromotions: function () {

		            var deferred = $q.defer();

		            $http.post(API_URL + 'Promotions/GetAllPromotions', merchant, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data.Data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (error) {
                            // console.log(error);
                            deferred.reject(error);
                        });
		            return deferred.promise;
		        }
		    };
		}]);
}());

(function () {
    'use strict';
    angular.module('posApp')
	// ModalAccountCtrl CONTROLLER
	// Please note that $modalInstance represents a modal window (instance) dependency.
	.controller('ModalAccountCtrl', ['$scope', '$modalInstance', 'item', '$location', 'localStorageService', function ($scope, $modalInstance, item, $location, localStorageService) {

	    $scope.merchant = item;
	    //console.log();

	    $scope.openAdmin = function () {
	        $modalInstance.close();
	        $location.path('/admin');
	    };

	    $scope.logout = function () {
	        $modalInstance.close();
	        localStorageService.clearAll();
	    };

	    $scope.close = function () {
	        $modalInstance.close();
	    };

	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	}])
	.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, item) {

	    $scope.items = item;
	    //console.log();

	    $scope.selected = {
	        item: $scope.items
	    };

	    $scope.modalOptions = {
	        closeButtonText: 'Close',
	        actionButtonText: 'Save',
	        headerText: $modalInstance.headerText
	    };

	    $scope.close = function () {
	        $modalInstance.close($scope.selected.items);
	    };

	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	}])
	.controller('ModalInstanceTermsCtrl', ['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, item) {
	    $scope.items = item;
	    //console.log();

	    $scope.selected = {
	        item: $scope.items
	    };

	    $scope.modalOptions = {
	        closeButtonText: 'Close',
	        actionButtonText: 'Save',
	        headerText: $modalInstance.headerText
	    };

	    $scope.close = function () {
	        $modalInstance.close($scope.selected.items);
	    };

	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	}])
	// MainCtrl CONTROLLER
	.controller('MainCtrl', ['$rootScope', '$scope', '$location', 'localStorageService', 'AuthenticationFactory', 'MerchantFactory', 'AdminFactory', 'AlertService', '$modal',
		function ($rootScope, $scope, $location, localStorageService, AuthenticationFactory, MerchantFactory, AdminFactory, AlertService, $modal) {

		    // clear alerts from previous view
		    AlertService.clear();

		    var merchant = {};
		    merchant.userInfo = localStorageService.get('userInfo');
		    // console.log(merchant.userInfo);
		    merchant.salesDetails = null;
		    merchant.balanceDetails = null;

		    // alert
		    $scope.closeAlert = function (index) {
		        $scope.alerts.splice(index, 1);
		    };

		    // TOP NAV INFO
		    var homeInfo = function () {
		        var viewInfo = {
		            show: true,
		            title: 'HOME',
		            instruction: 'Select category'
		        };
		        return viewInfo;
		    };

		    var navInfo = function () {
		        var param1 = $location.path().split('/').splice(1, 1).toString();
		        var param2 = $location.path().split('/').splice(2, 1).toString();
		        var param3 = $location.path().split('/').splice(3, 1).toString();
		        var param4 = $location.path().split('/').splice(4, 1).toString();

		        var viewInfo = {
		            show: true,
		            title: param1,
		            instruction: 'Select' + param1.toUpperCase()
		        };

		        function posViewInfo(category) {

		            switch (category) {
		                case 'longdistance':
		                    viewInfo = {
		                        show: true,
		                        title: 'Long Distance',
		                        instruction: (param4 === 'countries') ? 'Select Country' : 'Select Product'
		                    };
		                    break;
		                case 'international':
		                    viewInfo = {
		                        show: true,
		                        title: 'International Top Up',
		                        instruction: (param4 === 'countries') ? 'Select Country' : 'Select Product'
		                    };
		                    break;
		                case 'pinless':
		                    viewInfo = {
		                        show: true,
		                        title: 'Pinless',
		                        instruction: 'Select Product'
		                    };
		                    break;
		                case 'wireless':
		                    viewInfo = {
		                        show: true,
		                        title: 'Wireless',
		                        instruction: (param4 === 'carriers') ? 'Select Carrier' : 'Select Product'
		                    };
		                    break;
		                case 'promotions':
		                    viewInfo = {
		                        show: true,
		                        title: 'Promotions',
		                        instruction: 'Select Product'
		                    };
		                    break;
		                default:
		                    viewInfo = {
		                        show: ($location.path() === '/login') ? false : true,
		                        title: param1,
		                        instruction: 'Select item'
		                    };
		            }

		            // console.log(category);
		            return viewInfo;
		        }

		        switch (param1) {
		            case 'pos':
		                posViewInfo(param3);
		                break;
		            case 'sunpass':
		                viewInfo = {
		                    show: true,
		                    title: param1,
		                    instruction: 'Select ' + param1.toUpperCase()
		                };
		                break;
		            case 'billpayment':
		                viewInfo = {
		                    show: true,
		                    title: 'Bill Payment',
		                    instruction: (param2 === 'categories') ? 'Select Category' : ((param2 === 'category') ? 'Select Biller' : 'Complete the form')
		                };
		                break;
		            case 'others':
		                viewInfo = {
		                    show: true,
		                    title: param1,
		                    instruction: 'Select item'
		                };
		                break;
		            case 'directtv':
		                viewInfo = {
		                    show: true,
		                    title: 'Direct Tv',
		                    instruction: (param2 === 'categories') ? 'Select Category' : ((param2 === 'category') ? 'Select Product' : 'Complete the form')
		                };
		                break;
		            default:
		                viewInfo = {
		                    show: ($location.path() === '/login') ? false : true,
		                    title: param1,
		                    instruction: 'Select item'
		                };
		        }

		        return (viewInfo);
		    };

		    // show / hide HOME button
		    var showHome = function () {
		        return ($location.path() === '/' || $location.path() === '/login') ? false : true;
		    };
		    var showAccount = function () {
		        return ($location.path() === '/login') ? false : true;
		    };
		    var showNav = function () {
		        return ($location.path() === '/login') ? false : true;
		    };

		    var getUserInfo = function () {
		        var userInfo = localStorageService.get('userInfo');
		        return userInfo;
		    };


		    // view info
		    if ($location.path() === '/') {
		        $scope.viewInfo = homeInfo();
		    } else {
		        $scope.viewInfo = navInfo();
		    }


		    // GET SALES SUMMARY
		    var getSalesSummary = function () {

		        var userInfo = getUserInfo();

		        MerchantFactory.getSalesSummary(userInfo.MerchantId, userInfo.MerchantPassword).then(
                    function (data) {
                        merchant.salesDetails = data;
                        //console.log(data);
                    },
                    function (error) {
                        $scope.error = error;
                        void 0;
                    }
                );
		    };

		    // GET BALANCE DETAILS
		    var getBalanceDetails = function () {

		        var userInfo = getUserInfo();
		        merchant.userInfo = userInfo;
		        // console.log(userInfo);

		        MerchantFactory.getBalanceDetails(userInfo.MerchantId, userInfo.MerchantPassword).then(
                    function (data) {
                        merchant.balanceDetails = data;
                        // getUserInfo();
                        $scope.spin = false;
                        // console.log(data);
                    },
                    function (error) {
                        $scope.error = error;
                        void 0;
                    }
                );
		    };

		    // var getAppMainLogoUrl = function() {

		    // 	var userInfo = getUserInfo();

		    // 	AdminFactory.getAppMainLogoUrl(userInfo.MerchantId, userInfo.MerchantPassword).then(
		    // 		function(data){
		    // 			$scope.logourl =  data.Data;
		    // 			localStorageService.set('logourl', data.Data);
		    // 		},
		    // 		function(error){
		    // 			console.log(error);
		    // 		}
		    // 	);
		    // };

		    // My Account modal
		    // Modal (ui.bootstrap.modal). In Docs (item) pass modal size, here pass the single item object
		    $scope.openAccountModal = function () {

		        var modalInstance = $modal.open({
		            templateUrl: './app/admin/_modal-account-tpl.html',
		            controller: 'ModalAccountCtrl',
		            size: 'lg',
		            windowClass: 'product-modal',
		            resolve: {
		                item: function () {
		                    getSalesSummary();
		                    getBalanceDetails();
		                    // console.log(merchantData);
		                    return merchant;
		                }
		            }
		        });

		        modalInstance.result.then(function (selectedItem) {
		            $scope.selected = selectedItem;
		        }, function () {
		            // $log.info('Modal dismissed at: ' + new Date());
		        });
		    };


		    // interface vars (show/hide) elements
		    $scope.showHome = showHome();
		    $scope.showAccount = showAccount();
		    $scope.showNav = showNav();

		    // var DEF = {title: 'Welcome', logo: '', favicon: 'favicon.png'};
		    var BS = { title: 'POS', logo: 'http://mobile.blackstonepos.com/logos/pos-logo.png', favicon: 'favicon.png' };
		    var FCUSA = { title: 'FCUSA', logo: 'http://mobile.blackstonepos.com/logos/fullCarga.png', favicon: 'favicon-fcusa.png' };

		    if (merchant.userInfo && merchant.userInfo.IsFullCarga) {
		        $scope.comInfo = FCUSA;
		        $scope.isFullCarga = true;
		    } else {
		        $scope.comInfo = BS;
		        $scope.isFullCarga = false;
		    }


		    $scope.userInfo = merchant.userInfo;


		    // update showHome & showAccount & userInfo, to control buttons display
		    $scope.$watch(
                function () {
                    return $location.path();
                },
                function (newValue, oldValue) {

                    if (newValue === oldValue) {
                        return;
                    }

                    $scope.showHome = showHome();
                    $scope.showAccount = showAccount();
                    $scope.showNav = showNav();
                    $scope.userInfo = localStorageService.get('userInfo');
                    $scope.isFullCarga = ($scope.userInfo && $scope.userInfo.IsFullCarga === true) ? true : false;
                    $scope.comInfo = ($scope.userInfo && $scope.userInfo.IsFullCarga === true) ? FCUSA : BS;
                    // console.log($scope.userInfo);

                    // set title in navigation from $location.path() #/pos/category/pinless = 0/1/2/3
                    if (newValue === '/') {
                        $scope.viewInfo = homeInfo();
                    } else {
                        $scope.viewInfo = navInfo();
                    }
                    // console.log(newValue);
                }, true);

		    // Watch if user is logged in
		    $scope.$watch(

                    AuthenticationFactory.isLoggedIn,

                function (value, oldValue) {

                    if (!value && oldValue) {
                        void 0;
                        $location.path('/login');
                    }

                    if (value) {
                        void 0;
                    }

                }, true);

		}]);
}());

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
	.directive('productCaption', function () {
	    return {
	        restrict: 'E',
	        templateUrl: 'app/directives/product-caption.html'
	    };
	})
	// productCaption Directive
	.directive('salesDetails', function () {
	    return {
	        restrict: 'A',
	        templateUrl: 'app/shared/_sales-details.html'
	    };
	})
	// work in progress template
	.directive('workInProgress', function () {
	    return {
	        restrict: 'A',
	        templateUrl: 'app/shared/_work-in-progress.html'
	    };
	})
	// countryFlag Directive to template country flags
	.directive('countryFlag', function () {
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
	        link: function (scope, elem, attrs, ctrl) {
	            scope.$watch(function () {
	                return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
	            }, function (currentValue) {
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
	        link: function (scope, elem) {
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
	.directive('ngAlertConfirm', [function () {
	    return {
	        link: function (scope, element, attr) {
	            var msg = attr.ngConfirmClick || 'Are you sure?';
	            var clickAction = attr.confirmedClick;

	            // element.bind('click', function (event) {
	            element.bind('click', function () {
	                if (window.confirm(msg)) {
	                    scope.$eval(clickAction);
	                }
	            });
	        }
	    };
	}])
	// validate numeric formats allowed
	.directive('numberFormatValidator', function () {
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
	        link: function ($scope, elem, attrs, ngModel) {
	            ngModel.$validators.numberFormat = function (value) {
	                var status = true;
	                angular.forEach(REQUIRED_PATTERNS, function (pattern) {
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

	        var minValidator = function (value) {
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
	        attrs.$observe('max', function (value) {
	            max = parseFloat(value);
	        });
	        // var max = parseFloat(attrs.max);
	        var maxValidator = function (value) {
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
	.directive('emailValidator', function () {

	    // set a array of regular expresión defining validation rules.
	    var REQUIRED_PATTERNS = [
			/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,    //numeric values
			/^\S+$/   //no whitespace allowed
	    ];

	    return {
	        require: 'ngModel',
	        link: function ($scope, elem, attrs, ngModel) {
	            ngModel.$validators.emailFormat = function (value) {
	                var status = true;
	                angular.forEach(REQUIRED_PATTERNS, function (pattern) {
	                    status = status && pattern.test(value);
	                    // console.log(status, pattern);
	                });
	                return status;
	            };
	        }
	    };
	})
	// validate phone number format
	.directive('phoneValidator', function () {

	    var REQUIRED_PATTERNS = [
			/^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/, //no whitespace allowed
			/^[0-9]{10}$/	//numeric values
	    ];

	    return {
	        require: 'ngModel',
	        link: function ($scope, elem, attrs, ngModel) {
	            ngModel.$validators.phoneFormat = function (value) {
	                var status = true;
	                angular.forEach(REQUIRED_PATTERNS, function (pattern) {
	                    status = status && pattern.test(value);
	                    // console.log(status, pattern);
	                });
	                return status;
	            };
	        }
	    };
	})
	// validate password match
	.directive('phoneMatch', function () {
	    return {
	        restrict: 'A',
	        scope: true,
	        require: 'ngModel',
	        link: function (scope, elem, attrs, ctrl) {
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
	.directive('accountMatch', function () {
	    return {
	        restrict: 'A',
	        scope: true,
	        require: 'ngModel',
	        link: function (scope, elem, attrs, ctrl) {
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
	.directive('usaStates', function () {
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
					{ 'name': 'Alabama', 'abb': 'AL' },
					{ 'name': 'Alaska', 'abb': 'AK' },
					{ 'name': 'Arizona', 'abb': 'AZ' },
					{ 'name': 'Arkansas', 'abb': 'AR' },
					{ 'name': 'California', 'abb': 'CA' },
					{ 'name': 'Colorado', 'abb': 'CO' },
					{ 'name': 'Connecticut', 'abb': 'CT' },
					{ 'name': 'Delaware', 'abb': 'DE' },
					{ 'name': 'District Of Columbia', 'abb': 'DC' },
					{ 'name': 'Florida', 'abb': 'FL' },
					{ 'name': 'Georgia', 'abb': 'GA' },
					{ 'name': 'Hawaii', 'abb': 'HI' },
					{ 'name': 'Idaho', 'abb': 'ID' },
					{ 'name': 'Illinois', 'abb': 'IL' },
					{ 'name': 'Indiana', 'abb': 'IN' },
					{ 'name': 'Iowa', 'abb': 'IA' },
					{ 'name': 'Kansas', 'abb': 'KS' },
					{ 'name': 'Kentucky', 'abb': 'KY' },
					{ 'name': 'Louisiana', 'abb': 'LA' },
					{ 'name': 'Maine', 'abb': 'ME' },
					{ 'name': 'Maryland', 'abb': 'MD' },
					{ 'name': 'Massachusetts', 'abb': 'MA' },
					{ 'name': 'Michigan', 'abb': 'MI' },
					{ 'name': 'Minnesota', 'abb': 'MN' },
					{ 'name': 'Mississippi', 'abb': 'MS' },
					{ 'name': 'Missouri', 'abb': 'MO' },
					{ 'name': 'Montana', 'abb': 'MT' },
					{ 'name': 'Nebraska', 'abb': 'NE' },
					{ 'name': 'Nevada', 'abb': 'NV' },
					{ 'name': 'New Hampshire', 'abb': 'NH' },
					{ 'name': 'New Jersey', 'abb': 'NJ' },
					{ 'name': 'New Mexico', 'abb': 'NM' },
					{ 'name': 'New York', 'abb': 'NY' },
					{ 'name': 'North Carolina', 'abb': 'NC' },
					{ 'name': 'North Dakota', 'abb': 'ND' },
					{ 'name': 'Ohio', 'abb': 'OH' },
					{ 'name': 'Oklahoma', 'abb': 'OK' },
					{ 'name': 'Oregon', 'abb': 'OR' },
					{ 'name': 'Pennsylvania', 'abb': 'PA' },
					{ 'name': 'Rhode Island', 'abb': 'RI' },
					{ 'name': 'South Carolina', 'abb': 'SC' },
					{ 'name': 'South Dakota', 'abb': 'SD' },
					{ 'name': 'Tennessee', 'abb': 'TN' },
					{ 'name': 'Texas', 'abb': 'TX' },
					{ 'name': 'Utah', 'abb': 'UT' },
					{ 'name': 'Vermont', 'abb': 'VT' },
					{ 'name': 'Virginia', 'abb': 'VA' },
					{ 'name': 'Washington', 'abb': 'WA' },
					{ 'name': 'West Virginia', 'abb': 'WV' },
					{ 'name': 'Wisconsin', 'abb': 'WI' },
					{ 'name': 'Wyoming', 'abb': 'WY' }
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
	.directive('innerNavFilters', function () {
	    return {
	        restrict: 'AE',
	        replace: true,
	        templateUrl: 'app/shared/_inner-nav.html',
	        // scope:true,
	        // require: 'ngModel',
	        link: function ($scope) {

	            var acronymText = {
	                show: 'Show Filter',
	                hide: 'Hide Filter'
	            };

	            $scope.acronymText = ($scope.showAcronym === true) ? acronymText.hide : acronymText.show;
	            $scope.clearDisabled = true;

	            $scope.showFilter = function () {
	                $scope.showAcronym = !$scope.showAcronym;
	                $scope.acronymText = ($scope.showAcronym === true) ? acronymText.hide : acronymText.show;
	            };

	            $scope.clearFilter = function () {
	                $scope.letter = '';
	                $scope.acronymDisabled = false;
	                $scope.clearDisabled = true;
	            };

	            $scope.setFilter = function (value) {
	                $scope.letter = value;
	                $scope.clearDisabled = false;
	            };
	        }
	    };
	});
}());

(function () {
    'use strict';

    angular.module('appFilters', [])
	/** Capitalize string, @return {[json]} */
	.filter('capitalize', function () {
	    return function (input) {
	        return (!input) ? '' : input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
	            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	        });
	    };
	})
	/** Replace spaces for dash symbol, @return {[json]} */
	.filter('makeSlug', function () {
	    return function (item) {
	        item = item || '';
	        return item.replace(/\s+/g, '-').toLowerCase();
	    };
	})
	/** format phone numbers */
	.filter('tel', function () {
	    return function (tel) {
	        if (!tel) {
	            return '';
	        }

	        var value = tel.toString().trim().replace(/^\+/, '');

	        if (value.match(/[^0-9]/)) {
	            return tel;
	        }

	        var country, city, number;

	        switch (value.length) {
	            case 10: // +1PPP####### -> C (PPP) ###-####
	                country = 1;
	                city = value.slice(0, 3);
	                number = value.slice(3);
	                break;

	            case 11: // +CPPP####### -> CCC (PP) ###-####
	                country = value[0];
	                city = value.slice(1, 4);
	                number = value.slice(4);
	                break;

	            case 12: // +CCCPP####### -> CCC (PP) ###-####
	                country = value.slice(0, 3);
	                city = value.slice(3, 5);
	                number = value.slice(5);
	                break;

	            default:
	                return tel;
	        }

	        if (country === 1) {
	            country = '';
	        }

	        number = number.slice(0, 3) + '-' + number.slice(3);

	        return (country + ' (' + city + ') ' + number).trim();
	    };
	})
	/** format myCamelCaseString to My Camel Case String */
	.filter('ordinal', function () {
	    return function (input) {
	        return input.charAt(0).toUpperCase() + input.substr(1).replace(/[A-Z]/g, ' $&');
	    };
	})
	.filter('humanizeConstant', function () {
	    return function (text) {
	        if (text) {
	            var string = text.split('_').join(' ').toLowerCase();
	            string = string.charAt(0).toUpperCase() + string.slice(1);
	            return string;
	        }
	    };
	})
	.filter('untilComa', function () {
	    // function to invoke by Angular each time
	    // Angular passes in the `items` which is our Array
	    return function (str) {
	        if (!str || !str.length) {
	            return false;
	        }
	        var filtered;
	        var i = str.indexOf(',');
	        filtered = (i === -1) ? str : str.substring(0, i);

	        // boom, return the Array after iteration's complete
	        return filtered;
	    };
	})
	.filter('firstLetter', function () {
	    // function to invoke by Angular each time
	    // Angular passes in the `items` which is our Array
	    return function (items, letter) {

	        if (!items || !items.length) {
	            return false;
	        }
	        // Create a new Array
	        var filtered = [];
	        // Match for first letter
	        var letterMatch = new RegExp(letter, 'i');
	        // loop through existing Array
	        for (var i = 0; i < items.length; i++) {
	            var item = items[i];
	            // check if the individual Array element begins with `a` or not
	            if (letterMatch.test(item.Name.substring(0, 1))) {
	                // push it into the Array if it does!
	                filtered.push(item);
	            }
	        }
	        // boom, return the Array after iteration's complete
	        return filtered;
	    };
	})
	.filter('customCurrency', ['$filter', function ($filter) {
	    return function (amount, currencySymbol) {
	        var currency = $filter('currency');

	        if (amount < 0) {
	            return currency(amount, currencySymbol).replace('(', '-').replace(')', '');
	        }

	        return currency(amount, currencySymbol);
	    };
	}]);
}());

(function () {
    'use strict';
    angular.module('customFunctions', [])
	// might ngInject
	.factory('SharedFunctions', [
		function () {
		    return {
		        // make array unique
		        unique: function (arr) {
		            var o = {}, i, r = [];
		            for (i = 0; i < arr.length; i++) {
		                o[arr[i]] = arr[i];
		            }
		            for (i in o) {
		                r.push(o[i]);
		            }
		            return r;
		        },
		        serialize: function (obj) {
		            var str = [];
		            for (var p in obj)
		                if (obj.hasOwnProperty(p)) {
		                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		                }
		            return str.join('&');
		        },
		        // check if
		        isobject: function (a) {
		            return (!!a) && (a.constructor === Object);
		        },
		        alpha: function () {
		            return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		        },
		        // merge: function(target, source){
		        // 	/* Merges two (or more) objects, giving the last one precedence */
		        // 	for (var p in source) {
		        // 		try {
		        // 			// Property in destination object set; update its value.
		        // 			if ( source[p].constructor === Object ) {
		        // 				target[p] = merge(target[p], source[p]);
		        // 			} else {
		        // 				target[p] = source[p];
		        // 			}
		        // 		} catch(e) {
		        // 			// Property in destination object not set; create it and set its value.
		        // 			target[p] = source[p];
		        // 		}
		        // 	}
		        // 	return target;
		        // },
		        firstleter: function (data) {
		            var arr = [];
		            for (var i = 0; i < data.length; i++) {
		                arr.push(data[i].Name.charAt(0));
		            }
		            return arr;
		        },
		        isMobile: function () {
		            // return $window.document.width < 700 ? true : false;
		            return navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ? true : false;
		            // other solution: http://detectmobilebrowsers.com/
		            // other solution: https://github.com/kaimallea/isMobile
		        }
		    };
		}]);
}());

(function () {
    'use strict';
    angular.module('sharedServices', [])
	// Get links to external services/tools.
	.factory('ExternalFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService', 'SharedFunctions',
		function ($http, $rootScope, API_URL, $q, localStorageService, SharedFunctions) {

		    var merchant;

		    // http interceptor
		    var loadingTracker = { tracker: $rootScope.loadingTracker };

		    // get user info from localStorageService
		    var userInfo = localStorageService.get('userInfo');

		    if (userInfo != null || SharedFunctions.isobject(userInfo)) {
		        merchant = {
		            MerchantId: userInfo.MerchantId,
		            MerchantPassword: userInfo.MerchantPassword,
		            PageNumber: null,
		            PageSize: null
		        };
		    } else {
		        merchant = { MerchantId: '834', MerchantPassword: 'm5494' };
		    }
		    // console.log(merchant);

		    return {
		        getActivationShopUrl: function () {
		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/GetActivationExternalLogin', merchant, loadingTracker)
					.then(
						function (response) {

						    var arr = response.data.Data;
						    deferred.resolve(arr);

						}, function (response) {

						    deferred.reject(response);
						    void 0;

						});

		            return deferred.promise;
		        },
		        getVonageUrl: function () {
		            var deferred = $q.defer();

		            $http.post(API_URL + 'admin/GetVonageExternalLogin', merchant, loadingTracker)
						.then(function (response) {

						    var arr = response.data.Data;
						    deferred.resolve(arr);

						}, function (response) {

						    deferred.reject(response);
						    void 0;

						});
		            return deferred.promise;
		        }
		    };
		}])
	// Service for interchange data between views and controllers via service.
	.factory('ItemFactory', [
		function () {

		    var objSelected = [];

		    return {
		        /* Methods to pass an Object from one view to another via service */
		        selectObject: function (newObj) {
		            objSelected = newObj;
		        },

		        // RETURN PRODUC (get last object stored in select)
		        returnObject: function () {
		            return objSelected;
		        }
		    };
		}])
	// Service to send confirmation messages via SMS or email.
	.factory('ConfirmationFactory', ['$http', '$rootScope', 'API_URL', '$q', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, localStorageService) {

		    var arr = [];
		    var userInfo = localStorageService.get('userInfo');
		    var merchant = { MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword };
		    var loadingTracker = { tracker: $rootScope.loadingTracker };

		    return {
		        /* Methods to pass an Object from one view to another via service */
		        sendConfirmationSms: function (receipt, phone) {

		            var queryObj = {
		                PhoneNumber: phone,
		                Receipt: {
		                    ProductName: receipt.ProductName,
		                    ProductCountry: receipt.ProductCountry,
		                    CarrierName: receipt.CarrierName,
		                    ProductInstructions: receipt.ProductInstructions,
		                    PhoneNumber: receipt.PhoneNumber,
		                    PinNumber: receipt.PinNumber,
		                    ControlNumber: receipt.ControlNumber,
		                    OrderNumber: receipt.OrderNumber,
		                    TransactionId: receipt.TransactionId,
		                    UpdatedBalance: receipt.UpdatedBalance,
		                    MerchantName: receipt.MerchantName,
		                    MerchantPhoneNumber: receipt.MerchantPhoneNumber,
		                    CashierName: receipt.CashierName,
		                    MerchantAddress: receipt.MerchantAddress,
		                    OrderDate: receipt.OrderDate,
		                    Amount: receipt.Amount,
		                    Fee: receipt.Fee,
		                    Tax: receipt.Tax,
		                    Total: receipt.Total
		                },
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword
		            };
		            void 0;

		            var deferred = $q.defer();

		            $http.post(API_URL + 'ReceiptServices/SendConfirmationSms', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        //
		        sendConfirmationEmail: function (receipt, email) {

		            var queryObj = {
		                Email: email,
		                Receipt: {
		                    ProductName: receipt.ProductName,
		                    ProductCountry: receipt.ProductCountry,
		                    CarrierName: receipt.CarrierName,
		                    ProductInstructions: receipt.ProductInstructions,
		                    PhoneNumber: receipt.PhoneNumber,
		                    PinNumber: receipt.PinNumber,
		                    ControlNumber: receipt.ControlNumber,
		                    OrderNumber: receipt.OrderNumber,
		                    TransactionId: receipt.TransactionId,
		                    UpdatedBalance: receipt.UpdatedBalance,
		                    MerchantName: receipt.MerchantName,
		                    MerchantPhoneNumber: receipt.MerchantPhoneNumber,
		                    CashierName: receipt.CashierName,
		                    MerchantAddress: receipt.MerchantAddress,
		                    OrderDate: receipt.OrderDate,
		                    Amount: receipt.Amount,
		                    Fee: receipt.Fee,
		                    Tax: receipt.Tax,
		                    Total: receipt.Total
		                },
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword
		            };
		            // console.log(queryObj);

		            var deferred = $q.defer();


		            $http.post(API_URL + 'ReceiptServices/SendConfirmationEmail', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data;
                            // console.log(arr);
                            deferred.resolve(arr);
                        },
                        function (response) {
                            void 0;
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        }
		    };
		}])
	// Service to handle error messages across application.
	.factory('AlertService', ['$rootScope', function ($rootScope) {

	    var alertService = {};

	    // global `alerts` array
	    $rootScope.alerts = [];

	    alertService.add = function (type, msg) {
	        $rootScope.alerts.push({
	            'type': type,
	            'msg': msg,
	            'close': function () {
	                alertService.closeAlert(this);
	            }
	        });
	    };

	    // close alert
	    alertService.closeAlert = function (alert) {
	        alertService.closeAlertIdx($rootScope.alerts.indexOf(alert));
	    };

	    // close alert by index
	    alertService.closeAlertIdx = function (index) {
	        $rootScope.alerts.splice(index, 1);
	    };

	    // Clear alert messages
	    alertService.clear = function () {
	        $rootScope.alerts = [];
	    };

	    // create instance of alertService
	    alertService.getAlertInstance = function (baseResponse) {

	        var status = baseResponse.Status;
	        var message = baseResponse.ErrorMessage;

	        var newAlert = {
	            type: status === 200 ? 'success' : 'error',
	            msg: message === '' ? 'The Operation was completed successfuly' : message
	        };

	        return newAlert;
	    };

	    return alertService;
	}]);
}());

(function () {
    'use strict';

    angular.module('posApp')
	// might ngInject
	// SunPasCtrl Controller
	.controller('IndexSunpassCtrl', ['$scope', 'AlertService',
		function ($scope, AlertService) {

		    // clear alerts from previous view
		    AlertService.clear();

		    $scope.items = [
                { categoryName: 'sunpass', title: 'Activate or Replenish Sunpass', url: '#/sunpass/category/replenish', position: 0, icon: '' },
                { categoryName: 'sunpass', title: 'Pay Your Document', url: '#/sunpass/category/documents', position: 1, icon: '' }
		    ];
		}])
	// might ngInject
	.controller('ReplenishSunpassCtrl', ['$scope', '$routeParams', 'SunpassFactory', 'AlertService', 'SharedFunctions', 'ConfirmationFactory',
		function ($scope, $routeParams, SunpassFactory, AlertService, SharedFunctions, ConfirmationFactory) {

		    // clear alerts from previous view
		    AlertService.clear();

		    $scope.item = {
		        name: 'Activate or Replenish Sunpass Transponder',
		        MaxAmount: 100
		    };

		    // interface elm visibility
		    $scope.hasKeyPad = true;
		    $scope.showKeypad = true;
		    $scope.showPaymentDetails = false;
		    $scope.showDoReplenishment = false;
		    $scope.showReceipt = false;
		    $scope.showToCategories = false;
		    $scope.showToReplenish = false;

		    // init params
		    $scope.accountNumber = { value: null, isFocused: false };
		    $scope.accountMatch = { value: null, isFocused: false };
		    $scope.amount = { value: null, isFocused: false };
		    $scope.submitted = false;



		    // undo function from keypad for account value
		    function backKeyAccountNumber() {
		        var length = $scope.accountNumber.value.length;
		        var value = $scope.accountNumber.value;
		        $scope.accountNumber.value = value.substring(0, length - 1);
		    }

		    // undo function from keypad for confirm account value
		    function backKeyAccountMatch() {
		        var length = $scope.accountMatch.value.length;
		        var value = $scope.accountMatch.value;
		        void 0;
		        void 0;
		        $scope.accountMatch.value = value.substring(0, length - 1);
		    }

		    // undo function from keypad for amount value
		    function backKeyAmount() {
		        var length = $scope.amount.value.length;
		        var value = $scope.amount.value;
		        void 0;
		        void 0;
		        $scope.amount.value = value.substring(0, length - 1);
		    }

		    // set value for account input
		    function setKeyAccountNumber(key) {
		        $scope.accountNumber.value = $scope.accountNumber.value + key;
		    }

		    // set value for onfirm account input
		    function setKeyConfirmAccountNumber(key) {
		        void 0;
		        $scope.accountMatch.value = $scope.accountMatch.value + key;
		    }

		    // set value for amount input
		    function setKeyAmount(key) {
		        $scope.amount.value = $scope.amount.value + key;
		    }

		    function initInputs() {
		        if (!$scope.accountNumber.value) {
		            $scope.accountNumber.value = '';
		        }
		        if (!$scope.accountMatch.value) {
		            $scope.accountMatch.value = '';
		        }
		        if (!$scope.amount.value) {
		            $scope.amount.value = '';
		        }
		    }
		    function setAmount(keynum) {
		        void 0;
		        if ($scope.amount.isFocused) {
		            setKeyAmount(keynum);
		        } else if ($scope.accountNumber.isFocused) {
		            setKeyAccountNumber(keynum);
		        } else {
		            setKeyConfirmAccountNumber(keynum);
		        }
		    }


		    $scope.editing = null;
		    $scope.editItem = function (item) {
		        $scope.editing = item;
		        void 0;
		    };

		    $scope.onInputClick = function ($event) {
		        $event.target.select();
		    };

		    // set input value from keypad
		    $scope.setKey = function (value) {
		        initInputs();
		        setAmount(value);
		    };

		    // clear input value from keypad
		    $scope.clearKey = function () {
		        if ($scope.accountNumber.isFocused) {
		            $scope.accountNumber.value = '';
		        } else {
		            $scope.amount.value = '';
		        }
		    };
		   
		   
		    $scope.backKey = function () {
		        initInputs();

		        if ($scope.accountNumber.isFocused) {
		            backKeyAccountNumber();
		        } else if ($scope.amount.isFocused) {
		            backKeyAmount();
		        } else {
		            backKeyAccountMatch();
		        }
		    };

		    //
		    $scope.setFocusedInput = function (inputName) {
		        if (inputName === 'amount') {
		            $scope.accountNumber.isFocused = false;
		            $scope.accountMatch.isFocused = false;
		            $scope.amount.isFocused = true;
		            void 0;
		        } else if (inputName === 'accountNumber') {
		            $scope.accountMatch.isFocused = false;
		            $scope.accountNumber.isFocused = true;
		            $scope.amount.isFocused = false;
		            void 0;
		        } else if (inputName === 'accountMatch') {
		            $scope.accountNumber.isFocused = false;
		            $scope.accountMatch.isFocused = true;
		            $scope.amount.isFocused = false;
		            void 0;
		        }
		    };

		    // set focus
		    $scope.leaveInputsFocus = function () {
		        $scope.accountNumber.isFocused = false;
		        $scope.accountMatch.isFocused = false;
		        $scope.amount.isFocused = false;
		    };

		    // GET TRANSPONDER INFO
		    $scope.doGetInfo = function (form) {

		        // Trigger validation flag.
		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            AlertService.clear();
		            AlertService.add('error', 'Check errors below (in red color)');
		            return;

		        } else {

		            var transporderNumber = $scope.accountNumber.value;

		            // console.log(account);

		            SunpassFactory.getSunpassTransporderInfo(transporderNumber).then(
                        function (response) {

                            if (response.Status === 200) {

                                // $scope.showKeypad = false;
                                $scope.isDisableInputs = true;
                                $scope.aditionalDataRequired = response.Data;
                                // console.log(response);

                                // set form visibility
                                $scope.showPaymentDetails = true;
                                $scope.showDoReplenishment = true;
                                $scope.submitted = false;

                            } else {

                                AlertService.clear();
                                AlertService.add('error', response.ErrorMessage);
                                $scope.isDisableInputs = false;

                            }

                        },
                        function (error) {
                            void 0;
                        }
                    );
		        }
		    };

		    // DO TRANSPONDER REPLENISHMENT
		    $scope.doReplenishment = function (form) {

		        // Trigger validation flag.
		        $scope.submitted = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            AlertService.clear();
		            AlertService.add('error', 'Check errors below (in red color)');
		            return;

		        } else {

		            var obj = {
		                TransporderNumber: $scope.accountNumber.value,
		                PurchaseId: $scope.aditionalDataRequired.purchaseIdField,
		                Amount: $scope.amount.value
		            };

		            void 0;

		            SunpassFactory.doSunpassReplenishment(obj).then(
                        function (response) {

                            if (response.Status === 200 || response.Status === 203) {

                                // $scope.showKeypad = false;
                                $scope.isDisableInputs = true;

                                // console.log(data);
                                $scope.receipt = response.Data;

                                // set form visibility
                                $scope.showPaymentDetails = true;
                                $scope.showDoReplenishment = false;
                                $scope.showReceipt = true;
                                $scope.showToCategories = true;
                                $scope.showToReplenish = true;

                            } else {

                                AlertService.clear();
                                AlertService.add('error', response.ErrorMessage);
                                $scope.isDisableInputs = false;

                            }

                        },
                        function (error) {
                            void 0;
                        }
                    );
		        }
		    };

		    // print receipt
		    $scope.printInfo = function () {
		        window.print();
		    };

		    // send receipt as sms
		    $scope.sendSms = function (form) {

		        // Trigger validation flag.
		        $scope.submittedSms = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {

		            AlertService.clear();
		            AlertService.add('error', 'Check form errors');
		            return;

		        } else {

		            // remove any previous alert
		            AlertService.clear();

		            var receipt = $scope.receipt;
		            var phone = $scope.phoneToSend;

		            ConfirmationFactory.sendConfirmationSms(receipt, phone).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedSms = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as sms successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                            void 0;
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                            void 0;
                        }
                    );
		        }
		    };

		    // send receipt as email
		    $scope.sendEmail = function (form) {

		        // Trigger validation flag.
		        $scope.submittedEmail = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {

		            AlertService.clear();
		            AlertService.add('error', 'Check form errors');
		            return;

		        } else {

		            // remove any previous alert
		            AlertService.clear();

		            var receipt = $scope.receipt;
		            var email = $scope.emailToSend;

		            ConfirmationFactory.sendConfirmationEmail(receipt, email).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedEmail = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as email successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                            void 0;
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                            void 0;
                        }
                    );
		        }
		    };
		}])
	// might ngInject
	.controller('DocumentsSunpassCtrl', ['$scope', '$routeParams', 'SunpassFactory', 'AlertService', 'localStorageService', 'SharedFunctions', 'ConfirmationFactory',
		function ($scope, $routeParams, SunpassFactory, AlertService, localStorageService, SharedFunctions, ConfirmationFactory) {

		    $scope.item = { name: 'Pay Your Documents' };

		    // interface elm visibility
		    $scope.showCheck = true;
		    $scope.showPaymentDetails = false;
		    $scope.showFieldsDescription = true;
		    $scope.showDoDocumentsPayment = false;
		    $scope.showReceipt = false;
		    // steps vars
		    $scope.submittedCheck = false;
		    $scope.submittedDoPayment = false;

		    // init params
		    $scope.idnumber = null;
		    $scope.plate = null;
		    $scope.total = 0;
		    $scope.fee = 0;
		    $scope.selectedDocuments = [];
		    $scope.submitted = false;

		    $scope.parseFloat = function (value) {
		        return parseFloat(value);
		    };

		    $scope.setDocument = function (obj, type) {
		        $scope.selectedDocuments = obj;
		        $scope.active = !$scope.active;

		        var allAmount = 0;
		        angular.forEach(obj, function (value) {
		            allAmount = allAmount + parseFloat(value.documentPaymentAmountField);
		        });

		        // console.log($scope.fee);
		        // console.log(allAmount);
		        $scope.total = allAmount + parseFloat($scope.fee);
		        $scope.paymentType = type;
		        void 0;
		        void 0;
		        void 0;
		    };


		    // GET TRANSPONDER INFO
		    $scope.doGetInfo = function (form) {

		        // Trigger validation flag.
		        $scope.submittedCheck = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            AlertService.clear();
		            AlertService.add('error', 'Check errors below (in red color)');
		            return;

		        } else {

		            // set query params
		            var obj = {
		                DocumentId: $scope.idnumber,
		                LicensePlate: $scope.plate
		            };

		            void 0;

		            SunpassFactory.getSunpassDocumentsInfo(obj).then(
                        function (response) {
                            // console.log(response);

                            if (response.Status === 200) {

                                // console.log(response);
                                $scope.documents = response.Data;
                                $scope.fee = response.Data.fee;
                                void 0;

                                // set form visibility
                                $scope.isDisableInputs = true;
                                $scope.showCheck = false;
                                $scope.showFieldsDescription = false;
                                $scope.showPaymentDetails = true;
                                $scope.showDoDocumentsPayment = true;

                            } else {

                                AlertService.clear();
                                AlertService.add('error', response.ErrorMessage);
                                $scope.isDisableInputs = false;
                                $scope.showCheck = true;

                            }

                        },
                        function (error) {
                            void 0;
                        }
                    );
		        }
		    };

		    // DO TRANSPONDER REPLENISHMENT
		    $scope.doDocumentsPayment = function (form) {

		        void 0;

		        // Trigger validation flag.
		        $scope.submittedDoPayment = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {
		            AlertService.clear();
		            AlertService.add('error', 'Check errors below (in red color)');
		            return;

		        } else {

		            // set query params
		            var obj = {
		                DocumentId: $scope.idnumber,
		                LicencePlate: $scope.plate,
		                PaymentType: $scope.paymentType
		            };

		            void 0;

		            // console.log(account);

		            SunpassFactory.doSunPassDocumentsPayment(obj).then(
                        function (response) {
                            // console.log(response);
                            if (response.Status === 200 || response.Status === 203) {
                                // console.log(response);
                                $scope.showReceipt = true;
                                $scope.receipt = response.Data;
                            } else {
                                AlertService.clear();
                                AlertService.add('error', response.ErrorMessage);
                                $scope.isDisableInputs = false;
                            }

                        },
                        function (error) {
                            void 0;
                        }
                    );
		        }
		    };

		    // print receipt
		    $scope.printInfo = function () {
		        window.print();
		    };

		    // send receipt as sms
		    $scope.sendSms = function (form) {

		        // Trigger validation flag.
		        $scope.submittedSms = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {

		            AlertService.clear();
		            AlertService.add('error', 'Check form errors');
		            return;

		        } else {

		            // remove any previous alert
		            AlertService.clear();

		            var receipt = $scope.receipt;
		            var phone = $scope.phoneToSend;

		            ConfirmationFactory.sendConfirmationSms(receipt, phone).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedSms = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as sms successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                        }
                    );
		        }
		    };

		    // send receipt as email
		    $scope.sendEmail = function (form) {

		        // Trigger validation flag.
		        $scope.submittedEmail = true;

		        // If form is invalid, return and let AngularJS show validation errors.
		        if (form.$invalid) {

		            AlertService.clear();
		            AlertService.add('error', 'Check form errors');
		            return;

		        } else {

		            // remove any previous alert
		            AlertService.clear();

		            var receipt = $scope.receipt;
		            var email = $scope.emailToSend;

		            ConfirmationFactory.sendConfirmationEmail(receipt, email).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedEmail = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as email successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                        }
                    );
		        }
		    };
		}]);
}());

(function () {
    'use strict';

    /* services & factories */
    angular.module('sunpassServices', [])
	// might ngInject
	.factory('SunpassFactory', ['$http', '$rootScope', 'API_URL', '$q', 'SharedFunctions', 'localStorageService',
		function ($http, $rootScope, API_URL, $q, SharedFunctions, localStorageService) {

		    var arr = [];
		    var userInfo = localStorageService.get('userInfo');
		    var merchant = { MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword };
		    var loadingTracker = { tracker: $rootScope.loadingTracker };

		    return {
		        // get BILLERS by categories
		        getSunpassTransporderInfo: function (transponder) {

		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                TransporderNumber: transponder
		            };
		            // console.log(queryObj);

		            var deferred = $q.defer();

		            $http.post(API_URL + 'SunPass/GetSunpassTransporderInfo', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data;
                            deferred.resolve(arr);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get BILLERS by categories
		        doSunpassReplenishment: function (obj) {
		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                TransporderNumber: obj.TransporderNumber,
		                PurchaseId: obj.PurchaseId,
		                Amount: obj.Amount
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'SunPass/DoSunpassReplenishment', queryObj, loadingTracker)
                        .then(
                        function (response) {
                            arr = response.data;
                            deferred.resolve(arr);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get CATEGORIES
		        getSunpassDocumentsInfo: function (obj) {

		            var queryObj = {
		                LicensePlate: obj.LicensePlate,
		                DocumentId: obj.DocumentId,
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'SunPass/GetSunpassDocumentsInfo', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data;
                            // console.log(JSON.stringify(arr));
                            deferred.resolve(arr);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        },
		        // get Biller
		        doSunPassDocumentsPayment: function (obj) {

		            var queryObj = {
		                MerchantId: merchant.MerchantId,
		                MerchantPassword: merchant.MerchantPassword,
		                PaymentType: obj.PaymentType,
		                DocumentId: obj.DocumentId,
		                LicensePlate: obj.LicencePlate
		            };

		            var deferred = $q.defer();

		            $http.post(API_URL + 'SunPass/DoSunPassDocumentsPayment', queryObj, loadingTracker)
                    .then(
                        function (response) {
                            arr = response.data;
                            deferred.resolve(arr);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
		            return deferred.promise;
		        }
		    };
		}]);
}());




(function () {
    'use strict';
    angular.module('posApp')	
        .controller('ModalReceiptCtrl', ['$scope', '$modalInstance', 'receipt', 'item', '$location', 'localStorageService', 'ProdsFactory', 'AlertService', 'ConfirmationFactory', function ($scope, $modalInstance, receipt, item, $location, localStorageService, ProdsFactory, AlertService, ConfirmationFactory) {
            $scope.showReceipt = true;
            $scope.receipt = receipt;
            $scope.item = item;


            $scope.sendSms = function (form) {

                // Trigger validation flag.
                $scope.submittedSms = true;

                // If form is invalid, return and let AngularJS show validation errors.
                if (form.$invalid) {

                    AlertService.clear();
                    AlertService.add('error', 'Check form errors');
                    return false;

                } else {

                    // remove any previous alert
                    AlertService.clear();

                    var phone = $scope.phoneToSend;

                    ConfirmationFactory.sendConfirmationSms(receipt, phone).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedSms = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as sms successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                            void 0;
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                            void 0;
                        }
                    );
                }
            };

            // SEND RECEIPT AS EMAIL
            $scope.sendEmail = function (form) {

                // Trigger validation flag.
                $scope.submittedEmail = true;

                // If form is invalid, return and let AngularJS show validation errors.
                if (form.$invalid) {

                    AlertService.clear();
                    AlertService.add('error', 'Check form errors');
                    return false;

                } else {

                    // remove any previous alert
                    AlertService.clear();

                    var email = $scope.emailToSend;

                    ConfirmationFactory.sendConfirmationEmail(receipt, email).then(
                        function (response) {

                            AlertService.clear();
                            $scope.submittedEmail = false;

                            if (response.Status === 200) {
                                AlertService.add('success', 'The Receipt has been sent as email successfully!');
                            } else {
                                AlertService.add('error', 'Sorry, an error has happened. Please, try again.');
                            }
                            void 0;
                        },
                        function (response) {
                            AlertService.add('error', response.ErrorMessage);
                            void 0;
                        }
                    );
                }
            };

            $scope.close = function() {
                $modalInstance.close();
            };
        }]);
}());


Array.prototype.indexOf = function (searchElement, fromIndex, comparer) {

    var k;
    var O = Object(this);
    var len = O.length >>> 0;

    if (len === 0) {
        return -1;
    }
    var n = +fromIndex || 0;
    if (Math.abs(n) === Infinity) {
        n = 0;
    }

    if (n >= len) {
        return -1;
    }
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    while (k < len) {
        if (k in O && ((comparer && comparer(O[k], searchElement)) || O[k] === searchElement)) {
            return k;
        }
        k++;
    }
    return -1;
};
