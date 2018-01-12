const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , massive = require('massive')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0');
    require('dotenv').config();

    const app = express();
    app.use( bodyParser.json() );
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    }))
    app.use( passport.initialize() );
    app.use( passport.session() );

    massive(process.env.CONNECTION_STRING).then( db => {
        app.set('db', db);
    })

    passport.use(new Auth0Strategy ({  //105C
        domain: process.env.DOMAIN,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: 'openid profile'
    }, function(accesstoken, refreshtoken, extraParams, profile, done){
        let {displayName, user_id } = profile;
        const db = app.get('db')

        db.find_user([user_id]).then(function(users) { //70k
            if(!users[0]){
                db.create_user(
                    [user_id]
                ).then(user => {
                    return done( null, users[0].id)
                })
            } else {
                done(null, users[0].id)
            }
        })

        
    }));

    passport.serializeUser((id, done) =>{
        done(null, id);
    })

    passport.deserializeUser((id, done) => {
        app.get('db').find_session_user([id])
        .then(function(user) {
            return done(null, user[0])
        })
    })

    app.get('/auth', passport.authenticate('auth0'));
    app.get('/auth/callback', passport.authenticate('auth0', {
        successRedirect: 'http://localhost:3000/#private',
        failureRedirect: 'http://www.oprah.com'
    }))

    app.listen(process.env.PORT, () => {
        console.log(`heavy petting on port ${process.env.PORT}`)
    })