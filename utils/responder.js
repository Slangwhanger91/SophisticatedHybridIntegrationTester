
var respondWith = function (code, param) {
    if (!param) {
        return respondSimple(code);
    }

    var objectConstructor = {}.constructor;
    if (param.constructor === objectConstructor)
        return respondJson(code, param);

    return respondString(code, param);
};

var respond = function (code) {
    return respondWith(code, null);
};

function respondSimple(code) {
    var status = getStatus(code);
    var obj = getRespondObj();
    console.log("simple: code " + code + ", status: " + status);
    obj.code = code;
    obj.status = status;
    return formattedResponse(obj);
}

function respondString(code, string) {
    var status = getStatus(code);
    var obj = getRespondObj();
    console.log("string: code " + code + ", status: " + status);
    obj.code = code;
    obj.status = status;
    obj.data = string;
    return formattedResponse(obj);
}

function respondJson(code, json) {
    var status = getStatus(code);
    var obj = getRespondObj();
    console.log("json: code " + code + ", status: " + status);
    obj.code = code;
    obj.status = status;
    obj.data = json;
    return formattedResponse(obj);
}

function formattedResponse(obj) {
    console.log(JSON.stringify(obj, null, '\t'));
    return (JSON.stringify(obj, null, '\t'));
}

function getRespondObj() {
    return {code: "", status: ""};
}

function getStatus(code) {
    var message;
    switch (code) {
        case 200:
            message = "ok";
            break;
        case 201:
            message = "Created";
            break;
        case 202:
            message = "Accepted";
            break;
        case 204:
            message = "No content";
            break;
        case 400:
            message = "Bad request";
            break;
        case 401:
            message = "Unauthorized";
            break;
        case 403:
            message = "Forbidden";
            break;
        case 404:
            message = "Not found";
            break;
        case 406:
            message = "Not acceptable";
            break;
        case 408:
            message = "Request timeout";
            break;
        case 409:
            message = "Conflict";
            break;
        case 426:
            message = "Upgrade required";
            break;
        case 429:
            message = "Too many requests";
            break;
        case 500:
            message = "Internal server error";
            break;
        case 501:
                message = "Not implemented";
            break;
        case 503:
            message = "Service unavailable";
            break;
        case 502:
            message = "Bad gateway";
            break;
        case 507:
            message = "Insufficient storage";
            break;
        default:
            message = "Undefined code exception!";
            break;
    }
    return message;
}

module.exports.respond = respond;
module.exports.respondWith = respondWith;
