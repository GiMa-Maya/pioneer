// Import the Pioneer class from the module
const Pioneer = require("../lib").default;

// Configure the spec URL and query key
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
//process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
let spec = process.env['URL_PIONEER_SPEC']
const config = {
    queryKey:'key:39c95ff7-8b86-49bd-bd42-b30697a8d72c',
    //queryKey: 'key:39c95ff7-8b86-49bd-bd42-b30697a8d72c',
};


let example = {
    "_id": {
        "$oid": "649f3bb36e364200136d2db2"
    },
    "invokeId": "invoke:5AYQE2Cik8s6ypJwhb3zmY",
    "success": true,
    "analysis": {
        "summary": "This function doesn't appear to be calling any token or ETH transfers. We recommend allowing this transaction",
        "isDangerousOperation": false,
        "recommendedAction": "ALLOW",
        "addressDetails": {
            "name": "No Flags Detected",
            "isMaliciousAddress": false,
            "isAssociatedWithProtocol": false,
            "tags": {
                "THEFT": false,
                "CYBERCRIME": false,
                "NO_DATA": true,
                "SANCTIONED": false,
                "MIXER": false,
                "BOT": false,
                "WASH_TRADER": false
            }
        }
    },
    "isEIP1559": false,
    "original": {
        "addressNList": [
            2147483692,
            2147483708,
            2147483648,
            0,
            0
        ],
        "from": "0x38829598219482Aaa6eB05736FCf462acF9B3db0",
        "chainId": 1,
        "nonce": "0x6",
        "value": "0x2df85d331a7b40000",
        "data": "0x3598d8ab000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000017bcf558d90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000869584cd000000000000000000000000c770eefad204b5180df6a14ee197d99d808ee52d00000000000000000000000000000000000000000000009babe1d2d8649f3ba1",
        "gasLimit": "0x20ab1",
        "to": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
        "gasPrice": "0x866d1e646"
    },
    "isError": false,
    "recommended": {
        "addressNList": [
            2147483692,
            2147483708,
            2147483648,
            0,
            0
        ],
        "from": "0x38829598219482Aaa6eB05736FCf462acF9B3db0",
        "chainId": 1,
        "data": "0x3598d8ab000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000017bcf558d90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000869584cd000000000000000000000000c770eefad204b5180df6a14ee197d99d808ee52d00000000000000000000000000000000000000000000009babe1d2d8649f3ba1",
        "to": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
        "value": "0x2df85d331a7b40000",
        "gasLimit": "0x0xcf08",
        "gas": "0x08ffd8d1a9"
    }
}

let example_2 =  {
    addressNList: [ 2147483692, 2147483708, 2147483648, 0, 0 ],
    from: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
    chainId: 1,
    data: '0x41f9b62c168041b76b57aaa8a81b105dc06c5f11db64c9325c5d3fa13a0df9be1c1a934c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000866206a6173706572000000000000000000000000000000000000000000000000',
    gasPrice: '0xf22d45af6',
    gasLimit: '0x13880',
    to: '0xe0f821d6cc2ab0d0660023a10340dc267120c9d4',
    value: '0x0',
    nonce: '0x73',
    maxPriorityFeePerGas: '0x42c1d80',
    maxFeePerGas: '0x0'
}

