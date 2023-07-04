export const HoneyPotStorageTmpl=`
{
	"storage": [
		{
			"astId": 5,
			"contract": "contracts/HoneyPot.sol:HoneyPot",
			"label": "balances",
			"offset": 0,
			"slot": "0",
			"type": "t_mapping(t_address,t_uint256)"
		}
	],
	"types": {
		"t_address": {
			"encoding": "inplace",
			"label": "address",
			"numberOfBytes": "20"
		},
		"t_mapping(t_address,t_uint256)": {
			"encoding": "mapping",
			"key": "t_address",
			"label": "mapping(address => uint256)",
			"numberOfBytes": "32",
			"value": "t_uint256"
		},
		"t_uint256": {
			"encoding": "inplace",
			"label": "uint256",
			"numberOfBytes": "32"
		}
	}
}`