#bash

rm -rf ./build/*.wasm
rm -rf ./build/*.wasm.map
rm -rf ./build/*.js
rm -rf ./build/*.d.ts
for file in ./aspect/*.ts
do
    if test -f $file
    then
      echo $file
      fileName=$(basename $file .ts)
      ./node_modules/assemblyscript/bin/asc.js $file  --outFile ./build/${fileName}.wasm
    fi
done
