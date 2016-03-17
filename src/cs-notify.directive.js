angular.module('cs-notify')
    /**
     * @ngdoc directive
     * @name cs-notify.directive:cs-notifications
     * @description
     * Creates a new cs-notifications area which will display the newest notification which has been received by the system.
     * This directive makes use of the CSNotificationsController in order to gather events and notifications for display
     * to the user.
     *
     * @restrict E
     * @scope
     * @param {number} [ellipsisLength] The length the string may be before it becomes shortened and has '...' appended.
     * @param {Object}  iconSet An Object containing the classPrefix and [(error)(warning)(success)(info)]Icon values.
     */
    .directive('csNotifications', [
    '$log',
    function($log) {
        $log.debug('Creating Directive...');
        return {
            restrict:       'E',
            controller:     'CSNotificationsController',
            controllerAs:   'csnctrl',
            templateUrl: 'cs-notify-status.html',
            scope: {
                ellipsisLength: '@?',
                iconSet: '='
            },
            link: function (ele, attrs, extra) {
                $log.debug('cs-notifications attributes:  ', attrs);
                $log.debug('cs-notifications extra: ', extra);
            }
        };
    }
]);
