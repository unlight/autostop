'use strict';

var authWeb = require('./middlewares/authorization-web');

module.exports = function (app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    //Setting up the users api
    app.post('/users', users.create);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);


    app.post(apiUri('/users/signin'), function (req, res, next) {
        passport.authenticate('local', function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.jsonp(401, 'Login and password do not match.');
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.jsonp(user);
            });
        })(req, res, next);
    });


    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    var usersApi = require('../app/api/users');
    app.post(apiUri('/users'), usersApi.create);
    app.get(apiUri('/users'), usersApi.list);
    app.get(apiUri('/users/:userId'), usersApi.show);
    app.put(apiUri('/users/:userId'), auth.requiresLogin, auth.user.hasAuthorization, usersApi.update);

    //Article Routes
    var articles = require('../app/controllers/articles');
    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    //Finish with setting up the articleId param
    app.param('articleId', articles.article);

    var locationsApi = require('../app/api/locations');
    app.post(apiUri('/locations'), auth.requiresLogin, locationsApi.create);
    app.get(apiUri('/locations'), locationsApi.search);

    var routesApi = require('../app/api/routes');
    app.get(apiUri('/routes'), routesApi.search);
    app.post(apiUri('/routes'), auth.requiresLogin, routesApi.create);
    app.get(apiUri('/routes/:routeId'), routesApi.show);
    app.put(apiUri('/routes/:routeId'), auth.requiresLogin, auth.route.hasAuthorization, routesApi.update);
    app.del(apiUri('/routes/:routeId'), auth.requiresLogin, auth.route.hasAuthorization, routesApi.deactivate);
    app.param('routeId', routesApi.route);

    var tripsApi = require('../app/api/trips');
    app.get(apiUri('/trips'), tripsApi.search);
    app.post(apiUri('/trips'), auth.requiresLogin, tripsApi.create);
    app.get(apiUri('/trips/:tripId'), tripsApi.show);
    app.put(apiUri('/trips/:tripId'), auth.requiresLogin, auth.trip.hasAuthorization, tripsApi.update);
    app.del(apiUri('/trips/:tripId'), auth.requiresLogin, auth.trip.hasAuthorization, tripsApi.deactivate);
    app.post(apiUri('/trips/:tripId/join'), auth.requiresLogin, tripsApi.join);
    app.post(apiUri('/trips/:tripId/leave'), auth.requiresLogin, tripsApi.leave);
    app.get(apiUri('/trips/:tripId/passengers'), auth.requiresLogin, tripsApi.getPassengers);
    app.param('tripId', tripsApi.trip);
    
    //Home routes
    var index = require('../app/controllers/index');
    app.get(apiUri(), index.api);
    app.get('/', authWeb.requiresLogin, index.render);
};

function apiUri(uri) {
    return '/api' + (uri || '');
}
