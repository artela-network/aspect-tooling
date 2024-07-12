import Web3 from '@artela/web3';
import {
    isBloom,
    isUserEthereumAddressInBloom,
    isContractAddressInBloom,
    isTopic,
    isTopicInBloom,
    isInBloom,
} from 'ethereum-bloom-filters';

// 创建web3实例，连接到你的以太坊节点
const web3 = new Web3("ws://47.254.68.8:8546");

const logTopic = web3.utils.soliditySha3('LogTest(string)');

const topicBloom =
        '0x00000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000200000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000';
// const ss=isTopicInBloom(
//     'invalid',
//     '0x4d61726b65745061792e696f206973206465706c6f79696e6720536d61727420',
// );
//console.log('Log included in block Bloom Filter:', ss);


const bb=isTopicInBloom(topicBloom, logTopic)

console.log('Log included in block Bloom Filter:', bb);
