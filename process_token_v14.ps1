Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\blakm\.gemini\antigravity\brain\8faa6d99-4f88-4b55-9b8a-9accc827ee3d\uploaded_image_1766637146068.png"
$destPath = "C:\Users\blakm\OneDrive\Desktop\RPG\rpg-tabletop\public\tokens\token_fiend.png"

# Ensure output directory exists
$destDir = Split-Path $destPath
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

Write-Host "Processing image from $sourcePath..."
$image = [System.Drawing.Image]::FromFile($sourcePath)
$finalSize = 256

# Logic: Scale to Fit (Contain)
# Calculate scale factor to fit entire image in 256x256
$ratioX = $finalSize / $image.Width
$ratioY = $finalSize / $image.Height
$ratio = [Math]::Min($ratioX, $ratioY)

$newWidth = [int]($image.Width * $ratio)
$newHeight = [int]($image.Height * $ratio)

$posX = [int](($finalSize - $newWidth) / 2)
$posY = [int](($finalSize - $newHeight) / 2)

Write-Host "Scaling to ${newWidth}x${newHeight} (Fit)"

$finalBitmap = New-Object System.Drawing.Bitmap($finalSize, $finalSize)
$graphics = [System.Drawing.Graphics]::FromImage($finalBitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Draw resized image centered
$graphics.DrawImage($image, $posX, $posY, $newWidth, $newHeight)

$finalBitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$image.Dispose()
$croppedBitmap.Dispose()
$finalBitmap.Dispose()

Write-Host "Token successfully generated at $destPath"
