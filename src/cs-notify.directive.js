(function () {
    'use strict';
    angular.module('cs-notify')
        /**
         * @ngdoc directive
         * @name cs-notify.directive:cs-notifications
         * @restrict E
         * @scope
         * @param {number} [ellipsisLength] The length the string may be before it becomes shortened
         *                                  and has '...' appended.
         * @param {Object}  iconSet An Object containing the classPrefix and [(error)(warning)(success)(info)]Icon
         *                          values.
         *
         * @description
         * Creates a new cs-notifications area which will display the newest notification which has been received by the
         * system. This directive makes use of the CSNotificationsController in order to gather events and notifications
         * for display to the user.
         *
         * ## Basic Usage (Default Icon Sets)
         *
         * There are default icon set definitions provided by the cs-notifications-service for Bootstraps Glyphicons and
         * Font Awesome.  These can be used by setting a scope or controller variable to the desired icon set:
         *
         * <pre>
         *  angular.module('myApp', ['cs-notify'])
         *    .controller('SomeController', ['cs-notification-service',
         *      function(csns) {
         *        this.iconSet = csns.fontAwesomeIconSet;
         *        // or: this.iconSet = csns.bootstrapGlyphiconsIconSet;
         *        // other code as necessary
         *      }]);
         * </pre>
         *
         * and passing it into the cs-notifications directive as follows:
         * <pre>
         *
         *   <html>
         *       <body data-ng-app="myApp" data-ng-controller="SomeController as sc">
         *           <!-- Other views, etc. go here -->
         *          <div id="#footer">
         *              <cs-notifications data-icon-set="sc.iconSet"></cs-notifications>
         *          </div>
         *       </body>
         *   </html>
         *
         * </pre>
         *
         * ## Advanced Usage (Custom Icon Sets)
         *
         * If a custom icon set is desired, it can be defined with the following JSON object (on the scope or controller):
         *
         * <pre>
         *
         *  angular.module('myApp', ['cs-notify']).controller('SomeController', [
         *    '$scope',
         *    function($scope) {
         *      $scope.customIconSet = {
         *        classPrefix:  '<insert prefix here>', // e.g. 'fa fa-fw'.
         *        errorIcon:    '<insert error icon here>', // e.g. fa-times.
         *        warningIcon:  '<insert warning icon here>', // e.g. fa-exclamation.
         *        successIcon:  '<insert success icon here>', // e.g. fa-check.
         *        infoIcon:     '<insert success icon here>', // e.g. fa-info-circle.
         *      };
         *    }]);
         * </pre>
         *
         * and then passed into the cs-notifications directives `iconSet` attribute:
         *
         * <pre>
         *
         *   <html>
         *       <body data-ng-app="myApp" data-ng-controller="SomeController">
         *           <!-- data goes here -->
         *          <div id="#footer">
         *              <cs-notifications data-icon-set="customIconSet"></cs-notifications>
         *          </div>
         *       </body>
         *   </html>
         *
         * </pre>
         *
         * # Suggested Usage
         *
         * It is suggested that the `<cs-notifications>` tag be used in a sticky footer on the main page of the web
         * application to remain constantly visible to the user.
         */
        .directive('csNotifications', [
            function () {
                return {
                    restrict: 'E',
                    controller: 'CSNotificationsController',
                    controllerAs: 'csnctrl',
                    templateUrl: 'cs-notify-status.html',
                    scope: {
                        ellipsisLength: '@?',
                        iconSet: '='
                    }
                };
            }
        ]);
}());

