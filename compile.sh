#!/bin/sh
rm dist.zip
mkdir -p dist
cd src
rollup g.js --format cjs --file ../dist/bundle.js
cp t-tinified.png ../dist/t.png
cd ..
cd dist
#terser bundle.js -o i.js --compress --mangle --mangle-props reserved=["g","img","flush","bkg","cls","col","init","generate","createWave"] --timings --toplevel --module
terser bundle.js -o g.js --compress --mangle --mangle-props --timings --toplevel --module
rm bundle.js
#roadroller -OO g.js -o ./o.js

roadroller -Zab26 -Zlr2501 -Zmc3 -Zmd117 -S0,1,2,3,5,7,14,25,85,106,225,387 g.js -o ./o.js
#roadroller -Zab28 -Zlr2501 -Zmc3 -Zmd111 -Zpr16 -S0,1,2,3,5,14,19,25,85,225,362,387 g.js -o ./o.js

#roadroller -Zab22 -Zlr2137 -Zmc3 -Zmd117 -Zpr16 -S0,1,2,3,5,7,14,25,85,225,298,453 g.js -o ./o.js



#roadroller -Zab34 -Zdy0 -Zlr2411 -Zmc3 -Zmd85 -Zpr16 -S0,1,2,3,5,7,14,25,50,101,330,417 g.js -o ./o.js

#roadroller -Zab35 -Zlr2090 -Zmc3 -Zmd117 -S0,1,2,3,5,6,13,25,42,113,212,451 g.js -o ./o.js
#roadroller -Zab35 -Zdy1 -Zlr2600 -Zmc3 -Zmd137 -Zpr16 -S0,1,2,3,5,7,14,19,25,102,213,417 g.js -o ./o.js
#/opt/homebrew/opt/gnu-sed/libexec/gnubin/sed 's/\x1f//g' o.js > oo.js
echo "<meta charset="UTF-8"><style>" > index-template.html
cat ../src/i.css >> index-template.html
echo "</style>" >> index-template.html
echo "<canvas id=\"g\"></canvas><canvas id=\"t\"></canvas>" >> index-template.html
echo "<canvas id=\"u\"></canvas>" >> index-template.html
#echo "<script>" >> index-template.html
#cat  ../src/lib/z.js >> index-template.html
#echo "</script>" >> index-template.html
#echo "<script>" >> index-template.html
#cat  ../src/lib/noise.js >> index-template.html
#echo "</script>" >> index-template.html
echo "<script>" >> index-template.html
cat ../src/c.js >> index-template.html
echo "</script>" >> index-template.html
echo "<script charset=\"utf8\">" >> index-template.html
cat o.js >> index-template.html
echo "</script>" >> index-template.html
#echo "</script><div id="s">Press any key to start</div>" >> index-template.html

cat index-template.html | tr -d '\n' > index.html


rm g.js o.js index-template.html

zip -9 -r ../dist.zip *
cd ..
echo "ect:"
./ect -9 -zip ./dist.zip
ls -la ./dist.zip