let example_3 = {
    "_id": {
        "$oid": "64a607b010dbd70013d46696"
    },
    "invokeId": "invoke:tCmqawQu47tg6ZVV8DrjsY",
    "success": true,
    "isEIP1559": false,
    "original": {
        "to": "0xc770eefad204b5180df6a14ee197d99d808ee52d",
        "from": "0x9d63dbed61abbbcc0c63b5bc10c4bcc44f05dc39",
        "data": "0x095ea7b3000000000000000000000000c92e8bdf79f0507f65a392b0ab4667716bfe0110ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    },
    "isError": false,
    "recommended": {
        "addressNList": null,
        "from": "0x9d63dbed61abbbcc0c63b5bc10c4bcc44f05dc39",
        "chainId": null,
        "data": "0x095ea7b3000000000000000000000000c92e8bdf79f0507f65a392b0ab4667716bfe0110ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "to": "0xc770eefad204b5180df6a14ee197d99d808ee52d",
        "value": null,
        "gasLimit": null,
        "gas": null
    }
}

let example_4 = {
    "addressNList": [
        2147483692,
        2147483708,
        2147483648,
        0,
        0
    ],
    "chainId": 1,
    "from": "0x9d63dbed61abbbcc0c63b5bc10c4bcc44f05dc39",
    "data": "0x659dd2b40000000000000000000000000000000000000000000000000000000000000004",
    "gasLimit": "0x7a120",
    "to": "0x360e2f3d92d23de8e5d8a461c2544aaf01eba549",
    "value": "0x221b262dd8000",
    "nonce": "0x7e",
    "maxPriorityFeePerGas": "0x6fb754a",
    "maxFeePerGas": "0x0"
}

let example_5 = {
    "addressNList": [
        2147483692,
        2147483708,
        2147483648,
        0,
        0
    ],
    "from": "0x9d63dbed61abbbcc0c63b5bc10c4bcc44f05dc39",
    "value": "0x2386f26fc10000",
    "to": "0xC3aFFff54122658b89C31183CeC4F15514F34624",
    "chainId": 100,
    "data": "0x",
    "nonce": "0x0",
    "gasLimit": "0x5208",
    "maxFeePerGas": "0x89231765",
    "maxPriorityFeePerGas": "0x8923175e"
}

let example_6 = {
    "invokeId": "invoke:cxauBCidnYL7txda3iL24a",
    "success": true,
    "isEIP1559": true,
    "original": {
        "addressNList": [
            2147483692,
            2147483708,
            2147483648,
            0,
            0
        ],
        "from": "0x098c926E561C5D4AC2113615A1c3589f85a6D9b7",
        "chainId": 137,
        "nonce": "0x1",
        "value": "0x0",
        "data": "0x11b804ab00000000000000000000000031787f747d98a24fabdac09b1d0a23f91b972d91000000000000000000000000000000000000000000000000000000000000006034353738383931300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000284e1591634000000000000000000000000098c926e561c5d4ac2113615a1c3589f85a6d9b70000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000098c926e561c5d4ac2113615a1c3589f85a6d9b7000000000000000000000000098c926e561c5d4ac2113615a1c3589f85a6d9b7000000000000000000000000000000000000000000000000000000000000025800000000000000000000000000000000000000000000000000000000000001f40000000000000000000000001a8f4f7eb2134e8ad141a761af528b74640712ec000000000000000000000000000000000000000000000000000000000000000a504f4e5a49564552534f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a504f4e5a49564552534f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000037697066733a2f2f516d556f457151787a464233727567314a4a53484c4b784176704643784868444465677232787644464c6a4d7a742f300000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c82bbe41f2cf04e3a8efa18f7032bdd7f6d98a8100000000000000000000000086c80a8aa58e0a4fa09a69624c31ab2a6cad56b800000000000000000000000000000000000000000000000000000000",
        "gasLimit": "0xef6e9",
        "to": "0x5dbc7b840baa9dabcbe9d2492e45d7244b54a2a0",
        "gasPrice": "0x3f41003",
        "maxFeePerGas": "0x0",
        "maxPriorityFeePerGas": "0x3f41003"
    },
    "isError": false,
    "recommended": {
        "addressNList": [
            2147483692,
            2147483708,
            2147483648,
            0,
            0
        ],
        "from": "0x098c926E561C5D4AC2113615A1c3589f85a6D9b7",
        "chainId": 137,
        "data": "0x11b804ab00000000000000000000000031787f747d98a24fabdac09b1d0a23f91b972d91000000000000000000000000000000000000000000000000000000000000006034353738383931300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000284e1591634000000000000000000000000098c926e561c5d4ac2113615a1c3589f85a6d9b70000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000098c926e561c5d4ac2113615a1c3589f85a6d9b7000000000000000000000000098c926e561c5d4ac2113615a1c3589f85a6d9b7000000000000000000000000000000000000000000000000000000000000025800000000000000000000000000000000000000000000000000000000000001f40000000000000000000000001a8f4f7eb2134e8ad141a761af528b74640712ec000000000000000000000000000000000000000000000000000000000000000a504f4e5a49564552534f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a504f4e5a49564552534f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000037697066733a2f2f516d556f457151787a464233727567314a4a53484c4b784176704643784868444465677232787644464c6a4d7a742f300000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c82bbe41f2cf04e3a8efa18f7032bdd7f6d98a8100000000000000000000000086c80a8aa58e0a4fa09a69624c31ab2a6cad56b800000000000000000000000000000000000000000000000000000000",
        "to": "0x5dbc7b840baa9dabcbe9d2492e45d7244b54a2a0",
        "value": "0x0",
        "gasLimit": "0xef6e9",
        "maxPriorityFeePerGas": "0x59682f00",
        "maxFeePerGas": "0x2d72db3a06"
    }
}

// Define an async function to run the test
const runTest = async () => {
    try {
        // Initialize the Pioneer instance
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();

        // tx = example.original
        // tx = example_2
        // tx = example_3.original
        // tx = example_4
        let tx = example_6.original
        let result = await pioneer.SmartInsight(tx);
        console.log("result: ",result.data)


    } catch (e) {
        console.error(e);
    }
};

runTest();