"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalBalance = void 0;
const calculateTotalBalance = (json) => {
    let totalBalance = 0;
    try {
        // Lecture du fichier JSON
        const cryptos = json;
        // Itération à travers chaque entrée du fichier JSON
        for (const address in cryptos) {
            console.log(address);
            const crypto = cryptos[address];
            totalBalance += crypto.total; // Ajout de la balance totale de chaque cryptomonnaie
        }
    }
    catch (error) {
        console.error('Erreur lors de la lecture du fichier JSON:', error);
    }
    return {
        totaleBalance: totalBalance
      };
};
exports.calculateTotalBalance = calculateTotalBalance;
