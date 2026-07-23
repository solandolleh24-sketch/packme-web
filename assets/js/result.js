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
    try {
      frame.setAttribute("data-tone", selection.tone || "positive");
      PackmePoster.render(canvas, selection);
      var shareUrl = window.PackmeState.buildShareUrl(selection, "shared.html");
      document.getElementById("shareUrl").value = shareUrl;
      drawQr(document.getElementById("qrInlineCanvas"), shareUrl);
    } catch (e) {
      console.error("poster render failed", e);
      PackmeUI.showToast("포스터를 그리는 데 문제가 생겼어요. 새로고침해 주세요.");
    }
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
    try {
      canvas.toBlob(function (blob) {
        if (!blob) { PackmeUI.showToast("이미지를 만들지 못했어요. 다시 시도해 주세요."); return; }
        var a = document.createElement("a");
        var url = URL.createObjectURL(blob);
        a.href = url;
        a.download = "packme2026-starterpack.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        PackmeUI.showToast("포스터를 저장했어요");
      }, "image/png");
    } catch (e) {
      console.error("download failed", e);
      PackmeUI.showToast("저장에 실패했어요. 화면을 캡처해서 저장해 보세요.");
    }
  });

  document.getElementById("shareBtn").addEventListener("click", async function () {
    var shareUrl = document.getElementById("shareUrl").value;
    try {
      var result = await PackmeUI.shareResult(canvas, {
        title: "내 2026 스타터팩",
        text: "친구들이 인정할 내 스타터팩, 너도 확인해봐",
        url: shareUrl,
        filename: "packme2026-starterpack.png"
      });
      if (result.method === "download-fallback") PackmeUI.showToast("공유 대신 이미지로 저장했어요");
      else if (result.method === "cancel") { /* user cancelled the native share sheet, no toast needed */ }
      else if (result.success) PackmeUI.showToast("공유했어요");
      else PackmeUI.showToast("공유에 실패했어요. 이미지를 저장해 보세요.");
    } catch (e) {
      console.error("share failed", e);
      PackmeUI.showToast("공유에 실패했어요. 이미지를 저장해 보세요.");
    }
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

  (async function start() {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    draw();
  })();
})();
