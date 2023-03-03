/**
 * CommingSoon model events
 */

'use strict';

import {EventEmitter} from 'events';
var CommingSoon = require('../../sqldb').CommingSoon;
var CommingSoonEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CommingSoonEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  CommingSoon.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    CommingSoonEvents.emit(event + ':' + doc._id, doc);
    CommingSoonEvents.emit(event, doc);
    done(null);
  }
}

export default CommingSoonEvents;
