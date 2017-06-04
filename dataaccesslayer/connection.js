var mongodb = require('mongodb').MongoClient;
var collectionsSettings = require('./collections-settings');

var connection = function () {
    var instance;

    this.getDatabase = function (callback) {
        this.checkConnection(callback);

    };

    this.checkConnection = function (callback) {
        mongodb.connect("mongodb://localhost:27017/shitdb", function (err, db) {
            if (err) {
                console.log("Get fukt: " + err);
                return;
            }

            instance = db;

            db.listCollections().toArray(function (err, collectionInfos) {
                console.log("-- We are connected to mongoDB --");
                console.log("Available Collections");
                collectionsSettings.setCollections(db, collectionInfos);
            });
            callback;
        });

    };

    var getInstance = function () {
        return instance;
    };

    return {
        startConnection: checkConnection,
        getDatabase: getDatabase,
        getInstance: getInstance,
    };
}();

module.exports = connection;
module.exports.database = connection.database;