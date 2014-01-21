'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    ObjectId = mongoose.Types.ObjectId;

exports.create = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';

    user.save(function (err) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            return User.findById(user._id, function (err, user) {
                if (err) {
                    res.jsonp(500, err);
                }
                else {
                    res.jsonp(user);
                }
            });
        }
    });
};

exports.list = function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            res.jsonp(users);
        }
    });
};

exports.show = function (req, res) {
    User.findById(new ObjectId(req.params.userId), function (err, user) {
        if (err) {
            return res.jsonp(500, err);
        }

        return res.jsonp(user);
    });
};