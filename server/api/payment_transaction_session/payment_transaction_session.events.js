/**
 * PaymentTransactionSession model events
 */

'use strict';

import {EventEmitter} from 'events';
var PaymentTransactionSession = require('../../sqldb').PaymentTransactionSession;
var PaymentTransactionSessionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PaymentTransactionSessionEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  PaymentTransactionSession.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    PaymentTransactionSessionEvents.emit(event + ':' + doc._id, doc);
    PaymentTransactionSessionEvents.emit(event, doc);
    done(null);
  }
}

export default PaymentTransactionSessionEvents;
