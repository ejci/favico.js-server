var utils = {};
utils.hexToRgb = function(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r : parseInt(result[1], 16),
        g : parseInt(result[2], 16),
        b : parseInt(result[3], 16)
    } : false;
};

utils.options = function(opt, options) {
    opt.n = (( typeof options.badge) === 'number') ? Math.abs(options.badge | 0) : options.badge;
    opt.x = options.width * opt.x;
    opt.y = options.height * opt.y;
    opt.w = options.width * opt.w;
    opt.h = options.height * opt.h;
    opt.len = ("" + opt.n).length;

    return opt;
};
utils.merge = function(def, opt) {
    var mergedOpt = {};
    var attrname;
    for (attrname in def) {
        mergedOpt[attrname] = def[attrname];
    }
    for (attrname in opt) {
        mergedOpt[attrname] = opt[attrname];
    }
    return mergedOpt;
};

module.exports = utils;
