(function(){

    var heartbeat_interval = document.body.getAttribute( "heartbeat-interval" ) * 1000;
    var heartbeat_url = document.body.getAttribute( "heartbeat-url" );

    function send_heartbeat()
    {
        var url = heartbeat_url + "?cache_buster=" + new Date().getTime();
        var timeout = heartbeat_interval * 0.75;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if( xhr.readyState == 4 )
            {
                if( xhr.status == 200 )
                    console.log( "heartbeat OK (url: " + url + ", response: " + xhr.responseText + ")" );
                else
                    console.log( "heartbeat ERROR (url: " + url + ", readyState: " + xhr.readyState + ", status: " + xhr.status + ")" );
            }
        };
        xhr.timeout = timeout;
        xhr.ontimeout = function () { console.log( "heartbeat TIMEOUT (url: " + url + ", timeout: " + timeout + "ms)" ); }
        xhr.open( "GET", url, true );
        xhr.send();
    }
    setInterval( send_heartbeat, heartbeat_interval );
})();
