'use strict';

(function() {

angular.module('pulianiBookStoreApp.auth')
  .run(function($rootScope, $state, Auth, $location) {
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on('$stateChangeStart', function(event, next) {
		
		
        
		
        document.body.scrollTop = document.documentElement.scrollTop = 0;

		if(next.name=="main" && !$rootScope.isEntered)
      { $("view").hide();
			$rootScope.isEntered = false;
    }
		else
      { $("view").show();
			$rootScope.isEntered = true;
    }
		
		$rootScope.onEnter = function()
		{ $("view").show();
			$rootScope.isEntered = true;
		}
        
        Auth.isLoggedIn(function(data){
            
			if((!data && next.authenticate) || (data && next.name=="register"))
			$location.path('/main');
		})
		  
      if (!next.authenticate) {
        return;
      }
		
/*	 if (typeof next.authenticate === 'string') {
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
      }  */
    });
	

  });

})();
