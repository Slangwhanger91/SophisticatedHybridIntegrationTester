var MOCKS = "mocks";
var DEVICES = "devices";
var USERS = "users";

var collectionSetter = function (db,collInfos) {
    collInfos.forEach(function (info) {
        console.log(info.name);
        var collection = db.collection(info.name);

        switch (collection.s.name) {
            case "mocks":
                collection.createIndex({"name": 1}, {unique: true});
                break;
            case "users":
                collection.createIndex({"username": 1}, {unique: true});
                break;
            case "devices":
                collection.createIndex({"id": 1}, {unique: true});
                break;
        }
    });
};
module.exports.setCollections = collectionSetter;
