/**
 * ResetPasswordSession model events
 */

'use strict';

import {EventEmitter} from 'events';
var ResetPasswordSession = require('../../sqldb').ResetPasswordSession;
var ResetPasswordSessionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ResetPasswordSessionEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ResetPasswordSession.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ResetPasswordSessionEvents.emit(event + ':' + doc._id, doc);
    ResetPasswordSessionEvents.emit(event, doc);
    done(null);
  }
}

export default ResetPasswordSessionEvents;
