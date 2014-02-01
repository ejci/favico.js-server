var http = require('http');
var Canvas = require('canvas');
var Image = Canvas.Image;
var FontFace = Canvas.FontFace;
var url = require('url');
var utils = require('./lib/utils');
var icon = require('./lib/icon');
var position = require('./lib/position');
var CONST = require('./lib/const');

/**
 * Very simple(!) http app and router
 */
var app = (function() {
    var routes = [];
    var get = function(path, cb) {
        routes[path] = (routes[path]) ? routes[path] : {};
        routes[path].get = cb;
    };

    var post = function(path, cb) {
        routes[path] = (routes[path]) ? routes[path] : {};
        routes[path].post = cb;
    };

    var start = function(port, host) {
        http.createServer(function(req, res) {
            //console.log(req.url, req.method.toLowerCase(), req);
            try {
                var path = url.parse(req.url).pathname;
                if (routes[path] && routes[path][req.method.toLowerCase()]) {
                    //console.log(routes[req.url.split('?')[0]][req.method.toLowerCase()]);
                    req.query = url.parse(req.url, true).query;
                    routes[path][req.method.toLowerCase()](req, res);
                    return;
                }
                //not found
                res.writeHead(404, {
                    'Content-Type' : 'text/plain'
                });
                res.write('404 - Not found');
                res.end('\n');
                console.log('404 - Not found');
            } catch(e) {
                //not found
                res.writeHead(500, {
                    'Content-Type' : 'text/plain'
                });
                res.write('500 - Something went wrong...');
                res.end('\n');
                console.log('500 - Something went wrong...', e);
            }
        }).listen(port, host);
        console.log('App started at ' + host + ':' + port);
    };

    return {
        get : get,
        start : start
    };

})();

app.get('/version', function(req, res) {
    res.writeHead(200, {
        'Content-Type' : 'application/json'
    });
    res.write(JSON.stringify({
        version : '0.0.1'
    }));
    res.end();
});

app.get('/image', function(req, res) {
    var options = JSON.parse(req.query.options);

    options = utils.merge(CONST.defaultOptions, options);
    options.bgColor = utils.hexToRgb(options.bgColor);
    options.textColor = utils.hexToRgb(options.textColor);

    //console.log(JSON.stringify(options));
    var streamCanvas = function(img) {
        var canvas = new Canvas(options.width, options.height);
        var font = new Canvas.Font('FontAwesome', './fonts/fontawesome-webfont.ttf');
        // when using createPNGStream or createJPEGStream
        //console.log(font);
        //canvas.contextContainer.addFont(font);
        //options.fontFamily='FontAwesome';
        //options.badge='\uf18e';
        var ctx = canvas.getContext('2d');
        ctx.addFont(font);
        if (img) {
            ctx.drawImage(img, 0, 0, options.width, options.height);
        }
        ////
        var opt = position(options.position);
        type[options.type](opt, options, ctx);
        ////
        var stream = canvas.pngStream();
        res.writeHead(200, {
            'Cache-Control' : 'max-age=1',
            'Content-Type' : 'image/png'
        });

        stream.on('data', function(chunk) {
            res.write(chunk);
        });

        stream.on('end', function() {
            res.end();
        });
    };
    if (options.url) {
        icon.getImage(options.url, function(error, data) {
            if (error) {
                //empty image
                streamCanvas();
            } else {
                //image from request

                var img = new Image();
                img.src = data;
                options.width = img.width;
                options.height = img.height;

                streamCanvas(img);
            }
        });
    } else {
        streamCanvas();
    }
});

if (process.env.NODE_ENV === 'production') {
    app.start(80, '127.0.0.1');
} else {
    app.start(3000, '127.0.0.1');
}

/**
 * Badge types
 */
var type = {};

/**
 * Generate circle
 * @param {Object} opt Badge options
 */
type.circle = function(opt, options, context) {
    opt = utils.options(opt, options);
    //console.log(opt);
    var more = false;
    if (opt.len === 2) {
        opt.x = opt.x - opt.w * 0.4;
        opt.w = opt.w * 1.4;
        more = true;
    } else if (opt.len >= 3) {
        opt.x = opt.x - opt.w * 0.65;
        opt.w = opt.w * 1.65;
        more = true;
    }
    context.beginPath();
    context.font = options.fontStyle + " " + Math.floor(opt.h * (opt.n > 99 ? 0.85 : 1)) + "px " + options.fontFamily;
    context.textAlign = 'center';
    if (more) {
        context.moveTo(opt.x + opt.w / 2, opt.y);
        context.lineTo(opt.x + opt.w - opt.h / 2, opt.y);
        context.quadraticCurveTo(opt.x + opt.w, opt.y, opt.x + opt.w, opt.y + opt.h / 2);
        context.lineTo(opt.x + opt.w, opt.y + opt.h - opt.h / 2);
        context.quadraticCurveTo(opt.x + opt.w, opt.y + opt.h, opt.x + opt.w - opt.h / 2, opt.y + opt.h);
        context.lineTo(opt.x + opt.h / 2, opt.y + opt.h);
        context.quadraticCurveTo(opt.x, opt.y + opt.h, opt.x, opt.y + opt.h - opt.h / 2);
        context.lineTo(opt.x, opt.y + opt.h / 2);
        context.quadraticCurveTo(opt.x, opt.y, opt.x + opt.h / 2, opt.y);
    } else {
        context.arc(opt.x + opt.w / 2, opt.y + opt.h / 2, opt.h / 2, 0, 2 * Math.PI);
    }
    context.fillStyle = 'rgba(' + options.bgColor.r + ',' + options.bgColor.g + ',' + options.bgColor.b + ',' + opt.o + ')';
    context.fill();
    context.closePath();
    context.beginPath();
    context.stroke();
    context.fillStyle = 'rgba(' + options.textColor.r + ',' + options.textColor.g + ',' + options.textColor.b + ',' + opt.o + ')';
    if (( typeof opt.n) === 'number' && opt.n > 999) {
        context.fillText(((opt.n > 9999) ? 9 : Math.floor(opt.n / 1000) ) + 'k+', Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.2));
    } else {
        context.fillText(opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
    }
    context.closePath();
};
/**
 * Generate rectangle
 * @param {Object} opt Badge options
 */
type.rectangle = function(opt, options, context) {
    opt = utils.options(opt, options);
    var more = false;
    if (opt.len === 2) {
        opt.x = opt.x - opt.w * 0.4;
        opt.w = opt.w * 1.4;
        more = true;
    } else if (opt.len >= 3) {
        opt.x = opt.x - opt.w * 0.65;
        opt.w = opt.w * 1.65;
        more = true;
    }
    context.beginPath();
    context.font = options.fontStyle + " " + Math.floor(opt.h * (opt.n > 99 ? 0.9 : 1)) + "px " + options.fontFamily;
    context.textAlign = 'center';
    context.fillStyle = 'rgba(' + options.bgColor.r + ',' + options.bgColor.g + ',' + options.bgColor.b + ',' + opt.o + ')';
    context.fillRect(opt.x, opt.y, opt.w, opt.h);
    context.fillStyle = 'rgba(' + options.textColor.r + ',' + options.textColor.g + ',' + options.textColor.b + ',' + opt.o + ')';
    if (( typeof opt.n) === 'number' && opt.n > 999) {
        context.fillText(((opt.n > 9999) ? 9 : Math.floor(opt.n / 1000) ) + 'k+', Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.2));
    } else {
        context.fillText(opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
    }
    context.closePath();
};

