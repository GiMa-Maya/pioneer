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
let BigNumber = require('@ethersproject/bignumber')
const TAG  = " | e2e-test | "
const log = require("@pioneer-platform/loggerdog")()

let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
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
    getInvocations,
    sendPairingCode,
    buildTransaction,
    approveTransaction,
    broadcastTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'ethereum'
let ASSET = 'ETH'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.0002"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.003"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj'
let FAUCET_ETH_ADDRESS = process.env['FAUCET_ETH_ADDRESS'] || '0x33b35c665496bA8E71B22373843376740401F106'

let noBroadcast = true


//force monitor
// let FORCE_MONITOR = false
// if(FORCE_MONITOR){
// let txid = "0x75dcac2dfc67086cfeae0c406b47e5c56c15607d9b22f3526ce86a92a4eaab7c"
// let invocationId = "pioneer:invocation:v0.01:ETH:4755MHZN6gqma6PkrmVtsF"
// }

let txid:string
let invocationId:string

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

        //start app and get wallet
        let wallets = await startApp()
        log.info(tag,"wallets: ",wallets)
        let username = wallets.username
        assert(username)

        let appContext = getContext()
        assert(appContext)
        log.info(tag,"appContext: ",appContext)

        //get wallets
        let appWallets = getWallets()
        let contextAlpha = appWallets[0]
        let balance = wallets.wallets[contextAlpha].WALLET_BALANCES[ASSET]
        assert(balance)

        let masterAlpha = wallets.wallets[contextAlpha].getMaster(ASSET)
        //assert balance local
        //log.debug(tag,"wallet: ",wallet)
        if(balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+masterAlpha)
            throw Error("101: Low funds!")
        } else {
            log.debug(tag," Attempting e2e test "+ASSET+" balance: ",balance)
        }

        //generate new key
        const queryKey = uuidv4();
        assert(queryKey)

        let config = {
            queryKey,
            spec,
            wss
        }

        let app = new SDK.SDK(spec,config)
        let events = await app.startSocket()
        let eventPairReceived = false
        let eventInvokeTransferReceived = false
        events.on('message', async (event:any) => {
            log.debug(tag,"event: ",event)
            switch(event.type) {
                case 'pairing':
                    assert(event.queryKey)
                    assert(event.username)
                    assert(event.url)
                    eventPairReceived = true
                    break;
                case 'transfer':
                    //TODO assert valid transfer info
                    //received continue below
                    eventInvokeTransferReceived = true
                    break;
                default:
                    log.error(tag,"unhandled event: ",event)
                // code block
            }
        })

        let seedChains = ['ethereum','thorchain']
        await app.init(seedChains)

        //pair sdk
        let code = await app.createPairingCode()
        code = code.code
        log.debug("code: ",code)
        assert(code)

        //
        let pairSuccess = await sendPairingCode(code)
        log.debug("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
        }

        //assert sdk user
        //get user
        let user = await app.getUserParams()
        log.debug("user: ",user)
        assert(user.context)
        assert(user.clients[BLOCKCHAIN])

        //intergration test asgard-exchange
        let blockchains = Object.keys(user.clients)
        log.debug("blockchains: ",blockchains)

        let client = user.clients['ethereum']

        //get master
        let masterAddress = await client.getAddress()
        log.debug(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)

        /*
            3 ways to express balance
                Sdk (x-chain compatible object type)
                native (satoshi/wei)
                base (normal 0.001 ETH)
         */

        let balanceSdk = await client.getBalance()
        log.debug(" balanceSdk: ",balanceSdk)
        assert(balanceSdk[0])
        assert(balanceSdk[0].amount)
        assert(balanceSdk[0].amount.amount())
        assert(balanceSdk[0].amount.amount().toString())


        let balanceNative = balanceSdk[0].amount.amount().toString()
        log.debug(tag,"balanceNative: ",balanceNative)
        assert(balanceNative)

        let balanceBase = await nativeToBaseAmount('ETH',balanceSdk[0].amount.amount().toString())
        log.debug(tag,"balanceBase: ",balanceBase)
        assert(balanceBase)

        //value USD
        let valueBalanceUsd = await coincap.getValue("ETH",balanceBase)
        log.debug(tag,"valueBalanceUsd: ",valueBalanceUsd)
        assert(valueBalanceUsd)

        if(balanceBase < TEST_AMOUNT){
            throw Error(" YOUR ARE BROKE! send more test funds into test seed! address: ")
        }

        let asset = {
            chain:"ETH",
            symbol:"ETH",
            ticker:"ETH",
        }

        //get estimate
        let estimatePayload = {
            asset,
            amount:balanceBase.toString(),
            recipient: '0xf10e1893b2fd736c40d98a10b3a8f92d97d5095e' // dummy value only used to estimate ETH transfer
        }
        log.debug(tag,"estimatePayload: ",estimatePayload)

        let estimateCost = await client.estimateFeesWithGasPricesAndLimits(estimatePayload);
        log.info(tag,"estimateCost: ",estimateCost)
        assert(estimateCost)

        //max cost - balance

        //you have x max amount spendable

        //you are attempting to spend x

        //this is x percent of total available

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        let transfer:Transfer = {
            context:user.context,
            fee:{
                // gasLimit: 20000,
                priority:3, //1-5 5 = highest
            },
            symbol: "ETH",
            recipient: FAUCET_ETH_ADDRESS,
            network: "ETH",
            asset: "ETH",
            memo: '',
            "amount":{
                amount: function(){
                    return BigNumber.BigNumber.from(baseAmountToNative("ETH",TEST_AMOUNT))
                }
            }
        }
        if(noBroadcast) transfer.noBroadcast = true

        //if create new
        let responseTransfer = await user.clients.ethereum.transfer(transfer,options)
        log.debug(tag,"responseTransfer: ",responseTransfer)
        //optional (configurable with options above) .invocationId response
        invocationId = responseTransfer

        //do not continue invocation
        assert(invocationId)

        let transaction = {
            invocationId,
            context:user.context
        }

        //build
        let unsignedTx = await buildTransaction(transaction)
        log.debug(tag,"unsignedTx: ",unsignedTx)
        assert(unsignedTx)

        //get invocation
        let invocationView1 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
        assert(invocationView1)
        assert(invocationView1.state)
        assert.equal(invocationView1.state,'builtTx')

        //sign transaction
        let signedTx = await approveTransaction(transaction)
        log.debug(tag,"signedTx: ",signedTx)
        assert(signedTx)
        assert(signedTx.txid)

        // //get invocation
        let invocationView2 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)
        assert(invocationView2.state)
        assert.equal(invocationView2.state,'signedTx')
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        let broadcastResult = await broadcastTransaction(transaction)
        log.info(tag,"broadcastResult: ",broadcastResult)

        //get invocation info EToC

        let isConfirmed = false
        //wait for confirmation

        if(!noBroadcast){
            // let invocationView3 = await app.getInvocation(invocationId)
            // log.debug(tag,"invocationView3: (VIEW) ",invocationView3)
            // assert(invocationView3)
            // assert(invocationView3.state)
            // assert.equal(invocationView3.state,'broadcasted')

            /*

                Status codes

                -1: errored
                 0: unknown
                 1: built
                 2: broadcasted
                 3: confirmed
                 4: fullfilled (swap completed)

             */

            //monitor tx lifecycle
            let currentStatus
            let statusCode = 0
            // let txid
            //wait till confirmed in block
            while(!isConfirmed){
                //get invocationInfo
                let invocationInfo = await app.getInvocation(invocationId)
                log.info(tag,"invocationInfo: ",invocationInfo)

                txid = invocationInfo.signedTx.txid
                assert(txid)
                if(!currentStatus) currentStatus = 'transaction built!'
                if(statusCode <= 0) statusCode = 1

                //lookup txid
                let response = await client.getTransactionData(txid)
                log.info(tag,"response: ",response)

                if(response && response.txInfo && response.txInfo.blockNumber){
                    log.info(tag,"Confirmed!")
                    statusCode = 3
                    isConfirmed = true
                } else {
                    log.info(tag,"Not confirmed!")
                    //get gas price recomended

                    //get tx gas price
                    await sleep(6000)
                }
            }
        }

        //close socket
        let result = await app.stopSocket()
        log.debug(tag,"result: ",result)


        log.info("****** TEST PASS ******")
        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
