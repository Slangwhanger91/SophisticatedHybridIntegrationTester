const express = require('express');
var router = express.Router();
var responder = require('.././utils/responder');
var validator = require('.././utils/validator');
var dbAccess = require('.././dataaccesslayer/absdal');



router.post('/addEvent', function (req, res, next) {
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
                dbAccess.query("users", {'token': tok}, function (data) {
                    if (validator.validateParams(jsonBody, ["id", "type", "name", "data", "message", "deviceId", "timeStamp", "duration"])) {
                        dbAccess.insert("events", {
                            "userId": data[0]._id.toHexString(),
                            "id": jsonBody.id,
                            "type": jsonBody.type,
                            "name": jsonBody.name,
                            "data": jsonBody.data,
                            "message": jsonBody.message,
                            "deviceId": jsonBody.deviceId,
                            "timeStamp": jsonBody.timeStamp,
                            "duration": jsonBody.duration
                        });
                        res.send(responder.respondWith(200, "yeah, ok"));
                    } else
                        res.send(responder.respondWith(503, "bad request"));
                    return;
                });
            } catch (e) {
                res.send(responder.respondWith(503, "bad request"));
                return;
            }
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

            var queryJson = {};
            var keyNum = 0;
            if (validator.validateParams(jsonBody, ["userId"])) {
                queryJson.userId = jsonBody.userId;
                keyNum++;
            }
            if (validator.validateParams(jsonBody, ["deviceId"])) {
                queryJson.deviceId = jsonBody.deviceId;
                keyNum++;
            }
            if (validator.validateParams(jsonBody, ["timeStamp"])) {
                queryJson.timeStamp = jsonBody.timeStamp;
                keyNum++;
            }
            if (validator.validateParams(jsonBody, ["name"])) {
                queryJson.name = jsonBody.name;
                keyNum++;
            }
            if (validator.validateParams(jsonBody, ["message"])) {
                queryJson.message = jsonBody.message;
                keyNum++;
            }

            if (Object.keys(jsonBody).length > keyNum) {
                res.send(responder.respondWith(503, "Bad request"));
                return;
            }

            console.log("GOOD SHIT: " + JSON.stringify(queryJson));
            dbAccess.query("events", queryJson, function (data) {
                console.log("FOUND SHIT" + JSON.stringify(data));
                res.send(responder.respondWith(200, data));
                return;
            });
        });


    });

});

module.exports = router;