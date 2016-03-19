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
angular.module('cs-notify', []);
