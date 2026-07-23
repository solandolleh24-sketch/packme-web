/* PACKME 2026 — result page: render, download, share, QR */

(function () {
  var selection = window.PackmeState.load();

  if (!window.PackmeState.isComplete(selection)) {
    window.location.href = "create.html";
    return;
  }

  var frame = document.getElementById("posterFrame");
  var canvas = document.getElementById("posterCanvas");

  function draw() {
    frame.setAttribute("data-tone", selection.tone || "positive");
    PackmePoster.render(canvas, selection);
    var shareUrl = window.PackmeState.buildShareUrl(selection, "shared.html");
    document.getElementById("shareUrl").value = shareUrl;
    drawQr(document.getElementById("qrInlineCanvas"), shareUrl);
  }

  function drawQr(target, url) {
    var ok = PackmeQR.drawQRCode(target, url, { cellSize: 4, margin: 8 });
    if (!ok) {
      var ctx = target.getContext("2d");
      ctx.clearRect(0, 0, target.width, target.height);
      ctx.fillStyle = "#f4f3f1";
      ctx.fillRect(0, 0, target.width, target.height);
      ctx.fillStyle = "#6b6b70";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("링크가 길어", target.width / 2, target.height / 2 - 8);
      ctx.fillText("QR 생성 불가", target.width / 2, target.height / 2 + 8);
    }
  }

  document.getElementById("downloadBtn").addEventListener("click", function () {
    canvas.toBlob(function (blob) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "packme2026-starterpack.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      PackmeUI.showToast("포스터를 저장했어요");
    }, "image/png");
  });

  document.getElementById("rerollBtn").addEventListener("click", function () {
    selection.captionSeed = (selection.captionSeed || 0) + 1;
    window.PackmeState.save(selection);
    draw();
  });

  document.getElementById("copyLinkBtn").addEventListener("click", function () {
    var input = document.getElementById("shareUrl");
    input.select();
    input.setSelectionRange(0, 99999);
    var done = function () { PackmeUI.showToast("링크를 복사했어요"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(input.value).then(done, function () {
        document.execCommand("copy");
        done();
      });
    } else {
      document.execCommand("copy");
      done();
    }
  });

  document.getElementById("showQrBtn").addEventListener("click", function () {
    drawQr(document.getElementById("qrModalCanvas"), document.getElementById("shareUrl").value);
    PackmeUI.openModal("qrModal");
  });
  document.getElementById("closeQrModal").addEventListener("click", function () {
    PackmeUI.closeModal("qrModal");
  });
  document.getElementById("qrModal").addEventListener("click", function (e) {
    if (e.target.id === "qrModal") PackmeUI.closeModal("qrModal");
  });

  draw();
})();
