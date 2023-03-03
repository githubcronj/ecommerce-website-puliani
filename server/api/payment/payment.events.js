/**
 * Payment model events
 */

'use strict';

import {EventEmitter} from 'events';
var Payment = require('../../sqldb').Payment;
var PaymentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PaymentEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Payment.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    PaymentEvents.emit(event + ':' + doc._id, doc);
    PaymentEvents.emit(event, doc);
    done(null);
  }
}

export default PaymentEvents;
