# Provehance Backend 🚀

Welcome to Provehance backend repository, the ultimate backend solution for processing both traditional banking data (Web2) and blockchain (Web3) data. Our API integrates with financial institutions and blockchain wallets, allowing you to harness the full potential of financial data. 🏦💼

## Features

- **Web2 Accounts**: Access and manage traditional bank account balances. 💳
- **Web2 Transactions**: Filter and retrieve banking transactions based on custom conditions. 🧾
- **Web2 Credit Score**: Calculate a credit score using a customizable algorithm. (Note: AI categorization not implemented yet). 📊
- **Web2 KYC**: Store and retrieve Know Your Customer (KYC) data securely. 🛂
- **Web3 Functions**: Recover balance information from blockchain addresses. 🔗

## Setup
- Make sure you have Node.js installed on your machine.
- Clone the repository and navigate into the project directory.
- Install the dependencies using ```npm install```.
- Start the server with ```npm start``` or ```node index.ts```. The server will listen on the port specified in your environment variables or default to 8000. 🚀

## Configuration
Before starting the server, create a .env file in the project root and set your environment variables:

```bash
env
Copy code
PORT=8000 # The port on which the server should listen
```

## API Endpoints

- **POST** /web2/accounts: Fetch the balance data from bank account api.
- **POST** /web2/transactions: Get bank account transactions that match given criteria.
- **POST** /web2/creditscore: Compute a credit score based on income, credit history, and job stability.
- **POST** /web2/savekyc: Save KYC data for later retrieval.
- **POST** /web2/getkyc: Retrieve KYC data for a given address.
...and more for Web3 interactions.

## Contributing
Your contributions are welcome! Please feel free to submit pull requests, open issues, and provide feedback. 🤝

## License
This project is open-source and available under the MIT License. 📄
