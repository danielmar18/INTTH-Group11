#!/bin/bash

# Check if the log file exists and archive it if it does
if [ -f "nohup.out" ]; then
    mv nohup.out "nohup_$(date +%Y%m%d%H%M%S).out"
fi

# Start the Python script in the background using nohup
nohup python3 station.py > nohup.out 2>&1 &

echo "Python script started with PID $!"
