/**
 * @ngdoc directive
 * @name cs-notifications
 * @description
 * Creates a new cs-notifications area which will display the newest notification which has been received by the system.
 * This directive makes use of the CSNotificationsController in order to gather events and notifications for display
 * to the user.
 */
angular.module('cs-notify').directive('csNotifications', [
    '$log',
    function($log) {
        $log.debug('Creating Directive...');
        return {
            restrict:       'E',
            controller:     'CSNotificationsController',
            controllerAs:   'csnctrl',
            templateUrl:    'cs-notify-status.html'
        };
    }
]);
