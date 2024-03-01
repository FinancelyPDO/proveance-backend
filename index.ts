import express from 'express';
import dotenv from 'dotenv';
import { GetWalletBalances } from './Web3Balance/getWalletBalances';

// App config
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Env config
dotenv.config();
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
    .then((response: any) => response.json())
    .then((data: any) => {
        data.transactions.map((transaction: any) => {
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
        })
        res.json(nbPayments);
    })
    .catch((error: any) => {
        console.error('Error:', error);
    });
});

app.post('/api/web3/recoverAddressInfo', async (req, res) => {
    const ethAddress = req.body.ethAddress;

  if (!ethAddress) {
    return res.status(400).send('Ethereum address is required');
  }
  const test = await GetWalletBalances(ethAddress);
  res.json(test);
});

app.post('/api/web3/calculateWeb3Balance', async (req, res) => {
    const Json = req.body.Json;

  if (!Json) {
    return res.status(400).send('Json is required');
  }
  const test = await calculateTotalBalance(Json);
  res.json(test);
});

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
