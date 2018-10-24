
function isDataValid() {
  let vpa = document.getElementById("vpa").value;
  let remarks = document.getElementById("remarks").value;
  let amount = document.getElementById("amount").value;
  document.getElementById("errorVpa").style.display = "none";
  document.getElementById("errorAmount").style.display = "none";
  document.getElementById("errorRemarks").style.display = "none";

  return isAmountValid(amount) && isVpaValid(vpa) && isRemarksValid(remarks);
}

function isVpaValid(vpa) {
  if (!(vpa.split("@").length == 2 && vpa.split("@")[0].length > 0 && vpa.split("@")[1].length > 0)) {
    document.getElementById("errorVpa").style.display = "inline";
    return false;
  }
  return true;
}

function isAmountValid(amount) {
  if (isNaN(amount) || (parseFloat(amount) < 1 || parseFloat(amount) > 100000)) {
    document.getElementById("errorAmount").style.display = "inline";
    return false;
  } else {
    var inputAmount = document.getElementById("amount");
    if (amount.indexOf(".") == -1) inputAmount.value = inputAmount.value + ".00";
    else if (amount.split(".")[1].length > 2) inputAmount.value = inputAmount.value.split(".")[0] + "." + inputAmount.value.split(".")[1].substring(0, 2);
    else if (amount.split(".")[1].length == 1) inputAmount.value = inputAmount.value + "0";
    else if (amount.split(".")[1].length == 0) inputAmount.value = inputAmount.value + "00";
    return true;
  }
}

function isRemarksValid(remarks) {
  if (remarks.length >= 1 && remarks.length <= 50 && /^[a-zA-Z0-9\-\s]*$/.test(remarks)) {
    return true;
  }
  document.getElementById("errorRemarks").style.display = "inline";
  return false;
}

function progress(timeleft) {
  if (window.stopProgress)
    return;
  var minutes = parseInt(timeleft / 60);
  var seconds = timeleft % 60;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  document.getElementById("counter").innerHTML = minutes + " : " + seconds;
  if (timeleft > 0) {
    setTimeout(function () {
      progress(timeleft - 1);
    }, 1000);
  }
  else {
    window.stopPolling = true;
    showTransactionResult(false, "Your request has expired", "null");
  }
};

function showTransactionResult(success, message, tid) {
  window.stopProgress = true;
  document.getElementById("polling").style.display = "none";
  document.getElementById("transactionStatus").style.display = "block";
  document.getElementById("statusImage").src = success ? "./images/success.png" : "./images/failure.png";
  document.getElementById("transactionMessage").innerHTML = message;
  document.getElementById("tid").innerHTML = tid === "null" ? "" : "Transaction ID : "+ tid;
}

function randHex(len) {
  var maxlen = 8,
      min = Math.pow(16, Math.min(len, maxlen) - 1)
      max = Math.pow(16, Math.min(len, maxlen)) - 1,
      n = Math.floor(Math.random() * (max - min + 1)) + min,
      r = n.toString(16);
  while (r.length < len) {
    r = r + randHex(len - maxlen);
  }
  return r;
};

function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  today = dd + '/' + mm + '/' + yyyy;
  return today;
}
