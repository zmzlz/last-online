# gitp.ps1 - 自动读取 Windows 系统代理并临时给 git 使用（不写死任何 git 配置）
# 用法: .\gitp.ps1 <任意 git 命令>
# 例:   .\gitp.ps1 push -u origin main

$key = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings'
$enabled = (Get-ItemProperty $key).ProxyEnable
$raw = (Get-ItemProperty $key).ProxyServer

if ($enabled -eq 1 -and $raw) {
    $m = [regex]::Match($raw, '(\d+\.\d+\.\d+\.\d+:\d+)')
    $proxy = if ($m.Success) { $m.Groups[1].Value } else { $raw }
    Write-Host "[gitp] using system proxy $proxy"
    git -c "http.proxy=http://$proxy" -c "https.proxy=http://$proxy" @args
} else {
    Write-Host "[gitp] no system proxy detected, running git directly"
    git @args
}
