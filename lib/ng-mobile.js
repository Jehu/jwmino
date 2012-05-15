/**
 * for each partial load do some transition and other stuff
 * credits for this solution goes to 'zadam', see https://groups.google.com/d/msg/angular/OroP1DBE6AA/AfpLQP-8V1MJ
 */
angular.module('SharedServices', []).config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('ngMobileHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
        // start transition
        if(window.ngMobileScroll != undefined) {
            window.ngMobileScroll.destroy();
        }
        window.ngMobileScroll = null;
        $('#loader').show();

        return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
})
// register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('ngMobileHttpInterceptor', function ($q, $window) {
    return function (promise) {
        // remove loading animation after partial was loaded
        var removeLoader = function() {
            setTimeout(function() {
                $('#loader').fadeOut();
            },100);
        }

        var refreshNavigation = function() {
            // set menulink in footer active
            $('footer, #footer').find('li > a').each(function(index, val) { 
                var regExp = /(\/?#?\/?)/;
                if($(val).attr('href').replace(regExp,'') === location.hash.replace(regExp,"")) {
                    $(val).addClass('active');
                }
                else {
                    $(val).removeClass('active');
                }
            });
        };

        return promise.then(function (response) {
            // only if loaded partial is an controller do some things...
            if($(response.data).attr('ng-controller')) {
                var cntlElem = $(response.data);

                // hide global header, if any in partial
                if($(cntlElem).find('div#header').length) {
                    $('header').hide();
                }
                else {
                    $('header').show();
                }
                // hide global footer, if any in partial
                if($(cntlElem).find('div#footer').length) {
                    $('footer').hide();
                }
                else {
                    $('footer').show();
                }

                // refresh Navifgation
                setTimeout(function() {
                    refreshNavigation()
                },10);

                // initialize iScroll if needed
                if($(response.data).find('#scroller').length) {
                    setTimeout(function() {
                        $window.ngMobileScroll = new iScroll('wrapper', { 
                            hScrollbar: false, 
                            vScrollbar: true,
                            //momentum: true,
                            onBeforeScrollStart: function (e) {
                                var target = e.target;
                                while (target.nodeType != 1) target = target.parentNode;
                                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                                    e.preventDefault();
                                }
                            }
                        });
                        $window.ngMobileScroll.refresh();
                    },300);
                }

                // stop transition
                removeLoader();
            }
            else {
                // stop transition
                removeLoader();
            }

            return response;

        }, function (response) {
            // stop transition
            removeLoader();

            return $q.reject(response);
        });
    };
});

/**
 *ngMobile Module
 */
var ngMobile = angular.module('ngMobile', ['SharedServices', 'jehu.i18n', 'jehu.nl2br', 'database']);

/**
 * Remove preloading animation after a timeout
 */
ngMobile.directive('ngmRemovePreloader', function () {
    return function (scope, element, attrs) {
        setTimeout(function() {
            element.fadeOut();
        },1000);
    };
});

ngMobile.directive('ngmTouchable', function factory() {
  return {
    priority: 0,
    replace: false,
    transclude: false,
    restrict: 'A',
    compile: function compile(tElement, tAttrs, transclude) {
      return function postLink(scope, iElement, iAttrs, controller) { 
            var touchDetected = false;

            // bind touch events
            $(iElement).hammer({
                // iScroll must be usable too
                // FIXME make these options configurable by attribute, these are good defaults in combination with iScroll
                prevent_default: false 
                ,drag: true 
                ,drag_vertical: true
                ,drag_horizontal: false
                ,transform: false
                ,tap: false
                ,tap_double: false
                ,hold: true
            }).bind('hold drag click', function(e) {
                if(e.type == 'drag') {
                    // try to prevent hold event while scrolling and holding
                    touchDetected = true;
                }
                if(e.type == 'hold' && !touchDetected) {
                    touchDetected = true;

                    // callback
                    var cb = iAttrs.ngmTouchable;
                       
                    try {
                        // callback with params?
                        if(cb.match(/\(.*?\)/)) {
                            eval("scope.$parent."+cb);
                        }
                        // callback without params (in parent scope)
                        else {
                            scope.$parent[cb]();
                        }
                    }
                    catch(err) {
                        console.log(err, err.type + ': Do you have the needed directive in your view? Callback exists in you controller?');
                    }

                    // scope must be evaluated again
                    scope.$parent.$digest();
                }
                else if (touchDetected) {
                    e.preventDefault();
                    touchDetected = false;
                    return false;
                }
            });
      }
    }
  };
});

