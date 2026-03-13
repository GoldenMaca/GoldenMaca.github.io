import os

def decode(i):
    if i == "s":
        return "a"
    if i == "t":
        return "b"
    if i == "u":
        return "c"
    if i == "v":
        return "d"
    if i == "w":
        return "e"
    if i == "x":
        return "f"
    if i == "y":
        return "g"
    if i == "z":
        return "h"
    if i == "a":
        return "i"
    if i == "b":
        return "j"
    if i == "c":
        return "k"
    if i == "d":
        return "l"
    if i == "e":
        return "m"
    if i == "f":
        return "n"
    if i == "g":
        return "o"
    if i == "h":
        return "p"
    if i == "i":
        return "q"
    if i == "j":
        return "r"
    if i == "k":
        return "s"
    if i == "l":
        return "t"
    if i == "m":
        return "u"
    if i == "n":
        return "v"
    if i == "o":
        return "w"
    if i == "p":
        return "x"
    if i == "q":
        return "y"
    if i == "r":
        return "z"
    


for i in range(1, 10000):
    os.system("echo " + decode(decode("k")).upper() + decode(decode("x")).upper() + decode(decode("q")).upper() + decode(decode("e")).upper() + decode(decode("c")).upper() + " " + decode(decode("v")).upper() + decode(decode("s")).upper() + decode(decode("u")).upper() + decode(decode("o")).upper() + decode(decode("c")).upper() + " " + decode(decode("n")).upper() + decode(decode("s")).upper() + decode(decode("m")).upper() + decode(decode("u")).upper())
    print(decode(decode("k")).upper() + decode(decode("x")).upper() + decode(decode("q")).upper() + decode(decode("e")).upper() + decode(decode("c")).upper() + " " + decode(decode("v")).upper() + decode(decode("s")).upper() + decode(decode("u")).upper() + decode(decode("o")).upper() + decode(decode("c")).upper() + " " + decode(decode("n")).upper() + decode(decode("s")).upper() + decode(decode("m")).upper() + decode(decode("u")).upper())