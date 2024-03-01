"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWalletBalances = void 0;
const erc20ABI_1 = require("./constants/erc20ABI");
const viem_1 = require("viem");
const client_1 = __importDefault(require("./constants/client"));
const chainData_json_1 = __importDefault(require("./constants/chainData.json"));
const chainifiedList_json_1 = __importDefault(require("./constants/chainifiedList.json"));
const jsonTokenLists = [chainifiedList_json_1.default];
const publicClients = client_1.default;
const GetWalletBalances = (address) => __awaiter(void 0, void 0, void 0, function* () {
    let allTokenInfo = {};
    let allTokenChainInfo = {};
    if (address) {
        for (let i = 0; i < jsonTokenLists.length; i++) {
            const tokenList = jsonTokenLists[i];
            const balancePromises = tokenList.tokens.flatMap(token => {
                // Function to retrieve the balance for a given token address
                const fetchTokenBalance = (tokenAddress, chainId) => {
                    if (!publicClients[chainId]) {
                        console.warn(`Client not found for chain ID: ${chainId}`);
                        return Promise.resolve();
                    }
                    return publicClients[chainId].readContract({
                        address: tokenAddress,
                        abi: erc20ABI_1.erc20ABI,
                        functionName: 'balanceOf',
                        args: [address]
                    }).then(data => {
                        const balance = data && (0, viem_1.formatUnits)(data, token.decimals);
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
                const balances = [fetchTokenBalance(token.address, token.chainId)];
                // Check and manage bridgeInfo (Token on other chains)
                if (token.extensions && token.extensions.bridgeInfo) {
                    Object.entries(token.extensions.bridgeInfo).forEach(([chainId, { tokenAddress }]) => {
                        balances.push(fetchTokenBalance(tokenAddress, Number(chainId)));
                    });
                }
                return balances;
            });
            const allBalances = yield Promise.all(balancePromises.flat()); // .flat()  => [[{}],[{}]] => [{},{}] Because we did flatMap before 
            const newTokenInfo = allBalances.reduce((acc, balance) => (Object.assign(Object.assign({}, acc), balance)), {}); // Transform the array into an object [{},{}] => {0:{},1:{}}
            allTokenInfo = Object.assign(Object.assign({}, allTokenInfo), newTokenInfo);
        }
        // For the token chain :
        const chainBalancePromises = chainData_json_1.default.chains.map(chain => {
            return publicClients[chain.chainId].getBalance({ address }).then(rawBalance => {
                const balance = (0, viem_1.formatUnits)(rawBalance, chain.decimals);
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
        const allChainBalances = yield Promise.all(chainBalancePromises);
        const tempallTokenChainInfo = allChainBalances.reduce((acc, balance) => (Object.assign(Object.assign({}, acc), balance)), {});
        allTokenChainInfo = Object.assign(Object.assign({}, allTokenChainInfo), tempallTokenChainInfo); //I do this because I have a typescript error of void ... (I could do this either : // @ts-ignore )
    }
    return { allTokenInfo, allTokenChainInfo };
});
exports.GetWalletBalances = GetWalletBalances;
