'use strict';

angular.module('pulianiBookStoreApp')
  .controller('CheckoutCtrl', function($scope, Auth, checkout, MyCart, $uibModal, toaster, $state, Global, $http, resetpassword) {


    function initialize() {
      var isTransacCompleted = ($state.params.status == "success" || $state.params.status == "failure");
      //alert(isTransacCompleted);
      Auth.isLoggedIn(function(isLoggedIn) {
        $scope.switchedView = isTransacCompleted && isLoggedIn ? "switch-payment" : (isLoggedIn ? "switch-address" : "switch-account");
        $scope.checkoutOpt = [{
          name: "ACCOUNT",
          ref: "switch-account",
          activeImg: 'assets/images/bubbles/account-selected.png',
          inactiveImg: 'assets/images/bubbles/account.png',
          isDisabled: (isTransacCompleted && isLoggedIn) ? true : isLoggedIn,
          isActive: (isTransacCompleted && isLoggedIn) ? false : !isLoggedIn
        }, {
          name: "SHIPPING",
          ref: "switch-address",
          activeImg: 'assets/images/bubbles/shipping-selected.png',
          inactiveImg: 'assets/images/bubbles/shipping.png',
          isDisabled: (isTransacCompleted && isLoggedIn) ? true : !isLoggedIn,
          isActive: (isTransacCompleted && isLoggedIn) ? false : isLoggedIn
        }, {
          name: "FINAL REVIEW",
          ref: "switch-review",
          activeImg: 'assets/images/bubbles/final-review-selected.png',
          inactiveImg: 'assets/images/bubbles/final-review.png',
          isDisabled: true,
          isActive: false
        }, {
          name: "PAYMENT",
          ref: "switch-payment",
          activeImg: 'assets/images/bubbles/payment-selected.png',
          inactiveImg: 'assets/images/bubbles/payment.png',
          isDisabled: !isTransacCompleted || !isLoggedIn,
          isActive: isTransacCompleted && isLoggedIn
        }];

        // alert($scope.switchedView);

      })
    }

    initialize();

    $scope.ordernumber = $state.params.ordernumber;
    $scope.paymentStatus = $state.params.status;


    $scope.currencyType = Global.CURRENCY;

    $scope.onBubbleClick = function(switchtype) {
      $scope.switchedView = switchtype;
      setBubbleCss(switchtype);
    }


    function getUserAddress() {
      checkout.getUserAddress().then(function(data) {
          //alert(data.data.addresses.length)
          $scope.userAddress = data.data.addresses;
          if ($scope.userAddress.length > 0 && !$scope.selectedAddressKey)
            $scope.selectedAddressKey = 0;
        },
        function(error) {
          //alert(JSON.stringify(error));
        })

    }

    getUserAddress();

    $scope.makeEditable = function(index) {
      $scope.edit = index;
    }

    $scope.openAddress = function(size, type, data, key) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'addAddressModal.html',
        controller: 'AddAddressModalCtrl',
        size: size,
        resolve: {
          type: function() {
            return type;
          },
          data: function() {
            return data;
          },
          key: function() {
            return key;
          },
        }

      });

      modalInstance.result.then(function(data) {
        getUserAddress();
      }, function() {
        console.log('Modal dismissed at: ' + new Date());
      });

    };



    $scope.switchToView = function(view) {

      $scope.switchedView = view;
      $scope.checkoutOpt['0'].isDisabled = true;

      setBubbleCss(view);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    function setBubbleCss(view) {

      angular.forEach($scope.checkoutOpt, function(value, key) {
        if (value.ref == view) {

          $scope.checkoutOpt[key].isDisabled = false;
          $scope.checkoutOpt[key].isActive = true;
        } else
          $scope.checkoutOpt[key].isActive = false;

      });
    }

    $scope.onPaymentComplete = function() {
      checkout.placeUserOrder({
        delivery_address: $scope.userAddress[$scope.selectedAddressKey],
        payment_method: "creditCard"
      }).then(function(data) {
        $scope.$emit('checkCartShell');
        toaster.pop("success", "Order Placed");
        $state.go('main');
      }, function(error) {

        //alert(JSON.stringify(error));
      })

    }

    getUserAddress();

    $scope.onAddressDelete = function(key) {

      var confirmation = confirm("Do you want to delete it?");
      if (confirmation) {

        checkout.deleteUserAddress(key).then(function(data) {
          toaster.pop("info", "Address deleted");
          getUserAddress();

          if ($scope.selectedAddressKey == key) {
            $scope.selectedAddressKey = null;
          }
        }, function(error) {
          //alert(JSON.stringify(error));
        });
      }
    }



    $scope.onAddressSelect = function(key) {
      $scope.selectedAddressKey = key;
    }



    function getCartItems() {
      MyCart.getMyCart()

      .then(function(data) {
        $scope.cartData = data.data;
      })
    }

    getCartItems();

    $scope.$on('onUserStatusChange', function(event, args) {

      initialize();

      //      Auth.isLoggedIn(function(isLoggedIn) {
      //
      //        if (!isLoggedIn) {
      //         
      //          $scope.switchToView("switch-account");
      //        } else {
      //          getCartItems();
      //          getUserAddress();
      //          $scope.switchToView("switch-address");
      //        }
      //
      //
      //      });

    });

    function guestUserAddtoCart() {
      MyCart.guestUserAddtoCart().then(function(data) {
        getCartItems();
        getUserAddress();
        $scope.$emit('AuthSuccess');
        initialize();
      });
    }



    $scope.onUserLogin = function(login) {
      Auth.login(login).then(function(data) {
        toaster.pop("success", "Login Success");
        guestUserAddtoCart();
      }, function(error) {

        toaster.pop("error", "Login Failed", "Invalid Credentials");

      })

    }

    $scope.onQuantityChange = function(productid, quantity, unitsInStock) {

      if (!quantity) {
        toaster.pop("error", "Specified quantity is not available");
        return;
      }

      if (quantity <= unitsInStock) {

        MyCart.onQuantityChange(productid, quantity)

        .then(function(data) {

          toaster.pop("info", "Item Quantity Updated");
          getCartItems();
          $scope.edit = undefined;

        });
      } else
        toaster.pop("warning", "Item Quantity has exceed Stock");

    }


    $scope.onUserRegister = function(user, type) {

      var data = null;
      if (type === 'guest') {
        data = {
          email: user.email,
          phone_number: [user.phone_number],
          first_name: 'Guest',
          role: 'guest'
        }
      } else {
        data = {

          email: user.email,
          phone_number: [user.phone_number],
          first_name: user.first_name,
          password: user.password,
          role: 'customer'
        }
      }
      //console.log("user",user);
      Auth.createUser(data).then(function(data) {
        if (type != "guest")
          toaster.pop("success", "Login Success");

        guestUserAddtoCart();
      }, function(error) {

        console.log("error ", error)
        toaster.pop("error", "Checkout Failed", error.data);
        console.log(error);
      })

    }

    $scope.makePayment = function() {
      checkout.getPaymentDetails($scope.selectedAddressKey).then(function(data) {

        var form = createPaymentFormData(data.data);
        form.submit();

        //           alert(JSON.stringify(data));
        //            
      }, function(error) {
        console.log(error);
      })



    }

    $scope.openForgotModal = function() {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'forgotpasswordmodal.html',
        controller: function ModalInstanceForgotCtrl($scope, $uibModalInstance) {
          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          }

          $scope.sendVerificationLink = function() {
            var body = {};
            body.email = $scope.reset.email;
            $scope.inprogress = true;
            $scope.sentEmail = false;
            $scope.invalidEmail = false;
            $scope.temporaryEmail = $scope.reset.email;
            resetpassword.sendVerificationLink(body).then(function(success) {
              $scope.inprogress = false;
              $scope.sentEmail = true;
              $scope.invalidEmail = false;
              $scope.reset.email = "";
            }, function(error) {
              $scope.inprogress = false;
              $scope.sentEmail = false;
              $scope.invalidEmail = true;
              console.log("handle error", error);
            })
          }

        },
        size: 'md'
      });
    }



    function createPaymentFormData(data) {

      var form = document.createElement("form"),
        node = document.createElement("input");


      form.action = data.payment_url;
      form.method = "POST";

      node.name = "key";
      node.value = data.key;
      form.appendChild(node.cloneNode());

      node.name = "hash";
      node.value = data.hash;
      form.appendChild(node.cloneNode());

      node.name = "txnid";
      node.value = data.txnid;
      form.appendChild(node.cloneNode());

      node.name = "amount";
      node.value = data.amount;
      form.appendChild(node.cloneNode());

      node.name = "firstname";
      node.value = data.firstname;
      form.appendChild(node.cloneNode());

      node.name = "email";
      node.value = data.email;
      form.appendChild(node.cloneNode());

      node.name = "phone";
      node.value = data.phone;
      form.appendChild(node.cloneNode());

      node.name = "productinfo";
      node.value = data.productinfo;
      form.appendChild(node.cloneNode());

      node.name = "surl";
      node.value = data.surl;
      node.size = '64';
      form.appendChild(node.cloneNode());

      node.name = "furl";
      node.value = data.furl;
      node.size = '64';
      form.appendChild(node.cloneNode());

      node.name = "service_provider";
      node.value = data.service_provider;
      node.size = '64';
      form.appendChild(node.cloneNode());

      node.name = "udf1";
      node.value = data.udf1;
      form.appendChild(node.cloneNode());

      node.name = "udf2";
      node.value = data.udf2;
      form.appendChild(node.cloneNode());



      //        formData.append("key", data.key);
      //        formData.append("hash", data.hash); 
      //        formData.append("txnid", data.txnid); 
      //        formData.append("amount", data.amount); 
      //        formData.append("firstname", data.firstname); 
      //        formData.append("email", data.email); 
      //        formData.append("phone", data.phone); 
      //        formData.append("productinfo", data.productinfo); 
      //        formData.append("surl", data.surl); 
      //        formData.append("furl", data.furl); 
      //        formData.append("service_provider", data.service_provider); 
      //        formData.append("udf1", data.udf1); 


      form.style.display = "none";
      document.body.appendChild(form);

      return form;
    }

  });