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
     */
    .factory('csNotificationService', ['$rootScope', function ($rootScope) {
        var serv = {};

        serv.maxNotifications = 10;
        serv.notifications = [];

        /**
         * @ngdoc object
         * @name NOTIFICATION_TYPE
         * @propertyOf cs-notify.service:csNotificationService
         * @type {Object}
         *
         * @description
         * A basic enumeration object containing the different notifications which can be sent to the cs-notifications
         * directive:
         *   * csNotificationService.NOTIFICATION_TYPE.ERROR:  Indicates an error notification is being sent
         *   * csNotificationService.NOTIFICATION_TYPE.WARNING:  Indicates a warning notification is being sent
         *   * csNotificationService.NOTIFICATION_TYPE.SUCCESS:  Indicates a success notification is being sent
         *   * csNotificationService.NOTIFICATION_TYPE.INFO:  Indicates an info notification is being sent
         *   * csNotificationService.NOTIFICATION_TYPE.ICONLESS:  Indicates an iconless notification is being sent
         */
        serv.NOTIFICATION_TYPE = Object.freeze({
            ERROR: 'error',
            WARNING: 'warning',
            SUCCESS: 'success',
            INFO: 'info',
            ICONLESS: 'other'
        });

        /**
         * @ngdoc method
         * @name sendNotification
         * @methodOf cs-notify.service:csNotificationService
         * @param {NOTIFICATION_TYPE} notificationType The type of notification to send.
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
            $rootScope.$emit('cs-notify-new-notification', evtData);
            serv.notifications.push(evtData);
            if (serv.notifications.length > serv.maxNotifications) {
                var start = serv.notifications.length - serv.maxNotifications;
                serv.notifications = serv.notifications.slice(start, serv.maxNotifications + 1);
            }
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

        return serv;
    }]);
