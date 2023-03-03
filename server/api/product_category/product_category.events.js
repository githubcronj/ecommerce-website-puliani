/**
 * ProductCategory model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductCategory = require('../../sqldb').ProductCategory;
var ProductCategoryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductCategoryEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ProductCategory.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductCategoryEvents.emit(event + ':' + doc._id, doc);
    ProductCategoryEvents.emit(event, doc);
    done(null);
  }
}

export default ProductCategoryEvents;
