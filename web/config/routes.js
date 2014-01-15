'use strict';

module.exports = function(app, passport, auth) {
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

    //Article Routes
    var articles = require('../app/controllers/articles');
    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    //Finish with setting up the articleId param
    app.param('articleId', articles.article);

    //Route Routes
    var routes = require('../app/controllers/routes');
    app.get(apiUri('/routes'), routes.search);
    app.post(apiUri('/routes'), auth.requiresLogin, routes.create);
    app.get(apiUri('/routes/:routeId'), routes.show);
    app.put(apiUri('/routes/:routeId'), auth.requiresLogin, auth.route.hasAuthorization, routes.update);
    app.del(apiUri('/routes/:routeId'), auth.requiresLogin, auth.route.hasAuthorization, routes.deactivate);
    app.param('routeId', routes.route);

    var trips = require('../app/controllers/trips');
    app.get(apiUri('/trips'), trips.search);
    app.post(apiUri('/trips'), auth.requiresLogin, trips.create);
    app.get(apiUri('/trips/:tripId'), trips.show);
    app.put(apiUri('/trips/:tripId'), auth.requiresLogin, auth.trip.hasAuthorization, trips.update);
    app.post(apiUri('/trips/:tripId/cancel'), auth.requiresLogin, auth.trip.hasAuthorization, trips.deactivate);
    app.post(apiUri('/trips/:tripId/join'), auth.requiresLogin, trips.join);
    app.post(apiUri('/trips/:tripId/leave'), auth.requiresLogin, trips.leave);
    app.param('tripId', trips.trip);

    //Home routes
    var index = require('../app/controllers/index');
    app.get(apiUri(), index.api);
    app.get('/', index.render);
};

function apiUri(uri) {
    return '/api' + (uri || '');
}
