Add-Type -AssemblyName System.Drawing

$size = 192
$img = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($img)
$g.Clear([System.Drawing.Color]::FromArgb(102,126,234))
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255,255,255,40))
$g.FillEllipse($brush, 19, 19, 154, 154)
$brush.Dispose()
$poly = [System.Drawing.Point[]]@(
    [System.Drawing.Point]::new(19,86),
    [System.Drawing.Point]::new(96,42),
    [System.Drawing.Point]::new(173,86),
    [System.Drawing.Point]::new(96,112)
)
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$g.FillPolygon($whiteBrush, $poly)
$g.FillRectangle($whiteBrush, 86,109,20,66)
$img.Save('icons/icon-192.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$img.Dispose()
Write-Output 'created 192'
