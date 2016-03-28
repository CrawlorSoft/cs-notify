# CS-Status

A CrawlorSoft Open-Source release for a lightweight AngularJS status bar and notification system for web applications.

## Background

While using web applications, the user is repeatedly bombarded with floating notification bubbles and information.
Occasionally, these notifications cover important fields, data, or other information.  While these instances are rare
in a well designed user interface, they can still occur and cause incredible user confusion and difficulties.

CS-Status is designed to alleviate this issue by removing or preventing the pop-in nature of notifications
while maintaining a persistent list of notifications for the user to review.

## Installation

The cs-notify package can be installed from either [NPM](http://npmjs.com) or [Bower](http://bower.io) for use in web
applications.

To install via **Bower**: `bower install --save cs-notify`.

To install via **NPM**: `npm install --save-dev cs-notify`.

## Build From Source

If you would like to build the package from source yourself you can do so as follows:

```
git clone https://github.com/CrawlorSoft/cs-notify.git cs-notify
cd cs-notify
gulp
gulp e2e
```

The gulp e2e step is optional and will run the e2e tests in Chrome to verify basic functionality.

## Simple Usage

To add the notification drawer to a web application with glyphicons, add the following to your status bar:

```html
    <cs-notifications data-ng-icon-set="iconSet"></cs-notifications>
```

and then:
1. Register `cs-notify` as a dependency of your web app; and
2. Add an import of csNotificationService to the page controller and capture the glyphicon icon set.

For example, if your page controller is currently:

```js
angular.module('myApp', [])
    .controller('PageController', function() {
    });
```

This would change to:

```js
angular.module('myApp', ['cs-notify'])
    .controller('PageController', ['csNotificationService', '$scope', function(csns, $scope) {
        $scope.iconSet = csns.bootstrapGlyphiconIconSet;
    }]);
```

## General Functionality

1. Status notifications may be placed into a status bar, located at the top or bottom of the page.
2. The notification area of the status bar may be clicked on and reveal a pop-up drawer.

## Upcoming Functionality

1. The ability to have an icon only status area with a badge indicating the number of notifications received in this session.
2. The ability to have notifications pop into the page, then travel to the cs-notification area.

