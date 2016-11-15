'use strict';

console.log('Start at ' + new Date());
exports.mongodb = {
  uri: 'mongodb://localhost:27017/wenjuan'
};
exports.mongoSession = {
  url: 'mongodb://localhost:27017/wenjuan_session',
  ttl: 14 * 24 * 60 * 60, // = 14 days. Default
  autoRemove: 'native'
};
