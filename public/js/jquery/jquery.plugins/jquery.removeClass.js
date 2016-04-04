/**
 * Enhancement to jQuery.fn.removeClass allowing regular expression to
 * be passed as a class name to be removed.
 *
 * @author xemlock
 * @version 2014-07-10
 */
;(function ($) {

    $.fn.removeClass = (function (removeClass) {
        return function (className) {
            var filter;
            if (className instanceof RegExp) {
                filter = function (cls) {
                    return !className.test(cls);
                };
                this.each(function () {
                    this.className = $.grep($.trim(this.className).split(/\s+/), filter).join(' ');
                });
                return this;
            }
            return removeClass.call(this, className);
        };
    })($.fn.removeClass);

})(jQuery);
