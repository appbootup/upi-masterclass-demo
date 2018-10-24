const proxyurl = "https://proxy.internal.svc.k8s.staging.juspay.net/";
const url = "https://upisdk.axisbank.co.in/api/n2/merchants/transactions";
const expiry = "3";
const merchantId = "APLTEST";
const pollingInterval = 5 * 1000; // Polling interval in milliseconds

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "x-merchant-checksum": "test_value",
    "x-merchant-id": merchantId,
    "x-merchant-channel-id": merchantId,
    "x-timestamp": Date.now()
  }
}

function sendCollect() {
  if (!isDataValid()) return;
  document.getElementById("loader").style.visibility = "visible";
  // Collect Request API
  fetch(proxyurl + url + "/webCollect", {
    method: "POST",
    mode: "cors",
    headers: getHeaders(),
    body: JSON.stringify({
      merchantRequestId: randHex(35),
      customerVpa: document.getElementById("vpa").value,
      collectRequestExpiryMinutes: expiry,
      remarks: document.getElementById("remarks").value,
      amount: document.getElementById("amount").value,
      udfParameters: null
    })
  })
  .then(response => response.json())
  .then(json => {
    document.getElementById("loader").style.visibility = "hidden";
    document.getElementById("polling").style.display = "block";
    document.getElementById("payerVpa").innerHTML = document.getElementById("vpa").value;
    document.getElementById("amountResult").innerHTML = "&#8377;" + document.getElementById("amount").value;
    document.getElementById("date").innerHTML = getDate();
    document.getElementById("inputItems").style.display = "none";
    progress(parseInt(expiry) * 60);
    poll(json.payload.merchantRequestId);
  });
}

function poll(merchantRequestId, response) {
  if (window.stopPolling) return;
  // Call transaction status api every n seconds till the transaction is successful
  if (response)
  {
    if (response.payload.gatewayResponseCode === "01") {
      setTimeout(() => {
        checkStatus(merchantRequestId);
      }, pollingInterval);
    } else {
      showTransactionResult(
        response.payload.gatewayResponseCode === "00",
        response.payload.gatewayResponseMessage,
        response.payload.gatewayTransactionId
      );
    }
  }
  else checkStatus(merchantRequestId);
}

function checkStatus(merchantRequestId) {
  // Check transaction status api call
  fetch(proxyurl + url + "/status", {
    method: "POST",
    mode: "cors",
    headers: getHeaders(),
    body: JSON.stringify({
      merchantRequestId: merchantRequestId,
      udfParameters: null
    })
  })
  .then(response => response.json())
  .then(json => poll(merchantRequestId, json));
}
