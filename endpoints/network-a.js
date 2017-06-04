const express = require('express');
var router = express.Router();
var responder = require('.././utils/responder');
var validator = require('.././utils/validator');
var dbAccess = require('.././dataaccesslayer/absdal');
//var url = require('url');

router.post('/send', function (req, res, next) {
//    var urlParsed = url.parse(req.url, true);
//    var queryParams = urlParsed.query;
//
//    var hasParams, hasHeaders, hasBody;
//    hasParams = (Object.keys(queryParams).length !== 0);
//    hasHeaders = req.headers['user-agent'];

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

//        console.log("hasParams: " + hasParams + ", hasHeaders: " + hasHeaders + ", hasBody: " + hasBody);
//        hasBody = (body !== "");

            dbAccess.query("users", {'token': tok}, function (data) {
                var keptReq = false;
                var keptRes = false;

                if (jsonBody.request !== null && jsonBody.request !== undefined && jsonBody.request !== "") {
                    keptReq = keepRequest(jsonBody.request);
                    dbAccess.insert("requests", {"userID": data[0]._id.toHexString(), "data": jsonBody.request});
                }

                if (jsonBody.repsonse !== null && jsonBody.repsonse !== undefined && jsonBody.repsonse !== "") {
                    keptRes = keepResponse(jsonBody.repsonse);
                    dbAccess.insert("responses", {"userID": data[0]._id.toHexString(), "data": jsonBody.request});
                }

                res.send(responder.respondWith(503, "req: " + keptReq + ", res: " + keptRes));
                return;
            });
        });
    });

//    move to sub-method.. (keepTransaction (req, res)

});

function keepRequest(req) {
    return true;
}
;

function keepResponse(res) {
    return true;
}
;

module.exports = router;


