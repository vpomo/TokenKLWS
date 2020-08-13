var infura = require("./Infura");
const fastify = require('fastify')({ logger: true })

var inputPath = 'distribution.csv';
var superWallet = '0x5a8C89E24417ee83F1b5B07a1608F7C0eF12E6E2';

var klwsDecimal = 18;
var usdtDecimal = 18;

// Declare an API route
fastify.get('/', async (request, reply) => {
  return {
      status: 'ok',
  }
})

fastify.get('/transfer', async (request, reply) => {
    var tokenName = request.query.token;
    console.log("tokenName", tokenName);
    if (tokenName == 'klws') {
        transferKlws();
    }
    if (tokenName == 'usdt') {
        await transferUsdt();
    }

    return {
          token: tokenName,
          status: 'ok'
      }
})

function transferKlws() {
	const fs = require('fs')
	var parse = require('csv-parse')
	fs.readFile(inputPath, function (err, fileData) {
		parse(fileData, {columns: false, trim: true}, function(err, rows) {
			var wallets = getMembers(0, rows);
			var values = getMembers(1, rows);
			console.log("wallets", wallets);
			console.log("values", values);
			infura.batchTransfer(wallets, values, true);
  		})
	})
}

function transferUsdt() {
    const fs = require('fs')
    var parse = require('csv-parse')
    fs.readFile(inputPath, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, rows) {
            var wallets = getMembers(0, rows);
            var values = getMembers(1, rows);
            console.log("values", values);
            var usdtValues = makeTransferUsdtValues(values, wallets);
        })
    })
}

async function makeTransferUsdtValues(_values, _wallets) {
    var val = [];
    var klwsVal = [];
    var klwsTotal = Number(0);
    var usdtTotal = await infura.getUsdtCount();
    usdtTotal = usdtTotal/10**usdtDecimal;
    var superBonus = Number(usdtTotal/5);
    var remain = usdtTotal - superBonus;
    console.log("usdtTotal", usdtTotal);
    console.log("superBonus", superBonus);
    console.log("remain", remain);

    for (var i=0; i< _values.length; i++) {
        klwsTotal = klwsTotal + Number(_values[i]/10**klwsDecimal);
        klwsVal.push(Number(_values[i]/10**klwsDecimal))
    }
    console.log("klwsTotal", klwsTotal);

    for (var i=0; i< _values.length; i++) {
        var usdtAmount = remain*Number(klwsVal[i]/klwsTotal);
        console.log("i=" + i + " amount = " + usdtAmount.toFixed(usdtDecimal));
        val.push(usdtAmount.toFixed(usdtDecimal)*10**usdtDecimal);
    }

    val.push(superBonus*10**usdtDecimal);
    _wallets.push(superWallet);
    console.log("usdtValues", val);
    console.log("wallets", _wallets);
    //infura.batchTransfer(wallets, usdtValues, true);
}

function getMembers(_index, _array) {
  var val = [];
  for (var i=0; i< _array.length; i++) {
     if(_index == 1) {
         val.push(_array[i][_index] * 10**klwsDecimal);
     } else {
         val.push(_array[i][_index]);
     }
  }
  return val;
}

// Run the server!
const start = async () => {
  try {
//    await fastify.listen(3202, '185.75.47.165')
    await fastify.listen(3202, '127.0.0.1')
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
