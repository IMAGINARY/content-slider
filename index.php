<?php
    // launch script relies on
    //  - php-cli
    //  - pslist (rkill)
    //  - electron

    require( 'config.inc' );

    // missing config.local.inc is ok
    // allows to overwrite config values with local
    // values that are not stored in the VCS
    // config.local.inc should be ignored via .gitignore
    include( 'config.local.inc' );

    if( php_sapi_name() == 'cli-server' )
    {
        // act as cli web server - serve files or process heartbeat
        if( strpos( $_SERVER["REQUEST_URI"], '/heartbeat' ) === 0 )
        {
            // reply to heartbeat
            header( 'Access-Control-Allow-Origin: *' );
            echo "OK";

            // store timestamp in file
            file_put_contents( $timestamp_file, time(), LOCK_EX );
        }
        else if( strpos( $_SERVER["REQUEST_URI"], '/index.php' ) === 0 )
        {
            // serve index.html
            readfile( 'index.html' );
        }
        else
        {
            // let default implementation serve files
            return false;
        }
    }
    else if( php_sapi_name() == 'cli' )
    {
        // act as launch script
        echo "entering launch script mode\n";

        // launch php's built in web server with this script as routing script
        $server_cmd = "php -S {$server_host}:{$server_port} '".__FILE__."' > /dev/null 2>&1 &";
        echo "spawning php's built-in web server\n\t{$server_cmd}\n";
        shell_exec( $server_cmd );

        while( true )
        {
            echo "(re-)entering browser respawn loop with heartbeat check\n";
            $pid = pcntl_fork();
            if( $pid == -1 )
            {
                die( 'could not fork process to spawn browser instance' );
            }
            else if( $pid )
            {
                // parent process

                $kiosk_browser_loop_pid = $pid;

                // fork heartbeat observation process
                $pid = pcntl_fork();
                if( $pid == -1 )
                {
                    die( 'could not fork heartbeat observation process' );
                }
                else if( $pid )
                {
                    // parent process

                    // just wait for children to finish
                    pcntl_wait ( $status );
                    pcntl_wait ( $status );
                }
                else
                {
                    // second child process
                    // in charge of checking heartbeat

                    // init timestamp
                    $timestamp = time();

                    // store init timestamp in file
                    file_put_contents( $timestamp_file, $timestamp, LOCK_EX );

                    // active waiting
                    while( time() - $timestamp < $heartbeat_respawn_delay )
                    {
                        sleep( 1 );
                        // read timestamp of last heartbeart from file
                        $timestamp = intval( file_get_contents( $timestamp_file ) );
                    }

                    echo "heartbeart delayed; kill current browser instances and respawning\n";

                    // heartbeat is delayed -> kill browser and respawn
                    // (use SIGKILL because browser is likely blocking anyway)
                    exec( "rkill -9 {$kiosk_browser_loop_pid}" );

                    // respawning takes place in the next loop iteration of the parent
                    exit;
                }
            }
            else
            {
                // first child process
                // in charge of spawning kiosk browser instances in a loop
                // such that the browser is restarted immediately after it crashed
                // or has been closed by other means
                while( true )
                {
                    echo "executing {$web_browser_cmd}\n";
                    shell_exec( "{$web_browser_cmd}" );
                    echo "browser terminated for some reason; respawning\n";
                }
                exit;
            }
        }
    }
    else
    {
        // serve index.html
        readfile( 'index.html' );
    }
?>
