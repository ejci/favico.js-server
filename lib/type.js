var utils = require('./utils');

/**
 * Badge types
 */
var type = {};

/**
 * Generate circle
 * @param {Object} opt Badge options
 */
type.circle = function(opt, options, context) {
	//console.log(opt,options);
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
    context.fillStyle = 'rgba(' + options.bgColor.r + ',' + options.bgColor.g + ',' + options.bgColor.b + ',' + ((options.bgColor.o!==undefined)?options.bgColor.o:opt.o) + ')';
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
    context.fillStyle = 'rgba(' + options.bgColor.r + ',' + options.bgColor.g + ',' + options.bgColor.b + ',' + ((options.bgColor.o!==undefined)?options.bgColor.o:opt.o) + ')';
    context.fillRect(opt.x, opt.y, opt.w, opt.h);
    context.fillStyle = 'rgba(' + options.textColor.r + ',' + options.textColor.g + ',' + options.textColor.b + ',' + opt.o + ')';
    if (( typeof opt.n) === 'number' && opt.n > 999) {
        context.fillText(((opt.n > 9999) ? 9 : Math.floor(opt.n / 1000) ) + 'k+', Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.2));
    } else {
        context.fillText(opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
    }
    context.closePath();
};

module.exports = type; 