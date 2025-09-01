@echo off
REM This script helps ensure proper deployment to Vercel

REM Create output directory
mkdir .vercel\output\static 2>nul

REM Copy all HTML files to output
xcopy *.html .vercel\output\static\ /Y

REM Copy assets and other important files
xcopy assets .vercel\output\static\assets\ /E /I /Y
if exist js xcopy js .vercel\output\static\js\ /E /I /Y

REM Create an index.html in the output that redirects to landingpage.html
echo ^<!DOCTYPE html^> > .vercel\output\static\index.html
echo ^<html lang="en"^> >> .vercel\output\static\index.html
echo ^<head^> >> .vercel\output\static\index.html
echo     ^<meta charset="UTF-8"^> >> .vercel\output\static\index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> .vercel\output\static\index.html
echo     ^<title^>Girlsin^</title^> >> .vercel\output\static\index.html
echo     ^<meta http-equiv="refresh" content="0;url=landingpage.html"^> >> .vercel\output\static\index.html
echo     ^<script type="text/javascript"^> >> .vercel\output\static\index.html
echo         window.location.href = "landingpage.html"; >> .vercel\output\static\index.html
echo     ^</script^> >> .vercel\output\static\index.html
echo ^</head^> >> .vercel\output\static\index.html
echo ^<body^> >> .vercel\output\static\index.html
echo     ^<p^>If you are not redirected automatically, please ^<a href="landingpage.html"^>click here^</a^>.^</p^> >> .vercel\output\static\index.html
echo ^</body^> >> .vercel\output\static\index.html
echo ^</html^> >> .vercel\output\static\index.html

echo Build script completed successfully.
