#!/bin/bash
# This script helps ensure proper deployment to Vercel

# Create output directory
mkdir -p .vercel/output/static

# Copy all HTML files to output
cp -r *.html .vercel/output/static/

# Copy assets and other important files
cp -r assets .vercel/output/static/
cp -r js .vercel/output/static/

# Create an index.html in the output that redirects to landingpage.html
cat > .vercel/output/static/index.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Girlsin</title>
    <meta http-equiv="refresh" content="0;url=landingpage.html">
    <script type="text/javascript">
        window.location.href = "landingpage.html";
    </script>
</head>
<body>
    <p>If you are not redirected automatically, please <a href="landingpage.html">click here</a>.</p>
</body>
</html>
EOL

echo "Build script completed successfully."
