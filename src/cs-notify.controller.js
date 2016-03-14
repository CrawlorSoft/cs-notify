angular.module('cs-notify').controller('CSNotificationsController', [
    '$log', '$rootScope', '$timeout',
    function($log, $rootScope, $timeout) {
        $log.debug('Creating CSNotificationsController');
        window.rs = $rootScope;
        var self = this;

        self.newEventReceived = false;

        function Notification(data) {
            this.error = data.error;
            this.warning = data.warning;
            this.success = data.success;
            this.info = data.info;
            this.message = data.message;
        }
        Notification.prototype.getShortMessage = function() {
            if (!this.message) {
                return '';
            } else if (this.message.length > 43) {
                return this.message.substring(0, 40) + '...';
            } else {
                return this.message;
            }
        };
        Notification.prototype.getFullMessage = function() {
            if (!this.message) {
                return '';
            }
            return this.message;
        };
        self.recentNotifications = [new Notification({error: false, warning: false, success: false, info: false, message: ''})];

        self.mostRecent = function() {
            return self.recentNotifications[self.recentNotifications.length - 1];
        };

        self.receivedNewEvent = function() {
            return self.newEventReceived;
        };

        $rootScope.$on('new-notification', function(evt, evtData) {
            evt.stopPropagation();
            self.newEventReceived = false;
            self.recentNotifications.push(new Notification(evtData));
            self.newEventReceived = true;
            $timeout(function() { self.newEventReceived = false; }, 2500);
            $rootScope.$digest();
        });
    }
]);

