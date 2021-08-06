/*
    E2E testing
        k8  "job" pattern

    load test seed

    verify empty

    build sign broadcast swap

    watch till confirmed

    report to leeroy server results



    SDK Arch pattern ***

        Start and configure app

        verify socket connection


    Use sdk to

        * check balances
        * check tx history
        * verify payment

 */

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
const TAG  = " | e2e-test | "
const log = require("@pioneer-platform/loggerdog")()

import {v4 as uuidv4} from 'uuid';
let BigNumber = require('@ethersproject/bignumber')
let SDK = require('@pioneer-platform/pioneer-sdk')
let wait = require('wait-promise');
let sleep = wait.sleep;
let midgard = require("@pioneer-platform/midgard-client")
let coincap = require("@pioneer-platform/coincap")

import {
    Transfer
} from "@pioneer-platform/pioneer-types";

let {
    supportedBlockchains,
    baseAmountToNative,
    nativeToBaseAmount,
} = require("@pioneer-platform/pioneer-coins")

const {
    startApp,
    getContext,
    getWallets,
    sendPairingCode,
    buildTransaction,
    approveTransaction,
    broadcastTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'bitcoinCash'
let ASSET = 'BCH'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.0002"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC']
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let wss = process.env['URL_PIONEER_SOCKET']
let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'
let FAUCET_BTC_ADDRESS = process.env['FAUCET_BTC_ADDRESS'] || 'bc1q0dt53aa0v366zdpsf2ant3pw4maugf50y2ywqy'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_BCH_ADDRESS'] || 'qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj'

let noBroadcast = true
describe(' - e2e test BTC transfer - ', function() {
    let tag = TAG + " | test_service | "
    try {
        const log = console.log;

        beforeEach(() => {
            console.log = jest.fn(); // create a new mock function for each test
            jest.setTimeout(90000)
        });
        afterAll(() => {
            console.log = log; // restore original console.log after all tests
        });


        const queryKey = uuidv4();
        let username
        let balance
        let contextAlpha:string
        let wallets:any
        let app:any
        let eventPairReceived = false
        let seedChains = ['ethereum','thorchain','bitcoin','bitcoinCash']
        let code:any
        let user:any
        let client:any
        let balanceSdk:any
        let balanceNative:any
        let balanceBase:any
        let valueBalanceUsd:any
        let estimateCost:any
        let transfer:Transfer
        let invocationId:string
        let signedTx:any
        let transaction:any
        let broadcastResult:any

        it('Starts Wallet', async function() {
            //start app and get wallet
            wallets = await startApp()
            log(tag,"wallets: ",wallets)
            username = wallets.username
            expect(username).toBeDefined();
        });

        it('gets balance', async function() {

            let appContext = getContext()
            expect(appContext).toBeDefined();

            //get wallets
            let appWallets = getWallets()
            contextAlpha = appWallets[0]
            balance = wallets.wallets[contextAlpha].WALLET_BALANCES[ASSET]
            expect(balance).toBeDefined();
        });

        it('Balance is enough for test', async function() {

            //get balance
            balance = wallets.wallets[contextAlpha].WALLET_BALANCES[ASSET]
            expect(Number(balance)).toBeGreaterThan(Number(MIN_BALANCE));
        });

        it('SDK initialization', async function() {

            let config = {
                queryKey,
                //username,
                spec,
                wss
            }

            app = new SDK.SDK(spec,config)
            expect(app).toBeDefined();

        });

        it('SDK start events', async function() {
            let events = await app.startSocket()
            events.on('message', async (request:any) => {
                expect(request.queryKey).toBeDefined();
                expect(request.username).toBeDefined();
                expect(request.url).toBeDefined();
                eventPairReceived = true
            })

        });

        it('App initialization', async function() {


            let resultInit = await app.init(seedChains)
            expect(resultInit).toBeDefined();

        });

        it('App pairing with sdk ', async function() {


            //pair sdk
            code = await app.createPairingCode()
            code = code.code
            log("code: ",code)
            expect(code).toBeDefined();

        });

        it('Send Pairing Code ', async function() {

            //pair sdk
            let pairSuccess = await sendPairingCode(code)
            log("pairSuccess: ",pairSuccess)
            expect(pairSuccess).toBeDefined();

        });

        it('Wait for pairing ACK ', async function() {


            //pair sdk
            while(!eventPairReceived){
                await sleep(300)
            }

        });


        it('Get User from SDK ', async function() {


            //get user
            user = await app.getUserParams()
            log("user: ",user)
            expect(user.context).toBeDefined();

        });

        it('Validate user configuration ', async function() {


            //get user
            let blockchains = Object.keys(user.clients)
            log("blockchains: ",blockchains)
            expect(blockchains).toBeDefined();

        });

        it('Get ETH client ', async function() {


            client = user.clients['ethereum']
            expect(client).toBeDefined();

        });

        it('Assert master exists ', async function() {


            let masterAddress = await client.getAddress()
            log(tag,"masterAddress: ",masterAddress)
            expect(masterAddress).toBeDefined();

        });

        it('get client balance SDK ', async function() {

            //Match X-Chain syntax
            balanceSdk = await client.getBalance()
            log(" balanceSdk: ",balanceSdk)
            expect(balanceSdk[0]).toBeDefined();
            expect(balanceSdk[0].amount).toBeDefined();
            expect(balanceSdk[0].amount.amount()).toBeDefined();
            expect(balanceSdk[0].amount.amount().toString()).toBeDefined();

        });

        it('Convert balance to human readable format', async function() {

            balanceNative = balanceSdk[0].amount.amount().toString()
            log(tag,"balanceNative: ",balanceNative)
            expect(balanceNative).toBeDefined();

            balanceBase = await nativeToBaseAmount('ETH',balanceSdk[0].amount.amount().toString())
            log(tag,"balanceBase: ",balanceBase)
            expect(balanceBase).toBeDefined();

            valueBalanceUsd = await coincap.getValue("ETH",balanceBase)
            log(tag,"valueBalanceUsd: ",valueBalanceUsd)
            expect(valueBalanceUsd).toBeDefined();

            expect(balanceBase).toBeGreaterThan(Number(TEST_AMOUNT));
        });

        it('Get Estimate Fees for swap ', async function() {
            console.log = jest.fn();
            //get estimate
            let asset = {
                chain:"ETH",
                symbol:"ETH",
                ticker:"ETH",
            }

            let estimatePayload = {
                asset:asset,
                amount:balanceBase.toString(),
                recipient: '0xf10e1893b2fd736c40d98a10b3a8f92d97d5095e' // dummy value only used to estimate ETH transfer
            }
            log(tag,"estimatePayload: ",estimatePayload)

            estimateCost = await client.estimateFeesWithGasPricesAndLimits(estimatePayload);
            log(tag,"estimateCost: ",estimateCost)
            expect(estimateCost).toBeDefined();

        });

        it('Get Swap Params from midgard ', async function() {

            //get pool address
            let poolInfo = await midgard.getPoolAddress()

            //filter by chain
            let ethVault = poolInfo.filter((e:any) => e.chain === 'ETH')
            log(tag,"ethVault: ",ethVault)
            expect(ethVault).toBeDefined();

            //test amount in native
            let amountTestNative = baseAmountToNative("BTC",TEST_AMOUNT)

            transfer = {
                context:user.context,
                recipient: FAUCET_BCH_ADDRESS,
                asset: ASSET,
                network: ASSET,
                memo: '',
                "amount":{
                    amount: function(){
                        return BigNumber.BigNumber.from(amountTestNative)
                    }
                },
                fee:{
                    priority:3, //1-5 5 = highest
                },
                noBroadcast
            }
        });

        it('Build transfer (init) ', async function() {
            let options:any = {
                verbose: true,
                txidOnResp: false, // txidOnResp is the output format
            }

            let responseTransfer = await user.clients[BLOCKCHAIN].transfer(transfer,options)
            log(tag,"responseTransfer: ",responseTransfer)
            let invocationId = responseTransfer
            expect(invocationId).toBeDefined();

            transaction = {
                invocationId,
                context:user.context
            }
        });

        it('Build transaction (with context)', async function() {

            let unsignedTx = await buildTransaction(transaction)
            log(tag,"unsignedTx: ",unsignedTx)
            expect(unsignedTx).toBeDefined();

        });

        it('Review Invocation ', async function() {
            //get invocation
            let invocationView1 = await app.getInvocation(invocationId)
            log(tag,"invocationView1: (VIEW) ",invocationView1)
            expect(invocationView1).toBeDefined();
        });

        it('Approve Invocation ', async function() {

            //sign transaction
            signedTx = await approveTransaction(transaction)
            log(tag,"signedTx: ",signedTx)
            expect(signedTx).toBeDefined();
            expect(signedTx.txid).toBeDefined();

        });

        it('Broadcast Invocation ', async function() {

            broadcastResult = await broadcastTransaction(transaction)
            log(tag,"broadcastResult: ",broadcastResult)

        });

        it('Broadcast Invocation ', async function() {

            broadcastResult = await broadcastTransaction(transaction)
            log(tag,"broadcastResult: ",broadcastResult)

        });

        //TODO if !noBroadcast


    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
})
