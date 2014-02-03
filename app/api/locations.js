'use strict';

var mongoose = require('mongoose'),
    Location = mongoose.model('Location');

exports.create = function (req, res) {
    var location = new Location(req.body);
    location.creator = req.user._id;

    location.save(function (err, location) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            Location.load(location._id, function (err, location) {
                if (err) {
                    res.jsonp(500, err);
                }
                else {
                    res.jsonp(location);
                }
            });
        }
    });
};

exports.search = function (req, res) {
    Location.search(req.query, function (err, locations) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            res.jsonp(locations);
        }
    });
};