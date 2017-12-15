const UserService = require('../../../skaffold-ecommerce').UserService;

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    _fields = Symbol('fields'),
    _config = Symbol('config');

export class PassportLocalService {

    constructor(options = {
        fields: {
            usernameField: 'email',
            passwordField: 'password'
        }, behaviour: {
            successRedirect: '/',
            failureRedirect: '/login',
            session: true
        }
    }) {
        this._passport = passport;
        this[_fields] = options.fields;
        this._behaviour = options.behaviour;
        this._userService = new UserService();
        this[_config]();
    }

    [_config]() {
        let userService = this._userService;
        this._passport.use(new LocalStrategy({
            usernameField: this[_fields].usernameField,
            passwordField: this[_fields].passwordField
        },
            function (username, password, done) {
                userService.confirmUserDetails(username, password, done);
            }
        ));
        if (this._behaviour.session) {
            this._passport.serializeUser((user, done) => {
                done(null, user.id);
            });
            this._passport.deserializeUser((userId, done) => {
                userService.findUserById(userId, user => {
                    done(null, user);
                });
            });
        }
    }

}

const _passport = require('passport'),
_passportJWT = require('passport-jwt'),
ExtractJWT = _passportJWT.ExtractJwt,
JWTStrategy = _passportJWT.Strategy;

export class PassportJWTService {

constructor(confirmUserDetails, deserializer, options = {
    fields: {
        usernameField: 'email',
        passwordField: 'password'
    }, behaviour: {
        successRedirect: '/',
        failureRedirect: '/login',
        session: true,
        secretOrKey : 'secret'
    }
}) {
    this._passport = passport;
    this._fields = options.fields;
    this._behaviour = options.behaviour;
    this.confirmUserDetails = confirmUserDetails;
    this.deserializer = deserializer;
    this.config();
}

config() {
    let confirmUserDetails = this.confirmUserDetails;
    let deserializer = this.deserializer;
    this._passport.use(new JWTStrategy({
        secretOrKey: this._behaviour.secretOrKey,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: true
    }, function (payload, done) {
        confirmUserDetails(payload, done);
    }));
    if (this._behaviour.session) {
        this._passport.serializeUser((user, done) => {
            done(null, user.id);
        });
        this._passport.deserializeUser((userId, done) => {
            deserializer(userId, user => {
                done(null, user);
            });
        });
    }
}


}