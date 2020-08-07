const KlwsToken = artifacts.require('./KlwsToken.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    //https://ropsten.etherscan.io/address/0x0b16b613cc3a506165dd6d993fb0fc18daa319ba
    var owner = "0x78d3a9fC256bb9a81d4fB887187D403c8347792e";
    var admin = "0x6fC4dF2Dc3029a7Bc28Ca66838246b081Ddf0C03";
    deployer.deploy(KlwsToken, owner, admin);
};
