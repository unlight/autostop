'use strict';

exports.render = function(req, res) {
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};

exports.api = function(req, res) {
    res.end('Please refer to https://github.com/3dev/autostop/wiki for API documentation');
};