(function () {
    'use strict';

    exports.config = {
        seleniumServerJar: '../../node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',
        baseUrl: 'http://localhost:9000/test/html/',
        framework: 'jasmine2',
        capabilities: {
            browserName: 'chrome'
        },
        specs: ['specs/**/*.spec.js'],
        jasmineNodeOpts: {
            showColors: true
        }
    };
}());

