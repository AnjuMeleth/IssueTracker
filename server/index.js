import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
import 'babel-polyfill';
import http from 'http';

import { MongoClient } from 'mongodb';

let appModule = require('./server.js');
let db;
let server;

MongoClient.connect('mongodb://admin:Q2Md7sP7bgg1Uafb@cluster0-shard-00-00.7kpdw.mongodb.net:27017,cluster0-shard-00-01.7kpdw.mongodb.net:27017,cluster0-shard-00-02.7kpdw.mongodb.net:27017/issuetracker?ssl=true&replicaSet=atlas-ksocqp-shard-0&authSource=admin&retryWrites=true&w=majority').then(connection => {
//MongoClient.connect('mongodb://localhost:27021/').then(connection => {
  db = connection;
  server = http.createServer();
  appModule.setDb(db);
  server.on('request', appModule.app);
  server.listen(3000, () => {
    console.log('App started on port 3000');
  });
}).catch(error => {
  console.log('ERROR:', error);
});

if (module.hot) {
  module.hot.accept('./server.js', () => {
    server.removeListener('request', appModule.app);
    appModule = require('./server.js');     // eslint-disable-line
    appModule.setDb(db);
    server.on('request', appModule.app);
  });
}
