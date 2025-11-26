<#
Deploy script for Vercel (PowerShell)

Usage:
  1) Install Vercel CLI if you don't have it:
       npm i -g vercel
  2) Log in once interactively:
       vercel login
     or set an environment variable `VERCEL_TOKEN` and use it below.
  3) From the repo root run this script in PowerShell:
       .\scripts\deploy-vercel.ps1

What it does:
  - If $env:VERCEL_TOKEN is present it will run `vercel --token <token> --prod --confirm`.
  - Otherwise it runs `vercel --prod --confirm` and requires an interactive login.

Notes:
  - This script assumes your `public/` folder and `vercel.json` are present (they are).
  - If you need a specific project/org, set VERCEL_ORG_ID or VERCEL_PROJECT_ID or run `vercel` interactively and choose.
#>

# Ensure running from repo root
Set-Location -Path "$PSScriptRoot\.."

function Write-Info($msg) { Write-Host "[info] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[warn] $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "[error] $msg" -ForegroundColor Red }

Write-Info "Deploy script started from: $(Get-Location)"

# Check vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Warn "Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
}

# Build the vercel command
$cmd = "vercel --prod --confirm"
if ($env:VERCEL_TOKEN) {
  Write-Info "Using VERCEL_TOKEN environment variable for non-interactive deploy."
  $cmd = "vercel --token $env:VERCEL_TOKEN --prod --confirm"
}

Write-Info "About to run: $cmd"
Write-Info "If this fails due to authentication, run: vercel login"

# Run the command
$procInfo = @{ FilePath = 'powershell.exe'; ArgumentList = "-NoProfile","-Command", $cmd; RedirectStandardOutput = $true; RedirectStandardError = $true; UseNewWindow = $false }
$proc = Start-Process @procInfo -PassThru
$stdout = $proc.StandardOutput.ReadToEnd()
$stderr = $proc.StandardError.ReadToEnd()
$proc.WaitForExit()

if ($proc.ExitCode -eq 0) {
  Write-Info "Vercel deploy succeeded. Output:"
  Write-Host $stdout
} else {
  Write-Err "Vercel deploy failed (exit code $($proc.ExitCode))."
  Write-Host $stderr
  exit $proc.ExitCode
}
