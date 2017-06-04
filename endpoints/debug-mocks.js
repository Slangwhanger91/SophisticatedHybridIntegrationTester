const express = require('express');
var router = express.Router();
var dbAccess = require('.././dataaccesslayer/absdal');
var validator = require('.././utils/validator');
var responder = require('.././utils/responder');





//json ex: headers: token, name
router.get('/getMock', function (req, res, next) {
    console.log("Getting mock");
    var collectionName = "mocks";

    var tok = req.get("token");
    var name = req.param("name");
    validator.validateToken(tok, function (isValidToken) {
        if (isValidToken) {
            console.log('url: ' + req.url);
            if (validator.validateQueryParams(req, ["name"])) {
                dbAccess.query(collectionName, {'name': name}, function (data) {
                    if (data.length > 0) {
                        res.send(responder.respondWith(200, data[0].data));
                        return;
                    }
                    res.send(responder.respondWith(400, "invalid mock identifier."));
                    return;
                });
            } else {
                res.send(responder.respondWith(400));
                return;
            }
        } else {
            res.send(responder.respondWith(401));
            return;
        }
    });
});

//json ex: {}
router.get('/getMocks', function (req, res, next) {
    console.log("Getting mocks");
    var collectionName = "mocks";
    var body = "";

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        var tok = req.get("token");
        console.log("validating user token: " + tok);
        validator.validateToken(tok, function (isValidToken) {
            if (isValidToken) {
                dbAccess.query(collectionName, {}, function (data) {
                    if (data.length > 0) {
                        var reformattedData = [];
                        data.forEach(function (dat) {
                            reformattedData[reformattedData.length] = dat.data;
                        });
                        res.send(responder.respondWith(200, reformattedData));
                        return;
                    }
                    res.send(responder.respondWith(500, "Err, This should never happen! check your DB Connection (or the collection?)"));
                    return;
                });
            } else {
                res.send(responder.respondWith(401));
                return;
            }
        });
    });
});

//json ex: {"name":"kkkkk","data":"shieeeet"}
router.post('/addMock', function (req, res, next) {
    console.log("Adding mock");
    var collectionName = "mocks";
    var body = "";

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        var tok = req.get("token");
        console.log("validating user token: " + tok);
        validator.validateToken(tok, function (isValidToken) {
            if (isValidToken) {
                console.log('\nbody: ' + body);
                var jsonBody;
                try {
                    jsonBody = JSON.parse(body);
                } catch (e) {
                    res.send(responder.respondWith(400, "invalid mock json."));
                    return;
                }

                if (validator.validateParams(jsonBody, ["name"])) {
                    dbAccess.query(collectionName, {'name': jsonBody.name}, function (data) {
                        if (data.length > 0) {//update
                            dbAccess.update(collectionName, {name: jsonBody.name}, {data: jsonBody.data});
                            res.send(responder.respondWith(200, "updated mock"));
                            return;
                        } else {//add
                            try {
                                dbAccess.insert(collectionName, {name: jsonBody.name, data: jsonBody.data});
                                res.send(responder.respondWith(200, "inserted mock"));
                                return;
                            } catch (e) {
                                res.send(responder.respondWith(500, "Err, This should never happen! check your DB Connection."));
                                return;
                            }
                        }
                    });
                } else {
                    res.send(responder.respondWith(400, "invalid mock json."));
                    return;
                }
            } else {
                res.send(responder.respondWith(401, "invalid user token."));
                return;
            }
        });
    });
});

module.exports = router;


