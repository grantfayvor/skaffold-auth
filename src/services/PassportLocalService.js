import { UserService } from './UserService';

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    _fields = Symbol('fields'),
    _config = Symbol('config');

export class PassportLocalService {

    constructor(deserializer, options = {
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
        this[_deserializer] = deserializer;
        this[_config]();
    }

    [_config]() {
        let confirmUserDetails = this[_confirmUserDetails];
        let deserializer = this[_deserializer];
        this._passport.use(new LocalStrategy({
            usernameField: this[_fields].usernameField,
            passwordField: this[_fields].passwordField
        },
            function (username, password, done) {
                _userService.confirmUserDetails(username, password, done);
            }
        ));
        if (this._behaviour.session) {
            this._passport.serializeUser((user, done) => {
                done(null, user.id);
            });
            this._passport.deserializeUser((userId, done) => {
                _userService.findUserById(userId, user => {
                    done(null, user);
                });
            });
        }
    }

}