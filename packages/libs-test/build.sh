#bash
rm -rf ./build
for file in ./assembly/test/*-test.ts
do
    if test -f $file
    then
      fileName=$(basename $file .ts)
      ./node_modules/assemblyscript/bin/asc.js $file  --outFile ./build/${fileName}.wasm
    fi
done
