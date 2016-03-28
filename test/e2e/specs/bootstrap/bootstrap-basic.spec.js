(function () {
    'use strict';
    describe('Basic Bootstrap Page Test', function () {
        var notificationTrigger, msgInput, typeSelection, notifyButton, csNotificationLine;
        beforeAll(function () {
            browser.get('/test/html/index-bootstrap.html');
            browser.waitForAngular();
        });
        beforeEach(function () {
            notificationTrigger = element(by.xpath('//div[@class="cs-status-area"]/label'));
            msgInput = element(by.name('evtMsg'));
            typeSelection = element(by.model('evt.type'));
            notifyButton = element(by.css('.btn-success'));
            csNotificationLine = element(by.css('cs-notifications'));
            msgInput.clear();
        });
        // Make sure we're on the right page
        describe('Layout', function () {
            it('should have the correct layout', function () {
                expect(element(by.css('h1')).getText()).toBe('CS-Notify Bootstrap Test Page');
            });
            it('should list the two default icon fonts', function () {
                var iconOptions = element.all(by.xpath('//select[@data-ng-model="evt.iconSet"]/option'));
                expect(iconOptions.count()).toBe(2);
                expect(iconOptions.get(0).getText()).toBe('Bootstrap Glyphicon');
                expect(iconOptions.get(1).getText()).toBe('Font Awesome');
            });
            it('should list the notification types', function () {
                var notificationTypes = element.all(by.xpath('//select[@data-ng-model="evt.type"]/option'));
                expect(notificationTypes.count()).toBe(5);
                expect(notificationTypes.get(0).getText()).toBe('Error');
                expect(notificationTypes.get(1).getText()).toBe('Warning');
                expect(notificationTypes.get(2).getText()).toBe('Success');
                expect(notificationTypes.get(3).getText()).toBe('Info');
                expect(notificationTypes.get(4).getText()).toBe('None');
            });
            it('should not have a notification initially', function () {
                expect(element(by.css('cs-notifications')).getText()).toBe('');
            });
        });
        describe('Notification Tray Empty', function () {
            it('should slide out even if no events have been received', function () {
                expect(notificationTrigger.isPresent()).toBe(true);
                notificationTrigger.click().then(function () {
                    expect(element(by.css('div[ng-if="csnctrl.displayAllEvents"]')).isPresent()).toBe(true);
                    expect(element(by.css('div[ng-if="!csnctrl.displayAllEvents"]')).isPresent()).toBe(false);
                    expect(element.all(by.repeater('notification in csnctrl.getInvertedNotifications()')).count())
                        .toBe(0);
                });
            });
            it("should close even if no events have been received", function () {
                notificationTrigger.click().then(function () {
                    expect(element(by.css('div[ng-if="csnctrl.displayAllEvents"]')).isPresent()).toBe(false);
                    expect(element(by.css('div[ng-if="!csnctrl.displayAllEvents"]')).isPresent()).toBe(true);
                });
            });
        });
        describe('Notification Sending And Initial Display', function () {
            it('should be possible to send an error notification', function () {
                msgInput.sendKeys('First Error');
                typeSelection.sendKeys('Error');
                notifyButton.click().then(function () {
                    expect(element(by.cssContainingText('.cs-error', 'First Error')).isPresent()).toBe(true);
                    expect(csNotificationLine.getText()).toEqual('First Error');
                });
            });
            it('should be possible to send a warning notification', function () {
                msgInput.sendKeys('First Warning');
                typeSelection.sendKeys('Warning');
                notifyButton.click().then(function () {
                    expect(element(by.cssContainingText('.cs-warning', 'First Warning')).isPresent()).toBe(true);
                    expect(csNotificationLine.getText()).toEqual('First Warning');
                });
            });
            it('should be possible to send a success notification', function () {
                msgInput.sendKeys('First Success');
                typeSelection.sendKeys('Success');
                notifyButton.click().then(function () {
                    expect(element(by.cssContainingText('.cs-success', 'First Success')).isPresent()).toBe(true);
                    expect(csNotificationLine.getText()).toEqual('First Success');
                });
            });
            it('should be possible to send a info notification', function () {
                msgInput.sendKeys('First Info');
                typeSelection.sendKeys('Info');
                notifyButton.click().then(function () {
                    expect(element(by.cssContainingText('.cs-info', 'First Info')).isPresent()).toBe(true);
                    expect(csNotificationLine.getText()).toEqual('First Info');
                });
            });
            it('should be possible to send a none notification', function () {
                msgInput.sendKeys('First None');
                typeSelection.sendKeys('None');
                notifyButton.click().then(function () {
                    expect(csNotificationLine.getText()).toEqual('First None');
                });
            });
        });
        describe('Notification Tray Non-Empty', function () {
            it('should slide out even if events have been received', function () {
                expect(notificationTrigger.isPresent()).toBe(true);
                notificationTrigger.click().then(function () {
                    expect(element(by.css('div[ng-if="csnctrl.displayAllEvents"]')).isPresent()).toBe(true);
                    expect(element(by.css('div[ng-if="!csnctrl.displayAllEvents"]')).isPresent()).toBe(false);
                    expect(element.all(by.repeater('notification in csnctrl.getInvertedNotifications()')).count())
                        .toBe(5);
                });
                // Intentionally do not close to verify new messages are automatically added.
            });
            it('should display the notifications in order from most recent to oldest', function () {
                var notifications = element.all(by.repeater('notification in csnctrl.getInvertedNotifications()'));
                expect(notifications.get(0).getText()).toBe('First None');
                expect(notifications.get(1).getText()).toBe('First Info');
                expect(notifications.get(2).getText()).toBe('First Success');
                expect(notifications.get(3).getText()).toBe('First Warning');
                expect(notifications.get(4).getText()).toBe('First Error');
            });
            it('should be able to hold at least 10 notifications', function () {
                msgInput.clear();
                msgInput.sendKeys('Second Error');
                typeSelection.sendKeys('Error');
                notifyButton.click();
                msgInput.clear();
                msgInput.sendKeys('Second Warning');
                typeSelection.sendKeys('Warning');
                notifyButton.click();
                msgInput.clear();
                msgInput.sendKeys('Second Success');
                typeSelection.sendKeys('Success');
                notifyButton.click();
                msgInput.clear();
                msgInput.sendKeys('Second Info');
                typeSelection.sendKeys('Info');
                notifyButton.click();
                msgInput.clear();
                msgInput.sendKeys('Second None');
                typeSelection.sendKeys('None');
                notifyButton.click();
                msgInput.clear();
                expect(notificationTrigger.isPresent()).toBe(true);
                var notificationRows = element.all(by.repeater('notification in csnctrl.getInvertedNotifications()'));
                expect(element(by.css('div[ng-if="csnctrl.displayAllEvents"]')).isPresent()).toBe(true);
                expect(element(by.css('div[ng-if="!csnctrl.displayAllEvents"]')).isPresent()).toBe(false);
                expect(notificationRows.count()).toBe(10);
                expect(element.all(by.css('div.cs-error')).count()).toBe(2);
                expect(element.all(by.css('div.cs-warning')).count()).toBe(2);
                expect(element.all(by.css('div.cs-success')).count()).toBe(2);
                expect(element.all(by.css('div.cs-info')).count()).toBe(2);
            });
            it('should not contain more than 10 notifications by default', function () {
                msgInput.clear();
                msgInput.sendKeys('Third Warning');
                typeSelection.sendKeys('Warning');
                notifyButton.click();
                var notificationRows = element.all(by.repeater('notification in csnctrl.getInvertedNotifications()'));
                expect(element(by.css('div[ng-if="csnctrl.displayAllEvents"]')).isPresent()).toBe(true);
                expect(element(by.css('div[ng-if="!csnctrl.displayAllEvents"]')).isPresent()).toBe(false);
                expect(notificationRows.count()).toBe(10);
                expect(element.all(by.css('div.cs-error')).count()).toBe(1);
                expect(element.all(by.css('div.cs-warning')).count()).toBe(3);
                expect(element.all(by.css('div.cs-success')).count()).toBe(2);
                expect(element.all(by.css('div.cs-info')).count()).toBe(2);
            });
            it("should close even if events have been received", function () {
                notificationTrigger.click().then(function () {
                    expect(element(by.css('div[ng-if="csnctrl.displayAllEvents"]')).isPresent()).toBe(false);
                    expect(element(by.css('div[ng-if="!csnctrl.displayAllEvents"]')).isPresent()).toBe(true);
                });
            });
        });
        describe('Ellipsis Testing', function () {
            var shortMsg = 'Test 123';
            var exactMsg = 'This is a 43 character message exactly!!!!!';
            var longMsg = 'This is a really really really really really long message that will be ellipsised';
            var longMsgWithEllipsis = 'This is a really really really really re...';

            it('should display the full message if it is less than 43 characters', function () {
                msgInput.sendKeys(shortMsg);
                notifyButton.click();
                expect(notificationTrigger.getText()).toBe(shortMsg);
            });
            it('should display the full message if it is exactly 43 characters', function () {
                msgInput.sendKeys(exactMsg);
                notifyButton.click();
                expect(notificationTrigger.getText()).toBe(exactMsg);
            });
            it('should display an ellipsised message if it is greater than 43 characters.', function () {
                msgInput.sendKeys(longMsg);
                notifyButton.click();
                expect(notificationTrigger.getText()).toBe(longMsgWithEllipsis);
            });
            it('should display the full message when the tray is opened', function () {
                notificationTrigger.click().then(function () {
                    var notifications = element.all(by.repeater('notification in csnctrl.getInvertedNotifications()'));
                    var mostRecent = notifications.first();
                    expect(mostRecent.getText()).toEqual(longMsg);
                });
            });
            it('should display the ellipsised message again if the tray is closed', function () {
                notificationTrigger.click().then(function () {
                    expect(notificationTrigger.getText()).toEqual(longMsgWithEllipsis);
                });
            });
        });
    });
}());

