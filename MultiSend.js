const path = require("path");
const cjson = require("cjson");
const TX = require("ethereumjs-tx");
const Web3 = require("web3");
const provider = "https://ropsten.infura.io/v3/5cfea0d474d94d178f030574a25eee02";
const web3 = new Web3(provider);
const contractAddress = "0x20c06b991226fec3d1f841596202cae3c89d6f9c";
const abi = cjson.load(path.resolve(__dirname, "./abi.json"));
const contract = new web3.eth.Contract(abi, contractAddress);
const etherscanlink = 'https://ropsten.etherscan.io/tx/';
const privateKey = new Buffer("1575FB785EFF345526CF61FEA35CFE55C866207501E423F0E025526DED1C6BAA","hex");

const addresses = require("./address")();
const addresses_per_tx = 10;
let slices = Math.ceil(addresses.length/addresses_per_tx);

function sendTokens(slice){
    const start = (slice -1) * addresses_per_tx;
    const end = slice * addresses_per_tx;
    const processingArray = addresses.slice(start, end);
    console.log("Processing", processingArray);
    return new Promise((resolve, reject) => {
        return sendSignTransaction(contract.methods.multiTransfer(processingArray)).then(result => {
                console.log(result);
                slices--;
            if(slices != 0){
                sendTokens(slices);
            }
            else{
                resolve("done");
            }
            });
            
        })
    
        
    }

sendTokens(slices);


async function sendSignTransaction(rawTx){
    if(rawTx){
        console.log("rawtx",rawTx);
        const txCount = await web3.eth.getTransactionCount('0xeB68FD34FE20C785b98848D7e78fB2Fb4bC747a5', 'pending');
        const txABI = await rawTx.encodeABI();
        console.log("txCount",txCount)


        let gasPrice = await web3.eth.getGasPrice();
        gasPrice = Number(gasPrice);

        gasPrice =gasPrice * 2;
        // const gasLimit = gas * 20;
        console.log("txABI",txABI);
        // console.log("gas", gas ,":", "gasPrice" , gasPrice);

        const txData = {
            nonce : web3.utils.toHex(txCount),
            gasLimit : web3.utils.toHex(2100000),
            gasPrice : web3.utils.toHex(gasPrice),
            to : contractAddress,
            data : txABI,
        }
        console.log("txdata",txData);
        const tx = new TX(txData);
        tx.sign(privateKey);
        console.log("tx", tx);
        return new Promise((resolve, reject) => {
            web3.eth.sendSignedTransaction('0x'+ tx.serialize().toString('hex'))
                .once('transactionHash', (hash) => {
                const result = {
                    'status' : 'sent',
                    'url' : etherscanlink + hash,
                    'message' : "click the below URL to verify status of transaction"
                    }
                    console.log("result", result);
                    resolve(result);
                })
        .then(out => {
            console.log(out);
        })
        .catch(err => {reject(err);});
    })
    }
    else {
     return console.error();
    }
} 