import { createPublicClient, http, webSocket } from 'viem'
import {
    mainnet, sepolia,
    arbitrum, //42161 (Rinkeby = 4 ?)
    optimism, //10 and (optimisticKovan = 69 ?)
    polygon, polygonMumbai,
    celo, celoAlfajores,
    bsc, //56
    avalanche, avalancheFuji, //43114 and 43113
    baseGoerli // base is not in wagmi/chains !
} from 'viem/chains'
import { defineChain } from 'viem'
import type { PublicClient } from 'viem'
import type { Chain } from 'viem'

export const base = /*#__PURE__*/ defineChain(
    {
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
    },
)

// const transport = webSocket(`wss://mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`); //Needed because to many requests with mainnet
//or : https://developers.cloudflare.com/web3/how-to/use-ethereum-gateway/

const clients: { [key: number]: PublicClient} = {
    1: createPublicClient({ chain: mainnet, transport: http(), batch: {multicall: {wait: 32,},}}),
    11155111: createPublicClient({ chain: sepolia, transport: http(), batch: {multicall: {wait: 32,},} }), //To erase
    42161: createPublicClient({ chain: arbitrum, transport: http(), batch: {multicall: {wait: 32,},} }),
    137: createPublicClient({ chain: polygon, transport: http(), batch: {multicall: {wait: 32,},} }),
    42220: createPublicClient({ chain: celo as Chain, transport: http(), batch: {multicall: {wait: 32,},} }), // Put 'celo as Chain' because celo has a formatter (But need to check if there's a mistake).
    56: createPublicClient({ chain: bsc, transport: http(), batch: {multicall: {wait: 32,},} }),
    43114: createPublicClient({ chain: avalanche, transport: http(), batch: {multicall: {wait: 32,},} }),
    43113: createPublicClient({ chain: avalancheFuji, transport: http(), batch: {multicall: {wait: 32,},} }), //To erase
    8453: createPublicClient({ chain: base, transport: http(), batch: {multicall: {wait: 32,},} }),
  };
  // 10: createPublicClient({ chain: optimism, transport: http(), batch: {multicall: {wait: 32,},} }),
  
export default clients;

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
