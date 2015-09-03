'use strict';

/* services & factories */
angular.module('prodsServices', [])
	/**
	 * ProdFactory - Factory
	 * Return products collection
	 * @return { object array }
	 */
	.factory('ProdsFactory', ['$http', 'API_URL', '$q', 'SharedFunctions',
		function($http, API_URL, $q, SharedFunctions) {

		var arr= [];
		var product;
		var products;
		var countries;
		var productSelect = [];

		return {
			// GET MOST SOLD PRODUCTS
			getMostSoldProducts: function(merchantId, category, amount){
				var deferred = $q.defer();

				var params = SharedFunctions.serialize({'merchantId': merchantId, 'category': category, 'amount': amount });
				// console.log(params);
				$http.get(API_URL + "Products/GetMostSoldProducts?" + params)
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
			// GET PRODUCT
			getProduct: function(merchantId, productMainCode){
				var deferred = $q.defer();

				var params = SharedFunctions.serialize({'merchantId': merchantId, 'productMainCode': productMainCode });
				// console.log(params);
				$http.get(API_URL + "Products/GetProduct?" + params)
				.then(
					function(response) {
						product = response.data.Data;
						// console.log(response);

						// $http.get("app/data/pos-rates.json")
						$http.get(API_URL + "Products/GetProductRates?" + params)
						.then(
							function(response) {
								var rates = response.data.Data;

								if (rates !== null && typeof rates === 'object' && rates[0] != null){
									product.rates = rates;
								}
								// console.log(rates);

								$http.get(API_URL + "Products/GetProductAccessNumbers?" + params)
								.then(
									function(response) {
										var accessPhones = response.data.Data;

										if (accessPhones !== null && typeof accessPhones === 'object' && accessPhones[0] != null){
											product.accessPhones = accessPhones;
										}
										// console.log(accessPhones);
										deferred.resolve(product);
									});
							});
					},
					function(response) {
						deferred.reject(response);
					}
				);

				return deferred.promise;
			},
			// GET ALL PRODUCTS by category
			getAllProducts: function(merchantId, category){
				var deferred = $q.defer();

				var params = SharedFunctions.serialize({'merchantId': merchantId, 'category': category });
				// console.log(params);
				$http.get(API_URL + "Products/GetAllProducts?" + params)
				.then(
					function(response) {
						var products = response.data.Data;
						// console.log(products);
						deferred.resolve(products);
					},
					function(response) {
						deferred.reject(response);
						console.log("The request failed: " + response);
					}
				);

				return deferred.promise;
			},
			// GET CARRIERS BY CATEGORY
			getCarriers: function(merchantId, category){
				var deferred = $q.defer();

				var params = SharedFunctions.serialize({'merchantId': merchantId, 'category':category});
				// console.log(params);
				$http.get(API_URL + "Products/GetCarriers?" + params)
				.then(function(response) {
					arr = response.data.Data;
					console.log(arr);
					deferred.resolve(arr);
				}, function(response) {
					console.log(response)
					deferred.reject(response);
				});
				return deferred.promise;
			},
			// Get countries by category
			getCountries: function(merchantId, category){
				var deferred = $q.defer();

				var params = SharedFunctions.serialize({'merchantId': merchantId, 'category': category });
				// console.log(params);
				$http.get(API_URL + "Products/GetCountries?" + params)
				.then(
					function(response) {
						countries = response.data.Data;
						// console.log(JSON.stringify(countries));
						deferred.resolve(countries);
					}, function(response) {
						console.log(response)
						deferred.reject(response);
					}
				);

				return deferred.promise;
			},
			// Get all rates by country
			getRates: function(merchantId, productMainCode) {
				// serialize object to url params
				var params = SharedFunctions.serialize({'merchantId': merchantId, 'productMainCode':productMainCode});
				// console.log(params);
				var deferred = $q.defer();
				$http.get(API_URL + "Products/GetProductRates?" + params)
				.then(
					function(response) {
						arr = response.data;
						deferred.resolve(arr);
					},
					function(response) {
						console.log(response)
						deferred.reject(response);
					}
				);

				return deferred.promise;
			},
			// Get static countries list (json files)
			getLongDistanceCountries: function(merchantId){
				// serialize object to url params
				var params = SharedFunctions.serialize({'merchantId': merchantId});
				// console.log(params);
				var deferred = $q.defer();
				$http.get(API_URL + "Products/GetLongDistanceCountries?" + params)
				.then(function(response) {
					var countries = response.data.Data;
					// console.log(JSON.stringify(countries));
					deferred.resolve(countries);
				}, function(response) {
					deferred.reject(response);
				});
				return deferred.promise;
			},
			// Get products by category and country
			getLongDistanceProductsByCountry: function(merchantId, countryName){
				// serialize object to url params
				var params = SharedFunctions.serialize({'merchantId': merchantId, 'countryName': countryName});
				// console.log(params);
				var deferred = $q.defer();
				$http.get(API_URL + "Products/GetLongDistanceProductsByCountry?" + params)
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
			// Get products by category and country
			getLongDistanceCountryDetails: function(merchantId, countryName){
				// serialize object to url params
				var params = SharedFunctions.serialize({'merchantId': merchantId, 'countryName': countryName});
				// console.log(params);
				var deferred = $q.defer();
				$http.get(API_URL + "Products/GetLongDistanceCountryDetails?" + params)
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
			getWirelessCarriers: function(merchantId, countryCode){
				// serialize object to url params
				var params = SharedFunctions.serialize({'merchantId': merchantId, 'countryCode': countryCode});
				// console.log(params);
				var deferred = $q.defer();
				$http.get(API_URL + "Products/GetWirelessCarriers?" + params)
				.then(
					function(response) {
						var arr = response.data.Data;
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
			getWirelessProductsByCarrier: function(merchantId, carrierId){
				//
				// serialize object to url params
				var params = SharedFunctions.serialize({'merchantId': merchantId, 'carrierId': carrierId});
				// console.log(params);
				var deferred = $q.defer();
				$http.get(API_URL + "Products/GetWirelessProductsByCarrier?" + params)
				.then(function(response) {
					arr = response.data.Data;
					deferred.resolve(arr);
				}, function(response) {
					console.log(response)
					deferred.reject(response);
				});
				return deferred.promise;
			},
			// GET WIRELESS CARRIER DETAILS
			getWirelessCarrierDetails: function(merchantId, carrierId){
				//
				// serialize object to url params
				var params = SharedFunctions.serialize({'merchantId': merchantId, 'carrierId': carrierId});
				// console.log(params);
				var deferred = $q.defer();
				$http.get(API_URL + "Products/GetWirelessCarrierDetails?" + params)
				.then(function(response) {
					arr = response.data.Data;
					deferred.resolve(arr);
				}, function(response) {
					console.log(response)
					deferred.reject(response);
				});
				return deferred.promise;
			},
			// GET WIRELESS CARRIER INITIALS
			getWirelessCarrierInitials: function(merchantId, countryCode){
				// serialize object to url params
				var params = SharedFunctions.serialize({'merchantId': merchantId, 'countryCode': countryCode});
				// console.log(params);
				var deferred = $q.defer();
				$http.get(API_URL + "products/GetWirelessCarrierInitials?" + params)
				.then(
					function(response) {
						arr = response.data.Data;
						console.log(error);
						deferred.resolve(arr);
					}, function(response) {
						console.log(response);
						deferred.reject(error);
					}
				);
				return deferred.promise;
			},
			// DO BLACKSTONE POS OPERATION
			doBlackstonePosOperation: function(order){
				var posOperation = API_URL + "Products/DoBlackstonePosOperation";
				// console.log(params);
				var deferred = $q.defer();
				$http.post(posOperation, order)
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
			}
		}
	}])
