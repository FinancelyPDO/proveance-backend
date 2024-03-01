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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const getWalletBalances_1 = require("./Web3Balance/getWalletBalances");
const calculateTotalBalances_1 = require("./Web3Balance/calculateTotalBalances");
// App config
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
// Env config
dotenv_1.default.config();
const port = process.env.PORT || 8000;
// Routes
app.post('/api/web2/balance', (req, res) => {
    const { access_token } = req.body;
    fetch(`https://buildhathon-sandbox.biapi.pro/2.0/users/me/accounts`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((data) => {
        const resData = {
            "balance": data.balance
        };
        res.json(resData);
    })
        .catch((error) => {
        console.error('Error:', error);
    });
});
app.post('/api/web2/payments', (req, res) => {
    const { access_token, limit_date, amount, name, condition } = req.body;
    let nbPayments = 0;
    fetch(`https://buildhathon-sandbox.biapi.pro/2.0/users/me/transactions?limit=1000`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((data) => {
        data.transactions.map((transaction) => {
            if (transaction.date >= limit_date && transaction.wording == name) {
                if (condition == "low" && Math.abs(transaction.value) < amount) {
                    nbPayments++;
                }
                if (condition == "high" && Math.abs(transaction.value) > amount) {
                    nbPayments++;
                }
                if (condition == "equl" && Math.abs(transaction.value) == amount) {
                    nbPayments++;
                }
            }
        });
        res.json(nbPayments);
    })
        .catch((error) => {
        console.error('Error:', error);
    });
});
app.post('/api/web3/recoverAddressInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ethAddress = req.body.ethAddress;
    if (!ethAddress) {
        return res.status(400).send('Ethereum address is required');
    }
    const test = yield (0, getWalletBalances_1.GetWalletBalances)(ethAddress);
    res.json(test);
}));
app.post('/api/web3/calculateWeb3Balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const Json = req.body.newJson;
    if (!Json) {
        return res.status(400).send('Json is required');
    }
    const test = yield (0, calculateTotalBalances_1.calculateTotalBalance)(Json);
    res.json(test);
}));
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
