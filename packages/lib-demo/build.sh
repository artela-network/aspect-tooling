#bash
rm -rf ./node_modules
npm install
rm -rf ./build
for file in ./aspect/*.ts
do
    if test -f $file
    then
      echo $file
      fileName=$(basename $file .ts)
      ./node_modules/assemblyscript/bin/asc.js $file  --outFile ./build/${fileName}.wasm
    fi
done
