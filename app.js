var http = require('http');
var url = require('url');

//node-canvas
var Canvas = require('canvas');
var Image = Canvas.Image;
var FontFace = Canvas.FontFace;

//custom libraries
var utils = require('./lib/utils');
var icon = require('./lib/icon');
var type = require('./lib/type');
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
                //error
                res.writeHead(500, {
                    'Content-Type' : 'text/plain'
                });
                res.write('500 - Something went wrong...');
                res.end('\n');
                console.log('500 - Something went wrong...', e);
                console.trace();
            }
        }).listen(port, host);
        console.log('App started at ' + host + ':' + port);
    };

    return {
        get : get,
        start : start
    };

})();

app.get('/', function(req, res) {
    res.writeHead(302, {
        'Location' : 'http://lab.ejci.net/favico.js/'
    });
    res.end();
});
app.get('/version', function(req, res) {
    res.writeHead(200, {
        'Content-Type' : 'application/json'
    });
    res.write(JSON.stringify({
        version : '0.1.0'
    }));
    res.end();
});

app.get('/image', function(req, res) {
    var options = JSON.parse(req.query.options);
    //console.log(options);
    options.bgColor = utils.hexToRgb(options.bgColor);
    options.textColor = utils.hexToRgb(options.textColor);
    options.width = 128;
    options.height = 128;
    //console.log(JSON.stringify(options));
    var streamCanvas = function(img) {
        var canvas = new Canvas(options.width, options.height);
        var font = new Canvas.Font('FontAwesome', './fonts/fontawesome-webfont.ttf');
        //when using createPNGStream or createJPEGStream
        //console.log(font,'aaa');
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
            'Cache-Control' : 'max-age=31536000',
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

