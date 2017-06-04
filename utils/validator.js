var dbAccess = require('.././dataaccesslayer/absdal');
var url = require('url');

var validateParams = function (jsonObj, params) {
    for (var param in params) {
        if (jsonObj.hasOwnProperty(params[param])) {
            if (jsonObj[params[param]] === null || jsonObj[params[param]] === "") {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
};

var validateQueryParams = function (req, params) {
    var urlParsed = url.parse(req.url, true);
    var queryParams = urlParsed.query;

    for (var param in params) {
        if (queryParams[params[param]]) {
            if (queryParams[params[param]] === null || queryParams[params[param]] === "") {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
};

var validateToken = function (token, callback) {
    console.log("got token " + token);
    dbAccess.query("users", {'token': token}, function (data) {
        if (data.length > 0) {
            callback(true);
            return;
        }

        callback(false);
        return;
    });
};

module.exports.validateParams = validateParams;
module.exports.validateToken = validateToken;
module.exports.validateQueryParams = validateQueryParams;
