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
                expect(serv.notifications).toBeDefined();
                expect(serv.notifications.length).toBe(0);
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
                expect(serv.notifications.length).toBe(0);
                serv.sendNotification(serv.NOTIFICATION_TYPE.ERROR, notificationMsg);
                rootScope.$apply();
                expect(serv.notifications.length).toBe(1);
                expect(serv.notifications).toEqual([{error: true, message: notificationMsg}]);
                serv.sendNotification(serv.NOTIFICATION_TYPE.SUCCESS, notificationMsg);
                rootScope.$apply();
                expect(serv.notifications.length).toBe(2);
                expect(serv.notifications).toEqual([{error: true, message: notificationMsg},
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
                expect(serv.notifications.length).toBe(10);
                expect(serv.notifications).toEqual([
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
                expect(serv.notifications.length).toBe(10);
                expect(serv.notifications).toEqual([
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
                expect(serv.notifications.length).toBe(10);
                expect(serv.notifications).toEqual([
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

