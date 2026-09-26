# PowerShell script to start all FoodShare microservices and verify they are listening on expected ports
# ------------------------------------------------------------
# Usage:
#   Open PowerShell, navigate to the project root (SkillSwap-Platform) and run:
#       .\start-services.ps1
#   The script will launch each service in the background, redirect logs, and
#   wait for the services to start. Afterwards it will check that the expected
#   ports are listening and report the status.
# ------------------------------------------------------------

# Define an array of services with their directory, log file and expected port
$services = @(
    @{ Name = "service-registry"; Dir = "service-registry"; Log = "service-registry.log"; Port = 8761 },
    @{ Name = "api-gateway";    Dir = "api-gateway";    Log = "api-gateway.log";    Port = 8080 },
    @{ Name = "auth-service";   Dir = "auth-service";   Log = "auth-service.log";   Port = 8081 },
    @{ Name = "user-service";   Dir = "user-service";   Log = "user-service.log";   Port = 8082 },
    @{ Name = "food-service";   Dir = "food-service";   Log = "food-service.log";   Port = 8083 }
)

# Helper function to start a service using Maven Wrapper
function Start-Service {
    param(
        [string]$Name,
        [string]$Dir,
        [string]$LogPath
    )
    Write-Host "Starting $Name..." -ForegroundColor Cyan
    $fullPath = Join-Path -Path $PSScriptRoot -ChildPath $Dir
    if (-not (Test-Path $fullPath)) {
        Write-Warning "Directory $fullPath does not exist – skipping $Name."
        return $null
    }
    $logFull = Join-Path -Path $PSScriptRoot -ChildPath $LogPath
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = "cmd.exe"
    $startInfo.Arguments = "/c .\\mvnw spring-boot:run"
    $startInfo.WorkingDirectory = $fullPath
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError  = $true
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true
    $proc = [System.Diagnostics.Process]::Start($startInfo)
    # Pipe output to log file asynchronously
    $proc.StandardOutput.BeginReadLine()
    $proc.StandardError.BeginReadLine()
    $proc.StandardOutput.Add_DataReceived({ param($sender,$e) if($e.Data){Add-Content -Path $logFull -Value $e.Data} })
    $proc.StandardError.Add_DataReceived({ param($sender,$e) if($e.Data){Add-Content -Path $logFull -Value $e.Data} })
    return $proc
}

# Start all services and keep the process objects for later checks
$processes = @{}
foreach ($svc in $services) {
    $proc = Start-Service -Name $svc.Name -Dir $svc.Dir -LogPath $svc.Log
    if ($proc) { $processes[$svc.Name] = $proc }
    # Give each service a few seconds to initialize before launching the next one
    Start-Sleep -Seconds 5
}

# Allow a short grace period for services to bind to ports
Write-Host "Waiting for services to become reachable..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verify that each expected port is listening
function Test-Port {
    param(
        [int]$Port
    )
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.Connect("localhost", $Port)
        $tcp.Close()
        return $true
    } catch {
        return $false
    }
}

Write-Host "--- Service health summary ---" -ForegroundColor Green
foreach ($svc in $services) {
    $isUp = Test-Port -Port $svc.Port
    if ($isUp) {
        Write-Host "$($svc.Name) is listening on http://localhost:$($svc.Port)" -ForegroundColor Green
    } else {
        Write-Host "$($svc.Name) NOT reachable on port $($svc.Port). Check $($svc.Log) for details." -ForegroundColor Red
    }
}

Write-Host "All services have been launched. Logs are available in the project root (e.g., *.log)." -ForegroundColor Cyan
