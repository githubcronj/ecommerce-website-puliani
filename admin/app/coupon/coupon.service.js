
'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('mycoupons', function (common) {
    var factory = {};

  factory.getMyCoupons = function(body)
  {
    let MyCoupon = common.callApi('POST','/api/coupons/getAllCoupons/' ,'',{'Content-Type':'application/json'},body);
    return MyCoupon;
  }

  factory.updateCoupon = function(body)
  {
    let MyCoupon = common.callApi('PUT','/api/coupons/editCoupon' ,'',{'Content-Type':'application/json'},body);
    return MyCoupon;
  }

  factory.createCoupon = function(body)
  {
    let MyCoupon = common.callApi('POST','/api/coupons/createCoupon' ,'',{'Content-Type':'application/json'},body);
    return MyCoupon;
  }

  factory.deleteCoupon = function(body)
  {
    let MyCoupon = common.callApi('DELETE','/api/coupons/deleteCoupon' ,'',{'Content-Type':'application/json'},body);
    return MyCoupon;
  }
  
   factory.sendCoupons = function(body)
  {
    let sendCoupons = common.callApi('POST','/api/coupons/sendCoupons' ,'',{'Content-Type':'application/json'},body);
    return sendCoupons;
  }
   
  return factory;

  });
