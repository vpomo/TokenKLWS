const KlwsToken = artifacts.require('./KlwsToken.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x8087300524FB758a3092046D9E975cd0f6D8a521";
    deployer.deploy(KlwsToken, owner);
};
