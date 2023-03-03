/**
 * Wishlist model events
 */

'use strict';

import {EventEmitter} from 'events';
var Wishlist = require('../../sqldb').Wishlist;
var WishlistEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
WishlistEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Wishlist.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    WishlistEvents.emit(event + ':' + doc._id, doc);
    WishlistEvents.emit(event, doc);
    done(null);
  }
}

export default WishlistEvents;
