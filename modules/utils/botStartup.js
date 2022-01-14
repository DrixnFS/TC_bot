    'use strict';
    var fs = require('fs');
    console.log('=== Initial Application Setup ===');

    // create .env as copy of the .env-sample
    fs.createReadStream(`${process.env['PWD']}/private/lib/.conf-template`)
        .pipe(fs.createWriteStream('./.conf'));