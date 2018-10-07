var getUrlParameter = function getUrlParameter(sParam) {
  // https://stackoverflow.com/a/21903119/4986615
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};



let contractInstance = null;
let userAddress = null;
let balance = null;
let accounts = [];
let accountsName = [];

window.addEventListener('load', function() {


  if (typeof web3 !== 'undefined') {
  userAddress = web3.eth.defaultAccount;
  web1 = new Web3(web3.currentProvider);
  web0 = web3;
  let addressURL = getUrlParameter('address');
  if (addressURL == undefined){
    contractInstance = new web1.eth.Contract(abi, address);
  }
  else {
    contractInstance = new web1.eth.Contract(abi, addressURL);
  }

  // web3.eth.getAccounts((error, result) => { accounts.push(result[0]); });
  accounts = [
      {addr:"0x2E024bfE2571D9D28b40F8f9aD34A0eB3DB699Bc",
      name:"Organization",
      eth:0,
      tok:0},
      {addr:"0xF7345feE6B2ee8f25C8f9D912a80f0c4B4847Cca",
      name:"Customer",
      eth:0,
      tok:0},
      {addr:"0xaa9e6FcFdAB4c7B3E030cCd64ca6F29f9de296D1",
      name:"Community",
      eth:0,
      tok:0},
      {addr:"0xf1E5C5BFEa6817C8c61Af06677C0B6B0ad1D5a98",
      name:"Investor",
      eth:0,
      tok:0},
    ]


  updateBalance(userAddress);
  updateSellReserve();
  updateNumTokens();

  updateAccounts();

  } else {
     // Warn the user that they need to get a web0 browser
     // Or install MetaMask, maybe with a nice graphic.
  console.warn("need metamask");
  }
})


function buy() {
  const value = $("#buy-value").val();
  wei = web0.toWei(value, 'ether');
  transaction = contractInstance.methods.buy().send({
                    'from': userAddress,
                    'gas': 4712388,
                    'gasPrice': 100000,
                    'value': wei
    })
    .then();

  updateBalance(userAddress);
  updateSellReserve();
  updateNumTokens();
}


function sell() {
  const value = $("#sell-value").val();
  wei = web0.toWei(value, 'ether');
  contractInstance.methods.sell(wei).send({
    from: userAddress,
    gas: 4712388,
    gasPrice: 100000
  })
  .then();
  updateBalance(userAddress);
  updateSellReserve();
  updateNumTokens();
}

function transfer() {
  const value = $("#transfer-amount").val();
  wei = web0.toWei(value, 'ether');
  const address = $("#transfer-address").val();
  contractInstance.methods.transfer(address, wei).send({
    from: userAddress,
    gas: 4712388,
    gasPrice: 100000
  })
  .then();

  updateBalance(userAddress);
  updateSellReserve();
  updateNumTokens();

}


function revenue() {
  const value = $("#revenue-value").val();
  wei = web0.toWei(value, 'ether');
  contractInstance.methods.revenue().send({
    from: userAddress,
    gas: 4712388,
    gasPrice: 100000,
    value: wei
  })
  .then();
  updateBalance(userAddress);
  updateSellReserve();
  updateNumTokens();
}

function grant() {
  const value = $("#grant-value").val();
  wei = web0.toWei(value, 'ether');
  contractInstance.methods.storeDividend().send({
    from: userAddress,
    gas: 4712388,
    gasPrice: 100000,
    value: wei
  })
  .then();


  web0.eth.accounts.forEach(function(address) {
    console.log(address);
    contractInstance.methods.askDividend(address).send({
      from: address,
      gas: 4712388,
      gasPrice: 100000
    }).then();
  });

  updateBalance(userAddress);
  updateSellReserve();
  updateNumTokens();
}


function updateBalance(address) {
  contractInstance.methods.balanceOf(address).call()
  .then((res) => {
    balance = parseFloat(web0.fromWei(res,"ether"));
    $("#balance-tok").html(balance.toFixed(3));
  });

  web1.eth.getBalance(address)
  .then((res) => {
    balance = parseFloat(web0.fromWei(res,"ether"));
    $("#balance-eth").html(balance.toFixed(3));
  });
}

function updateSellReserve() {
  contractInstance.methods.sellReserve().call()
  .then((res) => {
    $("#sell-reserve").html(parseFloat(web0.fromWei(res)).toFixed(3));
  });
}

function updateNumTokens() {
  contractInstance.methods.totalSupply().call()
  .then((res) => {
    $("#n-tokens").html(parseFloat(web0.fromWei(res)).toFixed(3));
  });
}


function updateAccounts() {

  accounts.forEach(function (account, i) {

    contractInstance.methods.balanceOf(account.addr).call()
    .then((res) => {
      account.tok = parseFloat(web0.fromWei(res)).toFixed(3);
    });

    web1.eth.getBalance(address)
    .then((res) => {
      account.eth = parseFloat(web0.fromWei(res,"ether")).toFixed(3);
      updateTable();
    });

  });


}


function updateTable() {

  const table = $("#sumup");

  const tbody = table.find('tbody');
  $('#sumup tr').each(function (i, row) {
    row.remove();
  });

  tbody.append('<tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">ETH</th><th scope="col">TOK</th></tr>');

  accounts.forEach(function (account, i) {
    tbody.append("<tr><th scope='row'>" + i + "</th><td>"+account.name+"</td><td>"+account.eth+"</td><td>"+account.tok+"</td></tr>");
  });
}
