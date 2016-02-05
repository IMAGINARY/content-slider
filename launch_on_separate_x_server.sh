#!/bin/bash

# cd to directory the script is stored in
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
cd "$DIR"

if [ $# -ne 0 ]; then
	DISPLAYS=$(xrandr | grep " connected" | awk '{print $1}')
	echo "trying to set 4k resolution"
	echo $DISPLAYS | xargs -I {} xrandr --output {} --mode 3840x2160
	echo "trying to set 60Hz"
	echo $DISPLAYS | xargs -I {} xrandr --output {} --rate 60
	echo "rotating screen towards the left"
	echo $DISPLAYS | xargs -I {} xrandr --output {} --rotate left
	echo "rotating DISPLAX touch input towards the left"
	xinput list --long | grep XITouchClass | awk '{print $4}' | sed 's/.$//' | xargs -I {} xinput set-prop "{}" "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1
    #	echo "rotating screen towards the right"
    #	echo $DISPLAYS | xargs -I {} xrandr --output {} --rotate right
    #	echo "rotating DISPLAX touch input towards the right"
    #	xinput list --long | grep XITouchClass | awk '{print $4}' | sed 's/.$//' | xargs -I {} xinput set-prop "{}" "Coordinate Transformation Matrix" 0 1 0 -1 0 1 0 0 1
	echo "turn off screen saver and screen blanking"
	xset s off
	xset -dpms
	xset s noblank
	echo "set background color to black"
	xsetroot -solid "#000000"
	echo "hide mouse cursor after a couple of seconds"
	unclutter -display "$DISPLAY"  -idle 1 -root &
	UNCLUTTER_PID=$!
	echo
	echo "current configuration:"
	echo "====================================================="
	echo "xrandr"
	echo "====================================================="
	xrandr --current
	echo "====================================================="
	echo "xset"
	echo "====================================================="
	xset -q
	echo "====================================================="
	echo "start the exhibit"
	php index.php
	kill $UNCLUTTER_PID
	wait
else
	while true; do
		echo "launch background task that always switches back to vt8"
		(while true; do sleep 10; chvt 8; done) &
		BG_PID=$!

		echo "starting new X server :1 on vt8"
		xinit ./$(basename "$0") launch -- :1 vt8

		kill $BG_PID
		wait

		echo "X server exited; starting again"
	done
fi
