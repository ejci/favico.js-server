var http = require('http');

/**
 * Icon namespace
 */
var icon = {};
icon.getImage = function(url, cb) {
    var req;
    try {
        req = http.request(url, function(response) {
            //http://chad.pantherdev.com/node-js-binary-http-streams/
            if (response.statusCode === 200) {
                var data = [];
                response.on('data', function(chunk) {
                    data.push(chunk);
                });
                response.on('end', function() {
                    var buffer = new Buffer(data.reduce(function(prev, current) {
                        return prev.concat(Array.prototype.slice.call(current));
                    }, []));
                    cb(false, buffer);
                    req.end();
                });
            } else {
                cb(new Error("No data from server!"));
            }

        });
        req.on('error', function() {
            cb(new Error("Something went wrong while receiving image!"));
            req.end();
        });
        req.end();
    } catch(e) {
        //console.log(e);
        //console.trace();
        if (req.end) {
            req.end();
        }
        cb(e);
    }
};

module.exports = icon;
