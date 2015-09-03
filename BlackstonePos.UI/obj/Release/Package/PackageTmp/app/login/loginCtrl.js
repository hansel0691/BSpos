/**
 * LandingCtrl Controller
 * Return most sold products and best country rates.
 */
app.controller('LoginCtrl', ['$scope', 'AlertService', '$location', 'AuthenticationFactory', 'localStorageService', '$rootScope',
	function($scope, AlertService, $location, AuthenticationFactory, localStorageService, $rootScope){

	// Show/Hide Application form
	$scope.isApplying = false;
	$scope.toggleApplication = function(){
		$scope.isApplying = !$scope.isApplying;
	}

	// Alert Service
	// AlertService.add('error', "This is an error message!");
	$scope.addAlert = function() {
		// user triggered event
		AlertService.add('success', '<h4>Success!</h4> This is a success message!');
	};
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};


	// Carousel (ui.bootstrap.carousel)
	$scope.myInterval = 5000;
	var slides = $scope.slides = [];

	$scope.addSlide = function() {
		var item = 1 + slides.length;
		slides.push({
			image: 'Images/src/slide-482x330/' + item + '.png',
			text: 'Loren Ipsum' + item
		});
	}
	for (var i=1; i<=2; i++) {
		$scope.addSlide();
	}

	// Form submit handler.
	$scope.submit = function(form) {

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
				function(response){

					loginUser(response);
				},
				function(error){
					AlertService.add('error', 'Invalid Credentials');
					console.log(error);
				}
			)
		}
	};

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
	        }

	        // check user authentification
	        AuthenticationFactory.submitApplicant(submissionData).then(
				function (response) {
				    if (response.Status == 200) {
				        AlertService.clear();
				        AlertService.add('success','Application Successfully submited!');
				    }
				  
				},
				function (error) {
				    AlertService.add('error', 'Problems processing your application. Try again later, please.');
				    console.log(error);
				}
			)
	    }
	};

	 function loginUser(response)
     {
     	if(response.Status == 200)
     	{
     		var userInfo = response.UserInfo;

			// store user data in session. this is used to keep live on refresh
			localStorageService.set('userInfo', userInfo);

			$scope.$parent.userInfo = localStorageService.get('userInfo');

			AlertService.add('success', 'Welcome!');

			// reditect to home page
			$location.path('/');
     	}
     	else{
     		AlertService.add('error', 'Invalid Credentials!');
     		console.log(error);
     	}
     }


}]);
