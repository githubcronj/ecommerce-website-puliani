/**
 * Shipment model events
 */

'use strict';

import {EventEmitter} from 'events';
var Shipment = require('../../sqldb').Shipment;
var ShipmentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ShipmentEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Shipment.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ShipmentEvents.emit(event + ':' + doc._id, doc);
    ShipmentEvents.emit(event, doc);
    done(null);
  }
}

export default ShipmentEvents;
