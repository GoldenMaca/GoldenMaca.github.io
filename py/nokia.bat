set i=1
@ECHO OFF
:loop_start
    mkdir "%i%"
    cd "%i%"
    touch "%i%"
    cd ..
    open "%i%"
    set i=i+1
    TIMEOUT /T 5 /nobreak
    goto loop_start
