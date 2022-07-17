#!/usr/bin/env bash

if [[ $(ls $dir_code) ]]; then
    latest_log=$(ls -r $dir_code | head -1)
    . $dir_code/$latest_log
fi
