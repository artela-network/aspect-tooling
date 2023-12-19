#bash
##

if [ ! -f "./privateKey.txt" ]; then
npm run account:create
node scripts/account.cjs
fi

## deploy contract and get address
npm run contract:build
contractAddress=`npm run contract:deploy -- --abi ./build/contract/HoneyPot.abi  --bytecode ./build/contract/HoneyPot.bin | grep "\--contractAddress" | awk -F "contractAddress" '{ print $2; }' | xargs`
echo "contractAddress == ${contractAddress}"

## deploy aspect
npm run aspect:build
aspectId=`npm run aspect:deploy -- --wasm ./build/release.wasm | grep "aspectID ==" | awk -F "==" '{ print $3;}' | xargs`
echo "aspectId == ${aspectId}"

npm run contract:bind -- --contract ${contractAddress} --abi ./build/contract/HoneyPot.abi --aspectId ${aspectId}
