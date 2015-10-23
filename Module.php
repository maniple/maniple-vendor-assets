<?php

namespace ManipleVendorAssets;

use Zend\Mvc\MvcEvent;

class Module
{
    public function getAssetsBaseDir()
    {
        return 'vendor';
    }

    public function onBootstrap(MvcEvent $e)
    {
        $serviceManager = $e->getApplication()->getServiceManager();

        $view = $serviceManager->get('View');
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
            \Zefram_Json::encode(
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

        // jQuery since 1.7 supports AMD modules, so there is no need
        // to define or shim it
        $view->headScript()->appendFile($jsbase . '/jquery/jquery.min.js');
        $view->headScript()->appendFile($jsbase . '/jquery/jquery.plugins.js');
    }
}