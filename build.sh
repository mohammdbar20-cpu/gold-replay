#!/bin/sh
# Edit src/*.js, then run: sh build.sh
npx -y esbuild@0.24 src/app.js --target=chrome58 --outfile=app.js
npx -y esbuild@0.24 src/i18n.js --target=chrome58 --outfile=i18n.js
