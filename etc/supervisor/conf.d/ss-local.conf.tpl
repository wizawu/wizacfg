[program:ss-local]
autorestart=true
command=/home/{{user}}/.sysconf/bin/ss-local
killasgroup=true
redirect_stderr=false
startretries=99
stderr_logfile=/var/log/ss-local.err
stdout_logfile=/var/log/ss-local.log
stopasgroup=true
stopsignal=KILL