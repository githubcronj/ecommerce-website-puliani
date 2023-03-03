'use strict';

(function() {

angular.module('pulianiBookStoreAdminApp.auth')
  .run(function($rootScope, $state, Auth, $location) {
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on('$stateChangeStart', function(event, next) {
      
//		var isLoggedIn = Auth.isLoggedIn();
//		console.log(isLoggedIn);
//		
//		if(!isLoggedIn){
//			          event.preventDefault();
//			$state.go('login');
//
//		}
//		$state.go('login');
//		return;
		Auth.isLoggedIn(function(data){
//        console.log(data);
		console.log(next.name)
			if(!data && next.name!='login')
			$location.path('/login');
		})
	  
		if (!next.authenticate) {
        return;
      }

       //document.body.scrollTop = document.documentElement.scrollTop = 0;

      if (typeof next.authenticate === 'string') {
        Auth.hasRole(next.authenticate, _.noop).then(has => {
          if (has) {
            return;
          }

          event.preventDefault();
          return Auth.isLoggedIn(_.noop).then(is => {
            $state.go(is ? 'main' : 'login');
          });
        });
      } else {
        Auth.isLoggedIn(_.noop).then(is => {
          if (is) {
            return;
          }

          event.preventDefault();
          $state.go('main');
        });
      }
    });
  });

})();
