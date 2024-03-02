"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const viem_2 = require("viem");
exports.base = (0, viem_2.defineChain)({
    id: 8453,
    network: 'base',
    name: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        alchemy: {
            http: ['https://base-mainnet.g.alchemy.com/v2'],
            webSocket: ['wss://base-mainnet.g.alchemy.com/v2'],
        },
        infura: {
            http: ['https://base-mainnet.infura.io/v3'],
            webSocket: ['wss://base-mainnet.infura.io/ws/v3'],
        },
        default: {
            http: ['https://mainnet.base.org'],
        },
        public: {
            http: ['https://mainnet.base.org'],
        },
    },
    blockExplorers: {
        blockscout: {
            name: 'Basescout',
            url: 'https://base.blockscout.com',
        },
        default: {
            name: 'Basescan',
            url: 'https://basescan.org',
        },
        etherscan: {
            name: 'Basescan',
            url: 'https://basescan.org',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 5022,
        },
    },
});
// const transport = webSocket(`wss://mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`); //Needed because to many requests with mainnet
//or : https://developers.cloudflare.com/web3/how-to/use-ethereum-gateway/
const clients = {
    1: (0, viem_1.createPublicClient)({ chain: chains_1.mainnet, transport: (0, viem_1.http)(), batch: { multicall: { wait: 32, }, } }),
    11155111: (0, viem_1.createPublicClient)({ chain: chains_1.sepolia, transport: (0, viem_1.http)(), batch: { multicall: { wait: 32, }, } }),
    42161: (0, viem_1.createPublicClient)({ chain: chains_1.arbitrum, transport: (0, viem_1.http)(), batch: { multicall: { wait: 32, }, } }),
    137: (0, viem_1.createPublicClient)({ chain: chains_1.polygon, transport: (0, viem_1.http)(), batch: { multicall: { wait: 32, }, } }),
    42220: (0, viem_1.createPublicClient)({ chain: chains_1.celo, transport: (0, viem_1.http)(), batch: { multicall: { wait: 32, }, } }),
    56: (0, viem_1.createPublicClient)({ chain: chains_1.bsc, transport: (0, viem_1.http)(), batch: { multicall: { wait: 32, }, } }),
    43114: (0, viem_1.createPublicClient)({ chain: chains_1.avalanche, transport: (0, viem_1.http)(), batch: { multicall: { wait: 32, }, } }),
    43113: (0, viem_1.createPublicClient)({ chain: chains_1.avalancheFuji, transport: (0, viem_1.http)(), batch: { multicall: { wait: 32, }, } }),
    8453: (0, viem_1.createPublicClient)({ chain: exports.base, transport: (0, viem_1.http)(), batch: { multicall: { wait: 32, }, } }),
};
// 10: createPublicClient({ chain: optimism, transport: http(), batch: {multicall: {wait: 32,},} }),
exports.default = clients;
const chainIdToNameMap = {
    1: 'mainnet',
    11155111: 'sepolia',
    42161: 'arbitrum',
    10: 'optimism',
    137: 'polygon',
    80001: 'polygonMumbai',
    42220: 'celo',
    44787: 'celoAlfajores',
    56: 'bsc',
    43114: 'avalanche',
    43113: 'avalancheFuji',
    8453: 'base',
    84531: 'baseGoerli',
};
