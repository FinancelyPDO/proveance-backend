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
// Variables
let kycData = [];
// Routes
// WEB2 API FUNCTIONS
app.post('/web2/accounts', (req, res) => {
    const { access_token } = req.body;
    fetch(`https://oxeniotna-sandbox.biapi.pro/2.0/users/me/accounts`, {
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
app.post('/web2/transactions', (req, res) => {
    const { access_token, amount, name, condition } = req.body; // Date to be add
    let validTransactions = [];
    fetch(`https://oxeniotna-sandbox.biapi.pro/2.0/users/me/transactions?limit=1000`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((data) => {
        data.transactions.map((transaction) => {
            if (transaction.wording == name) { // date to be added (transaction.date >= date)
                if (condition == "low" && Math.abs(transaction.value) < amount) {
                    validTransactions.push(transaction);
                }
                else if (condition == "high" && Math.abs(transaction.value) > amount) {
                    validTransactions.push(transaction);
                }
                else if (condition == "equl" && Math.abs(transaction.value) == amount) {
                    validTransactions.push(transaction);
                }
            }
        });
        res.json(validTransactions);
    })
        .catch((error) => {
        console.error('Error:', error);
    });
});
app.post('/web2/creditscore', (req, res) => {
    const { access_token } = req.body;
    function normalize(value, min, max) {
        return (value - min) / (max - min);
    }
    // Not implemented yet: this data needs be performed by an AI for categorization of bank transactions
    let income = 5000;
    let creditHistory = 2;
    let jobStability = 4;
    const incomeWeight = 0.4;
    const creditHistoryWeight = 0.3;
    const jobStabilityWeight = 0.3;
    const normalizedIncome = normalize(income, 1000, 10000);
    const normalizedCreditHistory = normalize(creditHistory, 0, 10);
    const normalizedJobStability = normalize(jobStability, 0, 5);
    const score = (normalizedIncome * incomeWeight) +
        (normalizedCreditHistory * creditHistoryWeight) +
        (normalizedJobStability * jobStabilityWeight);
    const normalizedScore = normalize(score, 0, 10);
    res.json(normalizedScore);
});
app.post('/web2/savekyc', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, firstname, lastname, bank_id } = req.body;
    const newKYC = {
        address,
        firstname,
        lastname,
        bank_id,
    };
    kycData.push(newKYC);
    res.status(201).json({ message: 'KYC information saved successfully' });
}));
app.post('/web2/getkyc', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.body;
    const kycInfo = kycData.find(entry => entry.address === address);
    if (kycInfo) {
        res.json(kycInfo);
    }
    else {
        res.status(404).json({ error: 'KYC information not found for the provided address' });
    }
}));
// WEB3 API FUNCTIONS
app.post('/web3/recoverAddressInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ethAddress = req.body.ethAddress;
    if (!ethAddress) {
        return res.status(400).send('Ethereum address is required');
    }
    res.json(yield (0, getWalletBalances_1.GetWalletBalances)(ethAddress));
}));
app.post('/web3/calculateWeb3Balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newaddressdata = req.body.addressdata;
    if (!newaddressdata) {
        return res.status(400).send('The New address data are required');
    }
    res.json(yield (0, calculateTotalBalances_1.calculateTotalBalance)(newaddressdata));
}));
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
