import express from 'express';
import dotenv from 'dotenv';
import { GetWalletBalances } from './Web3Balance/getWalletBalances';
import { calculateTotalBalance } from './Web3Balance/calculateTotalBalances';

// App config
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Env config
dotenv.config();
const port = process.env.PORT || 8000;

// Routes

// WEB2 API FUNCTIONS
app.post('/api/web2/accounts', (req, res) => {
    const { access_token } = req.body;

    fetch(`https://oxeniotna-sandbox.biapi.pro/2.0/users/me/accounts`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
    })
    .then((response: any) => response.json())
    .then((data: any) => {
        const resData = {
            "balance": data.balance
        }
        res.json(resData);
    })
    .catch((error: any) => {
        console.error('Error:', error);
    });
});

app.post('/api/web2/transactions', (req, res) => {
    const { access_token, amount, name, condition } = req.body; // Date to be add
    let validTransactions: any[] = [];

    fetch(`https://oxeniotna-sandbox.biapi.pro/2.0/users/me/transactions?limit=1000`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
    })
    .then((response: any) => response.json())
    .then((data: any) => {
        data.transactions.map((transaction: any) => {
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
        })
        res.json(validTransactions);
    })
    .catch((error: any) => {
        console.error('Error:', error);
    });
});

// WEB3 API FUNCTIONS
app.post('/api/web3/recoverAddressInfo', async (req, res) => {
    const ethAddress = req.body.ethAddress;

  if (!ethAddress) {
    return res.status(400).send('Ethereum address is required');
  }
  res.json(await GetWalletBalances(ethAddress));
});

app.post('/api/web3/calculateWeb3Balance', async (req, res) => {
    const newaddressdata = req.body.addressdata;

    if (!newaddressdata) {
        return res.status(400).send('The New address data are required');
    }
    res.json(await calculateTotalBalance(newaddressdata));
});

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
