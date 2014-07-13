jQuery.fn.autocomplete=function(e){function g(a){if("string"===typeof a){var c=Array.prototype.slice.apply(arguments);return e.apply(this,c)}var a=$.extend({},a),h=a.source,g=a.open,r=a.select,s=a.focus,t=a.close,j,u,f,k,l;m?(j=a.response,delete a.response,f=function(a,b){this.element.trigger("autocompleteresponse",{content:b||[]});a(b)}):f=function(a,b){a(b)};k="function"===typeof a.renderItem?a.renderItem:function(a){return a&&"object"===typeof a?a.label:""+a};delete a.renderItem;l="function"===
typeof a.renderValue?a.renderValue:k;delete a.renderValue;u="undefined"===typeof a.cache?!0:!!a.cache;delete a.cache;a.open=function(a,b){try{var d=$(this),i=(d.data("ui-autocomplete")||d.data("autocomplete")).menu.element,f=d.outerWidth()-parseInt(d.css("borderLeftWidth"),10)-parseInt(d.css("borderRightWidth"),10),c=0;d.parents().each(function(){c=Math.max(c,parseInt(this.style.zIndex,10)||0)});i.css({width:f,zIndex:1+c});var e=parseInt(i.css("marginTop"),10);e&&i.css("top",parseInt(i.css("top"),
10)+e)}catch(h){}"function"===typeof g&&g.apply(this,[a,b])};a.focus=function(a,b){$(this).val(l(b.item));"function"===typeof s&&s.apply(this,[a,b]);return!1};a.select=function(a,b){$(this).val(l(b.item));"function"===typeof r&&r.apply(this,[a,b]);return!1};a.close=function(a,b){"function"===typeof t&&t.apply(this,[a,b]);return!1};if(h instanceof Array)a.source=function(a,b){var d=e.filter(h,a.term);f.apply(this,[b,d])};else if("string"===typeof h){var p={},q;a.source=function(n,b){var d=this,c;"function"===
typeof a.beforeSend&&!1===a.beforeSend.apply(d,[n,b])?f.apply(d,[b]):(c=n.term,u&&c in p?f.apply(d,[b,p[c]]):(q&&q.abort(),q=$.ajax({url:h,data:n,dataType:"json",success:function(a){p[c]=a;f.apply(d,[b,a])},error:function(){f.apply(d,[b])}})))}}var v=function(a,b){return $("<li/>").data("item.autocomplete",b).append($("<a/>").append(k(b))).appendTo(a)};this.each(function(){var c=$(this),b=!1;"undefined"===typeof a.source&&(b=!0,a.source=c.data("source"));this.setAttribute("autocomplete","off");e.call(c,
a);(c.data("ui-autocomplete")||c.data("autocomple"))._renderItem=v;b&&delete a.source});m&&"function"===typeof j&&this.bind("autocompleteresponse",function(a,b){j.apply(this,[a,b])});return this}var c=0,m=!1;$.each(["1","9","0"].concat([0,0,0]).slice(0,3),function(a,e){c=100*c+(parseInt(e,10)||0)});$.each($.ui.autocomplete.version.split(".").concat([0,0,0]).slice(0,3),function(a,e){c=100*c+(parseInt(e,10)||0)});m=10900>c;g.autocomplete=e;return g}(jQuery.fn.autocomplete);
(function(e){var c={sort:!1,"sort-attr":"data-priority","sort-desc":!1,autoselect:!0,"alternative-spellings":!0,"alternative-spellings-attr":"data-alternative-spellings","remove-valueless-options":!0,"copy-attributes-to-text-field":!0,"autocomplete-plugin":"jquery_ui","relevancy-sorting":!0,"relevancy-sorting-partial-match-value":1,"relevancy-sorting-strict-match-value":5,"relevancy-sorting-booster-attr":"data-relevancy-booster",handle_invalid_input:function(a){a.$text_field.val(a.$select_field.find("option:selected:first").text())},
handle_valid_values:e.noop,handle_select_field:function(a){return a.hide()},insert_text_field:function(a){var f=e('<input type="text" />');if(c["copy-attributes-to-text-field"]){for(var i={},d=a.$select_field[0].attributes,b=0;b<d.length;b++){var h=d[b].nodeName,j=d[b].nodeValue;"name"!==h&&("id"!==h&&"undefined"!==typeof a.$select_field.attr(h))&&(i[h]=j)}f.attr(i)}f.blur(function(){var b=a.$select_field.find("option").map(function(a,b){return e(b).text()});0>e.inArray(f.val(),b)?"function"===typeof c.handle_invalid_input&&
c.handle_invalid_input(a,f.val()):"function"===typeof c.handle_valid_values&&c.handle_valid_values(a,b)});a.settings.autoselect&&f.click(function(){this.select()});return f.val(a.$select_field.find("option:selected:first").text()).insertAfter(a.$select_field)},extract_options:function(a){var f=[],a=a.find("option"),i=a.length;a.each(function(){var a=e(this),b={"real-value":a.attr("value"),label:a.text()};if(!(c["remove-valueless-options"]&&""===b["real-value"])){b.matches=b.label;var h=a.attr(c["alternative-spellings-attr"]);
h&&(b.matches+=" "+h);c.sort&&(h=parseInt(a.attr(c["sort-attr"]),10),b.weight=h?h:i);c["relevancy-sorting"]&&(b["relevancy-score"]=0,b["relevancy-score-booster"]=1,(a=parseFloat(a.attr(c["relevancy-sorting-booster-attr"])))&&(b["relevancy-score-booster"]=a));f.push(b)}});c.sort&&(c["sort-desc"]?f.sort(function(a,b){return b.weight-a.weight}):f.sort(function(a,b){return a.weight-b.weight}));return f}},g={init:function(a){var f=/MSIE\s+(\d+)/.exec(navigator.userAgent);if(f&&6>=parseInt(f[1],10)&&!window.opera)return this;
c=e.extend(c,a);return this.each(function(){var a=e(this),d={$select_field:a,options:c.extract_options(a),settings:c};d.$text_field=c.insert_text_field(d);c.handle_select_field(a);e.each(["focus","blur"],function(a,f){"function"===typeof c[f]&&d.$text_field.bind(f,c[f])});a.data("selectToAutocomplete",d);if("string"===typeof c["autocomplete-plugin"])l[c["autocomplete-plugin"]](d);else c["autocomplete-plugin"](d)})}},l={jquery_ui:function(a){var c=function(c){if(c)a.$select_field.val()!==c["real-value"]&&
(a.$select_field.val(c["real-value"]),a.$select_field.change());else{for(var c=a.$text_field.val().toLowerCase(),d={"real-value":!1},b=0;b<a.options.length;b++)if(c===a.options[b].label.toLowerCase()){d=a.options[b];break}a.$select_field.val()!==d["real-value"]&&(a.$select_field.val(d["real-value"]||""),a.$select_field.change());d["real-value"]&&a.$text_field.val(d.label);"function"===typeof a.settings.handle_invalid_input&&""===a.$select_field.val()&&a.settings.handle_invalid_input(a)}};a.$text_field.autocomplete({minLength:2,
delay:0,autoFocus:!1,source:function(c,d){var b,f=c.term;b=f.split(" ");for(var j=[],k=0;k<b.length;k++)if(0<b[k].length){var g={};g.partial=RegExp(e.ui.autocomplete.escapeRegex(b[k]),"i");a.settings["relevancy-sorting"]&&(g.strict=RegExp("^"+e.ui.autocomplete.escapeRegex(b[k]),"i"));j.push(g)}b=e.grep(a.options,function(b){var c=0;if(a.settings["relevancy-sorting"])var d=!1,e=b.matches.split(" ");for(var g=0;g<j.length;g++)if(j[g].partial.test(b.matches)&&c++,a.settings["relevancy-sorting"])for(var i=
0;i<e.length;i++)if(j[g].strict.test(e[i])){d=!0;break}a.settings["relevancy-sorting"]&&(e=0+c*a.settings["relevancy-sorting-partial-match-value"],d&&(e+=a.settings["relevancy-sorting-strict-match-value"]),e*=b["relevancy-score-booster"],b["relevancy-score"]=e);return!f||j.length===c});a.settings["relevancy-sorting"]&&(b=b.sort(function(a,b){return b["relevancy-score"]-a["relevancy-score"]}));d(b)},select:function(a,d){c(d.item)},change:function(a,d){c(d.item)}});a.$text_field.parents("form:first").submit(function(){c()});
c()}};e.fn.selectToAutocomplete=function(a){if(g[a])return g[a].apply(this,Array.prototype.slice.call(arguments,1));if("object"===typeof a||!a)return g.init.apply(this,arguments);e.error("Method "+a+" does not exist on jQuery.fn.selectToAutocomplete")}})(jQuery);
