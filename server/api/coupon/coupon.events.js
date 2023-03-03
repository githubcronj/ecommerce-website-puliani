/**
 * Coupon model events
 */

'use strict';

import {EventEmitter} from 'events';
var Coupon = require('../../sqldb').Coupon;
var CouponEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CouponEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Coupon.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    CouponEvents.emit(event + ':' + doc._id, doc);
    CouponEvents.emit(event, doc);
    done(null);
  }
}

export default CouponEvents;
