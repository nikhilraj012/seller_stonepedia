# PowerShell deployment script for Windows
# Exit on any error
$ErrorActionPreference = "Stop"

# Configuration
$PROJECT_ID = "sellers-stonepedia"
$PROJECT_NUMBER = "928719717351"
$REGION = "asia-southeast1"
$SERVICE_NAME = "sellers-stonepedia"
$REGISTRY = "gcr.io/$PROJECT_ID"
$TIMESTAMP = Get-Date -Format "yyyyMMddHHmmss"
$IMAGE_NAME = "$REGISTRY/${SERVICE_NAME}:$TIMESTAMP"

Write-Host "=== Setting GCloud Project ===" -ForegroundColor Green
gcloud config set project $PROJECT_ID

Write-Host "`n=== Loading Environment Variables from .env.local ===" -ForegroundColor Green
# Load .env.local file
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
            Write-Host "Loaded: $name" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Building $SERVICE_NAME Docker image ===" -ForegroundColor Green
docker build `
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="$env:NEXT_PUBLIC_FIREBASE_API_KEY" `
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" `
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="$env:NEXT_PUBLIC_FIREBASE_PROJECT_ID" `
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$env:NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" `
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$env:NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" `
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="$env:NEXT_PUBLIC_FIREBASE_APP_ID" `
  --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="$env:NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" `
  -t $IMAGE_NAME .

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Pushing $SERVICE_NAME image to Container Registry ===" -ForegroundColor Green
docker push $IMAGE_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Deploying $SERVICE_NAME to Cloud Run ===" -ForegroundColor Green

# Read service.yaml and replace ${IMAGE_URL} with actual image name
$serviceYaml = Get-Content "service.yaml" -Raw
$serviceYaml = $serviceYaml -replace '\$\{IMAGE_URL\}', $IMAGE_NAME

# Write to temporary file
$serviceYaml | Out-File -FilePath "service_resolved.yaml" -Encoding UTF8

# Deploy to Cloud Run
gcloud run services replace service_resolved.yaml --region=$REGION --project=$PROJECT_ID

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Cloud Run deployment failed!" -ForegroundColor Red
    Remove-Item "service_resolved.yaml" -ErrorAction SilentlyContinue
    exit 1
}

# Clean up
Remove-Item "service_resolved.yaml" -ErrorAction SilentlyContinue

Write-Host "`n=== Deployment complete! ===" -ForegroundColor Green

# Get service URL
$serviceUrl = gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format="value(status.url)"
Write-Host "Service URL: $serviceUrl" -ForegroundColor Cyan
