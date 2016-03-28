////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Compilation instructions for cs-status project for creating a reliable notification / status notification system   //
// in AngularJS.                                                                                                      //
//                                                                                                                    //
// Dan Taylor                                                                                                         //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function () {
    'use strict';
    var gulp = require('gulp');
    var del = require('del');
    var templ = require('gulp-ngtemplate');
    var htmlmin = require('gulp-htmlmin');
    var docs = require('gulp-ngdocs');
    var less = require('gulp-less');
    var Server = require('karma').Server;
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');
    var connect = require('gulp-connect');
    var protractor = require('gulp-protractor').protractor;
    var webserver = require('gulp-webserver');

    gulp.task('clean', function () {
        del(['dist/', '.tmp/', 'artifacts/']);
    });

    gulp.task('docs', function () {
        return gulp.src('./src/**/*.js')
            .pipe(docs.process({html5Mode: false}))
            .pipe(gulp.dest('./artifacts/docs'));
    });

    gulp.task('styles:dist', function () {
        return gulp.src('./src/*.less')
            .pipe(less())
            .pipe(gulp.dest('./dist/styles/'));
    });

    gulp.task('templates:dist', function () {
        gulp.src('src/**/*.html')
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(templ({module: 'cs-notify'}))
            .pipe(gulp.dest('.tmp/'));
    });

    gulp.task('test', function () {
        new Server({
            configFile: __dirname + '/test/unit/karma.conf.js',
            singleRun: true
        }).start();
    });

    var csNotifySrcs = [
        'src/cs-notify.module.js',
        'src/cs-notify.service.js',
        'src/cs-notify.controller.js',
        'src/cs-notify.directive.js',
        '.tmp/cs-notify-status.js'
    ];

    gulp.task('compile:norm', function () {
        return gulp.src(csNotifySrcs)
            .pipe(concat('cs-notify.js'))
            .pipe(gulp.dest('./dist'));
    });

    gulp.task('compile:min', function () {
        return gulp.src(csNotifySrcs)
            .pipe(uglify())
            .pipe(concat('cs-notify.min.js'))
            .pipe(gulp.dest('./dist'));
    });

    gulp.task('e2e', function () {
        gulp.src('./')
            .pipe(webserver({
                livereload: true,
                directoryListing: true,
                port: 9000
            }));
        gulp.src([])
            .pipe(protractor({
                configFile: 'test/e2e/protractor.conf.js',
                keepAlive: true
            }))
            .on('end', function () {
                connect.serverClose();
                process.exit();
            });
    });

    // Intentionally do not clean before a build
    gulp.task('default', ['templates:dist', 'styles:dist', 'docs', 'compile:norm', 'compile:min', 'test'], function () {
    });

}());

