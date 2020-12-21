window.addEventListener("load", () => {
  var nonce = getNonce();
  var payload = createPayload(nonce);
  var signature = createSignature(payload, apiSecret);
  var headers = createHeaders(apiKey, signature.toString());

  var eth = document.querySelector("#eth");
  var xrp = document.querySelector("#xrp");
  var btc = document.querySelector("#btc");
  var eur = document.querySelector("#eur");
  var totalText = document.querySelector("#total");

  fetchRates().then(rates => {
    fetchBalance(
      "https://api.coinmotion.com/v1/balances",
      payload,
      headers
    ).then(data => {
      var ethBalance = parseFloat(data.payload.eth_bal);
      var xrpBalance = parseFloat(data.payload.xrp_bal);
      var btcBalance = parseFloat(data.payload.btc_bal);
      var eurBalance = parseFloat(data.payload.eur_bal);

      var ethEur = ethBalance * parseFloat(rates.payload.ethEur.buy);
      var xrpEur = xrpBalance * parseFloat(rates.payload.xrpEur.buy);
      var btcEur = btcBalance * parseFloat(rates.payload.btcEur.buy);

      var total = ethEur + xrpEur + btcEur;

      eth.textContent =
        "ETH: " + ethBalance.toFixed(2) + " - " + ethEur.toFixed(2) + " €";
      xrp.textContent =
        "XRP: " + xrpBalance.toFixed(2) + " - " + xrpEur.toFixed(2) + " €";
      btc.textContent =
        "BTC: " + btcBalance.toFixed(3) + " - " + btcEur.toFixed(2) + " €";
      eur.textContent = "EUR: " + eurBalance.toFixed(2) + " €";
      totalText.textContent = "Total value: " + total.toFixed(2) + " €";
    });
  });
});

function getNonce() {
  return new Date().getTime();
}

function createHeaders(key, signature) {
  return {
    "Content-Type": "application/json",
    "X-COINMOTION-APIKEY": key,
    "X-COINMOTION-SIGNATURE": signature
  };
}

function createSignature(payload, secret) {
  return CryptoJS.HmacSHA512(JSON.stringify(payload), secret);
}

function createPayload(nonce) {
  return { nonce: nonce, parameters: {} };
}
async function fetchBalance(url, payload, headers) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: headers,
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(payload)
  });
  return response.json();
}

async function fetchRates() {
  const response = await fetch("https://api.coinmotion.com/v2/rates");
  return response.json();
}
