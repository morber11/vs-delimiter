param(
    [string]$Pat = $env:VSCE_PAT
)

$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
Set-Location $scriptDir

Write-Host 'Compiling extension...' -ForegroundColor Cyan
npm run compile
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Compilation failed. Aborting publish.'
    exit $LASTEXITCODE
}

Write-Host 'Packaging extension with vsce...' -ForegroundColor Cyan
vsce package
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Package creation failed. Aborting publish.'
    exit $LASTEXITCODE
}

Write-Host 'Publishing extension with vsce...' -ForegroundColor Cyan
if ($Pat) {
    vsce publish --pat $Pat
}
else {
    vsce publish
}
if ($LASTEXITCODE -ne 0) {
    Write-Error 'vsce publish failed.'
    exit $LASTEXITCODE
}

Write-Host 'Publish completed successfully.' -ForegroundColor Green
