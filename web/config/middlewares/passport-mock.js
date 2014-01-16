var passport = require('passport'),
    StrategyMock = require('./strategy-mock'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    ObjectId = mongoose.Types.ObjectId;

passport.use(new StrategyMock({}, function (userId, callback) {
    if (userId) {
        User.findById(new ObjectId(userId), function (err, user) {
            if (!err && user) {
                callback(null, user);
            }
            else {
                callback(null, false);
            }
        });
    }
    else {
        callback(null, false);
    }
}));

exports.authenticate = function (req, res, next) {
    passport.authenticate('mock', { session: false })(req, res, next);
};