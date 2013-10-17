REM @echo off
echo "Creating necessary folders..."
mkdir .\static
mkdir .\static\images
mkdir .\static\css
mkdir .\static\js
mkdir .\views
mkdir .\models
mkdir .\test

echo "Copying code, markup and CSS boilerplate..."
copy .\templates\app\server.js .\server.js
copy .\templates\app\package.json .\package.json
copy .\templates\app\.gitignore .\.gitignore
copy .\templates\app\config.json .\config.json
copy .\templates\app\Makefile .\Makefile
copy .\templates\test\stub.js .\test\stub.js
curl https:\\raw.github.com\h5bp\html5-boilerplate\master\css\main.css > .\static\css\style.css
copy .\templates\views\500.jade .\views\500.jade
copy .\templates\views\404.jade .\views\404.jade
copy .\templates\views\index.jade .\views\index.jade
copy .\templates\views\layout.jade .\views\layout.jade
copy .\templates\js\script.js .\static\js\script.js
REM TODO copy over the models

echo "Setting up dependencies from NPM..."
npm install

echo "Removing stuff you don't want..."
del /S /F .git
del /S /F templates
del README.md
del initproject.sh

echo "Initializing new git project..."
git init
git add .
git commit -m"Initial Commit"
