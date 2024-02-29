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
const port = process.env.PORT || 3000;

// Routes
app.get('/api/web2/connection', (req, res) => {
    const redirectUrl = 'https://buildhathon-sandbox.biapi.pro/2.0/auth/webview/connect?client_id=61176337&redirect_uri=http://localhost:8000/api/web2/access';
    res.redirect(redirectUrl);
});

app.get('/api/web2/access', (req, res) => {
    const code = req.query.code as string;
    const connectionId = req.query.connection_id as string;

    console.log('Code:', code);
    console.log('Connection ID:', connectionId);

    const data = {
        code: code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    };

    fetch(`https://buildhathon-sandbox.biapi.pro/2.0/auth/token/access`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response: any) => response.json())
    .then((data: any) => {
        console.log('Access Token:', data.access_token);
        const resAccess = {
            access_token: data.access_token
        };

        res.redirect(`http://localhost:3000/proof-of-reserve?access_token=${data.access_token}`);
    })
    .catch((error: any) => {
        console.error('Error:', error);
    });
});

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

app.post('/api/web3/passaddress', (req, res) => {
    const ethAddress = req.body.ethAddress;

  if (!ethAddress) {
    return res.status(400).send('Ethereum address is required');
  }
  res.json(GetWalletBalances(ethAddress));
});

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
