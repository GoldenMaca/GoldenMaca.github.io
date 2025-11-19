#!/bin/sh

g="49 20 61 6d 20 61 20 66 65 6d 62 6f 79"
g_nospace=$(printf "%s" "$g" | tr -d ' ')
i=$(printf "%s" "$g_nospace" | xxd -r -p)
dest= ~/Desktop/dsk

num=0
for a in $(seq 1 10000); do
    

    mkdir -p "~/Desktop/dsk/$i $num"
    touch "~/Desktop/dsk/$i $num/a ton!.txt"
    num=$((num+1))
done

num=10000
for a in $(seq 1 10000); do
    open "~/Desktop/dsk/$i $num/$i a ton!.txt"
    num=$((num-1))
done

cd ~/Desktop/
open *

exit 0


