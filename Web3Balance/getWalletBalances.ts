import { erc20ABI } from './constants/erc20ABI';
import { formatUnits } from 'viem'
import clients from './constants/client';
import chainData from './constants/chainData.json';
import { AllTokenInfo, AllTokenChainInfo } from './type';

import chainifiedList from './constants/chainifiedList.json';

const jsonTokenLists = [chainifiedList];

const publicClients = clients;

export const GetWalletBalances = async (address: `0x${string}`) => {
    let allTokenInfo: AllTokenInfo = {};
    let allTokenChainInfo: AllTokenChainInfo = {};
    if (address) {
        for (let i = 0; i < jsonTokenLists.length; i++) {
            const tokenList = jsonTokenLists[i];
            const balancePromises = tokenList.tokens.flatMap(token => { //flatmap() because we're potentially creating 2 or more promises per token (token on the main chain and token on the bridge info)
                // Function to retrieve the balance for a given token address
                const fetchTokenBalance = (tokenAddress: `0x${string}`, chainId: number) => {
                    if (!publicClients[chainId]) {
                        console.warn(`Client not found for chain ID: ${chainId}`);
                        return Promise.resolve();
                    }
                    return publicClients[chainId].readContract({
                        address: tokenAddress,
                        abi: erc20ABI,
                        functionName: 'balanceOf',
                        args: [address]
                    }).then(data => {
                        const balance = data && formatUnits(data, token.decimals);
                        if (balance && balance != '0') {
                            return {
                                [tokenAddress]: {
                                    name: token.name || "Default Name",
                                    symbol: token.symbol,
                                    chainId: chainId,
                                    decimals: token.decimals,
                                    logoURI: token.logoURI || "default-logo-uri.png",
                                    balance: balance || '0'
                                }
                            };
                        }
                    }).catch(error => { });
                };
                
                // Retrieve the balance for the token's main address
                const balances = [fetchTokenBalance(token.address as `0x${string}`, token.chainId)];

                // Check and manage bridgeInfo (Token on other chains)
                if (token.extensions && token.extensions.bridgeInfo) {
                    Object.entries(token.extensions.bridgeInfo).forEach(([chainId, { tokenAddress }]) => {
                        balances.push(fetchTokenBalance(tokenAddress as `0x${string}`, Number(chainId)));
                    });
                }
                return balances;
            });

            const allBalances = await Promise.all(balancePromises.flat()); // .flat()  => [[{}],[{}]] => [{},{}] Because we did flatMap before 
            const newTokenInfo = allBalances.reduce((acc, balance) => ({ ...acc, ...balance }), {}); // Transform the array into an object [{},{}] => {0:{},1:{}}
            allTokenInfo = { ...allTokenInfo, ...newTokenInfo };
        }

        // For the token chain :
        const chainBalancePromises = chainData.chains.map(chain => {
            return publicClients[chain.chainId].getBalance({ address }).then(rawBalance => {
                const balance = formatUnits(rawBalance, chain.decimals);
                if (balance && balance != '0') {
                    return {
                        [chain.chainId]: {
                            name: chain.name,
                            symbol: chain.symbol,
                            decimals: chain.decimals,
                            logoURI: chain.logoURI,
                            balance: balance
                        }
                    };
                }
            }).catch(error => { });
        });

        const allChainBalances = await Promise.all(chainBalancePromises);
        const tempallTokenChainInfo = allChainBalances.reduce((acc, balance) => ({ ...acc, ...balance }), {});  
        allTokenChainInfo = { ...allTokenChainInfo, ...tempallTokenChainInfo }; //I do this because I have a typescript error of void ... (I could do this either : // @ts-ignore )
    }
    return { allTokenInfo, allTokenChainInfo };
};