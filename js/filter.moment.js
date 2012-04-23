angular.filter('moment', function(dateObj) { 
    if(dateObj) {
        var fmt = arguments[1] || 'L HH:mm';
        return moment(dateObj).format(fmt);
    }
});
