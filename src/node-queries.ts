import {ConnectionOptions} from 'mysql2';
import IEnhancedResponse   from './interfaces/enhanced-response';
import Factory             from './classes/factory';
import db                  from './db';
import middleware          from './middleware';

exports = module.exports = function(response: IEnhancedResponse) {
  return new Factory(response);
}
exports['middleware'] = middleware;
exports['init'] = function(options: ConnectionOptions) {
  db.init(options);
}