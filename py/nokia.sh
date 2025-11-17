#!/bin/sh

i=1
while [ "$i" -le 10 ]; do
    dir="$HOME/Desktop/Sample$i"
    mkdir -p "$dir"
    printf 'sample\n' > "$dir/sample.txt"
    open "$dir"
    sleep 5
    i=$((i+1))
done