(function () {
    'use strict';

angular.module('cs-notify')
    /**
     * @ngdoc service
     * @name cs-notify.service:csNotificationService
     * @description
     *
     * The `csNotificationService` provides:
     *   * Event notification methods for error, warning, success and info messages; and
     *   * Event notification methods for messages which are not prefixed by an icon; and
     *   * A custom icon set creation method; and
     *   * A default log of the last ten (10) notification messages of any type; and
     *   * The ability to adjust the number of messages held in memory to be more or less than 10; and
     *   * The ability to retrieve the last _x_ messages; and
     *   * The ability to clear the message list; and
     *   * A default [Font Awesome](http://fontawesome.io) icon set definition; and
     *   * A default [Bootstrap Glyphicon](http://getbootstrap.com/components/#glyphicons) icon set definition.
     *
     * @param {Object} $rootScope The rootScope to use to emit notification messages.
     * @param {Object} $log The log object to use in the case of errors.
     */
    .factory('csNotificationService', [
        '$rootScope', '$log', 'CSNotification', 'CS_NOTIFICATION_TYPE',
        function ($rootScope, $log, CSNotification, CS_NOTIFICATION_TYPE) {
            var serv = {};

            var notifications = [];

            function sliceNotifications() {
                var start = notifications.length - serv.maxNotifications;
                var end = notifications.length + 1;
                notifications = notifications.slice(start, end);
            }

            /**
             * @ngdoc property
             * @name maxNotifications
             * @propertyOf cs-notify.service:csNotificationService
             * @type {number}
             * @description
             * The maximum number of notifications which will be retained before the oldest notification is permanently
             * discarded.
             */
            serv.maxNotifications = 10;
            /**
             * @ngdoc property
             * @name DEFAULT_ELLIPSIS_PT
             * @propertyOf cs-notify.service:csNotificationService
             * @type {number}
             * @description
             * The default string length (43 characters) before the string will be shortened and have `...` appended in a
             * notification short message.
             */
            serv.DEFAULT_ELLIPSIS_PT = 43;
            /**
             * @ngdoc property
             * @name ellipsisLength
             * @propertyOf cs-notify.service:csNotificationService
             * @type {number}
             * @description
             * The current string length after which the string will be shortened and have `...` appended in a notification
             * short message.  This value ***MUST NOT*** be < 3.
             */
            serv.ellipsisLength = serv.DEFAULT_ELLIPSIS_PT;

            /**
             * @ngdoc method
             * @name changeNotificationMaximum
             * @methodOf cs-notify.service:csNotificationService
             * @param {number} max The maximum number of notifications the `csNotificationService` should retain in memory
             * at any given point.
             * @description
             * Adjusts the maximum number of notification events which should be retained in memory at any given point to
             * any value between 0 and infinity.
             *
             * If the maximum chosen is less than the current number of retained notifications, the excess notifications
             * will be immediately removed from the queue in a First In First Out (FIFO) order with no way to retrieve the
             * messages in the future, even if the maximum is increased immediately to its previous value or higher.
             *
             * If the maximum chosen is greater than or equal to the current number of retained notifications, no
             * notifications will be lost until the new threshold is passed.
             */
            serv.changeNotificationMaximum = function (max) {
                var newMax = parseInt(max);
                if (isNaN(newMax) || newMax < 0) {
                    $log.warn('cs-notify: new maximum notifications of', max, ' is invalid, must be a positive integer.');
                    return;
                }

                serv.maxNotifications = newMax;
                if (notifications.length > serv.maxNotifications) {
                    sliceNotifications();
                }
            };

            /**
             * @ngdoc method
             * @name clearNotifications
             * @methodOf cs-notify.service:csNotificationService
             * @description
             * Permanently clears any notifications which have been generated / emitted by this service with no chance of
             * retrieval.
             */
            serv.clearNotifications = function () {
                notifications = [];
            };

            /**
             * @ngdoc method
             * @name getNotifications
             * @methodOf cs-notify.service:csNotificationService
             * @returns {Array} An array of the last _x_ notification objects.
             * @description
             * Returns a copy of the last _maxNotifications_ notification objects which have been sent by the
             * `csNotificationService`.  If _maxNotifications_ was recently adjusted to a higher value, any notifications
             * which were rotated out before the increase in the notification limit will not be reported and are lost
             * permanently.
             */
            serv.getNotifications = function () {
                if (!notifications) {
                    notifications = [];
                }
                return angular.copy(notifications);
            };

            /**
             * @ngdoc method
             * @name sendNotification
             * @methodOf cs-notify.service:csNotificationService
             * @param {CS_NOTIFICATION_TYPE} notificationType The type of notification to send.
             * @param {string} msg The message to send to the cs-notifications directive.
             * @description
             * Emits a `cs-notify-new-notification` message to all registered listeners on the rootScope and then appends
             * the new notification data to the notification log.
             *
             * If there are more than the permitted number of notifications in the notification log, the first _x_ necessary
             * to bring the total number to the maximum permitted are removed.
             */
            serv.sendNotification = function (notificationType, msg) {
                var evtData = {message: msg};
                evtData[notificationType] = true;
                var notification = new CSNotification(evtData);
                notifications.push(notification);
                if (notifications.length > serv.maxNotifications) {
                    sliceNotifications();
                }
                $rootScope.$emit('cs-notify-new-notification', notification);
            };

            /**
             * @ngdoc method
             * @name sendErrorNotification
             * @methodOf cs-notify.service:csNotificationService
             * @param {string} msg  The message to send as an error notification.
             * @description
             * A basic helper method to send the provided message as an error notification.
             *
             * See sendNotification for more information.
             */
            serv.sendErrorNotification = function (msg) {
                serv.sendNotification(CS_NOTIFICATION_TYPE.ERROR, msg);
            };

            /**
             * @ngdoc method
             * @name sendWarningNotification
             * @methodOf cs-notify.service:csNotificationService
             * @param {string} msg  The message to send as an warning notification.
             * @description
             * A basic helper method to send the provided message as a warning notification.
             *
             * See sendNotification for more information.
             */
            serv.sendWarningNotification = function (msg) {
                serv.sendNotification(CS_NOTIFICATION_TYPE.WARNING, msg);
            };

            /**
             * @ngdoc method
             * @name sendSuccessNotification
             * @methodOf cs-notify.service:csNotificationService
             * @param {string} msg  The message to send as an success notification.
             * @description
             * A basic helper method to send the provided message as a success notification.
             *
             * See sendNotification for more information.
             */
            serv.sendSuccessNotification = function (msg) {
                serv.sendNotification(CS_NOTIFICATION_TYPE.SUCCESS, msg);
            };

            /**
             * @ngdoc method
             * @name sendInfoNotification
             * @methodOf cs-notify.service:csNotificationService
             * @param {string} msg  The message to send as an info notification.
             * @description
             * A basic helper method to send the provided message as an info notification.
             *
             * See sendNotification for more information.
             */
            serv.sendInfoNotification = function (msg) {
                serv.sendNotification(CS_NOTIFICATION_TYPE.INFO, msg);
            };

            /**
             * @ngdoc method
             * @name sendIconlessNotification
             * @methodOf cs-notify.service:csNotificationService
             * @param {string} msg  The message to send as an iconless notification.
             * @description
             * A basic helper method to send the provided message as an iconless notification.
             *
             * See sendNotification for more information.
             */
            serv.sendIconlessNotification = function (msg) {
                serv.sendNotification(CS_NOTIFICATION_TYPE.ICONLESS, msg);
            };

            /**
             * @ngdoc method
             * @name createIconSetDefinition
             * @methodOf cs-notify.service:csNotificationService
             * @param {string} [prefix] The CSS class prefix required to use the icons (e.g. `glyphicon` or `fa fa-fw`).
             * @param {string} [errorIcon] The full name of the error icon (e.g. `fa-exclamation-circle`)
             * @param {string} [warningIcon] The full name of the warning icon (e.g. `fa-exclamation-triangle`)
             * @param {string} [successIcon] The full name of the success icon (e.g. `fa-check-circle`)
             * @param {string} [infoIcon] The full name of the info icon (e.g. `fa-info-circle`)
             *
             * @description
             * Creates a new icon set definition which can then be passed in to the
             * {@link cs-notify.directive:cs-notifications cs-notifications} directive to display custom icons inside the
             * status area.
             *
             * The object returned will be frozen and contain the provided classPrefix and icon values, or they will be
             * undefined depending if no value is passed into the function.
             *
             * # Usage
             *
             * ## An Empty Icon Set
             * To create an empty icon set (e.g. no icon will ever be displayed with a message):
             *
             * <pre>
             *   var emptyIconSet = csNotificationService.createIconSetDefinition();
             *   // emptyIconSet will be the equivalent of:  Object.freeze({});
             * </pre>
             *
             * ## A Customized Font Awesome Icon Set
             *
             * To create a customized font-awesome icon set without fixed width icons and the following icons:
             *   * **Error Icon**: Stop icon in a solid circle (e.g. the old VCR stop symbol)
             *   * **Warning Icon**: An asterisk
             *   * **Success Icon**: A beer (because everyone drinks beer on success)
             *   * **Info Icon**: A lightning bolt
             *
             * the following call would accomplish this:
             *
             * <pre>
             *   var customFontAwesomeSet = csNotificationService.createIconSetDefinition('fa', 'fa-stop-circle', 'fa-asterisk', 'fa-beer', 'fa-bolt');
             * </pre>
             */
            serv.createIconSetDefinition = function (prefix, errorIcon, warningIcon, successIcon, infoIcon) {
                return Object.freeze({
                    classPrefix: prefix,
                    errorIcon: errorIcon,
                    warningIcon: warningIcon,
                    successIcon: successIcon,
                    infoIcon: infoIcon
                });
            };

            // Icon sets
            /**
             * @ngdoc property
             * @name fontAwesomeIconSet
             * @propertyOf cs-notify.service:csNotificationService
             * @description
             * The default font-awesome icon set which is set to use the Font Awesome fixed width icons, with the following
             * icon definitions:
             *   * **errorIcon**: [fa-exclamation-circle](http://fontawesome.io/icon/exclamation-circle/)
             *   * **warningIcon**: [fa-exclamation-triangle](http://fontawesome.io/icon/exclamation-triangle/)
             *   * **successIcon**: [fa-check-circle](http://fontawesome.io/icon/check-circle/)
             *   * **infoIcon**: [fa-info-circle](http://fontawesome.io/icon/info-circle/)
             *
             * @type {{classPrefix: string, errorIcon: string, warningIcon: string, successIcon: string, infoIcon: string}}
             */
            serv.fontAwesomeIconSet = serv.createIconSetDefinition('fa fa-fw', 'fa-exclamation-circle',
                'fa-exclamation-triangle', 'fa-check-circle', 'fa-info-circle');

            /**
             * @ngdoc property
             * @name bootstrapGlyphiconIconSet
             * @propertyOf cs-notify.service:csNotificationService
             * @description
             * The default bootstrap glyphicon icon set which is set to use the Bootstrap specific glyphicons, with the
             * following icon definitions:
             *   * **errorIcon**: glyphicon-ban-circle
             *   * **warningIcon**: glyphicon-warning-sign
             *   * **successIcon**: glyphicon-ok-circle
             *   * **infoIcon**: glyphicon-info-sign
             *
             * @type {{classPrefix: string, errorIcon: string, warningIcon: string, successIcon: string, infoIcon: string}}
             */
            serv.bootstrapGlyphiconIconSet = serv.createIconSetDefinition('glyphicon', 'glyphicon-ban-circle',
                'glyphicon-warning-sign', 'glyphicon-ok-circle', 'glyphicon-info-sign');

            /**
             * @ngdoc method
             * @name setEllipsisLength
             * @methodOf cs-notify.service:csNotificationService
             * @param {number} ellipsisPoint The length of the string, past which an ellipsis will be created.
             * @description
             * Sets the maximum length of a string before the string will be trimmed to __ellipsisPoint - 3__ and then have
             * `...` appended to it when calling CSNotification.getShortMessage().  If any of:
             * 1. No value; or
             * 2. A non-numerical value (e.g. `"Hello"`) value; or
             * 3. A value < 3
             *
             * are provided, then no change will occur to the ellipsis point.
             *
             * ## Examples
             *
             * Assume the ellipsis length is set to 6:
             *
             * <pre>
             *     csNotificationService.setEllipsisLength(6);
             * </pre>
             *
             * The output of the strings "Hi", "Hi You" and "Hi There" for CSNotification.getShortMessage() would be:
             * 1. Hi
             * 2. Hi You
             * 3. Hi ...
             */
            serv.setEllipsisLength = function (ellipsisPoint) {
                var pt = parseInt(ellipsisPoint);
                if (isNaN(pt) || !pt || pt < 3) {
                    $log.warn('cs-notify: new ellipsis point must be an integer >= 3, not "' + ellipsisPoint + '"');
                    return;
                }
                CSNotification.prototype.ellipsisLength = pt;
            };

            return serv;
        }]);
}());
