<?php

// jquery_plugins compiler
//
// version: 2014-07-13
// author: xemlock

define('DS', DIRECTORY_SEPARATOR);

function get_dir($path, $writable = false) {
    $path = str_replace('\\', '/', $path);
    if (substr($path, 0, 2) == './') {
        $path = dirname(__FILE__) . substr($path, 1);
    } elseif (substr($path, 0, 3) == '../') {
        $path = dirname(dirname(__FILE__)) . substr($path, 2);
    }
    if (!is_dir($path) || !is_readable($path)) {
        echo 'Directory not found: ', $path, "\n";
        exit(1);
    }
    if ($writable && !is_writable($path)) {
        echo 'Directory is not writable: ', $path, "\n";
        exit(1);
    }
    return realpath($path);
}

$CONFIG_PATH = dirname(__FILE__) . '/combinejs.json';
if (!is_file($CONFIG_PATH)) {
    echo 'Config file not found: ', $CONFIG_PATH, "\n";
    exit(1);
}

$force = false;

foreach ($_SERVER['argv'] as $arg) {
    if ($arg === '-f' || $arg === '--force') {
        $force = true;
    }
}

$CONFIG = json_decode(file_get_contents($CONFIG_PATH), true);

// detect java and closure compiler
$compiler = dirname(__FILE__) . DS . 'compiler.jar';
$dev_null = strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN' ? '/dev/null' : 'nul';
system("java -version 2>{$dev_null}", $retval);
$has_compiler = is_file($compiler) && !$retval;

echo "Closure compiler: ", $has_compiler ? $compiler : "not found", "\n";
echo "\n";

foreach ($CONFIG as $WORK_ID => $WORK) {
    echo $WORK_ID, ":\n";
    $SRC_DIR = get_dir($WORK['src'], true);
    $DST_DIR = get_dir(dirname($WORK['dst']), true);
    $OUTPUT = $DST_DIR . DS . basename($WORK['dst']);

    $entries = scandir($SRC_DIR);
    foreach ($entries as &$entry) {
        $entry = $SRC_DIR . DS . $entry;
    }
    unset($entry);

    foreach ($entries as $key => $value) {
        if (!is_file($value) || !preg_match('/\.js$/', $value)) {
            unset($entries[$key]);
        }
    }

    $js = array();
    foreach ($entries as $entry) {
        if (preg_match('/\.min\.js$/', $entry)) {
            // file already compressed, can be added
            $js[$entry] = true;
        } else {
            // file not compressed, check if compressed version is available
            $min = preg_replace('/\.js$/', '.min.js', $entry);

            if ($force || !is_file($min) || filemtime($min) < filemtime($entry)) {
                // minify/compress file
                if ($has_compiler) {
                    echo "  [min] $entry\n";
                    $minified = `java -jar {$compiler} --js "$entry"`;
                } else {
                    $minified = file_get_contents($entry);
                }
                $minified = trim($minified);
                if (!strncmp('/*', $minified, 2)) {
                    $minified = substr($minified, strpos($minified, '*/', 2) + 2);
                    $minified = trim($minified);
                }
                file_put_contents($min, $minified);
            }
            $js[$min] = true;
        }
    }

    $contents = '';
    foreach ($js as $filename => $whatever) {
        echo "  [add] $filename\n";

        $js_contents = trim(file_get_contents($filename));

        // remove starting comments
        if (substr($js_contents, 0, 2) == '/*') {
            $pos = strpos($js_contents, '*/', 2) + 2;
            $js_contents = trim(substr($js_contents, $pos));
        }

        // disable AMD module detection, as it makes requirejs to fail with
        // 'Mismatched anonymous define() module' error
        if (strpos($js_contents, 'define(') !== false) {
            $js_contents = ';(function(){var define;' . $js_contents . '})();';
        }

        $contents .= $js_contents . "\n";
    }

    file_put_contents($OUTPUT, $contents);
    echo "  [done] Output written to: {$OUTPUT}\n\n";
}

