Write-Host "🧹 Чищу .next/.turbo..."
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue

Write-Host "🚀 Запускаю dev-сервер..."
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
