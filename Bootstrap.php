<?php

class ManipleVendorAssets_Bootstrap extends Zend_Application_Module_Bootstrap
{
    public function getAssetsBaseDir()
    {
        return 'vendor';
    }

    public function onBootstrap(Maniple_Application_ModuleBootstrapper $moduleBootstrapper)
    {
        $moduleBootstrapper->getBootstrap()->bootstrap('request');

        $bootstrap = $moduleBootstrapper->getBootstrap();
        $bootstrap->bootstrap('request');
        $bootstrap->bootstrap('view');

        $view = $bootstrap->getResource('view');
        $jsbase = $view->baseUrl('/assets/vendor/js');

        // add JavaScript 1.6 compatibility script
        $view->headScript()->appendFile($jsbase . '/compat.min.js');

        // add support for CSS3 pseudo-classes and attribute selectors in IE 6-8
        $view->headScript()->appendFile($jsbase . '/selectivizr.min.js',
            'text/javascript',
            array('conditional' => '(gte IE 6) & (lte IE 8)')
        );

        // add RequireJS + config
        $view->headScript()->appendFile($jsbase . '/require.min.js');
        $view->headScript()->appendScript(sprintf(
            'require.config(%s)',
            Zefram_Json::encode(
                array(
                    'baseUrl' => $view->baseUrl('/'),
                    'paths' => array(
                        'handlebars.runtime'    => $jsbase . '/handlebars.runtime.min',
                        'jquery-ui'             => $jsbase . '/jquery-ui/jquery-ui.min',
                        'jquery.magnific-popup' => $jsbase . '/jquery/jquery.magnific-popup.min',
                    ),
                    'shim' => array(
                        'handlebars.runtime' => array(
                            'exports' => 'Handlebars',
                        ),
                    ),
                ),
                array(
                    'unescapedSlashes' => true,
                    'unescapedUnicode' => true,
                )
            )
        ));

        $view->headScript()->appendFile($jsbase . '/modernizr.min.js');

        // jQuery since 1.7 supports AMD modules, more over it defines itself
        // as a named module (jquery), so it can be used without hacks in
        // requirejs and non-requirejs environment
        $view->headScript()->appendFile($jsbase . '/jquery/jquery.min.js');
        $view->headScript()->appendFile($jsbase . '/jquery/jquery.plugins.js');

        // on the other hand, jQuery UI if RequireJS is present, must be loaded
        // via require, otherwise an "Mismatched anonymous define() module" will
        // be thrown. This little hack makes it work in both environments
        $view->headScript()->appendScript(
            'window.__define=window.define;window.define=function(){}</script>' .
            '<script src="' . $jsbase . '/jquery-ui/jquery-ui.min.js' . '"></script>' .
            '<script>window.define=window.__define'
        );
        $view->headScript()->appendFile($jsbase . '/jquery-ui/jquery-ui.plugins.js');
    }
}
