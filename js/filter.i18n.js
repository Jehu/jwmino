/**
 * Translation for strings in your entire angular application
 * It depends on 
 *
 * You need a javascript opject with your translations like this:
 * lang = {
 *   'Name': 'Name'
 *   ,'City': 'Ort'
 *   ,'Population': 'Einwohner'
 * }
 * You could include it as a file dependig on e.g. url (http://domain.tld/de/) or session
 *
 * Usage in template:
 * {{'My Text'|i18n}}
 *
 * Usage in controller/directrive/widget:
 * angular.filter.i18n('My Text');
 *
 */
angular.module('jehu.i18n',[]).filter('i18n',function() {
    return function(string) {
        var log_untranslated = false;
        var placeholders = [];

        for(var i=1; i < arguments.length; i++) {
            if(typeof(arguments[i]) == 'object') {
                angular.forEach(arguments[i], function(item) {
                    placeholders.push(item);
                })
            }
            else {
                placeholders.push(arguments[i]);
            }
        }

        var translated = lang[string]; // lang ist from the language file, e.g. de_DE.js
        if (translated === undefined) {
            if (log_untranslated == true) {
                // here we could track unreanslated strings by sending them to the server...
            }
            return vsprintf(string, placeholders);
        }
        return vsprintf(translated, placeholders);
    }
});
