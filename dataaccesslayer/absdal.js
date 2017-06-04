var db = require('./shitdb');
var connection = require('./connection');

connection.startConnection();

var dbAccess = function () {
    this.insert = function (collectionName, data, callback) {
        var collection = connection.getInstance().collection(collectionName);
        console.log('inserting ' + JSON.stringify(data) + ' to ' + collectionName);
        collection.insert(data, null, callback);
    };

    this.query = function (collectionName, document, callback) {
        var collection = connection.getInstance().collection(collectionName);
        collection.find(document).toArray(function (err, items) {
            callback(items);
            console.log("query found: " + JSON.stringify(items));
        });
    };

    this.update = function (collectionName, document, update) {
        var collection = connection.getInstance().collection(collectionName);
        collection.updateOne(
                document,
                {$set: update,
                }).then(function (result) {
            console.log("collection " + collectionName + " updated");
        });
    };

    return {
        insert: insert,
        query: query,
        update: update,
    };
}();

module.exports = dbAccess;