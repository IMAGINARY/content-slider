<!DOCTYPE html>
<html>
    <head>
        <script>
            var current_content_slides = [];
        </script>
    </head>
    <body>

<?php
    ob_start();
    include( "app4.inc" );
    $result = ob_get_contents();
    ob_end_clean();
    print str_replace( "\n", "\n\t\t", "\t\t" . $result );
?>

    </body>
</html>
