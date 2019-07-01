class HeartBeat {
    constructor(heartbeat_url, heartbeat_interval_s) {
        this._heartbeat_url = heartbeat_url;
        this._heartbeat_interval = heartbeat_interval_s * 1000;
        this._last_heartbeat = 0;
        this._enabled = true;

        const thisSendHeartBeat = () => this.sendHeartbeat();
        setInterval(thisSendHeartBeat, this._heartbeat_interval);

        // also fire on touch and mouse mouse event because they seem to block
        // proper timer event enqueueing
        document.body.addEventListener('touchmove', thisSendHeartBeat, true);
        document.body.addEventListener('mousemove', thisSendHeartBeat, true);
    }

    sendHeartbeat() {
        const current_time = new Date().getTime();
        if (!this._enabled || current_time - this._last_heartbeat < this._heartbeat_interval)
            return;

        this._last_heartbeat = current_time;

        const url = this._heartbeat_url + "?cache_buster=" + new Date().getTime();
        const timeout = this._heartbeat_interval * 0.75;

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    console.log("heartbeat OK (url: " + url + ", response: " + xhr.responseText + ")");
                else
                    console.log("heartbeat ERROR (url: " + url + ", readyState: " + xhr.readyState + ", status: " + xhr.status + ")");
            }
        };
        xhr.timeout = timeout;
        xhr.ontimeout = () => console.log("heartbeat TIMEOUT (url: " + url + ", timeout: " + timeout + "ms)");
        xhr.open("GET", url, true);
        xhr.send();
    }

    setEnabled(enable) {
        this._enabled = enable;
    }
}
