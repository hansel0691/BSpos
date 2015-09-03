'use strict';
/**
 * Custom filters
 * [description]
 * @return {[json]}
 */

/**
* @return {[json]}
*/
angular.module('appFilters', [])
	/** Capitalize string, @return {[json]} */
	.filter('capitalize', function() {
		return function(input, all) {
			return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
		}
	})
	/** Replace spaces for dash symbol, @return {[json]} */
	.filter('makeSlug', function() {
		return function(item) {
			item = item || '';
			return item.replace(/\s+/g, '-').toLowerCase();
		}
	})
	/** format phone numbers */
	.filter('tel', function () {
		return function (tel) {
			if (!tel) { return ''; }

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

			if (country == 1) {
				country = "";
			}

			number = number.slice(0, 3) + '-' + number.slice(3);

			return (country + " (" + city + ") " + number).trim();
		};
	})
	/** format myCamelCaseString to My Camel Case String */
	.filter('ordinal', function() {
		return function(input) {
			return input.charAt(0).toUpperCase() + input.substr(1).replace(/[A-Z]/g, ' $&');
		}
	})
	.filter('humanizeConstant', function(){
		return function(text) {
			if(text) {
				var string = text.split("_").join(" ").toLowerCase();
				var string = string.charAt(0).toUpperCase() + string.slice(1);
				return string
			};
		};
	}).
	filter('firstLetter', function () {
		// function to invoke by Angular each time
		// Angular passes in the `items` which is our Array
		return function (items, letter) {
			if (!items || !items.length) { return; }
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
	});
