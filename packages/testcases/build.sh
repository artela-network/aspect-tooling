#bash


asc_build() {
  # obtain parameter 1
  file_path=$1
  # print parameter 1
  echo "file path: $file_path"
  # check if the file exists
  if [ -e "$file_path" ]; then
     fileName=$(basename $file_path .ts)
     ./node_modules/assemblyscript/bin/asc.js $file_path  --outFile ./build/${fileName}.wasm  --target release --disable bulk-memory --optimize --debug --runtime stub --exportRuntime --exportStart __aspect_start__
     echo "ok $file_path ./build/${fileName}.wasm "
  fi
}

# check whether the parameters are provided
if [ $# -eq 0 ]; then

 rm -rf ./build/*.wasm
 rm -rf ./build/*.wasm.map
 rm -rf ./build/*.js
 rm -rf ./build/*.d.ts

 for file in ./aspect/*.ts
 do
     if test -f $file
     then
       asc_build $file
     fi
 done

else
  asc_build $1
fi

exit 0




