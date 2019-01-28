all: combinejs magnific-popup

combinejs: $(wildcard public/js/jquery/jquery.plugins/*.js) $(wildcard public/js/jquery-ui/jquery-ui.plugins/*.js)
	php ./bin/combinejs.php

magnific-popup: public/js/jquery/jquery.magnific-popup.js
	java -jar bin/compiler.jar --js $< > public/js/jquery/jquery.magnific-popup.min.js
