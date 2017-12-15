# SKAFFOLD-AUTH

Skaffold-auth is the authentication plugin for a skaffolded application.

__STEPS TO INSTALL__

* run the command <code>npm install skaffold-auth</code> from your terminal.
* add the following code to your project <br>
<code>var PassportLocalService = require('skaffold-auth').AuthenticationService.PassportLocalService; <br>
var authenticationService = new PassportLocalService(); <br>
app.use(authenticationService._passport.initialize());
app.use(authenticationService._passport.session());<br></code>
* use the following code as a middleware in your routes <br>
<code>authenticationService._passport.authenticate('local', authenticationService._behaviour)<br></code>

<b> Voila your authentication has been plugged-in</b> Happy coding ;)