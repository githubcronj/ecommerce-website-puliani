/**
 * BannerImage model events
 */

'use strict';

import {EventEmitter} from 'events';
var BannerImage = require('../../sqldb').BannerImage;
var BannerImageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BannerImageEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  BannerImage.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    BannerImageEvents.emit(event + ':' + doc._id, doc);
    BannerImageEvents.emit(event, doc);
    done(null);
  }
}

export default BannerImageEvents;
