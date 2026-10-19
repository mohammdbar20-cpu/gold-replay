#!/bin/sh
# Edit src/*.js, then run: sh build.sh   (app.js = src/app.js + src/course.js, shared scope)
cat src/app.js src/course.js > /tmp/gr_bundle.js
npx -y esbuild@0.24 /tmp/gr_bundle.js --target=chrome58 --outfile=app.js
npx -y esbuild@0.24 src/i18n.js --target=chrome58 --outfile=i18n.js
