var mongodb = require('mongodb').MongoClient;
var connection = require('./connection');


//var UserDb = function () {
//    var instance;
//    var collectionName = 'devices';
//    connection.startConnection();
//    var getInstance = function () {
//        return instance;
//    };
//
//    // f.e user in format: { id: 2, token: '4321', globalSettings}
//    this.insert = function (user) {
//        getInstance().collection(collectionName, function (err, collection) {
//            console.log("Inserting user: " + JSON.stringify(user));
//            collection.insert(user);
//        });
//    };
//
//    this.remove = function (user) {
//        getInstance().collection(collectionName, function (err, collection) {
//            console.log("Removing user: " + JSON.stringify(user));
//            collection.remove(user);
//        });
//    };
//
//    this.findById = function (user, callback) {//either by id or token
//        getInstance().collection(collectionName, function (err, collection) {
//            collection.findOne(user, function (err, document) {
//                console.log("Found user: " + JSON.stringify(document));
//                callback(document);
//            });
//        });
//    };
//
//    this.getUsersForNotification = function (packageName, flavorName, callback) {
//        getInstance().collection(collectionName, function (err, collection) {
//            if (err) {
//                callback(err);
//                return;
//            }
//
//            var query = {
//                "globalSettings.knownApps": {$elemMatch: {
//                        "key": packageName,
//                        "flavors": {$elemMatch: {
//                                "isChecked": true,
//                                "key": flavorName
//                            }}
//                    }}
//            };
//
//            callback(undefined, collection.find(query));
//        });
//    };
//
//    this.getCollection = function (callback) {
//        getInstance().collection(collectionName, function (err, collection) {
//            collection.find().toArray(function (err, items) {
//                if (err)
//                    throw err;
//                console.log("Got collection: " + JSON.stringify(items));
//                callback(items);
//            });
//        });
//    };
//
//    this.getSize = function (callback) {
//        getInstance().collection(collectionName).count(function (err, size) {
//            if (err)
//                throw err;
//            console.log('Total Rows: ' + size);
//            callback(size);
//        });
//    };
//
//    return {
//        findById: findById,
//        insert: insert,
//        remove: remove,
//        getCollection: getCollection,
//        getSize: getSize,
//        getUsersForNotification: getUsersForNotification
//    };
//
//}();

//module.exports = UserDb;