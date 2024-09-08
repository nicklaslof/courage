#!/bin/sh
rm dist.zip
mkdir -p dist
cd src
rollup g.js --format cjs --file ../dist/bundle.js
cp t-tinified.png ../dist/t.png
cd ..
cd dist

terser bundle.js -o g.js --compress --mangle --mangle-props --timings --toplevel --module
rm bundle.js

# Let roadroller run until stopped. I usually leave it running for an hour and then record the output parameters to save time next time
#roadroller -OO g.js -o ./o.js


roadroller -Zab24 -Zlr2260 -Zmc3 -Zmd123 -S0,1,2,3,5,6,13,26,57,85,170,451 g.js -o ./o.js


echo "<meta charset="UTF-8"><style>" > index-template.html
cat ../src/i.css >> index-template.html
echo "</style>" >> index-template.html
echo "<canvas id=\"g\"></canvas><canvas id=\"t\"></canvas>" >> index-template.html
echo "<canvas id=\"u\"></canvas>" >> index-template.html
echo "<script>" >> index-template.html
cat ../src/c.js >> index-template.html
echo "</script>" >> index-template.html
echo "<script charset=\"utf8\">" >> index-template.html
cat o.js >> index-template.html
echo "</script>" >> index-template.html
cat index-template.html | tr -d '\n' > index.html


rm g.js o.js index-template.html

zip -9 -r ../dist.zip *
cd ..
echo "ect:"
./ect -9 -zip ./dist.zip
ls -la ./dist.zip
