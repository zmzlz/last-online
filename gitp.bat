@echo off
REM gitp.bat - 自动读取 Windows 系统代理并临时给 git 使用（不写死任何 git 配置）
REM 用法: gitp.bat <任意 git 命令>
REM 例:   gitp.bat push -u origin main
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0gitp.ps1" %*
