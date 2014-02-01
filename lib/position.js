var position = function(pos) {
    types = {};
    types.down = {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1
    };
    types.up = {
        x : 0.4,
        y : 0,
        w : 0.6,
        h : 0.6,
        o : 1
    };
    types.left = {
        x : 0,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1
    };
    types.leftUp = {
        x : 0,
        y : 0,
        w : 0.6,
        h : 0.6,
        o : 1
    };
    return types[pos];
};

module.exports = position; 