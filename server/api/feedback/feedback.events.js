/**
 * Feedback model events
 */

'use strict';

import {EventEmitter} from 'events';
var Feedback = require('../../sqldb').Feedback;
var FeedbackEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FeedbackEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Feedback.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    FeedbackEvents.emit(event + ':' + doc._id, doc);
    FeedbackEvents.emit(event, doc);
    done(null);
  }
}

export default FeedbackEvents;
