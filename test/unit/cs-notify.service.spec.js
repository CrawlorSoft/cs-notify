(function () {
    'use strict';
    describe('Service: cs-notification-service', function () {
        var serv, scope, rootScope;

        beforeEach(module('cs-notify'));

        beforeEach(inject(function (_csNotificationService_, $rootScope) {
            serv = _csNotificationService_;
            scope = $rootScope.$new();
            rootScope = $rootScope;
        }));

        describe('Initialization', function () {
            it('should be defined and have the correct icon sets and notification types', function () {
                expect(serv).toBeDefined();
                expect(serv.fontAwesomeIconSet).toBeDefined();
                expect(serv.fontAwesomeIconSet.classPrefix).toBe('fa fa-fw');
                expect(serv.fontAwesomeIconSet.errorIcon).toBe('fa-exclamation-circle');
                expect(serv.fontAwesomeIconSet.warningIcon).toBe('fa-exclamation-triangle');
                expect(serv.fontAwesomeIconSet.successIcon).toBe('fa-check-circle');
                expect(serv.fontAwesomeIconSet.infoIcon).toBe('fa-info-circle');
                expect(Object.isFrozen(serv.fontAwesomeIconSet)).toBe(true);
                expect(serv.bootstrapGlyphiconIconSet).toBeDefined();
                expect(serv.bootstrapGlyphiconIconSet.classPrefix).toBe('glyphicon');
                expect(serv.bootstrapGlyphiconIconSet.errorIcon).toBe('glyphicon-ban-circle');
                expect(serv.bootstrapGlyphiconIconSet.warningIcon).toBe('glyphicon-warning-sign');
                expect(serv.bootstrapGlyphiconIconSet.successIcon).toBe('glyphicon-ok-circle');
                expect(serv.bootstrapGlyphiconIconSet.infoIcon).toBe('glyphicon-info-sign');
                expect(Object.isFrozen(serv.bootstrapGlyphiconIconSet)).toBe(true);
                expect(serv.NOTIFICATION_TYPE).toBeDefined();
                expect(Object.isFrozen(serv.NOTIFICATION_TYPE)).toBe(true);
                expect(serv.NOTIFICATION_TYPE.ERROR).toBe('error');
                expect(serv.NOTIFICATION_TYPE.SUCCESS).toBe('success');
                expect(serv.NOTIFICATION_TYPE.WARNING).toBe('warning');
                expect(serv.NOTIFICATION_TYPE.INFO).toBe('info');
                expect(serv.NOTIFICATION_TYPE.ICONLESS).toBe('other');
            });
            it('should have the correct methods', function () {
                expect(serv.sendNotification).toBeDefined();
                expect(typeof serv.sendNotification).toBe('function');
                expect(serv.createIconSetDefinition).toBeDefined();
                expect(typeof serv.createIconSetDefinition).toBe('function');
            });
        });

        describe('Function: sendNotification', function () {
            var listenerTriggered, eventType, eventData;
            var notificationMsg = 'Test Message';

            beforeEach(function () {
                rootScope.$on('cs-notify-new-notification', function (evt, evtData) {
                    listenerTriggered = true;
                    eventType = evt;
                    eventData = evtData;
                });
            });
            afterEach(function () {
                listenerTriggered = undefined;
                eventType = undefined;
                eventData = undefined;
            });
            it('should emit a cs-notify-new-notification event with the type error', function () {
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.error).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.success).not.toBeDefined();
                expect(eventData.warning).not.toBeDefined();
                expect(eventData.info).not.toBeDefined();
                expect(eventData.other).not.toBeDefined();
            });
            it('should emit a cs-notify-new-notification event with the type success', function () {
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.success).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.error).not.toBeDefined();
                expect(eventData.warning).not.toBeDefined();
                expect(eventData.info).not.toBeDefined();
                expect(eventData.other).not.toBeDefined();
            });
            it('should emit a cs-notify-new-notification event with the type warning', function () {
                serv.sendNotification(serv.NOTIFICATION_TYPE.WARNING, notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.warning).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.success).not.toBeDefined();
                expect(eventData.error).not.toBeDefined();
                expect(eventData.info).not.toBeDefined();
                expect(eventData.other).not.toBeDefined();
            });
            it('should emit a cs-notify-new-notification event with the type info', function () {
                serv.sendNotification(serv.NOTIFICATION_TYPE.INFO, notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.info).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.success).not.toBeDefined();
                expect(eventData.warning).not.toBeDefined();
                expect(eventData.error).not.toBeDefined();
                expect(eventData.other).not.toBeDefined();
            });
            it('should emit a cs-notify-new-notification event with the type other', function () {
                serv.sendNotification(serv.NOTIFICATION_TYPE.ICONLESS, notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.other).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.success).not.toBeDefined();
                expect(eventData.warning).not.toBeDefined();
                expect(eventData.info).not.toBeDefined();
                expect(eventData.error).not.toBeDefined();
            });
            it('should log each new notification to an internal log', function () {
                expect(serv.getNotifications().length).toBe(0);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                rootScope.$apply();
                expect(serv.getNotifications().length).toBe(1);
                expect(serv.getNotifications()).toEqual([{error: true, message: notificationMsg}]);
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                rootScope.$apply();
                expect(serv.getNotifications().length).toBe(2);
                expect(serv.getNotifications()).toEqual([{error: true, message: notificationMsg},
                    {success: true, message: notificationMsg}]);
            });
            it('should not trim the array with up to 10 logs by default', function () {
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.WARNING, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.INFO, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ICONLESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.WARNING, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.INFO, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ICONLESS, notificationMsg);
                expect(serv.getNotifications().length).toBe(10);
                expect(serv.getNotifications()).toEqual([
                    {error: true, message: notificationMsg},
                    {success: true, message: notificationMsg},
                    {warning: true, message: notificationMsg},
                    {info: true, message: notificationMsg},
                    {other: true, message: notificationMsg},
                    {error: true, message: notificationMsg},
                    {success: true, message: notificationMsg},
                    {warning: true, message: notificationMsg},
                    {info: true, message: notificationMsg},
                    {other: true, message: notificationMsg}
                ]);
            });
            it('should trim the array once the 11th log is added', function () {
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.WARNING, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.INFO, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ICONLESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.WARNING, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.INFO, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ICONLESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                expect(serv.getNotifications().length).toBe(10);
                expect(serv.getNotifications()).toEqual([
                    {success: true, message: notificationMsg},
                    {warning: true, message: notificationMsg},
                    {info: true, message: notificationMsg},
                    {other: true, message: notificationMsg},
                    {error: true, message: notificationMsg},
                    {success: true, message: notificationMsg},
                    {warning: true, message: notificationMsg},
                    {info: true, message: notificationMsg},
                    {other: true, message: notificationMsg},
                    {error: true, message: notificationMsg}
                ]);
            });
            it('should continue to trim the array as more are added', function () {
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.WARNING, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.INFO, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ICONLESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.WARNING, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.INFO, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ICONLESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.WARNING, notificationMsg);
                serv.sendNotification(serv.NOTIFICATION_TYPE.INFO, notificationMsg);
                expect(serv.getNotifications().length).toBe(10);
                expect(serv.getNotifications()).toEqual([
                    {other: true, message: notificationMsg},
                    {error: true, message: notificationMsg},
                    {success: true, message: notificationMsg},
                    {warning: true, message: notificationMsg},
                    {info: true, message: notificationMsg},
                    {other: true, message: notificationMsg},
                    {error: true, message: notificationMsg},
                    {success: true, message: notificationMsg},
                    {warning: true, message: notificationMsg},
                    {info: true, message: notificationMsg}
                ]);
            });
        });

        describe('Function: sendErrorNotification', function () {
            var listenerTriggered, eventType, eventData;
            var notificationMsg = 'Test Message';

            beforeEach(function () {
                rootScope.$on('cs-notify-new-notification', function (evt, evtData) {
                    listenerTriggered = true;
                    eventType = evt;
                    eventData = evtData;
                });
            });
            afterEach(function () {
                listenerTriggered = undefined;
                eventType = undefined;
                eventData = undefined;
            });
            it('should emit a cs-notify-new-notification event with the type error', function () {
                serv.sendErrorNotification(notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.error).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.success).not.toBeDefined();
                expect(eventData.warning).not.toBeDefined();
                expect(eventData.info).not.toBeDefined();
                expect(eventData.other).not.toBeDefined();
            });
            it('should continue to track and trim notification logs appropriately', function () {
                serv.sendErrorNotification(notificationMsg + 1);
                serv.sendErrorNotification(notificationMsg + 2);
                serv.sendErrorNotification(notificationMsg + 3);
                serv.sendErrorNotification(notificationMsg + 4);
                serv.sendErrorNotification(notificationMsg + 5);
                serv.sendErrorNotification(notificationMsg + 6);
                serv.sendErrorNotification(notificationMsg + 7);
                serv.sendErrorNotification(notificationMsg + 8);
                serv.sendErrorNotification(notificationMsg + 9);
                serv.sendErrorNotification(notificationMsg + 10);
                serv.sendErrorNotification(notificationMsg + 11);
                serv.sendErrorNotification(notificationMsg + 12);
                expect(serv.getNotifications()).toEqual([
                    {error: true, message: notificationMsg + 3},
                    {error: true, message: notificationMsg + 4},
                    {error: true, message: notificationMsg + 5},
                    {error: true, message: notificationMsg + 6},
                    {error: true, message: notificationMsg + 7},
                    {error: true, message: notificationMsg + 8},
                    {error: true, message: notificationMsg + 9},
                    {error: true, message: notificationMsg + 10},
                    {error: true, message: notificationMsg + 11},
                    {error: true, message: notificationMsg + 12}
                ]);
            });
        });


        describe('Function: sendSuccessNotification', function () {
            var listenerTriggered, eventType, eventData;
            var notificationMsg = 'Test Message';

            beforeEach(function () {
                rootScope.$on('cs-notify-new-notification', function (evt, evtData) {
                    listenerTriggered = true;
                    eventType = evt;
                    eventData = evtData;
                });
            });
            afterEach(function () {
                listenerTriggered = undefined;
                eventType = undefined;
                eventData = undefined;
            });
            it('should emit a cs-notify-new-notification event with the type error', function () {
                serv.sendSuccessNotification(notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.success).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.error).not.toBeDefined();
                expect(eventData.warning).not.toBeDefined();
                expect(eventData.info).not.toBeDefined();
                expect(eventData.other).not.toBeDefined();
            });
            it('should continue to track and trim notification logs appropriately', function () {
                serv.sendSuccessNotification(notificationMsg + 1);
                serv.sendSuccessNotification(notificationMsg + 2);
                serv.sendSuccessNotification(notificationMsg + 3);
                serv.sendSuccessNotification(notificationMsg + 4);
                serv.sendSuccessNotification(notificationMsg + 5);
                serv.sendSuccessNotification(notificationMsg + 6);
                serv.sendSuccessNotification(notificationMsg + 7);
                serv.sendSuccessNotification(notificationMsg + 8);
                serv.sendSuccessNotification(notificationMsg + 9);
                serv.sendSuccessNotification(notificationMsg + 10);
                serv.sendSuccessNotification(notificationMsg + 11);
                serv.sendSuccessNotification(notificationMsg + 12);
                expect(serv.getNotifications()).toEqual([
                    {success: true, message: notificationMsg + 3},
                    {success: true, message: notificationMsg + 4},
                    {success: true, message: notificationMsg + 5},
                    {success: true, message: notificationMsg + 6},
                    {success: true, message: notificationMsg + 7},
                    {success: true, message: notificationMsg + 8},
                    {success: true, message: notificationMsg + 9},
                    {success: true, message: notificationMsg + 10},
                    {success: true, message: notificationMsg + 11},
                    {success: true, message: notificationMsg + 12}
                ]);
            });
        });

        describe('Function: sendWarningNotification', function () {
            var listenerTriggered, eventType, eventData;
            var notificationMsg = 'Test Message';

            beforeEach(function () {
                rootScope.$on('cs-notify-new-notification', function (evt, evtData) {
                    listenerTriggered = true;
                    eventType = evt;
                    eventData = evtData;
                });
            });
            afterEach(function () {
                listenerTriggered = undefined;
                eventType = undefined;
                eventData = undefined;
            });
            it('should emit a cs-notify-new-notification event with the type error', function () {
                serv.sendWarningNotification(notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.warning).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.error).not.toBeDefined();
                expect(eventData.success).not.toBeDefined();
                expect(eventData.info).not.toBeDefined();
                expect(eventData.other).not.toBeDefined();
            });
            it('should continue to track and trim notification logs appropriately', function () {
                serv.sendWarningNotification(notificationMsg + 1);
                serv.sendWarningNotification(notificationMsg + 2);
                serv.sendWarningNotification(notificationMsg + 3);
                serv.sendWarningNotification(notificationMsg + 4);
                serv.sendWarningNotification(notificationMsg + 5);
                serv.sendWarningNotification(notificationMsg + 6);
                serv.sendWarningNotification(notificationMsg + 7);
                serv.sendWarningNotification(notificationMsg + 8);
                serv.sendWarningNotification(notificationMsg + 9);
                serv.sendWarningNotification(notificationMsg + 10);
                serv.sendWarningNotification(notificationMsg + 11);
                serv.sendWarningNotification(notificationMsg + 12);
                expect(serv.getNotifications()).toEqual([
                    {warning: true, message: notificationMsg + 3},
                    {warning: true, message: notificationMsg + 4},
                    {warning: true, message: notificationMsg + 5},
                    {warning: true, message: notificationMsg + 6},
                    {warning: true, message: notificationMsg + 7},
                    {warning: true, message: notificationMsg + 8},
                    {warning: true, message: notificationMsg + 9},
                    {warning: true, message: notificationMsg + 10},
                    {warning: true, message: notificationMsg + 11},
                    {warning: true, message: notificationMsg + 12}
                ]);
            });
        });

        describe('Function: sendinfoNotification', function () {
            var listenerTriggered, eventType, eventData;
            var notificationMsg = 'Test Message';

            beforeEach(function () {
                rootScope.$on('cs-notify-new-notification', function (evt, evtData) {
                    listenerTriggered = true;
                    eventType = evt;
                    eventData = evtData;
                });
            });
            afterEach(function () {
                listenerTriggered = undefined;
                eventType = undefined;
                eventData = undefined;
            });
            it('should emit a cs-notify-new-notification event with the type error', function () {
                serv.sendInfoNotification(notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.info).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.error).not.toBeDefined();
                expect(eventData.warning).not.toBeDefined();
                expect(eventData.success).not.toBeDefined();
                expect(eventData.other).not.toBeDefined();
            });
            it('should continue to track and trim notification logs appropriately', function () {
                serv.sendInfoNotification(notificationMsg + 1);
                serv.sendInfoNotification(notificationMsg + 2);
                serv.sendInfoNotification(notificationMsg + 3);
                serv.sendInfoNotification(notificationMsg + 4);
                serv.sendInfoNotification(notificationMsg + 5);
                serv.sendInfoNotification(notificationMsg + 6);
                serv.sendInfoNotification(notificationMsg + 7);
                serv.sendInfoNotification(notificationMsg + 8);
                serv.sendInfoNotification(notificationMsg + 9);
                serv.sendInfoNotification(notificationMsg + 10);
                serv.sendInfoNotification(notificationMsg + 11);
                serv.sendInfoNotification(notificationMsg + 12);
                expect(serv.getNotifications()).toEqual([
                    {info: true, message: notificationMsg + 3},
                    {info: true, message: notificationMsg + 4},
                    {info: true, message: notificationMsg + 5},
                    {info: true, message: notificationMsg + 6},
                    {info: true, message: notificationMsg + 7},
                    {info: true, message: notificationMsg + 8},
                    {info: true, message: notificationMsg + 9},
                    {info: true, message: notificationMsg + 10},
                    {info: true, message: notificationMsg + 11},
                    {info: true, message: notificationMsg + 12}
                ]);
            });
        });

        describe('Function: sendIconlessNotification', function () {
            var listenerTriggered, eventType, eventData;
            var notificationMsg = 'Test Message';

            beforeEach(function () {
                rootScope.$on('cs-notify-new-notification', function (evt, evtData) {
                    listenerTriggered = true;
                    eventType = evt;
                    eventData = evtData;
                });
            });
            afterEach(function () {
                listenerTriggered = undefined;
                eventType = undefined;
                eventData = undefined;
            });
            it('should emit a cs-notify-new-notification event with the type error', function () {
                serv.sendIconlessNotification(notificationMsg);
                rootScope.$apply();
                expect(listenerTriggered).toBe(true);
                expect(eventType).toBeDefined();
                expect(eventData).toBeDefined();
                expect(eventData.other).toBe(true);
                expect(eventData.message).toBe(notificationMsg);
                expect(eventData.error).not.toBeDefined();
                expect(eventData.warning).not.toBeDefined();
                expect(eventData.info).not.toBeDefined();
                expect(eventData.success).not.toBeDefined();
            });
            it('should continue to track and trim notification logs appropriately', function () {
                serv.sendIconlessNotification(notificationMsg + 1);
                serv.sendIconlessNotification(notificationMsg + 2);
                serv.sendIconlessNotification(notificationMsg + 3);
                serv.sendIconlessNotification(notificationMsg + 4);
                serv.sendIconlessNotification(notificationMsg + 5);
                serv.sendIconlessNotification(notificationMsg + 6);
                serv.sendIconlessNotification(notificationMsg + 7);
                serv.sendIconlessNotification(notificationMsg + 8);
                serv.sendIconlessNotification(notificationMsg + 9);
                serv.sendIconlessNotification(notificationMsg + 10);
                serv.sendIconlessNotification(notificationMsg + 11);
                serv.sendIconlessNotification(notificationMsg + 12);
                expect(serv.getNotifications()).toEqual([
                    {other: true, message: notificationMsg + 3},
                    {other: true, message: notificationMsg + 4},
                    {other: true, message: notificationMsg + 5},
                    {other: true, message: notificationMsg + 6},
                    {other: true, message: notificationMsg + 7},
                    {other: true, message: notificationMsg + 8},
                    {other: true, message: notificationMsg + 9},
                    {other: true, message: notificationMsg + 10},
                    {other: true, message: notificationMsg + 11},
                    {other: true, message: notificationMsg + 12}
                ]);
            });
        });

        describe('Function: changeNotificationMaximum', function () {
            var logServ;
            beforeEach(inject(function ($log) {
                logServ = $log;
                logServ.reset();
            }));
            it('should log an error message if max is less than 0', function () {
                serv.changeNotificationMaximum(-3);
                expect(logServ.error.logs.length).toBe(1);
                expect(logServ.error.logs[0].length).toBe(3);
                expect(logServ.error.logs[0]).toEqual(
                    ['cs-notify: new maximum notifications of', -3, ' is invalid, must be a positive integer.']);
                expect(serv.maxNotifications).toBe(10);
            });
            it('should log an error message if max is not an integer', function () {
                serv.changeNotificationMaximum('Bob');
                expect(logServ.error.logs.length).toBe(1);
                expect(logServ.error.logs[0].length).toBe(3);
                expect(logServ.error.logs[0]).toEqual(
                    ['cs-notify: new maximum notifications of', 'Bob', ' is invalid, must be a positive integer.']);
                expect(serv.maxNotifications).toBe(10);
            });
            it('should successfully change the maximum if max is 0 and retain no notifications', function () {
                serv.changeNotificationMaximum(0);
                logServ.assertEmpty();
                expect(serv.maxNotifications).toBe(0);
                serv.sendErrorNotification('test');
                expect(serv.getNotifications().length).toBe(0);
            });
            it('should successfully change the maximum if max is > 0 and retain that many notifications only',
                function () {
                    serv.changeNotificationMaximum(6);
                    serv.sendErrorNotification('test 1');
                    serv.sendErrorNotification('test 2');
                    serv.sendErrorNotification('test 3');
                    serv.sendErrorNotification('test 4');
                    serv.sendErrorNotification('test 5');
                    serv.sendErrorNotification('test 6');
                    expect(serv.getNotifications().length).toBe(6);
                    serv.sendErrorNotification('test 6');
                    expect(serv.getNotifications().length).toBe(6);
                });
            it('should not affect the log retention if the new maximum is greater than the number of notifications',
                function () {
                    serv.sendErrorNotification('test 1');
                    serv.sendErrorNotification('test 2');
                    serv.sendErrorNotification('test 3');
                    expect(serv.getNotifications().length).toBe(3);
                    serv.changeNotificationMaximum(6);
                    expect(serv.getNotifications().length).toBe(3);
                });
            it('should retain only the most recent maximum permitted notifications', function () {
                serv.sendErrorNotification('test 1');
                serv.sendErrorNotification('test 2');
                serv.sendErrorNotification('test 3');
                expect(serv.getNotifications().length).toBe(3);
                serv.changeNotificationMaximum(2);
                expect(serv.getNotifications().length).toBe(2);
                expect(serv.getNotifications()).toEqual(
                    [{error: true, message: 'test 2'}, {error: true, message: 'test 3'}]);
            });
            it('should not retrieve any notifications once they have been discarded on max change.', function () {
                serv.sendErrorNotification('test 1');
                serv.sendErrorNotification('test 2');
                serv.sendErrorNotification('test 3');
                expect(serv.getNotifications().length).toBe(3);
                serv.changeNotificationMaximum(1);
                serv.changeNotificationMaximum(2);
                expect(serv.getNotifications().length).toBe(1);
                expect(serv.getNotifications()).toEqual([{error: true, message: 'test 3'}]);
            });
        });

        describe('Function: getNotifications', function () {
            var notificationMessage = 'Message ';
            it('should return an empty array if no notifications have been sent', function () {
                expect(serv.getNotifications()).toEqual([]);
            });
            it('should not be possible to mutate the notification array from the copy', function () {
                var returnedNotifications = serv.getNotifications();
                returnedNotifications.push('blah');
                expect(serv.getNotifications()).toEqual([]);
            });
            it('should return the most recent notifications when the threshold has been passed', function () {
                var expResult = [
                    {warning: true, message: notificationMessage + 2},
                    {info: true, message: notificationMessage + 2},
                    {error: true, message: notificationMessage + 3},
                    {success: true, message: notificationMessage + 3},
                    {warning: true, message: notificationMessage + 3},
                    {info: true, message: notificationMessage + 3},
                    {error: true, message: notificationMessage + 4},
                    {success: true, message: notificationMessage + 4},
                    {warning: true, message: notificationMessage + 4},
                    {info: true, message: notificationMessage + 4}
                ];
                serv.sendErrorNotification(notificationMessage + 1);
                serv.sendSuccessNotification(notificationMessage + 1);
                serv.sendWarningNotification(notificationMessage + 1);
                serv.sendInfoNotification(notificationMessage + 1);
                serv.sendErrorNotification(notificationMessage + 2);
                serv.sendSuccessNotification(notificationMessage + 2);
                serv.sendWarningNotification(notificationMessage + 2);
                serv.sendInfoNotification(notificationMessage + 2);
                serv.sendErrorNotification(notificationMessage + 3);
                serv.sendSuccessNotification(notificationMessage + 3);
                serv.sendWarningNotification(notificationMessage + 3);
                serv.sendInfoNotification(notificationMessage + 3);
                serv.sendErrorNotification(notificationMessage + 4);
                serv.sendSuccessNotification(notificationMessage + 4);
                serv.sendWarningNotification(notificationMessage + 4);
                serv.sendInfoNotification(notificationMessage + 4);
                expect(serv.getNotifications()).toEqual(expResult);
            });
            it('should return the same information on two subsequent calls but not the same object', function () {
                serv.sendErrorNotification(notificationMessage + 1);
                serv.sendSuccessNotification(notificationMessage + 1);
                serv.sendWarningNotification(notificationMessage + 1);
                serv.sendInfoNotification(notificationMessage + 1);
                serv.sendErrorNotification(notificationMessage + 2);
                serv.sendSuccessNotification(notificationMessage + 2);
                serv.sendWarningNotification(notificationMessage + 2);
                serv.sendInfoNotification(notificationMessage + 2);
                serv.sendErrorNotification(notificationMessage + 3);
                serv.sendSuccessNotification(notificationMessage + 3);
                serv.sendWarningNotification(notificationMessage + 3);
                serv.sendInfoNotification(notificationMessage + 3);
                serv.sendErrorNotification(notificationMessage + 4);
                serv.sendSuccessNotification(notificationMessage + 4);
                serv.sendWarningNotification(notificationMessage + 4);
                serv.sendInfoNotification(notificationMessage + 4);
                expect(serv.getNotifications()).toEqual(serv.getNotifications());
                expect(serv.getNotifications()).not.toBe(serv.getNotifications());
            });
        });

        describe('Function:  clearNotifications', function () {
            var notificationMessage = 'Message ';
            it('should be able to clear notifications even if none have been received without error', function () {
                expect(serv.getNotifications()).toEqual([]);
                serv.clearNotifications();
                expect(serv.getNotifications()).toEqual([]);
            });
            it('should be able to clear notifications after any number have been received', function () {
                serv.sendErrorNotification(notificationMessage + 1);
                serv.sendSuccessNotification(notificationMessage + 1);
                serv.sendWarningNotification(notificationMessage + 1);
                serv.sendInfoNotification(notificationMessage + 1);
                serv.sendErrorNotification(notificationMessage + 2);
                serv.sendSuccessNotification(notificationMessage + 2);
                serv.sendWarningNotification(notificationMessage + 2);
                serv.sendInfoNotification(notificationMessage + 2);
                serv.sendErrorNotification(notificationMessage + 3);
                serv.sendSuccessNotification(notificationMessage + 3);
                serv.sendWarningNotification(notificationMessage + 3);
                serv.sendInfoNotification(notificationMessage + 3);
                serv.sendErrorNotification(notificationMessage + 4);
                serv.sendSuccessNotification(notificationMessage + 4);
                serv.sendWarningNotification(notificationMessage + 4);
                serv.sendInfoNotification(notificationMessage + 4);
                serv.clearNotifications();
                expect(serv.getNotifications()).toEqual([]);
            });
            it('should be possible to clear notifications multiple times in succession without a problem', function () {
                serv.sendErrorNotification(notificationMessage + 1);
                serv.sendSuccessNotification(notificationMessage + 1);
                serv.clearNotifications();
                serv.clearNotifications();
                serv.clearNotifications();
                serv.clearNotifications();
                serv.clearNotifications();
                expect(serv.getNotifications()).toEqual([]);
            });
        });

        describe('Function: createIconSetDefinition', function () {
            it('should return a frozen object with no values if called with no parameters', function () {
                var result = serv.createIconSetDefinition();
                expect(result).toBeDefined();
                expect(Object.isFrozen(result)).toBe(true);
                expect(result.classPrefix).not.toBeDefined();
                expect(result.errorIcon).not.toBeDefined();
                expect(result.warningIcon).not.toBeDefined();
                expect(result.successIcon).not.toBeDefined();
                expect(result.infoIcon).not.toBeDefined();
            });
            it('should return the correct frozen object', function () {
                var expectedIconSet = Object.freeze({
                    classPrefix: 'fa',
                    errorIcon: 'fa-stop-circle',
                    warningIcon: 'fa-asterisk',
                    successIcon: 'fa-beer',
                    infoIcon: 'fa-bolt'
                });
                var customFontAwesomeSet = serv.createIconSetDefinition('fa', 'fa-stop-circle',
                    'fa-asterisk', 'fa-beer', 'fa-bolt');
                expect(customFontAwesomeSet).toEqual(expectedIconSet);
                expect(Object.isFrozen(customFontAwesomeSet)).toBe(true);
            });
        });
    });
}());

