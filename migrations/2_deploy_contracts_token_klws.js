const KlwsToken = artifacts.require('./KlwsToken.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x78d3a9fC256bb9a81d4fB887187D403c8347792e";
    deployer.deploy(KlwsToken, owner);
};
