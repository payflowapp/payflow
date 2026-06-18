Add-Type -AssemblyName System.Drawing

$size = 512
$bmp  = New-Object System.Drawing.Bitmap($size, $size)
$g    = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode   = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Full-bleed lime background (#CCFB50). GitHub rounds org avatars itself.
$lime = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 204, 251, 80))
$g.FillRectangle($lime, 0, 0, $size, $size)

# Chevron pen: near-black (#0A0A0C), thick, rounded caps/joins. Scale x8 from 64-space.
function New-ChevronPen([int]$alpha) {
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb($alpha, 10, 10, 12)), 64
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    return $pen
}

# Chevron 1 (solid): (112,128)->(240,256)->(112,384)
$p1 = New-ChevronPen 255
$g.DrawLines($p1, @(
    (New-Object System.Drawing.PointF(112, 128)),
    (New-Object System.Drawing.PointF(240, 256)),
    (New-Object System.Drawing.PointF(112, 384))
))

# Chevron 2 (0.45 opacity): (272,128)->(400,256)->(272,384)
$p2 = New-ChevronPen 115
$g.DrawLines($p2, @(
    (New-Object System.Drawing.PointF(272, 128)),
    (New-Object System.Drawing.PointF(400, 256)),
    (New-Object System.Drawing.PointF(272, 384))
))

$g.Dispose()
$out = Join-Path $PSScriptRoot 'logo-512.png'
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Wrote $out"
