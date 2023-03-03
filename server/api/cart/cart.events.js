/**
 * Cart model events
 */

'use strict';

import {EventEmitter} from 'events';
var Cart = require('../../sqldb').Cart;
var CartEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CartEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Cart.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    CartEvents.emit(event + ':' + doc._id, doc);
    CartEvents.emit(event, doc);
    done(null);
  }
}

export default CartEvents;
