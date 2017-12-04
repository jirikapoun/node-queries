import {Connection} from 'mysql2';
import Factory      from './classes/factory';
import middleware   from './middleware';

exports = module.exports = function(connection: Connection) {
  return new Factory(connection);
}
exports['middleware'] = middleware;