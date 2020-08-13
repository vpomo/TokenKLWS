const Web3 = require('web3');
const web3 = new Web3();
const Tx = require('ethereumjs-tx');
var Web3Utils = require('web3-utils');

//var adrressContract = "0x446cF4d84070fE21B6C8f5E330aC3562dA76a501";
var adrressContract = "0x446cF4d84070fE21B6C8f5E330aC3562dA76a501";

//var adrressUsdtContract = "0xbdC018A1FbAb0336FefEbE58F48eadd55160a84D";
var adrressUsdtContract = "0xbdC018A1FbAb0336FefEbE58F48eadd55160a84D";
var usdtOwner = "0xC6209690b79DDB25d12EE7eD659B705eB6607879";

//var pathToFileAbi = "/home/webmaster/workspace/CHAIN/node.js/";
var pathToFileAbi = "C:/Logs/Bchain/TokenKLWS/infura/";

var fs = require('fs');
var abiContract = fs.readFileSync(pathToFileAbi + 'abi.json', 'utf8');

var myWallet = '0x6fC4dF2Dc3029a7Bc28Ca66838246b081Ddf0C03';
var myPrivateKey = '46';

var decimal = 1e18;
var gasPriceGwei = 8 * 1e9; //8 GWEY
var gasLimit = 8000000;

var contractRPS = web3.eth.contract(JSON.parse(abiContract)).at(adrressContract);
var contractUsdt = web3.eth.contract(JSON.parse(abiContract)).at(adrressUsdtContract);

//web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/v3/a88e56ffdebb4d2da70d16e747aae8f8'));
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/v3/a88e56ffdebb4d2da70d16e747aae8f8'));

if (!web3.isConnected())
    console.log("not connected");
else
    console.log("connected");
web3.eth.defaultAccount = web3.eth.accounts[0];

module.exports.getUsdtCount = async function() {
    console.log("ontractUsdt.address", contractUsdt.address)
    var balance = await contractUsdt.balanceOf(usdtOwner, {from:myWallet});
    console.log("balance usdtOwner", Number(balance));
	return Number(balance);
}

module.exports.batchTransfer = async function(_wallets, _values, _isTokenKlws) {
    console.log("making transfer token ...");
    try {
        const rawTransaction = {
            from: myWallet,
            to: adrressContract,
            nonce: web3.toHex(web3.eth.getTransactionCount(myWallet)),
            gasPrice: web3.toHex(gasPriceGwei),
            gasLimit: web3.toHex(gasLimit),
            value: 0,
            data: contractRPS.batchTransfer.getData(_wallets, _values, _isTokenKlws)
        };

        let privateKey = new Buffer(myPrivateKey, 'hex');
        var tx = new Tx(rawTransaction);
        tx.sign(privateKey);
        console.log("Validation:", tx.validate());

        var serializedTx = '0x' + tx.serialize().toString('hex');

        try {
            var hash = await web3.eth.sendRawTransaction(serializedTx);
            console.log('hash:', hash);
            sleep(2000);
            return hash;
        } catch (err) {
            console.log('error transfer token (sendRawTransaction):', err);
            return "";
        }
    } catch (error) {
        console.log('error transfer token:', error);
        return "";
    }
}

module.exports.isAddress = async function(_wallet) {
    var result = await Web3Utils.isAddress(_wallet);
    return result;
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
