var KlwsToken = artifacts.require("./KlwsToken.sol");

var tokenContract;
//var owner = "0x8180826dc88a61176496210d3ce70cfe02f7ec74";
var maxTotalSupply = Number(42956031700);
var oneTransferToken = Number(100000000);

contract('KlwsToken', (accounts) => {
    var owner = accounts[0];
    var accountTwo = accounts[2];

    it('should deployed contract Token', async ()  => {
        assert.equal(undefined, tokenContract);
        tokenContract = await KlwsToken.deployed();
        assert.notEqual(undefined, tokenContract);
    });

    it('get address contract Token', async ()  => {
        assert.notEqual(undefined, tokenContract.address);
    });

    it('verification balance contracts', async ()  => {
        var totalSupply = await tokenContract.totalSupply.call();
        //console.log("totalSupply", Number(totalSupply));
        assert.equal( maxTotalSupply, Number(totalSupply));

        var balanceOwner = await tokenContract.balanceOf(owner);
        assert.equal(Number(totalSupply), balanceOwner);
    });

    it('verification transfer token', async ()  => {
        var balanceOwnerBefore = await tokenContract.balanceOf(owner);
        assert.equal(maxTotalSupply, Number(balanceOwnerBefore));

        var balanceAccountBefore = await tokenContract.balanceOf(accountTwo);
        assert.equal(0, Number(balanceAccountBefore));

        await tokenContract.transfer(accountTwo, oneTransferToken);

        var balanceAccountAfter = await tokenContract.balanceOf(accountTwo);
        //console.log("balanceAccountAfter", Number(balanceAccountAfter));
        assert.equal(oneTransferToken, Number(balanceAccountAfter));

        var balanceOwnerAfter = await tokenContract.balanceOf(owner);
        var diff = Number(balanceOwnerBefore) - Number(balanceOwnerAfter);
        //console.log("diff", diff);
        assert.equal(true, diff > 0);
        assert.equal(diff, oneTransferToken);
    });

    it('verification batch transfer token', async ()  => {
        var recipients = [accounts[6], accounts[7]];
        var values = [oneTransferToken * 2, oneTransferToken * 3];

        var balanceAcc6Before = await tokenContract.balanceOf(accounts[6]);
        assert.equal(0, Number(balanceAcc6Before));

        await tokenContract.approve(tokenContract.address, oneTransferToken*5);
        await tokenContract.batchTransfer(recipients, values);

        var balanceAcc6After = await tokenContract.balanceOf(accounts[6]);
        var diff = Number(balanceAcc6After) - Number(balanceAcc6Before);
        //console.log("diff", diff);
        assert.equal(true, diff > 0);
        assert.equal(diff, oneTransferToken*2);
    });

});



