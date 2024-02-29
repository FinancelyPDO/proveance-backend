"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// App config
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
// Env config
dotenv_1.default.config();
const port = process.env.PORT || 3000;
// Routes
app.get('/web2/connection', (req, res) => {
    const redirectUrl = 'https://thisisdenver-sandbox.biapi.pro/2.0/auth/webview/connect?client_id=65388666&redirect_uri=http://localhost:8000/web2/access';
    res.redirect(redirectUrl);
});
app.get('/web2/access', (req, res) => {
    const code = req.query.code;
    const connectionId = req.query.connection_id;
    console.log('Code:', code);
    console.log('Connection ID:', connectionId);
    const data = {
        code: code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    };
    fetch(`https://thisisdenver-sandbox.biapi.pro/2.0/auth/token/access`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
        console.log('Access Token:', data.access_token);
        const resAccess = {
            access_token: data.access_token
        };
        res.json(resAccess);
    })
        .catch(error => {
        console.error('Error:', error);
    });
});
// access_token IS REQUIRED TO CALL
app.post('/web2/data', (req, res) => {
    const { access_token } = req.body;
    fetch(`https://thisisdenver-sandbox.biapi.pro/2.0/users/me/accounts`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
        res.json(data);
    })
        .catch(error => {
        console.error('Error:', error);
    });
});
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
