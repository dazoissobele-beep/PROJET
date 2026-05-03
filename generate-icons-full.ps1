Add-Type -AssemblyName System.Drawing

function Write-Icon($size, $filename) {
    $img = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($img)
    $g.Clear([System.Drawing.Color]::FromArgb(102,126,234))
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255,255,255,40))
    $g.FillEllipse($brush, [math]::Round($size*0.1), [math]::Round($size*0.1), [math]::Round($size*0.8), [math]::Round($size*0.8))
    $brush.Dispose()
    $poly = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new([math]::Round($size*0.1), [math]::Round($size*0.45)),
        [System.Drawing.Point]::new([math]::Round($size*0.5), [math]::Round($size*0.28)),
        [System.Drawing.Point]::new([math]::Round($size*0.9), [math]::Round($size*0.45)),
        [System.Drawing.Point]::new([math]::Round($size*0.5), [math]::Round($size*0.62))
    )
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $g.FillPolygon($whiteBrush, $poly)
    $g.FillRectangle($whiteBrush, [math]::Round($size*0.45), [math]::Round($size*0.58), [math]::Round($size*0.1), [math]::Round($size*0.33))
    $img.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $img.Dispose()
}

Write-Icon 192 'icons/icon-192.png'
Write-Icon 512 'icons/icon-512.png'
Write-Icon 192 'icons/icon-192-maskable.png'
Write-Icon 512 'icons/icon-512-maskable.png'
Write-Output 'created full png set'
