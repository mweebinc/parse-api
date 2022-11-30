const http = require("http");
const express = require("express");
const parse = require("parse-server");
const app = express();// express App

//mongodb url
const databaseUri = process.env.MONGO_URL || "mongodb://root:0afc0339de37260993c6df9320ca0756@localhost";
const port = process.env.PORT || 80;
const mountPath = process.env.PARSE_MOUNT || "/v1";
const serverUrl = "http://localhost:" + port + mountPath;

// parse API
const api = new parse.ParseServer({
    databaseURI: databaseUri,
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + "/cloud/main.js",
    appId: process.env.APP_ID || "e3af844bec24c1ad975700177b47993c",
    masterKey: process.env.MASTER_KEY || "491a423557ca662804cd734781f6fec6", //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || serverUrl, // Don"t forget to change to https if needed
    allowClientClassCreation: true, // Set to false to disable client class creation. Defaults to true.
    // account lockout policy setting (OPTIONAL) - defaults to undefined
    // if the account lockout policy is set and there are more than `threshold` number of failed login attempts then the `login` api call returns error code `Parse.Error.OBJECT_NOT_FOUND` with error message `Your account is locked due to multiple failed login attempts. Please try again after <duration> minute(s)`. After `duration` minutes of no login attempts, the application will allow the user to try login again.
    accountLockout: {
        duration: 5, // duration policy setting determines the number of minutes that a locked-out account remains locked out before automatically becoming unlocked. Set it to a value greater than 0 and less than 100000.
        threshold: 3 // threshold policy setting determines the number of failed sign-in attempts that will cause a user account to be locked. Set it to an integer value greater than 0 and less than 1000.
    },
    // optional settings to enforce password policies
    passwordPolicy: {
        doNotAllowUsername: true, // optional setting to disallow username in passwords
        resetTokenValidityDuration: 24 * 60 * 60 // optional setting to set a validity duration for password reset links (in seconds) expire after 24 hours
    },
    liveQuery: {
        classNames: ["Message", "Location", "Book", "UserDocument"] // List of classes to support live query subscriptions
    },
    verifyUserEmails: false,
    appName: "App",
});
app.use(mountPath, api);
const httpServer = http.createServer(app);
httpServer.listen(port, function () {
    console.log("parse-server running on port " + port + ".");
});
// This will enable the Live Query real-time server
parse.ParseServer.createLiveQueryServer(httpServer);