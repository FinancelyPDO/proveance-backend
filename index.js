"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require('cors');
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(cors());
const port = process.env.PORT;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Bonjour!');
});
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
