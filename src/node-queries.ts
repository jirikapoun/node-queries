import {ConnectionOptions} from 'mysql2';
import Factory             from './classes/factory';
import db                  from './db';
import middleware          from './middleware';

exports = module.exports = new Factory();

exports['middleware'] = middleware;

exports['init'] = function(options: ConnectionOptions) {
  db.init(options);
}