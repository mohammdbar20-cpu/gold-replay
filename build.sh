#!/bin/sh
# Edit src/app.js, then run: sh build.sh
npx -y esbuild@0.24 src/app.js --target=chrome58 --outfile=app.js
