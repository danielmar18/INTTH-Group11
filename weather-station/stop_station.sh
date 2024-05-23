#!/bin/bash

# Find the process running 'station.py' and kill it
PID=$(pgrep -f 'python3 station.py')

if [ -z "$PID" ]; then
    echo "No process found."
else
    kill $PID
    echo "Process with PID $PID has been stopped."
fi
.