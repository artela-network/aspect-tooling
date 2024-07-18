
```shell
./aspect/   => write aspect code here
./contracts/ => write Contract code here


## build Aspect
```shell
sh build.sh 
```


## build Contract
```shell
 npm run contract:build
```
Delete `build/contract/Attack_storage.json` after compilation, as this file cannot generate aspect gen


## create account for test
```shell
 npm run account:create
 npm run account:create -- --skfile ./aspect_accounts.txt
 npm run account:create -- --skfile ./attack_accounts.txt
```
there will be three private Key when completed 

1. ./privateKey.txt 
2. ./aspect_accounts.txt
3. ./attack_accounts.txt


## add money to an account

```shell
 node scripts/transfer.cjs --skfile ./xxxx.txt --from {sender_private_key}
 
```

## execute test case

```shell
cd test
node *.test.js
```