(function() {
    'use strict';
    describe('Controller: CSNotificationsController', function () {
        beforeEach(module('cs-notify'));

        var ctrl, rootScope, scope;

        beforeEach(inject(function($controller, $rootScope) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            ctrl = $controller('CSNotificationsController', {$rootScope: rootScope, $scope: scope});
        }));

        describe('Initialization', function() {
            it('should have the correct controller functions and variables', function() {
                expect(ctrl.recentNotifications).toBeDefined();
                expect(ctrl.mostRecent).toBeDefined();
                expect(typeof ctrl.mostRecent).toBe('function');
                expect(ctrl.receivedNewEvent).toBeDefined();
                expect(typeof ctrl.receivedNewEvent).toBe('function');
            });
        });

        describe('Function: cs-notify-new-notification', function () {
            it('should create a new notification on an appropriate $emit', function() {
                rootScope.$emit('cs-notify-new-notification', {error: true, message: 'Short test message'});
                rootScope.$apply();
                expect(ctrl.recentNotifications.length).toBe(2);
            });
            it('should not create anything if an incorrect event is $emitted', function() {
                rootScope.$emit('new-not', {error: true, message: 'Short test message'});
                rootScope.$apply();
                expect(ctrl.recentNotifications.length).toBe(1);
            });
        });

        describe('Function: mostRecent()', function() {
            it('should retrieve the dummy Notification initially', function() {
                var notification = ctrl.mostRecent();
                expect(notification.error).toBe(false);
                expect(notification.warning).toBe(false);
                expect(notification.info).toBe(false);
                expect(notification.success).toBe(false);
                expect(notification.message).toBe('');
                expect(ctrl.receivedNewEvent()).toBe(false);
            });
            it('should retrieve the newest Notification after it is added', function() {
                rootScope.$emit('cs-notify-new-notification', {error: true, message: 'Short test message'});
                rootScope.$apply();
                var notification = ctrl.mostRecent();
                expect(notification.error).toBe(true);
                expect(notification.warning).toBeFalsy();
                expect(notification.info).toBeFalsy();
                expect(notification.success).toBeFalsy();
                expect(notification.message).toBe('Short test message');
                expect(ctrl.receivedNewEvent()).toBe(true);
            });
        });

        describe('Function: receivedNewEvent and Timeout', function() {
            it('should initially return false', function() {
                expect(ctrl.receivedNewEvent()).toBe(false);
            });
            it('should return true after a new Notification is added', function() {
                expect(ctrl.receivedNewEvent()).toBe(false);
                rootScope.$emit('cs-notify-new-notification', {error: true, message: 'Short test message'});
                rootScope.$apply();
                expect(ctrl.receivedNewEvent()).toBe(true);
            });
            it('should return true after a new Notification is added, false after a timeout',
                inject(function($timeout) {
                    expect(ctrl.receivedNewEvent()).toBe(false);
                    rootScope.$emit('cs-notify-new-notification', {error: true, message: 'Short test message'});
                    rootScope.$apply();
                    expect(ctrl.receivedNewEvent()).toBe(true);
                    $timeout.flush();
                    expect(ctrl.receivedNewEvent()).toBe(false);
                }));
        });

        describe('Function: Notification.getFullMessage()', function() {
            it('should return the empty string if the message is undefined', function() {
                rootScope.$emit('cs-notify-new-notification', {error: true});
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe('');
                // Ensure it doesn't affect the original message
                expect(noti.message).not.toBeDefined();
            });
            it('should return the empty string if the message is null', function() {
                rootScope.$emit('cs-notify-new-notification', {error: true, message: null});
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe('');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBeNull();
            });
            it('should return the exact message if it is less than 43 characters long.', function() {
                rootScope.$emit('cs-notify-new-notification', {error: true, message: 'Short test message'});
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe('Short test message');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe('Short test message');
            });
            it('should return the exact message if it is exactly 43 characters long.', function() {
                var evtData = {
                    error: true,
                    message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                };
                rootScope.$emit('cs-notify-new-notification', evtData);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe(evtData.message);
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(evtData.message);
            });
            it('should return the full message if it is exactly 44 characters long.', function() {
                var evtData = {
                    error: true,
                    message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                };
                rootScope.$emit('cs-notify-new-notification', evtData);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe(evtData.message);
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(evtData.message);
            });
            it('should return the full message if it is greater than 44 characters long.', function() {
                var evtData = {
                    error: true,
                    message: 'ababababababababababababababababababababababababab'
                };
                rootScope.$emit('cs-notify-new-notification', evtData);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe(evtData.message);
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(evtData.message);
            });
        });

        describe('Function:  Notification.getShortMessage()', function() {
            it('should return the empty string if the message is undefined', function() {
                rootScope.$emit('cs-notify-new-notification', {error: true});
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe('');
                // Ensure it doesn't affect the original message
                expect(noti.message).not.toBeDefined();
            });
            it('should return the empty string if the message is null', function() {
                rootScope.$emit('cs-notify-new-notification', {error: true, message: null});
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe('');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBeNull();
            });
            it('should return the exact message if it is less than 43 characters long.', function() {
                rootScope.$emit('cs-notify-new-notification', {error: true, message: 'Short test message'});
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe('Short test message');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe('Short test message');
            });
            it('should return the exact message if it is exactly 43 characters long.', function() {
                var evtData = {
                    error: true,
                    message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                };
                rootScope.$emit('cs-notify-new-notification', evtData);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe(evtData.message);
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(evtData.message);
            });
            it('should return the ellipsised message if it is exactly 44 characters long.', function() {
                var evtData = {
                    error: true,
                    message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                };
                rootScope.$emit('cs-notify-new-notification', evtData);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe(evtData.message.substring(0, 40) + '...');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(evtData.message);
            });
            it('should return the ellipsised message if it is greater than 44 characters long.', function() {
                var evtData = {
                    error: true,
                    message: 'ababababababababababababababababababababababababab'
                };
                rootScope.$emit('cs-notify-new-notification', evtData);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe(evtData.message.substring(0, 40) + '...');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(evtData.message);
            });
        });

        describe('Function: getIconType', function () {

            it('should return an empty string if no iconset has been specified regardless of notification type',
                function () {
                    delete scope.iconSet;
                    expect(ctrl.getIconType({error: true, message: 'doh'})).toBe('');
                    expect(ctrl.getIconType({warning: true, message: 'doh'})).toBe('');
                    expect(ctrl.getIconType({success: true, message: 'doh'})).toBe('');
                    expect(ctrl.getIconType({info: true, message: 'doh'})).toBe('');
                    expect(ctrl.getIconType({message: 'doh'})).toBe('');
                });
            describe('iconSet present in scope', function () {
                beforeEach(inject(function ($controller) {
                    scope.iconSet = {
                        classPrefix: 'glyphicon',
                        errorIcon: 'glyphicon-ban-circle',
                        warningIcon: 'glyphicon-warning-sign',
                        successIcon: 'glyphicon-ok-circle',
                        infoIcon: 'glyphicon-info-sign'
                    };
                    ctrl = $controller('CSNotificationsController', {$rootScope: rootScope, $scope: scope});
                }));
                it('should return the class prefix only if no notification type is present', function () {
                    expect(ctrl.getIconType({message: 'doh'})).toBe(scope.iconSet.classPrefix);
                });
                it('should return the class classPrefix plus error icon when error is true', function () {
                    expect(ctrl.getIconType({error: true, message: 'doh'}))
                        .toBe(scope.iconSet.classPrefix + ' ' + scope.iconSet.errorIcon);
                });
                it('should return the class classPrefix plus warning icon when warning is true', function () {
                    expect(ctrl.getIconType({warning: true, message: 'doh'}))
                        .toBe(scope.iconSet.classPrefix + ' ' + scope.iconSet.warningIcon);
                });
                it('should return the class classPrefix plus info icon when info is true', function () {
                    expect(ctrl.getIconType({info: true, message: 'doh'}))
                        .toBe(scope.iconSet.classPrefix + ' ' + scope.iconSet.infoIcon);
                });
                it('should return the class classPrefix plus success icon when success is true', function () {
                    expect(ctrl.getIconType({success: true, message: 'doh'}))
                        .toBe(scope.iconSet.classPrefix + ' ' + scope.iconSet.successIcon);
                });
            });
            describe('iconSet present in scope but missing icons', function () {
                beforeEach(inject(function ($controller) {
                    scope.iconSet = {
                        classPrefix: 'glyphicon'
                    };
                    ctrl = $controller('CSNotificationsController', {$rootScope: rootScope, $scope: scope});
                }));
                it('should return the class prefix only if no notification type is present', function () {
                    expect(ctrl.getIconType({message: 'doh'})).toBe(scope.iconSet.classPrefix);
                });
                it('should return the class classPrefix plus error icon when error is true', function () {
                    expect(ctrl.getIconType({error: true, message: 'doh'}))
                        .toBe(scope.iconSet.classPrefix);
                });
                it('should return the class classPrefix plus warning icon when warning is true', function () {
                    expect(ctrl.getIconType({warning: true, message: 'doh'}))
                        .toBe(scope.iconSet.classPrefix);
                });
                it('should return the class classPrefix plus info icon when info is true', function () {
                    expect(ctrl.getIconType({info: true, message: 'doh'}))
                        .toBe(scope.iconSet.classPrefix);
                });
                it('should return the class classPrefix plus success icon when success is true', function () {
                    expect(ctrl.getIconType({success: true, message: 'doh'}))
                        .toBe(scope.iconSet.classPrefix);
                });
            });
            describe('iconSet present in scope but missing classPrefix', function () {
                beforeEach(inject(function ($controller) {
                    scope.iconSet = {
                        errorIcon: 'glyphicon-ban-circle',
                        warningIcon: 'glyphicon-warning-sign',
                        successIcon: 'glyphicon-ok-circle',
                        infoIcon: 'glyphicon-info-sign'
                    };
                    ctrl = $controller('CSNotificationsController', {$rootScope: rootScope, $scope: scope});
                }));
                it('should return the class prefix only if no notification type is present', function () {
                    expect(ctrl.getIconType({message: 'doh'})).toBe('');
                });
                it('should return the class classPrefix plus error icon when error is true', function () {
                    expect(ctrl.getIconType({error: true, message: 'doh'}))
                        .toBe(scope.iconSet.errorIcon);
                });
                it('should return the class classPrefix plus warning icon when warning is true', function () {
                    expect(ctrl.getIconType({warning: true, message: 'doh'}))
                        .toBe(scope.iconSet.warningIcon);
                });
                it('should return the class classPrefix plus info icon when info is true', function () {
                    expect(ctrl.getIconType({info: true, message: 'doh'}))
                        .toBe(scope.iconSet.infoIcon);
                });
                it('should return the class classPrefix plus success icon when success is true', function () {
                    expect(ctrl.getIconType({success: true, message: 'doh'}))
                        .toBe(scope.iconSet.successIcon);
                });
            });
        });
    });
}());

