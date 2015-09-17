npm run build
find static -name '*.html' -delete
convert -background none -density 500 -scale 300x300 ./src/containers/Home/logo.svg static/logo.png
npm run start-prod &
trap "jobs -p; sleep 5; pstree -p `jobs -p`; kill -INT `jobs -p | xargs`" EXIT
sleep 10;
rm -rf tmp
mkdir -p tmp/chooser
curl http://localhost:8080/ > tmp/index.html
curl http://localhost:8080/chooser/ > tmp/chooser/index.html
cp -rf tmp/* static/
