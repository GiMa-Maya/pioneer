let Changelly = require('@bithighlander/changelly');

const TAG = " | blocknative | ";
const CHANGELLY_API_KEY = process.env['CHANGELLY_API_KEY'];
const CHANGELLY_API_SECRET = process.env['CHANGELLY_API_SECRET'];

if (!CHANGELLY_API_KEY) throw new Error('CHANGELLY_API_KEY not set');
if (!CHANGELLY_API_SECRET) throw new Error('CHANGELLY_API_SECRET not set');

let changelly: any;

let {shortListSymbolToCaip} = require("@pioneer-platform/pioneer-caip")


let networkSupport = [
    shortListSymbolToCaip["XRP"],
    shortListSymbolToCaip["DASH"],
    shortListSymbolToCaip["ZEC"],
    // shortListSymbolToCaip["BSV"], //TODO
    // shortListSymbolToCaip["ADA"], //TODO
    // shortListSymbolToCaip["EOS"], //TODO
    shortListSymbolToCaip["GAIA"],
    shortListSymbolToCaip["BNB"],
    shortListSymbolToCaip["DOGE"],
    shortListSymbolToCaip["BTC"],
    shortListSymbolToCaip["ETH"],
    shortListSymbolToCaip["LTC"],
    shortListSymbolToCaip["THOR"],
    shortListSymbolToCaip["BCH"],
    shortListSymbolToCaip["GNO"],
    shortListSymbolToCaip["MATIC"],
    shortListSymbolToCaip["AVAX"],
]

module.exports = {
    init: function(settings: any): void {
        changelly = new Changelly(CHANGELLY_API_KEY, CHANGELLY_API_SECRET);
    },
    networkSupport: function () {
        return networkSupport
    },
    getCurrenciesAsync: function(): Promise<any> {
        return get_currencies();
    },
    getQuote: function(from: string, to: string, address: string, amount: number, extraId?: string): Promise<any> {
        return create_transaction(from, to, address, amount, extraId);
    },
    // createTransactionAsync: function(from: string, to: string, address: string, amount: number, extraId?: string): Promise<any> {
    //     return create_transaction(from, to, address, amount, extraId);
    // },
    getMinAmountAsync: function(from: string, to: string): Promise<any> {
        return get_min_amount(from, to);
    },
    getExchangeAmountAsync: function(from: string, to: string, amount: number): Promise<any> {
        return get_exchange_amount(from, to, amount);
    },
    getTransactionsAsync: function(limit: number, offset: number, currency?: string, address?: string, extraId?: string): Promise<any> {
        return get_transactions(limit, offset, currency, address, extraId);
    },
    getStatusAsync: function(id: string): Promise<any> {
        return get_status(id);
    }
};

async function get_currencies(): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getCurrencies((err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_currencies error:", e);
        throw e;
    }
}

async function create_transaction(from: string, to: string, address: string, amount: number, extraId?: string): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.createTransaction(from, to, address, amount, extraId, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "create_transaction error:", e);
        throw e;
    }
}
async function get_min_amount(from: string, to: string): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getMinAmount(from, to, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_min_amount error:", e);
        throw e;
    }
}

async function get_exchange_amount(from: string, to: string, amount: number): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getExchangeAmount(from, to, amount, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_exchange_amount error:", e);
        throw e;
    }
}

async function get_transactions(limit: number, offset: number, currency?: string, address?: string, extraId?: string): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getTransactions(limit, offset, currency, address, extraId, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_transactions error:", e);
        throw e;
    }
}

async function get_status(id: string): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getStatus(id, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_status error:", e);
        throw e;
    }
}