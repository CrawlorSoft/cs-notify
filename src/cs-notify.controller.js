angular.module('cs-notify').controller('CSNotificationsController', [
    '$log', '$rootScope', '$timeout', '$scope',
    function ($log, $rootScope, $timeout, $scope) {
        $log.debug('Creating CSNotificationsController');
        window.rs = $rootScope;
        var self = this;

        self.newEventReceived = false;

        try {
            $scope.ellipsisLength = $scope.ellipsisLength ? parseInt($scope.ellipsisLength) : 43;
        } catch (nfe) {
            $scope.ellipsisLength = 43;
        }

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
            } else if (this.message.length > $scope.ellipsisLength) {
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

        self.getIconType = function (notification) {
            var classString = '';
            if ($scope.iconSet) {
                classString = $scope.iconSet.classPrefix ? ($scope.iconSet.classPrefix + ' ') : '';
                if (notification.error) {
                    classString += $scope.iconSet.errorIcon ? $scope.iconSet.errorIcon : '';
                } else if (notification.warning) {
                    classString += $scope.iconSet.warningIcon ? $scope.iconSet.warningIcon : '';
                } else if (notification.success) {
                    classString += $scope.iconSet.successIcon ? $scope.iconSet.successIcon : '';
                } else if (notification.info) {
                    classString += $scope.iconSet.infoIcon ? $scope.iconSet.infoIcon : '';
                }
            }
            return classString.trim();
        };

        self.mostRecent = function() {
            return self.recentNotifications[self.recentNotifications.length - 1];
        };

        self.receivedNewEvent = function() {
            return self.newEventReceived;
        };

        $rootScope.$on('cs-notify-new-notification', function (evt, evtData) {
            evt.stopPropagation();
            self.newEventReceived = false;
            self.recentNotifications.push(new Notification(evtData));
            self.newEventReceived = true;
            $timeout(function() { self.newEventReceived = false; }, 2500);
        });
    }
]);

