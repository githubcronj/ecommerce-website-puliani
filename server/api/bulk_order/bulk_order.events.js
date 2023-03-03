/**
 * BulkOrder model events
 */

'use strict';

import {EventEmitter} from 'events';
var BulkOrder = require('../../sqldb').BulkOrder;
var BulkOrderEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BulkOrderEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  BulkOrder.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    BulkOrderEvents.emit(event + ':' + doc._id, doc);
    BulkOrderEvents.emit(event, doc);
    done(null);
  }
}

export default BulkOrderEvents;
