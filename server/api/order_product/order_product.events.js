/**
 * OrderProduct model events
 */

'use strict';

import {EventEmitter} from 'events';
var OrderProduct = require('../../sqldb').OrderProduct;
var OrderProductEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OrderProductEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  OrderProduct.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    OrderProductEvents.emit(event + ':' + doc._id, doc);
    OrderProductEvents.emit(event, doc);
    done(null);
  }
}

export default OrderProductEvents;