ngMobile.directive('ngmDialogAction', function factory() {
    return {
        priority: 0,
        replace: true,
        transclude: false,
        controller: function($scope, $element, $attrs) {
            // hide dialog 
            $element.hide();

            // implement some methods to scope, can be used in controller and view
            $scope.dialogAction = {
                // show dialog
                show: function(customActions) {
                    if(customActions) {
                        // if there are actions in show() call
                        this.actions = customActions;
                    }
                    else {
                        // else take the actions from directive param
                        this.actions = eval($attrs.actions);
                    }
                    // add a cancel button at the end of the button list
                    this.actions.push({text: 'Cancel', callback:'cancel'})
                    $element.show();    
                }
                // hide dialog
                ,hide: function() {
                    $element.hide();    
                }
                ,actions: {}
                // execute callback
                ,exec: function(cb, scope) {
                    if(cb == 'cancel') {
                        // cancel ation and close dialog
                        $element.hide();
                        return;
                    }
                    // do callback and close dialog
                    if(_.isObject(scope)) {
                        cb = new Function(cb);
                        cb();
                    }
                    else {
                       // callback with braces 
                       if(cb.match(/\(.*?\)/)) {
                           eval("$scope."+cb);
                       }
                       else {
                           $scope[cb]();
                       }
                    }
                    $element.hide();
                }
            }

        },
        restrict: 'E',
        template: '<div class="dialog action"><div class="wrapper">'
            + '<ul>'
            + '<li ng-repeat="item in dialogAction.actions">'
            + '<button ng-click="dialogAction.exec(item.callback, item.scope)">{{item.text}}</button>'
            + '</li>'
            + '</ul></div></div>'
    }
});

ngMobile.directive('ngmDialogConfirm', function factory() {
    return {
        priority: 0,
        replace: true,
        transclude: false,
        controller: function($scope, $element, $attrs) {
            // hide dialog 
            $element.hide();

            // callback to call by default, can be overridden by dialogConfirm.show('text', 'myCallback')
            var cb = $attrs.callback;

            // implement some methods to scope, can be used in controller and view
            $scope.dialogConfirm = {
                // default message
                message: '[no message given]'
                /**
                 * dialogConfirm.show('text', 'myCallback') allows to open a dialog with custom text and callback
                 * overrides values from directive attributes
                 */
                ,show: function(msg, callback) {
                    if(msg) {
                        $scope.dialogConfirm.message = msg;
                    }
                    if(callback) {
                        cb = callback;
                    }
                    $element.show();    
                }
                // dialog can be hidden
                ,hide: function() {
                    $element.hide();    
                }
                // callback for answer
                ,answer: function(answer) {
                    // callback with params, they will be deleted and replaced by the users answer, sorry...
                    if(cb.match(/\(.*?\)/)) {
                        cb = cb.replace(/\(.*?\)/, '(answer)');
                        eval("$scope."+cb);
                    }
                    // callback without params
                    else {
                        $scope[cb](answer);
                    }
                    //$scope[cb](answer);
                    $element.hide();
                }
            }

        },
        restrict: 'E',
        //templateUrl: 'partials/ngm-dialog-yes-no.html',
        template: '<div class="dialog yesno"><div class="wrapper"><p>{{dialogConfirm.message}}</p><button class="btn btn-red" ng-click="dialogConfirm.answer(\'yes\')">Yes</button> <button class="btn" ng-click="dialogConfirm.answer(\'no\')">No</button></div></div>',
        compile: function compile(tElement, tAttrs, transclude) {
            return function postLink(scope, iElement, iAttrs) { 
                scope.dialogConfirm.message = iAttrs.message || scope.dialogConfirm.message;
            }
        }
    }
});

/**
 * Main Controller, provide some methods to use in all other child controllers
 */
function MainCntl($scope, $location) {
    // default header Text
    $scope.txtHeader = undefined 

    // default footer and header partials
    $scope.header = 'partials/default_header.html';
    $scope.footer = 'partials/default_footer.html';

    // setter to load another partial for regions (header or footer)
    $scope.setPartial = function(region, filename) {
        $scope[region] = filename;
    }

    // setter for header text
    $scope.setHeaderText = function(string) {
        $scope.txtHeader = string;
    }

    // make history back possible
    $scope.previousPage = {
        txtHeader: ''
        ,hash: ''
        ,path: ''
    }

    $scope.$on('$beforeRouteChange', function() {
        $scope.previousPage.txtHeader = $scope.txtHeader;
        $scope.previousPage.hash = $scope.previousPage.path.replace(/\/?#?\/?/,'#');
    });

    $scope.$on('$afterRouteChange', function() {
        $scope.previousPage.path = $location.path();
    });

    // history back method to use it in a view or controller
    $scope.historyBack = function() {
        $location.path($scope.previousPage.path);
    }
}

