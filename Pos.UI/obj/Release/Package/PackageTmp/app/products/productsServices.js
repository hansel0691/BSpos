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

		var loadingTracker = {tracker: $rootScope.loadingTracker};

		var userInfo = localStorageService.get('userInfo');
		    console.log(userInfo);
		if (SharedFunctions.isobject(userInfo)){
			var merchant = {MerchantId: userInfo.MerchantId, MerchantPassword: userInfo.MerchantPassword};
		}
		// console.log(merchant);

		return {
			// get PRODUCTS by category & country
			getProductsByCategoryByCountry: function(category, countryCode){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					Category: category,
					CountryCode: countryCode
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetProductsByCategoryByCountry', queryObj, loadingTracker)
				.then(
					function(response) {
						products = response.data.Data;
						// console.log(JSON.stringify(products));
						deferred.resolve(products);
					},
					function(response) {
						console.log(JSON.stringify(response));
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get PRODUCT
			getProduct: function(productMainCode){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					ProductMainCode: productMainCode
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetProduct', queryObj, loadingTracker)
				.then(
					function(response) {
						product = response.data.Data;
						// console.log(response);
						deferred.resolve(product);
					},
					function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get PRODUCT TERMS
			getProductTerms: function(productMainCode){
				var queryObj = {
					MerchantId: '834',
					MerchantPassword: 'm5494',
					ProductMainCode: productMainCode
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetProduct', queryObj, loadingTracker)
				.then(
					function(response) {
						product = response.data.Data;
						// console.log(response);
						deferred.resolve(product);
					},
					function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get product RATES
			getProductRates: function(productMainCode){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					ProductMainCode: productMainCode
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetProductRates', queryObj, loadingTracker)
				.then(
					function(response) {
						var rates = response.data.Data;
						// console.log(rates);
						deferred.resolve(rates);
					},
					function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get product ACCESS NUMBERS
			getProductAccessNumbers: function(productMainCode){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					ProductMainCode: productMainCode
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetProductAccessNumbers', queryObj, loadingTracker)
				.then(
					function(response) {
						var accessnumbers = response.data.Data;
						// console.log(accessPhones);
						deferred.resolve(accessnumbers);
					},
					function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get all PRODUCTS by category
			getAllProducts: function(category) {
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					Category: category
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetAllProducts', queryObj, loadingTracker)
				.then(
					function(response) {
						products = response.data.Data;
						 console.log(products);
						deferred.resolve(products);
					},
					function(response) {
						deferred.reject(response);
						console.log('The request failed: ' + response);
					}
				);
				return deferred.promise;
			},
			// get PRODUCTS INITIALS by category
			getProductInitialsByCategory: function(category){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					Category: category
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetProductInitialsByCategory', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data.Data;
						// console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						deferred.reject(response);
						console.log('The request failed: ' + response);
					}
				);
				return deferred.promise;
			},
			// get PRODUCTS INITIALS by category
			getProductInitialsByCategoryByCountry: function(category, country){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					Category: category,
					CountryCode: country
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetProductInitialsByCategoryByCountry', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data.Data;
						// console.log(arr);
						deferred.resolve(arr);
					},
					function(response) {
						deferred.reject(response);
						console.log('The request failed: ' + response);
					}
				);
				return deferred.promise;
			},
			// get CARRIERS by category
			getCarriers: function(category){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					Category: category
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetCarriers', queryObj, loadingTracker)
				.then(function(response) {
					arr = response.data.Data;
					console.log(arr);
					deferred.resolve(arr);
				}, function(response) {
					console.log(response);
					deferred.reject(response);
				});
				return deferred.promise;
			},
			// get COUNTRIES by category
			getCountriesByCategory: function(category){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					Category: category
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetCountriesByCategory', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data.Data;
						// console.log(JSON.stringify(arr));
						deferred.resolve(arr);
					}, function(response) {
						console.log(response);
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get COUNTRIES INITIALS by category
			getCountryInitialsByCategory: function(category){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					Category: category
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetCountryInitialsByCategory', queryObj)
				.then(
					function(response) {
						arr = response.data.Data;
						// console.log(JSON.stringify(arr));
						deferred.resolve(arr);
					}, function(response) {
						console.log(response);
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get RATES by country
			getRates: function(maincode) {
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					ProductMainCode: maincode
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetProductRates', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data;
						deferred.resolve(arr);
					},
					function(response) {
						console.log(response);
						deferred.reject(response);
					}
				);

				return deferred.promise;
			},
			// get LONGDISTANCE countries
			getLongDistanceCountries: function(){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetLongDistanceCountries', queryObj, loadingTracker)
				.then(function(response) {
					countries = response.data.Data;
					// console.log(JSON.stringify(countries));
					deferred.resolve(countries);
				}, function(response) {
					deferred.reject(response);
				});
				return deferred.promise;
			},
			// get LONGDISTANCE products by country
			getLongDistanceProductsByCountry: function(countryName){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CountryName: countryName
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetLongDistanceProductsByCountry', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data.Data;
						// console.log(arr);
						deferred.resolve(arr);
					}, function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// get LONGDISTANCE country details
			getCountryDetails: function (category, countryCode) {
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					Category: category,
					CountryCode: countryCode
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetCountryDetailsByCategory', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data.Data;
						// console.log(arr);
						deferred.resolve(arr);
					}, function(response) {
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// GET WIRELESS CARRIERS
			getWirelessCarriers: function(countryCode){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CountryCode: countryCode
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetWirelessCarriers', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data.Data;
						deferred.resolve(arr);
						// console.log(arr);
					},
					function(response) {
						console.log(response);
						deferred.resolve(response);
					}
				);
				return deferred.promise;
			},
			// GET WIRELESS PRODUCTS BY CARRIER
			getWirelessProductsByCarrier: function(carrierId){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CarrierId: carrierId
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetWirelessProductsByCarrier', queryObj, loadingTracker)
				.then(function(response) {
					arr = response.data.Data;
					console.log(arr);
					deferred.resolve(arr);
				}, function(response) {
					console.log(response);
					deferred.reject(response);
				});
				return deferred.promise;
			},
			// GET WIRELESS CARRIER DETAILS
			getWirelessCarrierDetails: function(carrierId){
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CarrierId: carrierId
				};
				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/GetWirelessCarrierDetails', queryObj, loadingTracker)
				.then(function(response) {
					arr = response.data.Data;
					deferred.resolve(arr);
				}, function(response) {
					console.log(response);
					deferred.reject(response);
				});
				return deferred.promise;
			},
			// GET WIRELESS CARRIER INITIALS
			getWirelessCarrierInitials: function(countryCode) {
				var queryObj = {
					MerchantId: merchant.MerchantId,
					MerchantPassword: merchant.MerchantPassword,
					CountryCode: countryCode
				};

				// console.log(queryObj);
				var deferred = $q.defer();

				$http.post(API_URL + 'products/GetWirelessCarrierInitials', queryObj, loadingTracker)
				.then(
					function(response) {
						arr = response.data.Data;
						console.log(arr);
						deferred.resolve(arr);
					}, function(response) {
						console.log(response);
						deferred.reject(response);
					}
				);
				return deferred.promise;
			},
			// DO BLACKSTONE POS OPERATION
			doBlackstonePosOperation: function(order){
				console.log(order);
				var deferred = $q.defer();

				$http.post(API_URL + 'Products/DoBlackstonePosOperation', order, loadingTracker)
				.then(
					function(response) {
						var brokerResponse = response.data;
						// console.log(brokerResponse);
						deferred.resolve(brokerResponse);
					},
					function(error) {
						console.log(error);
						deferred.reject(error);
					}
				);
				return deferred.promise;
			},
			// POS MAIN PRODUCTS
			getPosMainProducts: function(user, pass) {

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
						console.log(error);
						deferred.reject(error);
					}
				);
				return deferred.promise;
		}
		};
	}]);
}());
