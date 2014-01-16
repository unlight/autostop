'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    ObjectId = mongoose.Types.ObjectId;

exports.create = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';

    user.save(function (err) {
        if (err) {
            return res.json(err);
        }

        res.json(user.id);
    });
};

exports.list = function(req, res) {
    User.find({}, function (err, users) {
        if (err) {
            return res.json(err);
        }

        res.json(users);
    });
};

exports.show = function (req, res) {
    User.findById(new ObjectId(req.params.userId), function(err, user) {
        if (err) {
            res.status(500);
            return res.json(err);
        }

        return res.json(user);
    });
};