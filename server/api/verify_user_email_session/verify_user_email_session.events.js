/**
 * VerifyUserEmailSession model events
 */

'use strict';

import {EventEmitter} from 'events';
var VerifyUserEmailSession = require('../../sqldb').VerifyUserEmailSession;
var VerifyUserEmailSessionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
VerifyUserEmailSessionEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  VerifyUserEmailSession.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    VerifyUserEmailSessionEvents.emit(event + ':' + doc._id, doc);
    VerifyUserEmailSessionEvents.emit(event, doc);
    done(null);
  }
}

export default VerifyUserEmailSessionEvents;
