/**
 * CartProduct model events
 */

'use strict';

import {EventEmitter} from 'events';
var CartProduct = require('../../sqldb').CartProduct;
var CartProductEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CartProductEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  CartProduct.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    CartProductEvents.emit(event + ':' + doc._id, doc);
    CartProductEvents.emit(event, doc);
    done(null);
  }
}

export default CartProductEvents;
