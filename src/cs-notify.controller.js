angular.module('cs-notify').controller('CSNotificationsController', [
    '$rootScope', '$timeout', '$scope', 'csNotificationService',
    function ($rootScope, $timeout, $scope, csNotificationService) {
        window.rs = $rootScope;
        var self = this;

        self.newEventReceived = false;
        self.displayAllEvents = false;

        try {
            $scope.ellipsisLength = $scope.ellipsisLength ? parseInt($scope.ellipsisLength) : 43;
        } finally {
            if (isNaN($scope.ellipsisLength)) {
                $scope.ellipsisLength = 43;
            }
            csNotificationService.setEllipsisLength($scope.ellipsisLength);
        }

        self.recentNotifications = csNotificationService.getNotifications();
        self.invertedNotifications = csNotificationService.getNotifications().reverse();

        self.getIconType = function (notification) {
            var classString = '';
            if (notification && $scope.iconSet) {
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

        self.getInvertedNotifications = function () {
            return self.invertedNotifications;
        };

        $rootScope.$on('cs-notify-new-notification', function (evt) {
            evt.stopPropagation();
            self.newEventReceived = false;
            self.recentNotifications = csNotificationService.getNotifications();
            self.invertedNotifications = csNotificationService.getNotifications().reverse();
            self.newEventReceived = true;
            $timeout(function() { self.newEventReceived = false; }, 2500);
        });
    }
]);

