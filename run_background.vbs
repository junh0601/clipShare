Set objShell = CreateObject("Shell.Application")
objShell.ShellExecute "run_server.bat", "/c lodctr.exe /r" , "", "runas", 0