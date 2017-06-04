const express = require('express');
var router = express.Router();
const app = express();
const port = 3000;
var dbAccess = require('.././dataaccesslayer/absdal');
var validator = require('.././utils/validator');
var responder = require('.././utils/responder');
var cryp = require('.././utils/cryptic');

router.get('/', (req, res, next) => {
    res.send(responder.respondWith(503, "Dafuq u want mejt?"));
});

router.get('/*', (req, res, next) => {
    res.send(responder.respondWith(503, "Dafuq you goin, mejt?"));
    return;
});

router.post('/login', function (req, res, next) {
    var body = "";

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        console.log('\nbody: ' + body);
        var jsonBody = JSON.parse(body);
        if (validator.validateParams(jsonBody, ["username", "password"])) {
//            console.log("username: "+jsonBody.username);
            dbAccess.query("users", {'username': jsonBody.username, 'password': jsonBody.password}, function (data) {
                if (data.length > 0) {
                    console.log("User by name " + jsonBody.username + " found: ");
                    console.log(data);
                    var day = 86400000;
                    var updateToken = {lastactivitytimestamp: Date.now(), token: data[0].token};
                    if (Date.now() + day < data[0].lastactivitytimestamp) {
                        var tok = cryp.cryptoGen();
                        console.log("token refreshed");
                        updateToken.token = tok;
                    }
                    dbAccess.update("users", {username: jsonBody.username}, updateToken);

                    var deviceData = jsonBody.device;
                    dbAccess.query("devices", {'id': deviceData.id}, function (data2) {
                        if (data2.length > 0) { //update existing device
                            dbAccess.update("devices", {id: deviceData.id}, deviceData);
                            console.log("updated device");
                        } else {//add new device
                            dbAccess.insert("devices", {
                                "userID": data[0]._id.toHexString(),
                                "id": deviceData.id,
                                "manufacturer": deviceData.manufacturer,
                                "model": deviceData.model,
                                "imei": deviceData.imei,
                                "version": deviceData.version,
                                "os": deviceData.os,
                                "screenSize": deviceData.screenSize,
                                "resolution": deviceData.resolution
                            });
                            console.log("added device");
                        }
                        res.send(responder.respondWith(200, {token: updateToken.token}));
                        return;
                    });
                    //data[0].lastactivitytimestamp
                } else {
                    console.log("Wrong credentials.");
                    res.send(responder.respondWith(401, "Wrong credentials."));
                }
                return;
            });
        }
    });

});

//json ex: {"username":"akakaka", "password":"fuck"}
router.post('/register', function (req, res, next) {
    console.log("registering user: " + JSON.stringify(body));
    var body = "";

    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {

        console.log('\nbody: ' + body);
        var jsonBody = JSON.parse(body);
        if (validator.validateParams(jsonBody, ["username", "password"])) {

            if (jsonBody.password.includes(jsonBody.username)) {
                res.send(responder.respondWith(403, "Please choose another password"));
                return;
            }

            dbAccess.query("users", {'username': jsonBody.username}, function (data) {
                if (data.length > 0) {
                    res.send(responder.respondWith(409, "User already registered."));
                } else {
                    try {
                        var tok = cryp.cryptoGen();
                        dbAccess.insert("users", {username: jsonBody.username, password: jsonBody.password, token: tok, lastactivitytimestamp: Date.now()});
                        res.send(responder.respondWith(200, {token: tok}));
                    } catch (e) {
                        res.send(responder.respondWith(200, "Err, This should never happen! check your DB Connection."));
                    }
                }
                return;
            });
        } else {
            res.send(responder.respondWith(400, "Err"));
            return;
        }
    });
});


module.exports = router;


