const express = require('express');
var router = express.Router();
var responder = require('.././utils/responder');
var validator = require('.././utils/validator');
var dbAccess = require('.././dataaccesslayer/absdal');
//var url = require('url');

router.post('/send', function (req, res, next) {
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        console.log('\nbody: ' + body);
        var tok = req.get("token");
        console.log("validating user token: " + tok);
        validator.validateToken(tok, function (isValidToken) {
            if (!isValidToken) {
                res.send(responder.respondWith(503, "your token is shit"));
                return;
            }
            try {
                var jsonBody = JSON.parse(body);
            } catch (e) {
                res.send(responder.respondWith(503, "terrible fucking json mejt"));
                return;
            }

            dbAccess.query("users", {'token': tok}, function (data) {
                var keptReq = false;
                var keptRes = false;

                if (jsonBody.request !== null && jsonBody.request !== undefined && jsonBody.request !== "") {
                    keptReq = true;
                    dbAccess.insert("requests", {"userID": data[0]._id.toHexString(), "data": jsonBody.request});
                }

                if (jsonBody.response !== null && jsonBody.response !== undefined && jsonBody.response !== "") {
                    keptRes = true;
                    dbAccess.insert("responses", {"userID": data[0]._id.toHexString(), "data": jsonBody.response});
                }
                //create obj and insert only once if not empty
                if (!keptReq && !keptRes)
                    res.send(responder.respondWith(204, "req: " + keptReq + ", res: " + keptRes));
                else
                    res.send(responder.respondWith(200, "req: " + keptReq + ", res: " + keptRes));

                return;
            });
        });
    });
});

router.post('/query', function (req, res, next) {
    var body = "";

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        console.log('\nbody: ' + body);
        try {
            var jsonBody = JSON.parse(body);
        } catch (e) {
            res.send(responder.respondWith(503, "Corrupted Json"));
            return;
        }

        var tok = req.get("token");
        validator.validateToken(tok, function (isValidToken) {
            if (!isValidToken) {
                res.send(responder.respondWith(503, "bad request"));
                return;
            }


            var isBadRequest = false;
            var viableReq = false;
            var viableRes = false;
            if (validator.validateParams(jsonBody, ["response"])) {
                isBadRequest = searchWithinCollection(jsonBody.response);
                viableRes = true;
            }
            if (!isBadRequest && validator.validateParams(jsonBody, ["request"])) {
                isBadRequest = searchWithinCollection(jsonBody.request);
                viableReq = true;
            }

            if (isBadRequest) {
                res.send(responder.respondWith(503, "Bad request"));
                return;
            }

            var obj = {};
            console.log("GOOD SHIT: " + JSON.stringify(jsonBody.requests));
            dbAccess.query("requests", viableReq ? jsonBody.request : {"none": ""}, function (data) {
                console.log("FOUND REQ" + JSON.stringify(data));
                if (viableReq)
                    obj.requests = data;

                dbAccess.query("responses", viableRes ? jsonBody.response : {"none": ""}, function (data2) {
                    console.log("FOUND RES" + JSON.stringify(data2));
                    if (viableRes)
                        obj.responses = data2;

                    res.send(responder.respondWith(200, obj));
                    return;
                });
            });
        });
    });
});

searchWithinCollection = function (collection) {
    var queryJson = {};
    var keyNum = 0;
    if (validator.validateParams(collection, ["userID"])) {
        queryJson.userID = collection.userID;
        keyNum++;
    }
    if (validator.validateParams(collection, ["_id"])) {
        queryJson._id = collection._id;
        keyNum++;
    }
    if (validator.validateParams(collection, ["data"])) {
        queryJson.data = collection.data;
        keyNum++;
    }

    if (Object.keys(collection).length > keyNum) {
        return true;
    }
};

module.exports = router;


