(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name cs-notify
     * @module cs-notify
     * @description
     *
     * # Installation
     *
     * First, include `cs-notify.js` in your HTML:
     * ```html
     * <script src="angular.js"></script>
     * <script src="cs-notify.js"></script>
     * ```
     *
     * CS-Notify can be installed from one of the following locations:
     *
     * * [Bower](http://bower.io)
     *      ___Will be documented once the first release is completed.___
     * * [NPM](http://npmjs.com)
     *      ___Will be documented once the first release is completed.___
     *
     * After installation, the module can be loaded into your application by indicating it is a dependent module:
     * ```js
     * angular.module('app', ['cs-notify']);
     * ```
     *
     * The CS-Notification directive and service are now ready to be used to help prevent annoying pop-ups and popovers
     * from hiding application content while still informing users of important status updates.
     *
     * # Usage
     *
     * The cs-notifications directive allows the specification of an icon-set to prepend to incoming notifications without
     * tying the user down to any one particular font or icon family.  The only restriction is that the icon set must
     * currently be an icon font such as [Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons) or
     * [Font Awesome](http://fontawesome.io).
     *
     * For detailed usage information on the {@link cs-notify.directive:cs-notifications cs-notifications} directive, please
     * see its specific documentation.
     */
    angular.module('cs-notify', [])
        /**
         * @ngdoc object
         * @name cs-notify.object:CS_NOTIFICATION_TYPE
         * @type {Object}
         *
         * @description
         * A basic enumeration object containing the different notifications which can be sent to the cs-notifications
         * directive:
         *   * csNotificationService.CS_NOTIFICATION_TYPE.ERROR:  Indicates an error notification is being sent
         *   * csNotificationService.CS_NOTIFICATION_TYPE.WARNING:  Indicates a warning notification is being sent
         *   * csNotificationService.CS_NOTIFICATION_TYPE.SUCCESS:  Indicates a success notification is being sent
         *   * csNotificationService.CS_NOTIFICATION_TYPE.INFO:  Indicates an info notification is being sent
         *   * csNotificationService.CS_NOTIFICATION_TYPE.ICONLESS:  Indicates an iconless notification is being sent
         *
         * @private
         */
        .value('CS_NOTIFICATION_TYPE', Object.freeze({
            ERROR: 'error',
            WARNING: 'warning',
            SUCCESS: 'success',
            INFO: 'info',
            ICONLESS: 'other'
        }))
        .factory('CSNotification', ['CS_NOTIFICATION_TYPE', function (CS_NOTIFICATION_TYPE) {
            /**
             * @ngdoc object
             * @name cs-notify.object:CSNotification
             * @param {Object} data A data object containing the type of notification (error, warning, success, info, other)
             *                      marked as true and the message for the notification.
             * @constructor
             * @classdesc The CSNotification class is responsible for passing information between services and
             *              controllers in the cs-notify module.
             */
            function CSNotification(data) {
                if (!data) {
                    data = {};
                }
                this[CS_NOTIFICATION_TYPE.ERROR] = data[CS_NOTIFICATION_TYPE.ERROR];
                this[CS_NOTIFICATION_TYPE.WARNING] = data[CS_NOTIFICATION_TYPE.WARNING];
                this[CS_NOTIFICATION_TYPE.SUCCESS] = data[CS_NOTIFICATION_TYPE.SUCCESS];
                this[CS_NOTIFICATION_TYPE.INFO] = data[CS_NOTIFICATION_TYPE.INFO];
                this[CS_NOTIFICATION_TYPE.ICONLESS] = data[CS_NOTIFICATION_TYPE.ICONLESS];
                this.message = data.message;
            }

            CSNotification.prototype.ellipsisLength = 43;
            /**
             * @ngdoc method
             * @name getShortMessage
             * @methodOf cs-notify.object:CSNotification
             * @returns {String} The short, possibly ellipsised, message for the notification
             */
            CSNotification.prototype.getShortMessage = function () {
                if (!this.message) {
                    return '';
                } else if (this.message.length > this.ellipsisLength) {
                    return this.message.substring(0, (this.ellipsisLength - 3)) + '...';
                } else {
                    return this.message;
                }
            };
            /**
             * @ngdoc method
             * @name getFullMessage
             * @methodOf cs-notify.object:CSNotification
             * @returns {String} The full, non-ellipsised, non-shortened message for the notification.
             */
            CSNotification.prototype.getFullMessage = function () {
                if (!this.message) {
                    return '';
                }
                return this.message;
            };

            return (CSNotification);
        }]);
}());

