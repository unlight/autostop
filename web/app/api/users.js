'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.create = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';

    user.save(function (err) {
        if (err) {
            res.json(err);
        }

        res.json(user.id);
    });
};