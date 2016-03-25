(function() {
    'use strict';
    describe('Controller: CSNotificationsController', function () {
        beforeEach(module('cs-notify'));

        var ctrl, rootScope, scope, csns;

        beforeEach(inject(function ($controller, $rootScope, _csNotificationService_) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            csns = _csNotificationService_;
            ctrl = $controller('CSNotificationsController',
                {$rootScope: rootScope, $scope: scope, csNotificationService: csns});
        }));

        describe('Initialization', function() {
            it('should have the correct controller functions and variables', function() {
                expect(ctrl.recentNotifications).toBeDefined();
                expect(ctrl.invertedNotifications).toBeDefined();
                expect(ctrl.mostRecent).toBeDefined();
                expect(typeof ctrl.mostRecent).toBe('function');
                expect(ctrl.receivedNewEvent).toBeDefined();
                expect(typeof ctrl.receivedNewEvent).toBe('function');
                expect(scope.ellipsisLength).toBe(43);
            });
            it('should initialize the ellipsisLength to the correct value', inject(function ($controller) {
                scope.ellipsisLength = '5';
                $controller('CSNotificationsController', {$rootScope: rootScope, $scope: scope});
                expect(scope.ellipsisLength).toBe(5);
                scope.ellipsisLength = 95;
                $controller('CSNotificationsController', {$rootScope: rootScope, $scope: scope});
                expect(scope.ellipsisLength).toBe(95);
            }));
            it('should initialize the ellipsisLength to the default value if a non-numeric value is present',
                inject(function ($controller) {
                    scope.ellipsisLength = 'incorrect value';
                    $controller('CSNotificationsController', {$rootScope: rootScope, $scope: scope});
                    expect(scope.ellipsisLength).toBe(43);
                }));
        });

        describe('Function: cs-notify-new-notification', function () {
            it('should create a new notification on an appropriate $emit', function() {
                csns.sendErrorNotification('Short test message');
                rootScope.$apply();
                expect(ctrl.recentNotifications.length).toBe(1);
            });
            it('should not create anything if an incorrect event is $emitted', function() {
                rootScope.$emit('new-not', {error: true, message: 'Short test message'});
                rootScope.$apply();
                expect(ctrl.recentNotifications.length).toBe(0);
            });
        });

        describe('Function: mostRecent()', function() {
            it('should retrieve the dummy Notification initially', function() {
                var notification = ctrl.mostRecent();
                expect(notification).not.toBeDefined();
                expect(ctrl.receivedNewEvent()).toBe(false);
            });
            it('should retrieve the newest Notification after it is added', function() {
                csns.sendErrorNotification('Short test message');
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
                csns.sendErrorNotification();
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe('');
                // Ensure it doesn't affect the original message
                expect(noti.message).not.toBeDefined();
            });
            it('should return the empty string if the message is null', function() {
                csns.sendErrorNotification(null);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe('');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBeNull();
            });
            it('should return the exact message if it is less than 43 characters long.', function() {
                csns.sendErrorNotification('Short test message');
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe('Short test message');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe('Short test message');
            });
            it('should return the exact message if it is exactly 43 characters long.', function() {
                var message = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                csns.sendErrorNotification(message);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe(message);
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(message);
            });
            it('should return the full message if it is exactly 44 characters long.', function() {
                var message = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                csns.sendErrorNotification(message);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe(message);
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(message);
            });
            it('should return the full message if it is greater than 44 characters long.', function() {
                var message = 'ababababababababababababababababababababababababab';
                csns.sendErrorNotification(message);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getFullMessage()).toBe(message);
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(message);
            });
        });

        describe('Function:  Notification.getShortMessage()', function() {
            it('should return the empty string if the message is undefined', function() {
                csns.sendErrorNotification();
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe('');
                // Ensure it doesn't affect the original message
                expect(noti.message).not.toBeDefined();
            });
            it('should return the empty string if the message is null', function() {
                csns.sendErrorNotification(null);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe('');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBeNull();
            });
            it('should return the exact message if it is less than 43 characters long.', function() {
                var message = 'Short test message';
                csns.sendErrorNotification(message);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe(message);
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(message);
            });
            it('should return the exact message if it is exactly 43 characters long.', function() {
                var message = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                csns.sendErrorNotification(message);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe(message);
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(message);
            });
            it('should return the ellipsised message if it is exactly 44 characters long.', function() {
                var message = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                csns.sendErrorNotification(message);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe(message.substring(0, 40) + '...');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(message);
            });
            it('should return the ellipsised message if it is greater than 44 characters long.', function() {
                var message = 'ababababababababababababababababababababababababab';
                csns.sendErrorNotification(message);
                rootScope.$apply();
                var noti = ctrl.mostRecent();
                expect(noti.getShortMessage()).toBe(message.substring(0, 40) + '...');
                // Ensure it doesn't affect the original message
                expect(noti.message).toBe(message);
            });
        });

        describe('Function: getInvertedNotifications', function () {
            it('should return the notifications array initially', function () {
                // Default notifications array contains an empty notification
                expect(ctrl.recentNotifications).toEqual(ctrl.getInvertedNotifications());
            });
            it('should return the inverted notifications array after a few events are received', function () {
                var message = 'ababababababababababababababababababababababababab',
                    message1 = 'abc';
                csns.sendErrorNotification(message);
                rootScope.$apply();
                csns.sendSuccessNotification(message1);
                rootScope.$apply();
                expect(ctrl.getInvertedNotifications()).not.toEqual(ctrl.recentNotifications);
                expect(ctrl.getInvertedNotifications()[0]).toEqual(ctrl.mostRecent());
                expect(ctrl.getInvertedNotifications()[0].success).toBe(true);
                expect(ctrl.getInvertedNotifications()[1].error).toBe(true);
                expect(ctrl.getInvertedNotifications()).toEqual(ctrl.recentNotifications.reverse());
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

