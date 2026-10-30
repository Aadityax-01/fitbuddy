# FitBuddy AI - Local Web Server
$port = 5000
$prefix = "http://localhost:$port/"
$htmlPath = Join-Path $PSScriptRoot "preview.html"

if (-not (Test-Path $htmlPath)) {
    $htmlPath = "C:\Users\asus\.gemini\antigravity\brain\52853aa8-ec62-4abb-891e-7746800fbd74\fitbuddy_preview.html"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=========================================================" -ForegroundColor Green
    Write-Host "  FitBuddy AI Bot & Web App is LIVE!" -ForegroundColor Green
    Write-Host "  URL: http://localhost:$port" -ForegroundColor White
    Write-Host "=========================================================" -ForegroundColor Green
} catch {
    Write-Error "Failed to start listener on $prefix : $_"
    exit 1
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $response.Headers.Add("Access-Control-Allow-Origin", "*")

        if (Test-Path $htmlPath) {
            $bytes = [System.IO.File]::ReadAllBytes($htmlPath)
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200

            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $msg = [System.Text.Encoding]::UTF8.GetBytes("FitBuddy AI Preview file not found.")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $msg.Length
            $response.StatusCode = 404
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # ignore client disconnects
    }
}
