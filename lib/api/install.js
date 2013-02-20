// Load modules

var Hapi = require('hapi');
var Db = require('./db');
var Utils = require('./utils');


// Initialize database connection

Db.initialize(true, function (err) {

    if (err) {

        // Database connection failed

        Hapi.log.event('err', err);
        process.exit(1);
    }

    Hapi.log.event('info', 'Database initialized');

    // Create required clients

    var clients = [
        {
            name: 'postmile.web',
            scope: ['authorized', 'login', 'reminder', 'signup', 'tos'],
            secret: Utils.getRandomString(64)
        },
        {
            name: 'postmile.view',
            scope: []
        }
    ];

    Db.insert('client', clients, function (err, items) {

        if (err) {
            Hapi.log.event('err', err);
            process.exit(1);
        }

        // Add public invite to disable invitations

        Db.insert('invite', { code: 'public' }, function (err, items) {

            if (err) {
                Hapi.log.event('err', err);
                process.exit(1);
            }

            Hapi.log.event('info', 'Initial dataset created successfully');
            Hapi.log.event('info', '>>>>> WEB client id: ' + clients[0]._id);
            Hapi.log.event('info', '>>>>> WEB client secret: ' + clients[0].secret);
            Hapi.log.event('info', '>>>>> VIEW client id: ' + clients[1]._id);
            process.exit(0);
        });
    });
});

